import React, { useEffect, useRef } from 'react';
import './VirtualCharacter.css'; // Import the CSS file
const VirtualCharacter = () => {
    const leftEyeRef = useRef(null);
    const rightEyeRef = useRef(null);
    const leftEarRef = useRef(null);
    const rightEarRef = useRef(null);
    const leftPupilRef = useRef(null);
    const rightPupilRef = useRef(null);
    const leftHighlightRef = useRef(null);
    const rightHighlightRef = useRef(null);
    const mouthRef = useRef(null);
    const teethRef = useRef(null);
    const tongueRef = useRef(null);
    const upperLipRef = useRef(null);
    const lowerLipRef = useRef(null);
    const leftBrowRef = useRef(null);
    const rightBrowRef = useRef(null);

    useEffect(() => {
        const randomEyeMovement = () => {
            const moveX = (Math.random() - 0.5) * 3;
            const moveY = (Math.random() - 0.5) * 2;

            leftPupilRef.current.setAttribute('cx', 130 + moveX);
            leftPupilRef.current.setAttribute('cy', 85 + moveY);
            rightPupilRef.current.setAttribute('cx', 170 + moveX);
            rightPupilRef.current.setAttribute('cy', 85 + moveY);

            leftHighlightRef.current.setAttribute('cx', 131 + moveX / 2);
            leftHighlightRef.current.setAttribute('cy', 83 + moveY / 2);
            rightHighlightRef.current.setAttribute('cx', 171 + moveX / 2);
            rightHighlightRef.current.setAttribute('cy', 83 + moveY / 2);

            const browY = 75 + (Math.random() - 0.5) * 2;
            leftBrowRef.current.setAttribute('d', `M120 ${browY} Q130 ${browY - 5} 140 ${browY}`);
            rightBrowRef.current.setAttribute('d', `M160 ${browY} Q170 ${browY - 5} 180 ${browY}`);

            const earY = 100 + (Math.random() - 0.5);
            leftEarRef.current.setAttribute('transform', `translate(0, ${earY - 100})`);
            rightEarRef.current.setAttribute('transform', `translate(0, ${earY - 100})`);

            setTimeout(randomEyeMovement, 2000 + Math.random() * 3000);
        };

        setTimeout(randomEyeMovement, 3000);
    }, []);

    const speak = (text) => {
        mouthRef.current.classList.add('talking-mouth');
        teethRef.current.setAttribute('opacity', '1');
        tongueRef.current.setAttribute('opacity', '1');
        upperLipRef.current.setAttribute('d', 'M135,115 Q150,120 165,115');
        lowerLipRef.current.setAttribute('d', 'M135,115 Q150,123 165,115');

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';

        utterance.onend = () => {
            mouthRef.current.classList.remove('talking-mouth');
            teethRef.current.setAttribute('opacity', '0');
            tongueRef.current.setAttribute('opacity', '0');
        };

        window.speechSynthesis.speak(utterance);
    };

    const manualBlink = () => {
        leftEyeRef.current.classList.add('blink');
        rightEyeRef.current.classList.add('blink');
        setTimeout(() => {
            leftEyeRef.current.classList.remove('blink');
            rightEyeRef.current.classList.remove('blink');
        }, 2000);
    };

    const smile = () => {
        mouthRef.current.setAttribute('d', 'M135,118 Q150,125 165,118');
        setTimeout(() => {
            mouthRef.current.setAttribute('d', 'M135,115 Q150,120 165,115 Q150,125 135,115');
        }, 3000);
    };

    return (
        <div style={styles.container}>
            <div style={styles.characterContainer}>
                <svg id="character-svg" width="300" height="400" viewBox="0 0 300 400">
                    <g ref={leftEarRef} className="ear-move">
                        <ellipse cx="95" cy="100" rx="12" ry="15" fill="#ffdbac" />
                        <ellipse cx="95" cy="100" rx="6" ry="8" fill="#f9c49a" />
                    </g>
                    <g ref={rightEarRef} className="ear-move">
                        <ellipse cx="205" cy="100" rx="12" ry="15" fill="#ffdbac" />
                        <ellipse cx="205" cy="100" rx="6" ry="8" fill="#f9c49a" />
                    </g>
                    <circle id="head" cx="150" cy="100" r="50" fill="#ffdbac" />
                    <rect id="left-arm" className="limb" x="75" y="160" width="20" height="70" rx="10" fill="#ffdbac" />
                    <rect id="right-arm" className="limb" x="205" y="160" width="20" height="70" rx="10" fill="#ffdbac" />
                    <ellipse id="body" cx="150" cy="200" rx="50" ry="60" fill="#3498db" />
                    <rect id="left-leg" className="limb" x="120" y="250" width="20" height="80" rx="10" fill="#ffdbac" />
                    <rect id="right-leg" className="limb" x="160" y="250" width="20" height="80" rx="10" fill="#ffdbac" />
                    <g ref={leftEyeRef} className="blink">
                        <ellipse cx="130" cy="85" rx="8" ry="8" fill="white" />
                        <circle ref={leftPupilRef} cx="130" cy="85" r="5" fill="#2c3e50" />
                        <circle ref={leftHighlightRef} cx="131" cy="83" r="1.5" fill="white" className="subtle-move" />
                        <ellipse cx="130" cy="89" rx="3" ry="2" fill="rgba(255,255,255,0.4)" />
                    </g>
                    <g ref={rightEyeRef} className="blink" onClick={manualBlink}>
                        <ellipse cx="170" cy="85" rx="8" ry="8" fill="white" />
                        <circle ref={rightPupilRef} cx="170" cy="85" r="5" fill="#2c3e50" />
                        <circle ref={rightHighlightRef} cx="171" cy="83" r="1.5" fill="white" className="subtle-move" />
                        <ellipse cx="170" cy="89" rx="3" ry="2" fill="rgba(255,255,255,0.4)" />
                    </g>
                    <path ref={leftBrowRef} d="M120 75 Q130 70 140 75" stroke="#8B4513" strokeWidth="3" fill="none" />
                    <path ref={rightBrowRef} d="M160 75 Q170 70 180 75" stroke="#8B4513" strokeWidth="3" fill="none" />
                    <g id="nose">
                        <path d="M145,100 Q150,110 155,100" stroke="#d9a679" strokeWidth="2" fill="none" />
                        <ellipse cx="150" cy="105" rx="5" ry="3" fill="#f9c49a" />
                        <ellipse cx="148" cy="104" rx="1" ry="0.8" fill="rgba(0,0,0,0.2)" />
                        <ellipse cx="152" cy="104" rx="1" ry="0.8" fill="rgba(0,0,0,0.2)" />
                    </g>
                    <g id="mouth-area" onClick={() => speak("你好！我是你的虚拟助手。很高兴见到你！")} onDoubleClick={smile}>
                        <path ref={mouthRef} id="mouth" d="M135,115 Q150,120 165,115 Q150,125 135,115" fill="#C93746" />
                        <path ref={upperLipRef} id="upper-lip" d="M135,115 Q150,117 165,115" stroke="#FF7C8B" strokeWidth="2" fill="none" />
                        <path ref={lowerLipRef} id="lower-lip" d="M135,115 Q150,123 165,115" stroke="#FF7C8B" strokeWidth="1.5" fill="none" opacity="0.7" />
                        <g ref={teethRef} id="teeth" opacity="0">
                            <rect x="138" y="116" width="4" height="2" rx="1" fill="#FFFFF0" />
                            <rect x="142" y="116" width="4" height="2" rx="1" fill="#FFFFF0" />
                            <rect x="146" y="116" width="4" height="2" rx="1" fill="#FFFFF0" />
                            <rect x="150" y="116" width="4" height="2" rx="1" fill="#FFFFF0" />
                            <rect x="154" y="116" width="4" height="2" rx="1" fill="#FFFFF0" />
                            <rect x="158" y="116" width="4" height="2" rx="1" fill="#FFFFF0" />
                        </g>
                        <ellipse ref={tongueRef} id="tongue" cx="150" cy="125" rx="8" ry="3" fill="#FF4B63" opacity="0" />
                    </g>
                </svg>
            </div>
            <div className="controls">
                <input type="text" id="speechInput" placeholder="输入要说的话..." />
                <button onClick={() => speak(document.getElementById('speechInput').value || "你好，我是虚拟人物！")}>说话</button>
                <button onClick={() => { /* Perform action */ }}>动作演示</button>
                <button onClick={() => { /* Move eyes */ }}>眼神移动</button>
                <button onClick={smile}>微笑</button>
                <button onClick={manualBlink}>眨眼</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        margin: 0,
        padding: '20px',
        fontFamily: "'Arial', sans-serif",
        position:'fixed',
        top:0,
        zIndex: 999
    },
    characterContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
};

export default VirtualCharacter;