import React, { useEffect } from 'react';
import { Routes, Route,Navigate    } from 'react-router-dom';
import DrawSVG from './DrawSVG';
import './App.css';
import PrintOut from "./PrintOut";
import WorkTrack2 from "./WorkTrack2";
import WordCardList from "./pages/card/WordCardList";
import PrintSheet from './pages/print/PrintSheet';
import Books from './Books';
import Records from './pages/record';
import Layout from './Layout';
import { SettingsProvider } from './SettingsContext';
const App = () => {


  return ( 
    <SettingsProvider>
    <div className="App">
      <Routes>
      <Route path="/" element={<Layout />} >
        <Route path="draw" element={<DrawSVG />} />
        <Route path="p" element={<PrintOut />} />
        <Route path="stroke/:sentence" element={<WorkTrack2 />} />
        <Route path="/" element={<WordCardList />} />
        <Route path="printSheet" element={<PrintSheet />} />
        <Route path="books" element={<Navigate to="/books/1" />} />
         <Route path="books/:pageNo" element={<Books />} />
        <Route path="records" element={<Records />} />
        
        <Route path="./"  element={<Navigate to="/cards" />} />
        <Route path="cards/:type?" element={<WordCardList />}  />
        
        <Route path="*" element={<Navigate to="/cards" />} />
        </Route>
      </Routes>
    </div>
    </SettingsProvider>
  );
};

export default App;