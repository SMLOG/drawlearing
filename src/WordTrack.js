import React, { useState, useEffect, useCallback, useRef } from "react";
import { translateAndScaleSvgPath, pointsSmooth } from "./SVGUtils";
const WordTrack = ({ item }) => {
  const [word, setWord] = useState(null);
  const [playedIndex, setPlayedIndex] = useState(-1);
  const [points, setPoints] = useState([]);
  const wordRef = useRef(null);

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
    const fetchPaths = async () => {
      try {
        // let chs = item.text.plit('');

        //isASCII(chs)
        let str = "王文宇";

        let word = { stroke: [],chs:[] };
        let i = 0;
        for (let c of str.split("")) {
          try{

          
          let t = c.charCodeAt(0).toString(16).toUpperCase();
          const response = await fetch(`/api/stroke/${t}.json`);
          const cdata = await response.json();

          cdata.stroke.map((s) => {
            s.d = translateAndScaleSvgPath(s.d, i * 348, 0, 1, 1);
            s.track.map((t) => (t[0] += i * 348));
          });
          const chData = {ch:c,begin:word.stroke.length};

          word.stroke.push(...cdata.stroke);
          chData.end=word.stroke.length;
          word.chs.push(chData);
          i++;
        }catch(error){
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
      {word&&<svg
        width="100%"
        viewBox={`0 0 ${word.chs.length*348}  348 `}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          zIndex: -1,
          transform: "translate(-50%, -50%)",
          maxHeight: "100%",
          maxWidth: "100%",
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
}
    </>
  );
};

export default WordTrack;
