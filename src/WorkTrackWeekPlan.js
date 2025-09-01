import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  translateAndScaleSvgPath,
  scaleSvgPath,
  getPointsOnPath,
  getOffset,
  PointsDistance,
} from "./SVGUtils";
import { useParams, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CollapsibleItemsContainer from "./CollapsibleItemsContainer";
import {
  faPlay,
  faRedo,
  faLightbulb,
  faVolumeUp,
  faQuestionCircle,
  faForward
} from "@fortawesome/free-solid-svg-icons";

import './word-animation.css';

export const weeksplan = [
  {
    "week": 1,
    "description": "基础汉字与常用字的学习，帮助学生建立书写信心。",
    "purpose": "通过学习常用基础字，增强学生的书写能力和对汉字的理解。",
    "days": [
      {
        "day": 1,
        "characters": ["一", "二", "三", "口", "日", "月", "山"],
        "repetitions": 5,
        "description": "这些字是生活中常用的基础字，帮助学生建立信心。"
      },
      {
        "day": 2,
        "characters": ["田", "水", "火", "木", "土", "风", "雨"],
        "repetitions": 5,
        "description": "通过这些字，学生可以了解自然元素及其书写方式。"
      },
      {
        "day": 3,
        "characters": ["人", "手", "耳", "眼", "心", "口", "足"],
        "repetitions": 5,
        "description": "这些字有助于学生描述自己和他人。"
      },
      {
        "day": 4,
        "characters": ["家", "学校", "书", "老师", "朋友", "游戏", "玩具"],
        "repetitions": 5,
        "description": "这些字对学生的日常生活非常重要。"
      },
      {
        "day": 5,
        "characters": ["爱", "快乐", "跑", "跳", "说", "听", "看"],
        "repetitions": 5,
        "description": "增强学生的表达能力和沟通技巧。"
      }
    ]
  },
  {
    "week": 2,
    "description": "学习与自然和环境相关的汉字，增强对周围世界的认识。",
    "purpose": "通过学习与自然相关的字，帮助学生更好地理解和描述他们的环境。",
    "days": [
      {
        "day": 1,
        "characters": ["江", "河", "海", "湖", "泉", "潮", "泪"],
        "repetitions": 5,
        "description": "通过这些字，学生可以理解水的不同形式。"
      },
      {
        "day": 2,
        "characters": ["林", "树", "梅", "松", "桥", "桃", "枫"],
        "repetitions": 5,
        "description": "帮助学生认识自然界的植物。"
      },
      {
        "day": 3,
        "characters": ["横", "竖", "撇", "捺", "提", "折", "勾"],
        "repetitions": 5,
        "description": "笔画是写字的基础，熟练掌握有助于书写其他汉字。"
      },
      {
        "day": 4,
        "characters": ["大", "小", "长", "短", "高", "低", "宽"],
        "repetitions": 5,
        "description": "这些字有助于学生在日常生活中进行比较和描述。"
      },
      {
        "day": 5,
        "characters": ["地", "场", "城", "堆", "坟", "塑", "境"],
        "repetitions": 5,
        "description": "帮助学生理解地理和环境概念。"
      }
    ]
  },
  {
    "week": 3,
    "description": "学习与情感和社会相关的汉字，增强学生的表达能力。",
    "purpose": "通过学习与情感、社会和教育相关的字，帮助学生更好地表达自己。",
    "days": [
      {
        "day": 1,
        "characters": ["心", "情", "思", "念", "想", "愿", "梦"],
        "repetitions": 5,
        "description": "增强学生的情感表达能力。"
      },
      {
        "day": 2,
        "characters": ["家", "乡", "国", "土", "民", "众", "族"],
        "repetitions": 5,
        "description": "帮助学生理解家庭和社会的关系。"
      },
      {
        "day": 3,
        "characters": ["学", "习", "知", "识", "教", "育", "成"],
        "repetitions": 5,
        "description": "这些字对学生的学业和未来发展非常重要。"
      },
      {
        "day": 4,
        "characters": ["美", "丽", "善", "良", "真", "诚", "信"],
        "repetitions": 5,
        "description": "帮助学生理解社会价值观。"
      },
      {
        "day": 5,
        "characters": "用已学字写5个短句",
        "repetitions": "注意字形和结构",
        "description": "通过写短句，增强学生的实际运用能力。"
      }
    ]
  }
];

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
  padding: 16px;
`;

const ScreenBox = styled.div`
  display: flex;
  flex-grow: 1;
  margin: 16px;
  align-items: flex-start;
  gap: 16px;
  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
  }
