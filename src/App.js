import React, { useEffect } from 'react';

import Draw from './DrawSVG';
import './App.css';

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
      <Draw />
    </div>
  );
};

export default App;