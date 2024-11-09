import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  translateAndScaleSvgPath,
  pointsSmooth,
  scaleStroke,
  scaleSvgPath,
  getPointsOnPath,
} from "./SVGUtils";
import { useSelector, useDispatch } from "react-redux";

import { updateSettings } from "./features/settingsSlice";
import { createStrokeJSON } from "./SvgEdit2/SVGUtils";
import { playSound } from "./sound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faRedo } from "@fortawesome/free-solid-svg-icons";
import EventBus from "just-event-bus";

const WordTrack = ({}) => {
  const [word, setWord] = useState(null);
  const [playedIndex, setPlayedIndex] = useState(-1);
  const [points, setPoints] = useState([]);
  const wordRef = useRef(null);
  const playingRef = useRef(0);

  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const playStroke = async (w,stroke, curTime) => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    if (curTime !== playingRef.current) return;
    let spoints = stroke.track;

    for (let j = 0; j < spoints.length; j++) {
      setPoints((prev) => [...prev, spoints[j]]);
      if (j != spoints.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        if (curTime !== playingRef.current) return;
      }
    }
  };

  const playStokes = async () => {
    const word = wordRef.current;

    playingRef.current = +new Date();
    let curTime = playingRef.current;
    setPlayedIndex(-1);
    setPoints([]);

    if (word?.stroke) {
      for (let w of word.chs) {
        for (let i = w.begin; i < w.end; i++) {
          setPoints([]);

          let stroke = word.stroke[i];
          await playStroke(w,stroke, curTime);
          if (curTime !== playingRef.current) return;
          setPlayedIndex(i);
        }
        playSound(`/sound/tc/${encodeURIComponent(w.ch)}.mp3`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (curTime !== playingRef.current) return;
      }
    }

    playingRef.current = false;
  };
  const resetStrokes = () => {
    setPlayedIndex(-1);
  };
  const loadDatas = async () => {
    try {
      let str = settings.item;

      let word = { stroke: [], chs: [] };
      let i = 0;
      let tranX = 0;
      for (let c of str.split("")) {
        try {
          let t = c.charCodeAt(0).toString(16).toUpperCase();
          const response = await fetch(`/api/stroke/${t}.json`);
          const cdata = await response.json();

          cdata.stroke.map((s) => {
            let scale = 100 / (cdata.h || 100);
            cdata.scale = scale;
            s.d = translateAndScaleSvgPath(s.d, tranX, 0, scale, scale);

            s.track = getPointsOnPath(
              s.t || s.d,
              s.r || cdata.r || 8,
              s.t ? scale : 1
            );
            s.track.map((t) => (t.x = (s.t ? tranX : 0) + t.x));
          });
          tranX += cdata.scale * (cdata.w || 100);

          const chData = {
            ch: c,
            begin: word.stroke.length,
            tranX: tranX,
            w: cdata.w || 100,
            strokeIndex:-1
          };

          word.stroke.push(...cdata.stroke);
          chData.end = word.stroke.length;
          word.chs.push(chData);
          i++;
        } catch (error) {
          console.error(error);
        }
      }
      word.viewBoxWidth = tranX;

      setWord(word); // Update state with the paths
      wordRef.current = word;
    } catch (error) {
      console.error("Error fetching paths:", error);
    }
  };

  useEffect(() => {
    wordRef.current = null;
    (async () => {
      if (settings.item) {
        await loadDatas();
      }
    })();
  }, [settings.item]); // Empty dependency array to run once on mount

  useEffect(() => {
    // playStokes();
    setPlayedIndex(-1);
  }, [word]);
  useEffect(() => {
    let contextButton = { name: "Replay" };
    dispatch(
      updateSettings({
        contextButtons: [...settings.contextButtons, contextButton],
      })
    );

    EventBus.on(["Replay"], [playStokes]);
    return () => {
      let updateButtons = settings.contextButtons.filter(
        (item) => item.name != contextButton.name
      );
      dispatch(
        updateSettings({
          contextButtons: updateButtons,
        })
      );

      EventBus.off(["Replay"], [playStokes]);
    };
  }, []);

  return (
    <>
      {word && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            maxHeight: "80%",
            maxWidth: "80%",
            width: "80%",
            height: "80%",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div>Next Tip</div>
            <div>Auto Tips</div>
            <div>
              <FontAwesomeIcon
                icon={faRedo}
                size="sm"
                color={"red"}
                onClick={resetStrokes}
              />
            </div>
          </div>
          <svg
            viewBox={`0 0 ${word.viewBoxWidth}  100 `}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
            }}
          >
            <g>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                stroke="black"
                strokeWidth="1"
                fill="#aaa"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="0"
                y1="50%"
                x2="100%"
                y2="50%"
                strokeDasharray={[5, 5]}
                stroke="black"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {word.chs &&
                word.chs.map((ch, index) => (
                  <g key={index}>
                    {false && (
                      <line
                        x1={100 * index + 50}
                        y1="0"
                        x2={100 * index + 50}
                        y2="100%"
                        strokeDasharray={[5, 5]}
                        stroke="black"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                      />
                    )}
                    {
                      <line
                        x1={ch.tranX}
                        y1="0"
                        x2={ch.tranX}
                        y2="100%"
                        stroke="black"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                      />
                    }
                  </g>
                ))}
            </g>

            <g>
              {word.stroke &&
                word.stroke.map((stroke, index) => (
                  <path
                    key={index}
                    d={stroke.d}
                    stroke="#FFF"
                    strokeWidth="1"
                    fill={stroke.nf ? "none" : "#FFF"}
                    strokeLinejoin="round"
                  />
                ))}
            </g>

            <g>
              {word.stroke &&
                word.stroke.map(
                  (stroke, index) =>
                    playedIndex >= index && (
                      <path
                        key={index}
                        d={stroke.d}
                        stroke="#000000"
                        strokeWidth="2"
                        fill={stroke.nf ? "none" : "#000"}
                        strokeLinejoin="round"
                      />
                    )
                )}
            </g>

            <g>
              {/* Define a mask for the circular track points */}
              <defs>
                <mask id="mask">
                  {word.stroke &&
                    word.stroke.map(
                      (stroke, index) =>
                        playedIndex + 1 == index && (
                          <path
                            key={index}
                            d={stroke.d}
                            stroke="white"
                            strokeWidth="2"
                            fill={stroke.nf ? "none" : "#FFF"}
                          />
                        )
                    )}
                </mask>
              </defs>

              {/* Draw stroke */}
              <g mask="url(#mask)">
                {points.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={point.r}
                    fill="#000000"
                  />
                ))}
              </g>
            </g>
          </svg>
          <div style={{ display: "flex" }}>
            {word.chs &&
              word.chs.map((ch, index) => (
                <div key={index} style={{ flexGrow: ch.w }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>{ch.ch}</span>
                    <FontAwesomeIcon icon={faPlay} size="sm" color={"#aaa"} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default WordTrack;
