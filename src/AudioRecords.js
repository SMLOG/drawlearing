import * as React from 'react';
import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useWavesurfer } from '@wavesurfer/react';
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js';

const AudioRecords = React.forwardRef((_, ref) => {
  const containerRef = useRef(null);
  const [audioUrls, setAudioUrls] = useState([
    '/audio/us/a.mp3',
    '/audio/us/b.mp3',
    '/audio/us/c.mp3',
  ]);
  const [urlIndex, setUrlIndex] = useState(0);
  const [loop, setLoop] = useState(false);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const buttonRef = useRef(null);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: audioUrls[urlIndex],
    plugins: useMemo(() => [Timeline.create()], []),
  });

  React.useImperativeHandle(ref, () => ({
    addAudio: (url) => {
      setAudioUrls((prevUrls) => [...prevUrls, url]);
    },
  }));

  const onPlayPause = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  }, [wavesurfer]);

  const toggleLoop = useCallback(() => {
    setLoop((prevLoop) => !prevLoop);
  }, []);

  const selectAudio = useCallback((index) => {
    if (index !== urlIndex && !loading) {
      setLoading(true);
      setUrlIndex(index);
      //wavesurfer.load(audioUrls[index]); // Load the new audio file
      setShowList(false);
    }
  }, [wavesurfer, audioUrls, urlIndex, loading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        listRef.current && !listRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
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

  useEffect(() => {
    if (wavesurfer) {
      const handleLoadError = () => {
        console.error("Error loading audio");
        setLoading(false); // Reset loading state on error
      };

      const handleReady = () => {
        setLoading(false); // Reset loading state when ready
      };

      wavesurfer.on('error', handleLoadError);
      wavesurfer.on('ready', handleReady);

      return () => {
        wavesurfer.un('error', handleLoadError);
        wavesurfer.un('ready', handleReady);
      };
    }
  }, [wavesurfer]);

  const formatTime = (seconds) =>
    [Math.floor(seconds / 60), Math.floor(seconds % 60)]
      .map((v) => `0${v}`.slice(-2))
      .join(':');

  return (
    <>
      <div style={{ position: 'relative' }}>
        <div ref={containerRef} />
        <p>Current audio: {audioUrls[urlIndex]}</p>
        <p>Current time: {formatTime(currentTime)}</p>
        {loading && <p>Loading audio...</p>}
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
              bottom: buttonRef.current ? buttonRef.current.getBoundingClientRect().height + 10 : 0,
              left: buttonRef.current ? buttonRef.current.getBoundingClientRect().left : 0,
            }}
          >
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {audioUrls.map((url, index) => (
                <li key={index} style={{ margin: '0.5em 0' }}>
                  <button onClick={() => selectAudio(index)}>
                    {url.split('/').pop()}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
});

export default AudioRecords;
