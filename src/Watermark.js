import React, { useEffect, useState } from 'react';

const Watermark = ({ text = '' }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      //setShow(!show);
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
    opacity: 1,
    animation: show ? 'rotateScale 20s linear infinite' : 'none', // Apply rotation and scale animation
  };

  return (
    <>
      {show && (
        <div style={watermarkStyle}>
          {text}
          <style>
            {`
              @keyframes rotateScale {
                0% {
                  transform: translate(-50%, -50%) rotate(0deg) scale(1.5);
                }
                25% {
                  transform: translate(-50%, -50%) rotate(45deg) scale(1);
                }
              50% {
                  transform: translate(-50%, -50%) rotate(0deg) scale(1.5);
                }
             75% {
                  transform: translate(-50%, -50%) rotate(-45deg) scale(1);
                }
                100% {
                  transform: translate(-50%, -50%) rotate(0deg) scale(1.5);
                }
              }
            `}
          </style>
        </div>
      )}
    </>
  );
};

export default Watermark;