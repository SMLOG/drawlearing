import React, { useState } from 'react';

const TextRecording = () => {
    const words = ['Hello', 'World', 'This', 'Is', 'A', 'Test'];
    const [clicks, setClicks] = useState([]);
    const [startTime, setStartTime] = useState(null);

    const handleClick = (word) => {
        const currentTime = Date.now();
        if (startTime === null) {
            setStartTime(currentTime);
        }

        const elapsedTime = ((currentTime - (startTime || currentTime)) / 1000).toFixed(2);
        
        setClicks(prevClicks => [
            ...prevClicks,
            { word, time: elapsedTime }
        ]);
    };

    return (
        <div>
            <h1>Click the Words</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {words.map((word, index) => (
                    <button key={index} onClick={() => handleClick(word)}>
                        {word}
                    </button>
                ))}
            </div>
            <h2>Recorded Clicks</h2>
            <ul>
                {clicks.map((click, index) => (
                    <li key={index}>
                        {click.word} clicked at {click.time} seconds
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TextRecording;
