import React from 'react';

const Watermark = ({ text = 'AlearningApp.com' }) => {
  const watermarkStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: '36px',
    color: 'transparent',
    background: 'linear-gradient(45deg, rgba(200, 200, 200, 0.1), rgba(100, 100, 100, 0.1))',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    pointerEvents: 'none',
    zIndex: 1000,
    whiteSpace: 'nowrap',
    opacity: 0.5,
  };

  return <div style={watermarkStyle}>{text}</div>;
};

export default Watermark;