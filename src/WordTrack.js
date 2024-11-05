import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  translateAndScaleSvgPath,
  pointsSmooth,
  scaleStroke,
} from "./SVGUtils";
import { createStrokeJSON } from "./SvgEdit2/SVGUtils";
const WordTrack = ({ item }) => {
  const [word, setWord] = useState(null);
  const [playedIndex, setPlayedIndex] = useState(-1);
  const [points, setPoints] = useState([]);
  const wordRef = useRef(null);
  const playingRef = useRef(false);

  const playStokes = async () => {
    const word = wordRef.current;
    if (playingRef.current) return;
    playingRef.current = true;
    setPlayedIndex(-1);
    setPoints([]);

    if (word?.stroke)
      for (let i = 0; i < word.stroke.length; i++) {
        setPoints([]);

        let stroke = word.stroke[i];
        await new Promise((resolve) => setTimeout(resolve, 50));

        let spoints = pointsSmooth(stroke.track);
        for (let j = 0; j < spoints.length; j++) {
          setPoints((prev) => [...prev, spoints[j]]);
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        setPlayedIndex(i);
      }
    playingRef.current = false;
  };

  useEffect(() => {
    wordRef.current = null;
    const fetchPaths = async () => {
      try {
        // let chs = item.text.plit('');

        // const xmlString = await response.text(); // Get the XML string
        //const word = await response.json();// createStrokeJSON(xmlString); // Convert XML to JSON

        // Assuming strokeData has a property 'path' that is an array
        // word.stroke.map(s=>scaleStroke(s,348 /2048,348 /1792))

        //isASCII(chs)
        let str = "玩";

        let word = { stroke: [], chs: [] };
        let i = 0;
        for (let c of str.split("")) {
          try {
            let t = c.charCodeAt(0).toString(16).toUpperCase();
            const response = await fetch(`/api/stroke/${t}.json`);
            const cdata = await response.json();

            cdata.stroke.map((s) => {
              s.d = translateAndScaleSvgPath(s.d, i * 100, 0, 1, 1);
              s.track.map((t) => (t[0] += i * 100));
            });
            const chData = { ch: c, begin: word.stroke.length };

            word.stroke.push(...cdata.stroke);
            chData.end = word.stroke.length;
            word.chs.push(chData);
            i++;
          } catch (error) {
            console.error(error);
          }
        }

        setWord(word); // Update state with the paths
        wordRef.current = word;
      } catch (error) {
        console.error("Error fetching paths:", error);
      }
    };

    (async () => {
      if (item) {
        await fetchPaths();
      }
    })();
  }, [item]); // Empty dependency array to run once on mount

  useEffect(() => {
    playStokes();
  }, [word]);

  return (
    <>
      <div
        onClick={playStokes}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          cursor: "pointer",
          background: "#ccc",
        }}
      >
        Replay
      </div>
      {word && (
        <svg
          width="100%"
          viewBox={`0 0 ${word.chs.length * 100}  100 `}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            zIndex: -1,
            transform: "translate(-50%, -50%)",
            maxHeight: "80%",
            maxWidth: "80%",
          }}
        >
          <g>
          <rect x="0" y="0" width="100%" height="100%" stroke="black" strokeWidth="1" fill="#aaa" vectorEffect="non-scaling-stroke"/>
          <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray={[5,5]} stroke="black" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
          {word.chs &&
              word.chs.map((ch, index) => (
                <>
                <line x1={100*index+50} y1="0" x2={100*index+50} y2="100%" strokeDasharray={[5,5]}  stroke="black" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
                {index>0&&<line x1={100*index} y1="0" x2={100*index} y2="100%"  stroke="black" strokeWidth="1" vectorEffect="non-scaling-stroke"/>}
                </>
              ))}
          </g>

          <g>
            {word.stroke &&
              word.stroke.map(
                (stroke, index) =>
                  (
                    <path
                      key={index}
                      d={stroke.d}
                      stroke="#000000"
                      strokeWidth="0"
                      fill="#FFF"
                      strokeLinejoin="round"
                    />
                  )
              )}
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
                      fill="#000000"
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
                          fill="white"
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
                  cx={point[0]}
                  cy={point[1]}
                  r={8}
                  fill="#000000"
                />
              ))}
            </g>
          </g>
        </svg>
      )}
    </>
  );
};

export default WordTrack;
