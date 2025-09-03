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
import { weeksplan } from "./weeksplan";
import {
  faPlay
} from "@fortawesome/free-solid-svg-icons";
import Watermark from './Watermark';
import './word-animation.css';
import VideoCover from "./screens/VideoCover";
import VideoEndScreen from "./screens/VideoEndScreen";
import FunnyIntro from "./screens/FunnyIntro";


const ScreenContainer = styled.div`
width: 100vw;
height: 100vh;
position: relative;

`
// Updated ScreenBox with fade animation


const Screen = styled.div`
  display: flex;
  flex-grow: 1;
  position: absolute;
  inset: 0;

  align-items: flex-start;
  opacity: 0; /* Start with opacity 0 */
  transition: opacity 1s ease-in-out; /* Smooth transition for opacity */
  &.fade-in {
    opacity: 1; /* Fade in to full opacity */
  }
  &.fade-out {
    opacity: 0; /* Fade out to zero opacity */
  }

`;

// Rest of your styled components remain unchanged
const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
`;

const LineWordList = styled.div`
  flex-grow: 1;
  padding: 16px;
  font-size: 100px;
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
  const [curAnimationState, setCurAnimationState] = useState(''); // New state for animation
  const [prevAnimationState, setPrevAnimationState] = useState(''); // New state for animation

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
    setPlayedIndex(-1);
    await playSound('/mixkit-casino-bling-achievement-2067.wav',0.8);
    const wordStrok = await loadDatas(word);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    playingRef.current = +new Date();
    let curTime = playingRef.current;
    setPoints([]);
    setWord(wordStrok);

    if (wordStrok?.stroke) {
      for (let w of wordStrok.chs) {
        for (let i = w.begin; i < w.end; i++) {
          setPoints([]);
          let stroke = wordStrok.stroke[i];
          await playStroke(w, stroke, curTime);
          if (curTime !== playingRef.current) return;
          setPlayedIndex(i);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        await playSound(`/data/audio/${selectedLanguage}/${encodeURIComponent(w.ch.toLowerCase())}.mp3`,10);
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

    for (let k = 0; k < day.characters.length; k++) {
      setCurChar(k);
      let chs = day.characters[k].split('');
      for (let i = 0; i < chs.length; i++) {
        try {
          setText(chs[i]);
          setWords(chs);
          setTxtIndex(i);
          setCurChari(i);
          await new Promise(resolve => setTimeout(resolve, 1000));
          await playWordStrokes(chs[i]);
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('Finished playing character:', chs[i]);
        } catch (error) {
          console.error(`Error processing character "${day.characters[i]}":`, error);
          continue;
        }
      }
    }
  };

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
            let r = scale * (s.r || cdata.r) * 1.1;
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






  const playSound = async (url,volume=1) => {

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioContext.createGain();
gainNode.gain.value = volume; // Increase volume (1 is normal, 2 is double)

const audioElement = new Audio(url);
const source = audioContext.createMediaElementSource(audioElement);
source.connect(gainNode);
gainNode.connect(audioContext.destination);

// Play audio
audioElement.play();

    /*if (audioRef.current) {
      audioRef.current.src = url;
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error("Error playing sound:", error);
        setErrorMsg(error.message);
      }
    }*/
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
  const [curChar, setCurChar] = useState(-1);
  const [curChari, setCurChari] = useState(-1);
  const [weekData, setWeekData] = useState(weeksplan);
  const [screen, setScreen] = useState("");
  const [prevScreen, setPrevScreen] = useState("");
  const [isVisible, setIsVisible] = useState(false); // New state for visibility
  const [dayNum, setDayNum] = useState(0);

 const startPlay = async () => {
    setScreen('');
    setIsVisible(false); // Initial fade-out
    setCurAnimationState('fade-in');
    setPrevAnimationState('fade-out');
         //   await showScreen('end', 80000); // Show intro for 5 seconds

    for (let i = 1; i < weeksplan.length; i++) {
        setCurWeek(i);
        
        for (let j = 1; j < weeksplan[i].days.length; j++) {
            setCurDay(j);
            setDayNum(5*i+j+1);
            await showScreen('conver', 3000); // Show intro for 5 seconds
            playSound('/mixkit-player-jumping-in-a-video-game-2043.wav',0.5);
            await showScreen('intro', 3000); // Show intro for 5 seconds

            await showScreen('run', ()=>{
              return playDays(weeksplan[i].days[j]);
            }); // Show run screen
            playSound('/mixkit-player-jumping-in-a-video-game-2043.wav',0.5);

            await showScreen('retry', 2000); // Show retry for 2 seconds
            playSound('/mixkit-player-jumping-in-a-video-game-2043.wav',0.5);

            await showScreen('run', ()=>{
              return playDays(weeksplan[i].days[j]);
            }); // Show run screen
           
            playSound('/mixkit-game-bonus-reached-2065.wav',0.5);
            await showScreen('end', 8000); // Show intro for 5 seconds

        }
    }
};

const curScreenRef = useRef(screen);
const prevScreenRef = useRef(prevScreen);

const showScreen = async (s, duration) => {
  prevScreenRef.current = curScreenRef.current;
  curScreenRef.current = s;



    setScreen(s);

    if (typeof duration =='number' &&  duration > 0) {
        await delay(duration); // Wait for specified duration
    }else if(typeof duration =='function'){ 
        await duration(); // Wait for the function to complete
    }

    setPrevScreen(s);
    setScreen('');
    await delay(1000); // Wait for specified duration

    console.log('Screen shown:', screen,prevScreen);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        startPlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        handleExitFullScreen();
      }
    });
    return () => {
      document.removeEventListener('fullscreenchange', handleExitFullScreen);
    };
  }, []);

  const handleFullScreen = () => {
    setFullScreen(true);
    document.querySelector('#screens').requestFullscreen();
  };

  const getAnimationClass = (screenName) => {

    if (screen === screenName) {
      return curAnimationState;
    }else if (prevScreen === screenName) {
      return prevAnimationState;
    }
    
  }
  return (
    <Container className="min-h-screen h-screen" id="screens" style={{ cursor: fullScreen ? 'none' : 'pointer' }}>
      <Watermark text="alearningapp.com" />
      <div
        id="cinfo"
        style={{
          position: fullScreen ? 'absolute' : 'static',
          top: fullScreen ? '50%' : 'auto',
          left: fullScreen ? '50%' : 'auto',
          transform: fullScreen ? 'translate(-50%, -50%)' : 'none',
          width: '100%',
          maxWidth: '800px',
          margin: fullScreen ? '0' : '0 auto',
          zIndex: fullScreen ? 1000 : 'auto',
          display: fullScreen ? 'none' : '',
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
                    className="mb-2 transition-colors duration-200 hover:text-blue-500 flex items-center gap-2 group"
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
          <ScreenContainer>
        {(screen === 'end' || prevScreen === 'end')  && (
        <Screen className={`screen ${getAnimationClass('end')}`} >
           <VideoEndScreen />
        </Screen>
      )}

        {(screen === 'conver'|| prevScreen === 'conver')  && (
        <Screen className={`screen ${getAnimationClass('conver')}`} >
           <VideoCover />
        </Screen>
      )}

      {(screen === 'intro'|| prevScreen === 'intro')  && (
        <Screen className={`${getAnimationClass('intro')}`} style={{ fontSize: '50px' }}>
          <FunnyIntro title={`Week ${weekData[curWeek].week} - Day ${weekData[curWeek].days[curDay].day}`} 
          description={`${weekData[curWeek].days[curDay].description}`}
          description2={`${weekData[curWeek].description}`}
          />

        </Screen>
      )}
      {(screen === 'retry'|| prevScreen === 'retry')  && (
        <Screen className={`${getAnimationClass('retry')}`} >
          <div className="screenIntro" style={{ fontSize: '100px' }}>
          {curWeek > -1 && curDay > -1 && weekData[curWeek] && weekData[curWeek].days[curDay] && (
            <div className="p-4 bg-white bg-yellow-50 rounded-lg mb-4">
              <p className="text-gray-700 mb-1 text-center"><strong>Again...</strong></p>
   
            </div>
          )}
          </div>

        </Screen>
      )}

      {(screen === 'run'|| prevScreen === 'run')  && (
          <Screen className={`flex-col-reverse ${getAnimationClass('run')}`}>
      <div className="w-full flex justify-center mt-4 flex-1">
              <div className="absolute top-2 left-2 p-2 font-bold rounded bg-green-200">
                Day {dayNum}
              </div>
              <div className="min-h-[500px] min-w-[500px] mb-8  border border-gray-300 rounded-md border-black" style={{ width: '500px', height: '500px', border: "10px solid black", boxSizing: 'border-box', touchAction: 'none'  }}>
                {word&&<svg
                  viewBox={`0 0 ${word.viewBoxWidth} 100`}
                  className="max-h-full max-w-[350px] min-w-[300px]"
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
                </svg>}
              </div>
            </div>
            <LineWordList className="w-full flex-0" style={{maxHeight:'400px'}}>
              <div className="h-full">
                <div className="flex items-center justify-center gap-4 mb-4 min-h-full">
                  {curWeek >= 0 && curDay >= 0 && (
                    <div className="font-semibold text-gray-700 flex">
                      {weekData[curWeek] && weekData[curWeek].days[curDay] && Array.isArray(weekData[curWeek].days[curDay].characters) ? (
                        weekData[curWeek].days[curDay].characters.map((ch, idx) => (
                          <span
                            key={idx}
                            className={`inline-block flex rounded-full px-3 py-1 font-semibold mr-4 mb-2 word-animation`}
                          >
                            {ch.split("").map((c, i) => (
                              <span
                                key={i}
                                className={`flex flex-col items-center mr-2 word-animation ${curChar === idx && curChari === i ? "active" : curChar > idx || (idx <= curChar && i <= curChari) ? "actived" : "text-black"}`}
                              >
                                {c}
                                {curChar === idx && curChari === i && <i className="fa-solid fa-hand-pointer mt-1"></i>}
                              </span>
                            ))}
                          </span>
                        ))
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </LineWordList>
          </Screen>
      )}
      </ScreenContainer>

      <audio ref={audioRef} controls src={`/data/sound/3s.mp3`} className={errorMsg ? '' : 'hidden'} />
      {errorMsg && <div className="text-red-500 mt-2">{errorMsg}</div>}
    </Container>
  );
};

export default WordTrackWeekPlan;