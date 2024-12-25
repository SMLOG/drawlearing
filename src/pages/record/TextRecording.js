import React, { useEffect, useState } from 'react';

const TextRecording = ({ onFinish }) => {
    const [inputWords, setInputWords] = useState('Hello World This Is A Test');
    const [words, setWords] = useState(inputWords.split(' '));
    const [clicks, setClicks] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleClick = (word) => {
        if (word === words[currentIndex]) {
            const currentTime = Date.now();
            if (startTime === null) {
                setStartTime(currentTime);
            }

            const elapsedTime = currentTime - (startTime || currentTime);
            setClicks(prevClicks => [
                ...prevClicks,
                elapsedTime // Store elapsed time
            ]);

            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);


        }
    };

    useEffect(()=>{
        if (currentIndex === words.length && onFinish) {
            const finalClickData = [clicks, words]; // Format as [[time1, time2, ...], words]
            onFinish(finalClickData);
        }
    },[currentIndex]);

    const handleInputChange = (e) => {
        const newInput = e.target.value;
        setInputWords(newInput);
        setWords(newInput.split(' '));
        resetState(); // Reset state when words change
    };

    const resetState = () => {
        setClicks([]);
        setCurrentIndex(0);
        setStartTime(null);
    };

    const handleReset = () => {
        resetState();
        setInputWords('Hello World This Is A Test'); // Optional: Reset input to default
        setWords(inputWords.split(' ')); // Update words based on default input
    };

    return (
        <div>
            <h1>Click the Words in Sequence</h1>
            <input
                type="text"
                value={inputWords}
                onChange={handleInputChange}
                style={{ marginBottom: '20px', width: '100%', padding: '10px' }}
            />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {words.map((word, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(word)}
                        style={{
                            backgroundColor: currentIndex > index ? 'lightgreen' : 'white',
                            border: '1px solid #ccc',
                            padding: '10px',
                            cursor: 'pointer',
                            opacity: currentIndex > index ? 0.5 : 1
                        }}
                        disabled={currentIndex > index}
                    >
                        {word}
                    </button>
                ))}
            </div>
            <button onClick={handleReset} style={{ marginTop: '20px', padding: '10px 20px' }}>
                Reset
            </button>
            <h2>Recorded Clicks</h2>
            <ul>
                {clicks.map((click, index) => (
                    <li key={index}>
                        Clicked at {click} milliseconds
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TextRecording;
