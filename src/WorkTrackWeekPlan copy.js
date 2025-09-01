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
  faEdit,
  faSave,
  faTimes,
  faForward
} from "@fortawesome/free-solid-svg-icons";

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

const LineText = styled.div`
  flex-grow: 1;
  padding: 16px;
  font-size: 2.5rem;
  text-align: left;
  min-width: 300px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  @media (min-width: 800px) {
    min-height: 300px;
  }
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
  const [autoPlayNext, setAutoPlayNext] = useState(false);

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

  const playStrokes = async () => {
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
        playSound(`/data/audio/${selectedLanguage}/${encodeURIComponent(w.ch.toLowerCase())}.mp3`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (curTime !== playingRef.current) return;
      }
    }
    playingRef.current = 0;
  };

    useEffect(() => {
    wordRef.current = null;
    setPlayedIndex(-1);
    (async () => {
      await loadDatas();
    })();
  }, [words, txtIndex]);
  
  useEffect(() => {
    if (wordRef.current && playedIndex >= wordRef.current.stroke.length - 1) {
      (async () => {
        await playSounds();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (autoPlayNext && txtIndex + 1 < words.length) {
          setTxtIndex((prev) => prev + 1);
          await new Promise((resolve) => setTimeout(resolve, 500));
          await playStrokes();
        } else {
          setTxtIndex((prev) => prev + 1 >= words.length ? prev : prev + 1);
        }
      })();
    }
  }, [wordRef.current, playedIndex, autoPlayNext, words.length, txtIndex]);

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
  const playSound = (url) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play().catch((error) => {
        console.error("Error playing sound:", error);
        setErrorMsg(error.message);
      });
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
    if(!word?.stroke||!word.stroke.length) return;
    if (nextIndex >= word.stroke.length) nextIndex = 0;
    setTipIndex(nextIndex);
  }, [word, playedIndex, autoTips]);

  const buttons = [
    { icon: faQuestionCircle, label: "Next Tip", onClick: tipsNextStroke },
    {
      icon: faLightbulb,
      label: "Auto Tips",
      onClick: () => setAutoTips(!autoTips),
      selected: autoTips,
    },
    { icon: faRedo, label: "Reset", onClick: resetStrokes },
    { icon: faPlay, label: "Play", onClick: playStrokes },
    { icon: faVolumeUp, label: "Sound", onClick: playSounds },
  ];

  const [trackPoints, setTrackPoints] = useState([]);
  const [text, setText] = useState(sentence);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => setIsEditing(true);
  const handleSaveClick = () => {
    setIsEditing(false);
    setWords(text.split(""));
    navigate('/weekplan/' + encodeURIComponent(text));
  };
  const handleCancelClick = () => {
    setIsEditing(false);
    setText(sentence);
  };

    const handleDayClick = (character) => {
    setText(character);
    setWords(character.split(""));
    setTxtIndex(0);
    navigate('/weekplan/' + encodeURIComponent(character));
  };
  return (
    <Container className="min-h-screen">
      <WeekPlanContainer>
        <h2 className="text-xl font-semibold mb-4">Learning Plan</h2>
        {weeks.map((week) => (
          <div key={week.week} className="mb-4">
            <h3 className="text-lg font-medium">Week {week.week}: {week.description}</h3>
            <p className="text-gray-600 mb-2">{week.purpose}</p>
            <ul className="list-disc pl-5">
              {week.days.map((day) => (
                <li key={day.day} className="mb-1" onClick={() => handleDayClick(Array.isArray(day.characters) ? day.characters.join('') : day.characters)} style={{cursor: 'pointer'} }>
                  <strong>Day {day.day}:</strong> {Array.isArray(day.characters) ? day.characters.join(", ") : day.characters} - ({day.description})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </WeekPlanContainer>
      {word && (
        <>
          <div className="flex justify-center items-center mb-4">
            <CollapsibleItemsContainer direction="w" className="flex flex-wrap gap-2">
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
              <CheckboxLabel selected={autoPlayNext}>
                <FontAwesomeIcon icon={faForward} />
                <span>Auto Play Next</span>
                <input
                  type="checkbox"
                  checked={autoPlayNext}
                  onChange={() => setAutoPlayNext(!autoPlayNext)}
                  className="ml-2"
                />
              </CheckboxLabel>
              <select
                onChange={(e) => setSelectedLanguage(e.target.value)}
                value={selectedLanguage}
                className="p-2 border rounded-md"
              >
                <option value="Cantonese">Cantonese</option>
                <option value="zh">Mandarin</option>
              </select>
            </CollapsibleItemsContainer>
          </div>
          <ScreenBox className="flex-col-reverse">
            <svg
              viewBox={`0 0 ${word.viewBoxWidth} 100`}
              className="max-h-full max-w-[350px] min-w-[300px] border border-gray-300 rounded-md"
              ref={svgRef}
              onMouseDown={startDrawing}
              onMouseMove={moveDraw}
              onMouseUp={stopDrawing}
            >
              <g>
                <rect x="0" y="0" width="100%" height="100%" stroke="black" strokeWidth="1" fill="#e5e7eb" />
                <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="5,5" stroke="#ffffff" strokeWidth="1" />
                <line x1="50%" y1="0" x2="50%" y2="100%" strokeDasharray="5,5" stroke="#ffffff" strokeWidth="1" />
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
            <LineText>
              <div className="h-full overflow-auto">
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea
                      rows={4}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter text to practice"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveClick}>
                        <FontAwesomeIcon icon={faSave} /> Save
                      </Button>
                      <Button onClick={handleCancelClick}>
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {words.map((ch, index) => (
                      <span
                        key={index}
                        className={`cursor-pointer ${txtIndex > index ? "text-red-500" : txtIndex === index ? "text-green-500" : "text-black"}`}
                        onClick={() => setTxtIndex(index)}
                      >
                        {ch}
                      </span>
                    ))}

                  </div>
                )}
              </div>
            </LineText>
          </ScreenBox>
          <audio ref={audioRef} controls src={`/data/sound/3s.mp3`} className={errorMsg ? '' : 'hidden'} />
          {errorMsg && <div className="text-red-500 mt-2">{errorMsg}</div>}
        </>
      )}
    </Container>
  );
};

export default WordTrackWeekPlan;