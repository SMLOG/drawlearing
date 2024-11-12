import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useReducer,
} from "react";
import ColorPicker from "./ColorPicker";
import ButtonContainer from "./ButtonContainer";
import CursorIcon from "./CursorIcon";
import "./DrawSVG.css";
import PlayList from "./PlayList";
import WordTrack from "./WordTrack";
import ModeSwitchButton from "./ModeSwitchButton";
import YoutubePlayer from "./YoutubePlayer";
import UnitList from "./UnitList";
import Settings from "./Settings";
import { useSelector, useDispatch } from "react-redux";
import SvgEditorWrap from "./SvgEditorWrap";
import TopNav from './TopNav';
import Books from './Books';


import { getOffset } from "./SVGUtils";

const Draw = () => {
  const svgRef = useRef(null);
  const cursorRef = useRef(null);
  const settingRef = useRef({ color: "#000000", penWidth: 5, opacity: 1 });
  const isDrawingRef = useRef(false);
  const actions = useRef([]);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [lines, setLines] = useState([]);

  const settings = useSelector((state) => state.settings);

  const [isShowUnitList, setIsShowUnitList] = useState(false);
  const theme = useSelector((state) => state.theme);

  const [actionsLen, setActionsLen] = useState(0);
  const currentIndexRef = useRef(-1);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [penWidth, setPenWidth] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [svgElements, setSvgElements] = useState([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [item, setItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const [penType, setPenType] = useState("solid");

  const toggleSettings = () => {
    setIsSettingsVisible(!isSettingsVisible);
  };

  useEffect(() => {
    settingRef.current.color = selectedColor;
    settingRef.current.penWidth = penWidth;
    settingRef.current.opacity = opacity;
  }, [opacity, selectedColor, penWidth]);

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const { offsetX, offsetY } = getOffset(svgRef.current,e);
    settingRef.current.points = [
      { x: parseInt(offsetX), y: parseInt(offsetY) },
    ];
    setSvgElements((prev) => {
      let ret = [
        ...prev,
        {
          type: "polyline",
          points: settingRef.current.points,
          color: settingRef.current.color,
          opacity: settingRef.current.opacity,
          penWidth: settingRef.current.penWidth,
        },
      ];
      return ret;
    });
  }, []);

  function shouldAddPoint(newPoint, lastPoint) {
    const distance = Math.sqrt(
      Math.pow(newPoint.x - lastPoint.x, 2) +
        Math.pow(newPoint.y - lastPoint.y, 2)
    );
    return distance > 5; // Threshold for adding new points
  }

  const moveDraw = useCallback((e) => {
    const { offsetX, offsetY } = getOffset(svgRef.current,e);

    cursorRef.current.style.left = `${offsetX}px`;
    cursorRef.current.style.top = `${offsetY}px`;

    if (!isDrawingRef.current) return;

    const newPoint = { x: offsetX, y: offsetY };

    // Avoid duplicates by checking against the last point
    const lastPoint =
      settingRef.current.points[settingRef.current.points.length - 1];
    if (!lastPoint || shouldAddPoint(newPoint, lastPoint)) {
      settingRef.current.points.push(newPoint);
      let points = [...settingRef.current.points];
      setSvgElements((prev) => {
        const lastElement = prev[prev.length - 1];
        lastElement.points.length = 0;
        lastElement.points.push(...points);
        return [...prev];
      });
    }
  }, []);

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const newAction = {
      color: settingRef.current.color,
      points: settingRef.current.points,
      penWidth: settingRef.current.penWidth,
      opacity: settingRef.current.opacity,
    };
    saveAction(newAction);
    settingRef.current.points = [];
  };

  const mouseEnter = () => {
    cursorRef.current.style.display = "block";
  };
  const mouseLeave = () => {
    cursorRef.current.style.display = "none";
  };


  const saveAction = (newAction) => {
    actions.current.splice(currentIndexRef.current + 1);
    actions.current.push(newAction);
    setActionsLen(actions.current.length);
    currentIndexRef.current = actions.current.length - 1;
    setCurrentIndex(currentIndexRef.current);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const restoreCanvas = async (isReplay = false) => {
    setSvgElements([]);
    let paths=[];
    cursorRef.current.style.display = "";

    for (let i = 0; i <= currentIndexRef.current; i++) {
      const action = actions.current[i];
      const curPoints = [];
      paths.push( {
        type: "path",
        points: curPoints,
        color: action.color,
        penType: action.penType,
        penWidth: action.penWidth,
        opacity: action.opacity,
      });
      for (const point of action.points) {
        curPoints.push(point);

        cursorRef.current.style.left = `${point.x}px`;
        cursorRef.current.style.top = `${point.y}px`;
        setSvgElements([...paths]);
        isReplay && (await sleep(50)); // Adjust timing as needed
      }
      isReplay && (await sleep(100)); // Adjust timing for action separation
    }
    setIsReplaying(false);
    cursorRef.current.style.display = "none";
  };

  useEffect(() => {
    restoreCanvas(false); // Default to non-replay mode
  }, [actionsLen]);

  const drawLines = () => {
    if (settings.Draw.isShowGrid && svgRef.current) {
      let padding = 10;
      let minHeight = 150;
      let x2 = svgRef.current.clientWidth - padding;

      let count = 1;
      for (; true; count++) {
        if (
          (svgRef.current.clientHeight - 2 * padding - (count - 1) * padding) /
            count <
          minHeight
        )
          break;
      }
      if (count > 1) count--;

      let l = [];
      let lineHeight =
        (svgRef.current.clientHeight - (count - 1 + 2) * padding) / count / 3;
      let y = 0;
      for (let i = 0; i < count; i++) {
        y += padding;
        l.push(
          <line
            key={y}
            x1={padding}
            y1={y}
            x2={x2}
            y2={y}
            stroke="#000000"
            strokeWidth="1"
          />
        );
        y += lineHeight;
        l.push(
          <line
            key={y}
            x1={padding}
            y1={y}
            x2={x2}
            y2={y}
            stroke="#000000"
            strokeDasharray="5 5"
            strokeWidth="1"
          />
        );
        y += lineHeight;
        l.push(
          <line
            key={y}
            x1={padding}
            y1={y}
            x2={x2}
            y2={y}
            stroke="#000000"
            strokeDasharray="5 5"
            strokeWidth="1"
          />
        );
        y += lineHeight;
        l.push(
          <line
            key={y}
            x1={padding}
            y1={y}
            x2={x2}
            y2={y}
            stroke="#000000"
            strokeWidth="1"
          />
        );
      }

      setLines(l);
      return l;
    }
    return null;
  };

  useEffect(() => {
    const handleResize = () => {
      drawLines();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function pointsToPathData(points) {
    if (points.length < 2) return "";

    let pathData = `M ${points[0].x} ${points[0].y} `; // Move to the first point
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      if(p1.command){
        pathData += p1.command+' '+p1.params.join(' ')+' ';
       if( points.length - 2 == i) {
        pathData += p2.command+' '+p2.params.join(' ')+' ';
        console.log(p2)
       }
        continue;
      }

      let cp1, cp2;

      // Calculate control points for cubic Bezier curves
      if (i > 0) {
        cp1 = {
          x: p1.x + (p2.x - points[i - 1].x) / 2,
          y: p1.y + (p2.y - points[i - 1].y) / 2,
        };
      } else {
        cp1 = { x: p1.x, y: p1.y };
      }

      if (i < points.length - 2) {
        cp2 = {
          x: p2.x + (p1.x - points[i + 2].x) / 2,
          y: p2.y + (p1.y - points[i + 2].y) / 2,
        };
      } else {
        cp2 = { x: p2.x, y: p2.y };
      }

      // Append Bezier curve command to the path data
      pathData += `C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y} `;
    }

    return pathData.trim(); // Return the path data string
  }
  const drawElements = () => {
    return svgElements.map((element, index) => {
      return (
        <path
          key={index}
          d={pointsToPathData(element.points)}
          stroke={element.color}
          strokeWidth={element.penWidth}
          fill="none"
          opacity={element.opacity}
          strokeLinecap="round"
        />
      );
      return null;
    });
  };

  const undo = () => {
    if (currentIndex > -1) {
      currentIndexRef.current -= 1;
      setCurrentIndex(currentIndexRef.current);
      setActionsLen(actions.current.length);
      restoreCanvas(false); // Restore without replay
    }
  };

  const redo = () => {
    if (currentIndex < actionsLen - 1) {
      currentIndexRef.current += 1;
      setCurrentIndex(currentIndexRef.current);
      setActionsLen(actions.current.length);
      restoreCanvas(false); // Restore without replay
    }
  };

  const resetCanvas = () => {
    actions.current = [];
    setActionsLen(0);
    setCurrentIndex(-1);
    currentIndexRef.current=-1;
    setSvgElements([]);
  };

  const replayDrawing = () => {
    if (isReplaying) {
      setIsReplaying(false);
      return;
    }

    setIsReplaying(true);
    restoreCanvas(true); // Trigger replay mode
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
  }, []);

  return (
    <div
      className="container"
      style={{ userSelect: "none", overflow: "hidden" }}
    >
      {isSettingsVisible && (
        <Settings onClose={toggleSettings} settings={settings} />
      )}
      {settings.showTopNav && (
        <div id="top" style={{ height: "43px", userSelect: "none",zIndex:10000 }}>
          <TopNav/>
        </div>
      )}
      <div
        id="middle"
        style={{ display: "flex", flexGrow: 1, position: "relative" }}
      >
        <div
          id="leftbar"
          style={{
            display: "flex",
            position: "absolute",
            top: "0",
            left: "0",
            height: "100%",

          }}
        >
          <ColorPicker
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            penWidth={penWidth}
            setPenWidth={setPenWidth}
            opacity={opacity}
            setOpacity={setOpacity}
            penType={penType}
            setPenType={setPenType}
          />
        </div>
        <div
          id="right"
          style={{
            flexGrow: 1,
            display: "flex",
            marginLeft: "30px",
            position: "relative",
          }}
        >
          <div
            className="svg-wrapper"
            style={{
              border: "1px solid #ccc",
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              overflow: "hidden",
            }}
          >
            {settings.currentMode == "Video" && <YoutubePlayer item={item} />}
            {settings.showSvgEditor && <SvgEditorWrap />}
            {settings.currentMode == "Track" && <WordTrack item={item} />}
            {settings.showBooks&& <Books/>}
            <svg
              ref={svgRef}
              className="svg"
              onMouseDown={startDrawing}
              onMouseMove={moveDraw}
              onMouseUp={stopDrawing}
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}
              width="100%"
              height="100%"
              style={{
                position: settings.drawEnabled ? "absolute" : "",
                left: 0,
              }}
            >
  
              {settings.Draw.isShowGrid && lines}

              {drawElements()}
            </svg>
            <div className="cursor" ref={cursorRef} style={{ zIndex: 2111 }}>
              <CursorIcon penWidth={penWidth} selectedColor={selectedColor} />
              <div
                className="point"
                style={{
                  width: penWidth,
                  height: penWidth,
                  background: selectedColor,
                }}
              ></div>
            </div>
          </div>
          <ModeSwitchButton
            settings={settings}
            toggleSettings={toggleSettings}
          />
          <UnitList
            isShowUnitList={isShowUnitList}
            setIsShowUnitList={setIsShowUnitList}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>
      </div>
      <div id="bottom">
        <ButtonContainer
          undo={undo}
          redo={redo}
          resetCanvas={resetCanvas}
          replayDrawing={replayDrawing}
          isReplaying={isReplaying}
          actionsLen={actionsLen}
          currentIndex={currentIndex}
        />
      </div>
    </div>
  );
};

export default Draw;
