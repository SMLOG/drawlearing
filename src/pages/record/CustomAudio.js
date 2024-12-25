import React, { useRef, useState, useEffect } from 'react';

const CustomAudio = ({ src }) => {
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [loop, setLoop] = useState(false);

    useEffect(() => {
        audioRef.current.volume = volume;
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.loop = loop;

        const handleEnded = () => {
            setIsPlaying(false);
        };

        audioRef.current.addEventListener('ended', handleEnded);

        return () => {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current.removeEventListener('ended', handleEnded);
        };
    }, [volume, playbackRate, loop]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        isPlaying ? audioRef.current.pause() : audioRef.current.play();
    };

    const handleVolumeChange = (e) => {
        setVolume(e.target.value);
    };

    const handlePlaybackRateChange = (e) => {
        setPlaybackRate(e.target.value);
    };

    const toggleLoop = () => {
        setLoop(!loop);
    };

    return (
        <div>
            <div>
            <audio ref={audioRef} controls src={src}>
                Your browser does not support the audio tag.
            </audio>
            </div>
            <div>
            <button onClick={togglePlay}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
            <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
            />
            <label>Volume: {volume}</label>
            <input
                type="number"
                min="0.5"
                max="2"
                step="0.1"
                value={playbackRate}
                onChange={handlePlaybackRateChange}
            />
            <label>Playback Rate: {playbackRate}</label>
            <button onClick={toggleLoop}>
                {loop ? 'Disable Loop' : 'Enable Loop'}
            </button>
            </div>
        </div>
    );
};

export default CustomAudio;
