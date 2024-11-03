import React, { useState, useEffect, useCallback, useRef } from "react";
import { translateAndScaleSvgPath } from "./SVGUtils";
const WordTrack = ({ item }) => {
  const [word, setWord] = useState({});
  const [playedIndex, setPlayedIndex] = useState(-1);
  const [points, setPoints] = useState([]);
  const wordRef = useRef(null);

  const pointsSmooth = function (list) {
    var returnVal = new Array();
    var prevX = -1;
    var prevY = -1;
    var prevSize = -1;
    for (var loop = 0; loop < list.length; loop++) {
      if (prevX == -1) {
        prevX = list[loop][0];
        prevY = list[loop][1];
        prevSize = list[loop][2] || 0;
      } else {
        var dx = list[loop][0] - prevX;
        var dy = list[loop][1] - prevY;
        var dSize = list[loop][2] || 0 - prevSize;
        for (var adLoop = 0; adLoop < 10; adLoop++) {
          var addX = prevX + (dx / 10) * adLoop;
          var addY = prevY + (dy / 10) * adLoop;
          var addSize = prevSize + (dSize / 10) * adLoop;
          returnVal.push([addX, addY, addSize]);
        }
        prevX = list[loop][0];
        prevY = list[loop][1];
        prevSize = list[loop][2] || 0;
      }
    }
    return returnVal;
  };

  const playStokes = useCallback(async () => {
    const word = wordRef.current;
    if (word?.stroke)
      for (let i = 0; i < word.stroke.length; i++) {
        let stroke = word.stroke[i];
        setPoints([]);
        let spoints = pointsSmooth(stroke.track);
        for (let j = 0; j < spoints.length; j++) {
          setPoints((prev) => [...prev, spoints[j]]);
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        setPlayedIndex(i);
      }
  });

  useEffect(() => {
    wordRef.current = null;
    setWord({});
    const fetchPaths = async () => {
      try {
        // let chs = item.text.plit('');

        //isASCII(chs)
        let str = "上下";

        let word = { stroke: [] };
        let i = 0;
        for (let c of str.split("")) {
          let t = c.charCodeAt(0).toString(16).toUpperCase();
          const response = await fetch(`/api/stroke/${t}.json`);
          const cdata = await response.json();
          cdata.stroke.map((s) => {
            s.d = translateAndScaleSvgPath(s.d, i * 348, 0, 1, 1);
            s.track.map((t) => (t[0] += i * 348));
          });
          word.stroke.push(...cdata.stroke);
          i++;
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

  useEffect(()=>{
    playStokes();

  },[word])

  return (
    <>
      <svg
        width="100%"
        height={348 * 2}
        
        viewBox="0 0 696  348 "
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          zIndex: -1,
          transform: "translate(-50%, -50%)",
          maxHeight:'100%',
          maxWidth:'100%'
        }}
      >
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
                r={(348 / 1792) * 120}
                fill="#000000"
              />
            ))}
          </g>
        </g>
      </svg>
    </>
  );
};

export default WordTrack;