`;

const LineWordList = styled.div`
  flex-grow: 1;
  padding: 16px;
  font-size: 2.5rem;
  text-align: left;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${props => props.selected ? '#ef4444' : '#e5e7eb'};
  color: ${props => props.selected ? '#ffffff' : '#1f2937'};
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: ${props => props.selected ? '#dc2626' : '#d1d5db'};
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${props => props.selected ? '#ef4444' : '#e5e7eb'};
  color: ${props => props.selected ? '#ffffff' : '#1f2937'};
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: ${props => props.selected ? '#dc2626' : '#d1d5db'};
  }
`;

const WeekPlanContainer = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const WordTrackWeekPlan = () => {
  const { sentence } = useParams();
  const navigate = useNavigate();
  const [weeks, setWeeks] = useState(weeksplan);
  const [word, setWord] = useState(null);
  const [words, setWords] = useState(sentence.split(""));
  const [playedIndex, setPlayedIndex] = useState(-1);
  const [txtIndex, setTxtIndex] = useState(0);
  const [points, setPoints] = useState([]);
  const wordRef = useRef(null);
  const playingRef = useRef(0);
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  const playStroke = async (w, stroke, curTime) => {
    await new Promise((resolve) => setTimeout(resolve, 70));
    if (curTime !== playingRef.current) return;
    let spoints = stroke.track;

    for (let j = 0; j < spoints.length; j++) {
      setPoints((prev) => [...prev, spoints[j]]);
      if (j != spoints.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (curTime !== playingRef.current) return;
      }
    }
    setPoints([]);
  };

  const playWordStrokes = async (word) => {

    const wordStrok = await loadDatas(word);
    playingRef.current = +new Date();
    let curTime = playingRef.current;
    setPlayedIndex(-1);
    setPoints([]);
    setWord(wordStrok)

    if (wordStrok?.stroke) {
      for (let w of wordStrok.chs) {
        for (let i = w.begin; i < w.end; i++) {
          setPoints([]);
          let stroke = wordStrok.stroke[i];
          await playStroke(w, stroke, curTime);
          if (curTime !== playingRef.current) return;
          setPlayedIndex(i);
          await new Promise((resolve) => setTimeout(resolve, 2000));

        }
        await playSound(`/data/audio/${selectedLanguage}/${encodeURIComponent(w.ch.toLowerCase())}.mp3`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (curTime !== playingRef.current) return;
      }
    }
    playingRef.current = 0;
  };

const playDays = async (day) => {
  if (!day?.characters || !Array.isArray(day.characters)) {
    console.warn('No valid characters array provided');
    return;
  }

  let chs = day.characters.join('').split('');
  for (let i=0;i<chs.length;i++) {
    try {
      // Update state for the current character
      setText(chs[i]); 
      setWords(chs); // Presumably setting words based on the full character string
      setTxtIndex(i);

      // Navigate to the character's page
     // navigate(`/weekplan/${encodeURIComponent(day.characters[i])}`);

      // Add a delay to allow state updates and navigation to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Play strokes and sounds sequentially
      await playWordStrokes(chs[i]);
      console.log('Finished playing character:', chs[i]);
    } catch (error) {
      console.error(`Error processing character "${day.characters[i]}":`, error);
      // Continue to the next character
      continue;
    }
  }
};


  /*useEffect(() => {
    if (wordRef.current && playedIndex >= wordRef.current.stroke.length - 1) {
      (async () => {
        await playSounds();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (autoPlayNext && txtIndex + 1 < words.length) {
          setTxtIndex((prev) => prev + 1);
          await new Promise((resolve) => setTimeout(resolve, 500));
          await playWordStrokes();
        } else {
          setTxtIndex((prev) => prev + 1 >= words.length ? prev : prev + 1);
        }
      })();
    }
  }, [wordRef.current, playedIndex, autoPlayNext, words.length, txtIndex]);*/

  const resetStrokes = () => {
    setPoints([]);
    setPlayedIndex(-1);
  };

  const loadDatas = async (str) => {
    try {
      let word = { stroke: [], chs: [] };
      let i = 0;
      let tranX = 0;

      for (let c of str.split("")) {
        try {
          let t = c.charCodeAt(0).toString(16).toUpperCase();
          const response = await fetch(`/data/api/stroke/${t}.json`);
          const cdata = await response.json();

          cdata.stroke.map((s) => {
            let scale = 100 / (cdata.h || 100);
            cdata.scale = scale;
            s.d = translateAndScaleSvgPath(s.d, tranX, 0, scale, scale);
            let r = scale * (s.r || cdata.r);
            const path = scaleSvgPath(s.t || s.d, scale);
            s.track = getPointsOnPath(path, r, s.t ? scale : 1);
            s.track.map((t) => (t.x = (s.t ? tranX : 0) + t.x));
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

      setWord(word);
      wordRef.current = word;
      return word;

    } catch (error) {
      console.error("Error fetching paths:", error);
    }
  };



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
    }
    setPoints([]);
    drawPoints.length = 0;
  };

  useEffect(() => {
    const divElement = svgRef.current;
    if (divElement) {
      divElement.addEventListener("touchstart", startDrawing, { passive: false });
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
  const [errorMsg, setErrorMsg] = useState('');
const playSound = async (url) => {
  if (audioRef.current) {
    audioRef.current.src = url;
    try {
      await audioRef.current.play();
    } catch (error) {
      console.error("Error playing sound:", error);
      setErrorMsg(error.message);
    }
  }
};

  const [selectedLanguage, setSelectedLanguage] = useState('Cantonese');
  const playSounds = async () => {
    for (const w of word.chs) {
      playSound(`/data/audio/${selectedLanguage}/${encodeURIComponent(w.ch.toLowerCase())}.mp3`);
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
    let nextIndex = autoTips ? playedIndex + 1 : -1;
    if (!word?.stroke || !word.stroke.length) return;
    if (nextIndex >= word.stroke.length) nextIndex = 0;
    setTipIndex(nextIndex);
  }, [word, playedIndex, autoTips]);


const [curWeek, setCurWeek] = useState(-1);
const [curDay, setCurDay] = useState(-1);
const [weekData, setWeekData] = useState(weeksplan);

const startPlay = async () => {
  for (let i=0;i< weeksplan.length;i++) {
    setCurWeek(i);
      for (let j=0;j< weeksplan[i].days.length;j++) {
        setCurDay(j);
        await playDays(weeksplan[i].days[j]);
  }
}
};




  const buttons = [
  
    { icon: faPlay, label: "Play", onClick: startPlay },
  ];

  const [trackPoints, setTrackPoints] = useState([]);
  const [text, setText] = useState(sentence);

  const handleDayClick = (character) => {
    setText(character);
    setWords(character.split(""));
    setTxtIndex(0);
    navigate('/weekplan/' + encodeURIComponent(character));
  };

  const [fullScreen, setFullScreen] = useState(false);

  const handleExitFullScreen = () => {
    setFullScreen(false);
  };

  useEffect(() => {
    // Listen for fullscreen change events
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        handleExitFullScreen();
      }
    });

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('fullscreenchange', handleExitFullScreen);
    };
  }, []);

  const handleFullScreen = () => {
    setFullScreen(true);
    document.querySelector('#screens').requestFullscreen();

  }

  return (
    <Container className="min-h-screen" id="screens" style={{ cursor: fullScreen ? 'none' : 'pointer' }}>
      <div
        id="cinfo"
        style={{
          position: fullScreen ? 'fixed' : 'static',
          top: fullScreen ? '50%' : 'auto',
          left: fullScreen ? '50%' : 'auto',
          transform: fullScreen ? 'translate(-50%, -50%)' : 'none',
          width: '100%',
          maxWidth: '800px',
          margin: fullScreen ? '0' : '0 auto',
          background: fullScreen ? 'rgba(0, 0, 0, 0.5)' : 'transparent', // optional: dim background
          zIndex: fullScreen ? 1000 : 'auto',
          display: fullScreen ? 'none' : '', // optional: allow scrolling if content is tall
        }}
      >
        <WeekPlanContainer className="week-plan-container bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <i className="fas fa-book text-blue-600"></i> 笔顺练习计划 (Week Plan)
          </h2>
          {weeks.map((week) => (
            <div key={week.week} className="mb-6 border-b last:border-0 pb-4">
              <h3 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                <i className="fas fa-calendar-week text-blue-500"></i> Week {week.week}: {week.description}
              </h3>
              <p className="text-gray-700 mb-2 italic flex items-center gap-2">
                <i className="fas fa-info-circle text-gray-500"></i> {week.purpose}
              </p>
              <ul className="list-none pl-5">
                {week.days.map((day) => (
                  <li
                    key={day.day}
                    className="mb-2 transition-colors duration-200 hover:text-blue-500 cursor-pointer flex items-center gap-2 group"
                    onClick={() => handleDayClick(Array.isArray(day.characters) ? day.characters.join('') : day.characters)}
                  >
                    <i className="fas fa-book-open text-gray-600 group-hover:text-blue-500 transition-colors duration-200"></i>
                    <span>
                      <strong>Day {day.day}:</strong> {Array.isArray(day.characters) ? day.characters.join(", ") : day.characters} - (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-blue-400 rounded px-1.5 py-0.5 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                        <i className="fas fa-quote-left text-sm"></i> {day.description}
                      </span>)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </WeekPlanContainer>
        <div className="flex justify-center items-center mb-4">
          <div direction="w" className="flex flex-wrap gap-2">
            <Button onClick={handleFullScreen}>
              <span>FullScreen</span>
            </Button>
            {buttons.map((button, index) => (
              <Button
                key={index}
                onClick={button.onClick}
                selected={button.selected}
              >
                <FontAwesomeIcon icon={button.icon} />
                <span>{button.label}</span>
              </Button>
            ))}
  
            <select
              onChange={(e) => setSelectedLanguage(e.target.value)}
              value={selectedLanguage}
              className="p-2 border rounded-md"
            >
              <option value="Cantonese">Cantonese</option>
              <option value="zh">Mandarin</option>
            </select>
          </div>
        </div>
      </div>
      {word && (
        <>

          <div >
            <ScreenBox className="flex-col-reverse">
              <div className="w-full flex justify-center">
                <div className="min-h-[500px] min-w-[500px] mb-8" style={{ width: '500px', height: '500px' }}>
                  <svg
                    viewBox={`0 0 ${word.viewBoxWidth} 100`}
                    className="max-h-full max-w-[350px] min-w-[300px] border border-gray-300 rounded-md border-black"
                    style={{ border: "10px solid black", boarderBox: 'border-box', touchAction: 'none' }}
                    ref={svgRef}
                    onMouseDown={startDrawing}
                    onMouseMove={moveDraw}
                    onMouseUp={stopDrawing}

                  >
                    <g>
                      <rect x="0" y="0" width="100%" height="100%" stroke="black" strokeWidth="1" fill="#e5e7eb" />
                      <line x1="2" y1="50%" x2="100%" y2="50%" strokeDasharray="5,5" stroke="#ffffff" strokeWidth="1" />
                      <line x1="50%" y1="2" x2="50%" y2="100%" strokeDasharray="5,5" stroke="#ffffff" strokeWidth="1" />
                      {word.chs.map((ch, index) => (
                        <g key={index}>
                          <line
                            x1={ch.tranX}
                            y1="0"
                            x2={ch.tranX}
                            y2="100%"
                            stroke="black"
                            strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                      ))}
                    </g>
                    <g>
                      {word.stroke.map((stroke, index) => (
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
                      {word.stroke.map((stroke, index) => playedIndex >= index && (
                        <path
                          key={index}
                          d={stroke.d}
                          stroke="#000000"
                          strokeWidth="2"
                          fill={stroke.nf ? "none" : "#000"}
                          strokeLinejoin="round"
                        />
                      ))}
                    </g>
                    <g>
                      {word.stroke.map((stroke, index) => tipIndex === index && (
                        <path
                          key={index}
                          d={stroke.d}
                          stroke="#F00"
                          strokeWidth="2"
                          fill={stroke.nf ? "none" : "#F00"}
                        />
                      ))}
                    </g>
                    <g>
                      <defs>
                        <mask id="mask">
                          {word.stroke.map((stroke, index) => playedIndex + 1 === index && (
                            <path
                              key={index}
                              d={stroke.d}
                              stroke="white"
                              strokeWidth="2"
                              fill={stroke.nf ? "none" : "#FFF"}
                            />
                          ))}
                        </mask>
                      </defs>
                      <g mask="url(#mask)">
                        {points.map((point, index) => (
                          <circle key={index} cx={point.x} cy={point.y} r={point.r} fill="#000000" />
                        ))}
                      </g>
                    </g>
                    <g>
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
                </div>
              </div>
              <LineWordList className="w-full">
                <div className="h-full overflow-auto">
                  <div className="flex items-center gap-4 justify-between mb-4 mx-5">
                     {curWeek >= 0 &&curDay >= 0 && (
                      <div className="text-lg font-semibold text-gray-700">
                        {weekData[curWeek] && weekData[curWeek].days[curDay] && Array.isArray(weekData[curWeek].days[curDay].characters)? (
                          weekData[curWeek].days[curDay].characters.map((ch, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 cursor-pointer hover:bg-blue-200"
                              onClick={() => handleDayClick(ch)}
                            >
                              {ch}
                            </span>
                          ))
                        ) :  (
                          <></>
                        )}
                      </div>
                    )}

                    {words.map((ch, index) => (
                      <span
                        key={index}
                        className={`flex flex-col items-center cursor-pointer word-animation ${txtIndex > index ? "text-red-500" : txtIndex === index ? "active" : "text-black"}`}
                        onClick={() => setTxtIndex(index)}
                      >
                        {ch}
                        {txtIndex === index && <i className="fa-solid fa-hand-pointer mt-1"></i>}
                      </span>
                    ))}
                  </div>
                </div>
              </LineWordList>
            </ScreenBox>
          </div>
          <audio ref={audioRef} controls src={`/data/sound/3s.mp3`} className={errorMsg ? '' : 'hidden'} />
          {errorMsg && <div className="text-red-500 mt-2">{errorMsg}</div>}
        </>
      )}
    </Container>
  );
};

export default WordTrackWeekPlan;