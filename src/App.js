import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DrawSVG from './DrawSVG';
import './App.css';
import SvgEditorWrap from "./SvgEditorWrap";
import PrintOut from "./PrintOut";
import WorkTrack2 from "./WorkTrack2";

const App = () => {
  const preventScroll = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    // Add touch event listeners
    document.body.addEventListener('touchmove', preventScroll, { passive: false });

    // Cleanup function to remove event listeners
    return () => {
      document.body.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  return ( 
    <div className="App">
      <Routes>
        <Route path="/" element={<DrawSVG />} />
        <Route path="/e" element={<SvgEditorWrap />} />
        <Route path="/p" element={<PrintOut />} />
        <Route path="/s" element={<WorkTrack2 />} />
        <Route path="*" element={<DrawSVG />} />
      </Routes>
    </div>
  );
};

export default App;