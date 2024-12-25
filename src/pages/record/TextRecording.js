import React, { useState } from 'react';

const TextRecording = ({ onFinish }) => {
    const words = ['Hello', 'World', 'This', 'Is', 'A', 'Test'];
    const [clicks, setClicks] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [highlightedWords, setHighlightedWords] = useState(new Set());
    const [currentIndex, setCurrentIndex] = useState(0); // To track the expected index

    const handleClick = (word) => {
        // Check if the clicked word matches the expected word
        if (word === words[currentIndex]) {
            const currentTime = Date.now();
            if (startTime === null) {
                setStartTime(currentTime);
            }

            const elapsedTime = currentTime - (startTime || currentTime); // Calculate elapsed time in milliseconds

            setClicks(prevClicks => [
                ...prevClicks,
                { word, time: elapsedTime } // Store elapsed time in milliseconds
            ]);

            // Highlight the clicked word
            setHighlightedWords(prev => new Set(prev).add(word));
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex); // Move to the next word

            // If it's the last word, call the finish callback if it exists
            if (newIndex === words.length && onFinish) {
                onFinish(clicks);
            }
        }
    };

    return (
        <div>
            <h1>Click the Words in Sequence</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {words.map((word, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(word)}
                        style={{
                            backgroundColor: highlightedWords.has(word) ? 'lightgreen' : 'white',
                            border: '1px solid #ccc',
                            padding: '10px',
                            cursor: 'pointer',
                            opacity: currentIndex > index ? 0.5 : 1 // Disable already clicked words
                        }}
                        disabled={currentIndex > index} // Disable clicks on already clicked words
                    >
                        {word}
                    </button>
                ))}
            </div>
            <h2>Recorded Clicks</h2>
            <ul>
                {clicks.map((click, index) => (
                    <li key={index}>
                        {click.word} clicked at {click.time} milliseconds
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TextRecording;
