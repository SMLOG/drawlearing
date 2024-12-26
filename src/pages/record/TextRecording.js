import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faCheck } from '@fortawesome/free-solid-svg-icons';

const TextRecording = forwardRef(({ onStart, onFinish, startTime }, ref) => {
    const [inputWords, setInputWords] = useState('Hello World This Is A Test');
    const [words, setWords] = useState(inputWords.split(' '));
    const [clicks, setClicks] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleClick = (word) => {
        if (word === words[currentIndex]) {
            const currentTime = Date.now();
            const elapsedTime = currentTime - (startTime || currentTime);
            setClicks(prevClicks => [...prevClicks, elapsedTime]);
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleInputChange = (e) => {
        const newInput = e.target.value;
        setInputWords(newInput);
        setWords(newInput.split(' '));
        resetState();
    };

    const resetState = () => {
        setClicks([]);
        setCurrentIndex(0);
    };

    const handleReset = () => {
        resetState();
        setInputWords('Hello World This Is A Test');
        setWords(inputWords.split(' '));
    };

    useImperativeHandle(ref, () => ({
        reset: resetState,
    }));

    const handleDone = ()=>{
        if (currentIndex === words.length && onFinish) {
            const finalClickData = [clicks, words];
            onFinish(finalClickData);
        }
    }

    return (
        <div>
            <textarea
                type="text"
                value={inputWords}
                onChange={handleInputChange}
                style={{ marginBottom: '20px', width: '100%',boxSizing:'border-box', padding: '10px' }}
            />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                    onClick={onStart} 
                    style={buttonStyle}
                >
                    <FontAwesomeIcon icon={faPlay} style={iconStyle} /> Start
                </button>
                {words.map((word, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(word)}
                        style={{
                            ...buttonStyle,
                            backgroundColor: currentIndex > index ? 'lightgreen' : 'white',
                            opacity: currentIndex > index ? 0.5 : 1,
                        }}
                        disabled={currentIndex > index}
                    >
                        {word}
                    </button>
                ))}
                <button 
                    onClick={handleDone} 
                    style={buttonStyle}
                >
                    <FontAwesomeIcon icon={faCheck} style={iconStyle} /> Done
                </button>
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
});

// Define styles for buttons and icons
const buttonStyle = {
    border: '1px solid #ccc',
    padding: '10px 15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
};

const iconStyle = {
    marginRight: '5px',
};

export default TextRecording;
