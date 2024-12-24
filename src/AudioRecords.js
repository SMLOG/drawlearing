import * as React from 'react';
import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useWavesurfer } from '@wavesurfer/react';
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js';

const audioUrls = [
  '/audio/us/a.mp3',
  '/audio/us/b.mp3', // Add more audio files as needed
  '/audio/us/c.mp3',
];

const formatTime = (seconds) => 
  [Math.floor(seconds / 60), Math.floor(seconds % 60)]
    .map((v) => `0${v}`.slice(-2))
    .join(':');

const AudioRecords = () => {
  const containerRef = useRef(null);
  const [urlIndex, setUrlIndex] = useState(0);
  const [loop, setLoop] = useState(false);
  const [showList, setShowList] = useState(false);
  const listRef = useRef(null);
  const buttonRef = useRef(null); // Ref for the button

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: audioUrls[urlIndex],
    plugins: useMemo(() => [Timeline.create()], []),
  });

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  const toggleLoop = useCallback(() => {
    setLoop((prevLoop) => !prevLoop);
  }, []);

  const selectAudio = useCallback((index) => {
    setUrlIndex(index);
    wavesurfer.load(audioUrls[index]);
    setShowList(false);
  }, [wavesurfer]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (loop && wavesurfer) {
      const handleFinish = () => {
        wavesurfer.play();
      };

      wavesurfer.on('finish', handleFinish);

      return () => {
        wavesurfer.un('finish', handleFinish);
      };
    }
  }, [loop, wavesurfer]);

  return (
    <>
    <div style={{position:'relative'}}>
      <div ref={containerRef} />
      <p>Current audio: {audioUrls[urlIndex]}</p>
      <p>Current time: {formatTime(currentTime)}</p>
      <div style={{ margin: '1em 0', display: 'flex', gap: '1em' }}>
        <button onClick={onPlayPause} style={{ minWidth: '5em' }}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={toggleLoop} style={{ minWidth: '5em' }}>
          {loop ? 'Disable Loop' : 'Enable Loop'}
        </button>
        <button ref={buttonRef} onClick={() => setShowList((prev) => !prev)}>
          Change audio
        </button>
      </div>
      {showList && (
        <div 
          ref={listRef} 
          style={{ 
            position: 'absolute', 
            background: 'white', 
            border: '1px solid #ccc', 
            padding: '10px', 
            zIndex: 1000,
            bottom: buttonRef.current.getBoundingClientRect().height+10, // Position above the button
            left: buttonRef.current ? buttonRef.current.getBoundingClientRect().left : 0, // Align to the left of the button
          }}
        >
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {audioUrls.map((url, index) => (
              <li key={index} style={{ margin: '0.5em 0' }}>
                <button onClick={() => selectAudio(index)}>
                  {url.split('/').pop()} {/* Display just the file name */}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </>
  );
};

export default AudioRecords;
