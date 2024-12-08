import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  translateAndScaleSvgPath,
  pointsSmooth,
  scaleStroke,
  scaleSvgPath,
  getPointsOnPath,
  getOffset,
  PointsDistance,
} from "./SVGUtils";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom";

import { updateSettings } from "./features/settingsSlice";
import { createStrokeJSON } from "./SvgEdit2/SVGUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CollapsibleItemsContainer from "./CollapsibleItemsContainer";
import {
  faPlay,
  faRedo,
  faLightbulb,
  faArrowRight,
  faVolumeUp,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import EventBus from "just-event-bus";

const WordTrack2 = ({}) => {
  const location = useLocation();
  const { sentence } = useParams();

  const [word, setWord] = useState(null);
  const [words, setWords] = useState(sentence.split(""));
  const [playedIndex, setPlayedIndex] = useState(-1);
  const [txtIndex, setTxtIndex] = useState(0);
  const [points, setPoints] = useState([]);
  const wordRef = useRef(null);
  const playingRef = useRef(0);

  const playStroke = async (w, stroke, curTime) => {
    await new Promise((resolve) => setTimeout(resolve, 70));
    if (curTime !== playingRef.current) return;
    let spoints = stroke.track;

    for (let j = 0; j < spoints.length; j++) {
      setPoints((prev) => [...prev, spoints[j]]);
      if (j != spoints.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 70));
        if (curTime !== playingRef.current) return;
      }
    }
    setPoints([]);

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
          await playStroke(w, stroke, curTime);
          if (curTime !== playingRef.current) return;
          setPlayedIndex(i);
        }
        playSound(`/sound/Cantonese/${encodeURIComponent(w.ch)}.mp3`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (curTime !== playingRef.current) return;
      }
    }

    playingRef.current = 0;
  };
  useEffect(()=>{
    if(wordRef.current&&playedIndex>=wordRef.current.stroke.length-1){
      setTimeout(()=>{
        setTxtIndex((prev)=>prev+1>=words.length?prev:prev+1)
      },2000);
    }
     
  },[wordRef.current,playedIndex]);
  const resetStrokes = () => {
    setPoints([]);
    setPlayedIndex(-1);
  };

  const loadDatas = async () => {
    try {
      let word = { stroke: [], chs: [] };
      let i = 0;
      let tranX = 0;

      let str = words[txtIndex];
      for (let c of str.split("")) {
        try {
          let t = c.charCodeAt(0).toString(16).toUpperCase();
          const response = await fetch(`/api/stroke/${t}.json`);
          const cdata = await response.json();

          cdata.stroke.map((s) => {
            let scale = 100 / (cdata.h || 100);
            cdata.scale = scale;
            s.d = translateAndScaleSvgPath(s.d, tranX, 0, scale, scale);
            let r = scale * (s.r || cdata.r);
            const path = scaleSvgPath(s.t || s.d, scale);
            s.track = getPointsOnPath(path, r, s.t ? scale : 1);
            s.track.map((t) => (t.x = (s.t ? tranX : 0) + t.x));
            console.log(s);
          });
          tranX += cdata.scale * (cdata.w || 100);

          const chData = {
            ch: c,
            begin: word.stroke.length,
            tranX: tranX,
            w: cdata.w || 100,
            strokeIndex: -1,
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
    setPlayedIndex(-1);
    (async () => {
      await loadDatas();
    })();
  }, [words, txtIndex]); // Empty dependency array to run once on mount



  const svgRef = useRef(null);
  const isDrawingRef = useRef(false);
  const drawPoints = useRef([]);

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const { offsetX, offsetY } = getOffset(svgRef.current, e);
    drawPoints.current = [];
    setPoints([]);
  }, []);

  const [penPoint, setPenPoint] = useState({ x: 0, y: 0 });
  const playedIndexRef = useRef(-1);
  useEffect(() => {
    if (!word) return;
    playedIndexRef.current = playedIndex;
    if (word.chs.filter((c) => c.end == playedIndex + 1).length > 0) {
      setTrackPoints([]);
    }
  }, [playedIndex, word]);
  const moveDraw = (e) => {
    if (!isDrawingRef.current) return;

    const { offsetX, offsetY } = getOffset(svgRef.current, e);

    const newPoint = { x: offsetX, y: offsetY };

    if (playedIndexRef.current + 1 >= word.stroke.length) return;
    let nextStrok = word.stroke[playedIndexRef.current + 1];
    let spoints = nextStrok.track;
    setTrackPoints(spoints);
    setPenPoint(newPoint);
    if (drawPoints.current.length < spoints.length) {
      let i = drawPoints.current.length;
      let nextPoint = spoints[i];
      let distance = PointsDistance(newPoint, nextPoint);
      if (distance <= spoints[drawPoints.current.length].r) {
        let point = spoints[drawPoints.current.length];
        if (point) {
          setPoints((prev) => [...prev, point]);
        }
        drawPoints.current.push(newPoint);
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (playedIndexRef.current + 1 >= word.stroke.length) return;
    let nextStrok = word.stroke[playedIndexRef.current + 1];
    let spoints = nextStrok.track;
    if (drawPoints.current.length == spoints.length) {
      setPlayedIndex(playedIndexRef.current + 1);
    } else {
    }
    setPoints([]);
    drawPoints.length = 0;
  };

  useEffect(() => {
    const divElement = svgRef.current;
    if (divElement) {
      divElement.addEventListener("touchstart", startDrawing, {
        passive: false,
      });
      divElement.addEventListener("touchmove", moveDraw, { passive: true });
      divElement.addEventListener("touchend", stopDrawing, { passive: false });

      return () => {
        divElement.removeEventListener("touchstart", startDrawing);
        divElement.removeEventListener("touchmove", moveDraw);
        divElement.removeEventListener("touchend", stopDrawing);
      };
    }
  }, [word]);

  const audioRef = useRef(null);
  const [errorMsg,setErrorMsg] = useState('');
  const playSound = (url) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play().catch((error) => {
        console.error("Error playing sound:", error);
        errorMsg = error;
      });
    }
  };

  const playSounds = async () => {
    console.log("Sound played");
    for (let w of word.chs) {
      playSound(`/sound/Cantonese/${encodeURIComponent(w.ch)}.mp3`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const [tipIndex, setTipIndex] = useState(-1);
  const [autoTips, setAutoTips] = useState(false);

  const tipsNextStroke = async () => {
    let nextIndex = playedIndex + 1;
    if (nextIndex >= word.stroke.length) nextIndex = 0;
    setTipIndex(nextIndex);
  };

  useEffect(() => {
    let nextIndex = playedIndex + 1;

    if (autoTips) {
      let nextIndex = playedIndex + 1;
      if (nextIndex >= word.stroke.length) nextIndex = 0;
    } else {
      nextIndex = -1;
    }
    setTipIndex(nextIndex);
  }, [word, playedIndex, autoTips]);

  const buttons = [
    { icon: faQuestionCircle, label: "Next Tip", onClick: tipsNextStroke },
    {
      icon: faLightbulb,
      label: "Auto Tips",
      onClick: () => {
        setAutoTips(!autoTips);
      },
      selected: autoTips,
    },
    { icon: faRedo, label: "Reset", onClick: resetStrokes },
    { icon: faPlay, label: "Play", onClick: playStokes },
    { icon: faVolumeUp, label: "Play Sound", onClick: playSounds },
  ];

  const [trackPoints, setTrackPoints] = useState([]);

  useEffect(() => {
    const handleClick = () => {
      playSound('/sound/3s.mp3');
      // Remove event listener after the first click
      document.body.removeEventListener('click', handleClick);
    };

    // Add event listener to the body
    document.body.addEventListener('click', handleClick);

    // Cleanup function to remove the event listener
    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {word && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, 0%)",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "5px 0",
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <CollapsibleItemsContainer direction={"w"}>
                {buttons.map((button, index) => (
                  <div
                    key={index}
                    onClick={button.onClick}
                    style={{
                      margin: "0 10px",
                      cursor: "pointer",
                      color: button.selected ? "red" : "black",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={button.icon}
                      size="sm"
                      color={"red"}
                    />
                    <span style={{ marginLeft: "5px" }}>{button.label}</span>
                  </div>
                ))}
              </CollapsibleItemsContainer>
            </div>
          </div>
          <svg
            viewBox={`0 0 ${word.viewBoxWidth}  100 `}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
            }}
            ref={svgRef}
            onMouseDown={startDrawing}
            onMouseMove={moveDraw}
            onMouseUp={stopDrawing}
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
                stroke="#ffffff"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
                <line
                x1="50%"
                y1="0"
                x2="50%"
                y2="100%"
                strokeDasharray={[5, 5]}
                stroke="#ffffff"
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
            {/** white stroke */}
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
            {/** played strokes */}
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

            {/* next tips stroke */}
            <g>
              <g>
                {word.stroke &&
                  word.stroke.map(
                    (stroke, index) =>
                      tipIndex == index && (
                        <path
                          key={index}
                          d={stroke.d}
                          stroke="#F00"
                          strokeWidth="2"
                          fill={stroke.nf ? "none" : "#F00"}
                        />
                      )
                  )}
              </g>
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
            <g>
              {false && (
                <circle cx={penPoint.x} cy={penPoint.y} r={4} fill="red" />
              )}
              {trackPoints.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r={1}
                  fill={index <= points.length - 1 ? "green" : "yellow"}
                />
              ))}
            </g>
          </svg>
          <div style={{ display: "flex" }}>
            {words &&
              words.map((ch, index) => (
                <span
                  key={index}
                  style={{ color: txtIndex > index ? "red" :txtIndex == index?"green": "black" }}
                  onClick={() => setTxtIndex(index)}
                >
                  {ch}
                </span>
              ))}
          </div>
          <audio ref={audioRef} controls src={`/sound/3s.mp3`} style={{display:errorMsg?'':'none'}}></audio>
          {errorMsg&&<div>{errorMsg}</div>}
        </div>
      )}
    </>
  );
};

export default WordTrack2;
