import * as React from 'react';
import { useMemo, useState, useCallback, useRef } from 'react';
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

  const onUrlChange = useCallback(() => {
    setUrlIndex((index) => (index + 1) % audioUrls.length);
    if (wavesurfer) {
      wavesurfer.load(audioUrls[(urlIndex + 1) % audioUrls.length]);
      if (loop) {
        wavesurfer.on('finish', () => {
          wavesurfer.play(); // Automatically play when finished if looping
        });
      }
    }
  }, [wavesurfer, urlIndex, loop]);

  // Effect to handle looping behavior
  React.useEffect(() => {
    if (loop && wavesurfer) {
      // Handle looping by listening to the finish event
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
        <button onClick={onUrlChange}>Change audio</button>
      </div>
    </>
  );
};

export default AudioRecords;
