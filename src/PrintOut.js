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

import { updateSettings } from "./features/settingsSlice";
import { createStrokeJSON } from "./SvgEdit2/SVGUtils";
import { playSound } from "./sound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CollapsibleItemsContainer from './CollapsibleItemsContainer';
import {
  faPlay,
  faRedo,
  faLightbulb,
  faArrowRight,
  faVolumeUp,faQuestionCircle 
} from "@fortawesome/free-solid-svg-icons";
import EventBus from "just-event-bus";

const PrintOut = ({}) => {
  const [word, setWord] = useState(null);
  const [playedIndex, setPlayedIndex] = useState(-1);
  const [points, setPoints] = useState([]);
  const wordRef = useRef(null);
  const playingRef = useRef(0);

  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const playStroke = async (w, stroke, curTime) => {
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
          await playStroke(w, stroke, curTime);
          if (curTime !== playingRef.current) return;
          setPlayedIndex(i);
        }
        playSound(`/data/sound/Cantonese/${encodeURIComponent(w.ch)}.mp3`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (curTime !== playingRef.current) return;
      }
    }

    playingRef.current = 0;
  };
  const resetStrokes = () => {
    setPoints([]);
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
          const response = await fetch(`/data/api/stroke/${t}.json`);
          const cdata = await response.json();

          cdata.stroke.map((s) => {
            let scale = 100 / (cdata.h || 100);
            cdata.scale = scale;
            s.d = translateAndScaleSvgPath(s.d, tranX, 0, scale, scale);
            let r  = scale*(s.r||cdata.r);
            const path = scaleSvgPath(s.t || s.d,scale);
            s.track = getPointsOnPath(
              path,
              r ,
              s.t ? scale : 1
            );
            s.track.map((t) => (t.x = (s.t ? tranX : 0) + t.x));
            console.log(s)
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
    if(!word)return;
    playedIndexRef.current = playedIndex;
    if(word.chs.filter(c=>c.end==playedIndex+1).length>0){
        setTrackPoints([]);
    }
    
  }, [playedIndex,word]);
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
     let distance =  PointsDistance(newPoint, nextPoint);
      if (
        distance <=
        spoints[drawPoints.current.length].r
      ) {
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
    //setPoints([]);
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

  const playSounds = async () => {
    console.log("Sound played");
    for(let w of word.chs){
      playSound(`/data/sound/Cantonese/${encodeURIComponent(w.ch)}.mp3`);
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
    { icon: faQuestionCircle , label: "Next Tip", onClick: tipsNextStroke },
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

  const [trackPoints,setTrackPoints] = useState([]);
  return (
    <>
<svg width="210mm" height="297mm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297">
  <rect width="210" height="297" fill="white" />
  
  <rect x="10" y="10" width="190" height="277" fill="none" stroke="black" stroke-width="0.5" />

  <text x="20" y="40" font-family="Arial" font-size="12">This is within the printable area.</text>
</svg>
    </>
  );
};

export default PrintOut;
