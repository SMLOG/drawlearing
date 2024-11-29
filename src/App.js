import React, { useEffect } from 'react';
import { Routes, Route,Navigate    } from 'react-router-dom';
import DrawSVG from './DrawSVG';
import './App.css';
import PrintOut from "./PrintOut";
import WorkTrack2 from "./WorkTrack2";
import WordCardList from "./pages/card/WordCardList";

const App = () => {
  /*const preventScroll = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    // Add touch event listeners
    document.body.addEventListener('touchmove', preventScroll, { passive: false });

    // Cleanup function to remove event listeners
    return () => {
      document.body.removeEventListener('touchmove', preventScroll);
    };
  }, []);*/

  return ( 
    <div className="App">
      <Routes>
        <Route path="/draw" element={<DrawSVG />} />
        <Route path="/p" element={<PrintOut />} />
        <Route path="/s" element={<WorkTrack2 />} />
        <Route path="/" element={<WordCardList />} />
        <Route path="/"  element={<Navigate to="/cards" />} />
        <Route path="/cards/:type?" element={<WordCardList />}  />

        <Route path="*" element={<Navigate to="/cards" />} />
      </Routes>
    </div>
  );
};

export default App;