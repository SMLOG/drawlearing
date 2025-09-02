import React, { useEffect, useState } from 'react';

const Watermark = ({ text = '' }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShow(!show);
    }, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [show]);

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
    opacity: 0.6,
  };

  return <> {show&&<div style={watermarkStyle}>{`${text}`}</div>}</>;
};

export default Watermark;