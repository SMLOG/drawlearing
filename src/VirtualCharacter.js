import React, { useState, useEffect, useRef } from 'react';

const SVGCharacter = () => {
  const [isTalking, setIsTalking] = useState(false);
  const [isSmiling, setIsSmiling] = useState(false);
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [browPosition, setBrowPosition] = useState(75);
  const [earPosition, setEarPosition] = useState(100);
  const speechInputRef = useRef(null);

  // 修复手和脚的位置（下移50单位）
  const armYPosition = 150; // 原100 + 50
  const bodyYPosition = 200; // 原200 + 50
  const legYPosition = 250; // 原200 + 50

  // 随机眼神移动
  useEffect(() => {
    const randomEyeMovement = () => {
      const moveX = (Math.random() - 0.5) * 3;
      const moveY = (Math.random() - 0.5) * 2;
      
      setEyePosition({ x: moveX, y: moveY });
      setBrowPosition(75 + moveY);
      setEarPosition(100 + moveY);
      
      setTimeout(randomEyeMovement, 2000 + Math.random() * 3000);
    };
    
    const timer = setTimeout(randomEyeMovement, 3000);
    return () => clearTimeout(timer);
  }, []);

  // 眨眼函数
  const blinkEyes = () => {
    // 这里可以通过添加CSS类或状态变化来实现眨眼效果
    const eyes = document.querySelectorAll('.eye-pupil');
    eyes.forEach(eye => {
      eye.style.animation = 'none';
      setTimeout(() => {
        eye.style.animation = '';
      }, 10);
    });
  };

  // 手动眨眼
  const manualBlink = () => {
    const eyes = document.querySelectorAll('.eye-pupil');
    eyes.forEach(eye => {
      eye.style.animation = 'blink 0.4s';
      setTimeout(() => {
        eye.style.animation = 'blink 4s infinite';
      }, 400);
    });
  };

  // 说话函数
  const speak = () => {
    const text = speechInputRef.current?.value || "你好，我是虚拟人物！";
    setIsTalking(true);
    
    // 使用Web Speech API合成语音
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    
    utterance.onend = () => {
      setIsTalking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // 微笑函数
  const smile = () => {
    setIsSmiling(true);
    setTimeout(() => {
      setIsSmiling(false);
    }, 3000);
  };

  // 动作演示函数
  const performAction = () => {
    setIsPerformingAction(true);
    setTimeout(() => {
      setIsPerformingAction(false);
    }, 3000);
  };

  // 眼神移动函数
  const moveEyes = () => {
    const directions = [
      { x: 0, y: 0 },
      { x: 2, y: -1 },
      { x: 2, y: 1 },
      { x: -2, y: -1 },
      { x: -2, y: 1 }
    ];
    
    const direction = directions[Math.floor(Math.random() * directions.length)];
    setEyePosition(direction);
    setBrowPosition(75 + direction.y);
    setEarPosition(100 + direction.y);
  };

  // 支持按回车键说话
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      speak();
    }
  };

  // 动态样式
  const styles = {
    container: {
      fontFamily: "'Arial', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      margin: 0,
      position:'fixed',
      zIndex:999,
    },
    title: {
      color: 'white',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
      marginBottom: '30px'
    },
    characterContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '30px'
    },
    svgContainer: {
      width: '300px',
      height: '400px',
      position: 'relative'
    },
    controls: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '15px',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
      width: '300px',
      textAlign: 'center'
    },
    input: {
      padding: '10px',
      margin: '8px 0',
      borderRadius: '8px',
      border: '1px solid #ddd',
      width: '80%'
    },
    button: {
      padding: '10px',
      margin: '8px 0',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#3498db',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      width: '80%'
    },
    buttonHover: {
      backgroundColor: '#2980b9'
    }
  };

  return (
    <div style={styles.container}>
      
      <div style={styles.characterContainer}>
        <div style={styles.svgContainer}>
          <svg id="character-svg" width="300" height="400" viewBox="0 0 300 400">
            {/* 左耳 */}
            <g id="left-ear" style={{ transform: `translate(0, ${earPosition-100}px)` }}>
              <ellipse cx="95" cy="100" rx="12" ry="15" fill="#ffdbac" />
              <ellipse cx="95" cy="100" rx="6" ry="8" fill="#f9c49a" />
            </g>
            
            {/* 右耳 */}
            <g id="right-ear" style={{ transform: `translate(0, ${earPosition-100}px)` }}>
              <ellipse cx="205" cy="100" rx="12" ry="15" fill="#ffdbac" />
              <ellipse cx="205" cy="100" rx="6" ry="8" fill="#f9c49a" />
            </g>
            
            {/* 头部 */}
            <circle id="head" cx="150" cy="100" r="50" fill="#ffdbac" />
            
            {/* 左臂 - 已下移50单位 */}
            <rect 
              id="left-arm" 
              className={isPerformingAction ? 'wave-left-arm' : ''} 
              x="85" 
              y={armYPosition} 
              width="20" 
              height="70" 
              rx="10" 
              fill="#ffdbac" 
            />
            
            {/* 右臂 - 已下移50单位 */}
            <rect 
              id="right-arm" 
              className={isPerformingAction ? 'wave-right-arm' : ''} 
              x="195" 
              y={armYPosition} 
              width="20" 
              height="70" 
              rx="10" 
              fill="#ffdbac" 
            />
            
            {/* 身体 - 已下移50单位 */}
            <ellipse id="body" cx="150" cy={bodyYPosition} rx="40" ry="60" fill="#3498db" />
            
            {/* 左腿 - 已下移50单位 */}
            <rect 
              id="left-leg" 
              className={isPerformingAction ? 'wave-left-leg' : ''} 
              x="120" 
              y={legYPosition} 
              width="20" 
              height="80" 
              rx="10" 
              fill="#ffdbac" 
            />
            
            {/* 右腿 - 已下移50单位 */}
            <rect 
              id="right-leg" 
              className={isPerformingAction ? 'wave-right-leg' : ''} 
              x="160" 
              y={legYPosition} 
              width="20" 
              height="80" 
              rx="10" 
              fill="#ffdbac" 
            />
            
            {/* 左眼 */}
            <g id="left-eye">
              <ellipse cx="130" cy="85" rx="8" ry="8" fill="white" />
              <ellipse 
                className="eye-pupil blink" 
                cx={130 + eyePosition.x} 
                cy={85 + eyePosition.y} 
                rx="8" 
                ry="8" 
                fill="#2c3e50" 
              />
              <circle 
                cx={131 + eyePosition.x/2} 
                cy={83 + eyePosition.y/2} 
                r="1.5" 
                fill="white" 
                className="subtle-move" 
              />
              <ellipse cx="130" cy="89" rx="3" ry="2" fill="rgba(255,255,255,0.4)" />
            </g>
            
            {/* 右眼 */}
            <g id="right-eye">
              <ellipse cx="170" cy="85" rx="8" ry="8" fill="white" />
              <ellipse 
                className="eye-pupil blink" 
                cx={170 + eyePosition.x} 
                cy={85 + eyePosition.y} 
                rx="8" 
                ry="8" 
                fill="#2c3e50" 
              />
              <circle 
                cx={171 + eyePosition.x/2} 
                cy={83 + eyePosition.y/2} 
                r="1.5" 
                fill="white" 
                className="subtle-move" 
              />
              <ellipse cx="170" cy="89" rx="3" ry="2" fill="rgba(255,255,255,0.4)" />
            </g>
            
            {/* 眉毛 */}
            <path 
              id="left-brow" 
              d={`M120 ${browPosition} Q130 ${browPosition-5} 140 ${browPosition}`} 
              stroke="#8B4513" 
              strokeWidth="3" 
              fill="none" 
            />
            <path 
              id="right-brow" 
              d={`M160 ${browPosition} Q170 ${browPosition-5} 180 ${browPosition}`} 
              stroke="#8B4513" 
              strokeWidth="3" 
              fill="none" 
            />
            
            {/* 鼻子 */}
            <g id="nose">
              <path d="M145,100 Q150,110 155,100" stroke="#d9a679" strokeWidth="2" fill="none" />
              <ellipse cx="150" cy="105" rx="5" ry="3" fill="#f9c49a" />
              <ellipse cx="148" cy="104" rx="1" ry="0.8" fill="rgba(0,0,0,0.2)" />
              <ellipse cx="152" cy="104" rx="1" ry="0.8" fill="rgba(0,0,0,0.2)" />
            </g>
            
            {/* 嘴巴区域 */}
            <g id="mouth-area">
              {/* 嘴巴基础形状 */}
              <path 
                id="mouth" 
                d={isSmiling ? 
                  "M135,118 Q150,125 165,118" : 
                  "M135,115 Q150,120 165,115 Q150,125 135,115"
                } 
                fill="#C93746" 
                className={isTalking ? 'talking-mouth' : ''}
              />
              
              {/* 上唇高光 */}
              <path 
                id="upper-lip" 
                d={isSmiling ? 
                  "M135,118 Q150,120 165,118" : 
                  "M135,115 Q150,117 165,115"
                } 
                stroke="#FF7C8B" 
                strokeWidth="2" 
                fill="none" 
                className="lip-gloss" 
              />
              
              {/* 下唇高光 */}
              <path 
                id="lower-lip" 
                d={isSmiling ? 
                  "M135,118 Q150,123 165,118" : 
                  "M135,115 Q150,123 165,115"
                } 
                stroke="#FF7C8B" 
                strokeWidth="1.5" 
                fill="none" 
                opacity="0.7" 
                className="lip-gloss" 
              />
              
              {/* 嘴巴内部（说话时可见） */}
              <path 
                id="mouth-inner" 
                d="M140,116 Q150,122 160,116" 
                fill="#2D0B0E" 
                opacity={isTalking ? "0.7" : "0"} 
              />
              
              {/* 牙齿 */}
              <g id="teeth" opacity={isTalking ? "1" : "0"} className={isTalking ? 'talking-teeth' : ''}>
                {/* 上排牙齿 */}
                <rect x="138" y="116" width="4" height="2" rx="1" fill="#FFFFF0" />
                <rect x="142" y="116" width="4" height="2" rx="1" fill="#FFFFF0" />
                <rect x="146" y="116" width="4" height="2" rx="1" fill="#FFFFF0" />
                <rect x="150" y="116" width="4" height="2" rx="1" fill="#FFFFF0" />
                <rect x="154" y="116" width="4" height="2" rx="1" fill="#FFFFF0" />
                <rect x="158" y="116" width="4" height="2" rx="1" fill="#FFFFF0" />
                
                {/* 下排牙齿 */}
                <rect x="140" y="123" width="4" height="2" rx="1" fill="#FFFFF0" opacity="0.9" />
                <rect x="144" y="123" width="4" height="2" rx="1" fill="#FFFFF0" opacity="0.9" />
                <rect x="148" y="123" width="4" height="2" rx="1" fill="#FFFFF0" opacity="0.9" />
                <rect x="152" y="123" width="4" height="2" rx="1" fill="#FFFFF0" opacity="0.9" />
                <rect x="156" y="123" width="4" height="2" rx="1" fill="#FFFFF0" opacity="0.9" />
              </g>
              
              {/* 舌头 */}
              <ellipse 
                id="tongue" 
                cx="150" 
                cy="125" 
                rx="8" 
                ry="3" 
                fill="#FF4B63" 
                opacity={isTalking ? "1" : "0"} 
                className={isTalking ? 'talking-tongue' : ''}
              />
            </g>
          </svg>
        </div>
        
        <div style={styles.controls}>
          <input 
            type="text" 
            id="speechInput" 
            placeholder="输入要说的话..." 
            ref={speechInputRef}
            onKeyPress={handleKeyPress}
            style={styles.input}
          />
          <button 
            id="speakBtn" 
            onClick={speak}
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            说话
          </button>
          <button 
            id="actionBtn" 
            onClick={performAction}
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            动作演示
          </button>
          <button 
            id="lookBtn" 
            onClick={moveEyes}
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            眼神移动
          </button>
          <button 
            id="smileBtn" 
            onClick={smile}
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            微笑
          </button>
          <button 
            id="blinkBtn" 
            onClick={manualBlink}
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            眨眼
          </button>
        </div>
      </div>

      <style>
        {`
          /* 眼睛动画关键帧 - 修复版 */
          @keyframes blink {
            0%, 90% { 
              ry: 8; /* 眼睛睁开 */
              opacity: 1;
            }
            92%, 96% { 
              ry: 0.5; /* 眼睛闭上 */
              opacity: 0.8;
            }
            98%, 100% { 
              ry: 8; /* 眼睛睁开 */
              opacity: 1;
            }
          }
          
          @keyframes subtle-move {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(1px, -1px); }
          }
          
          /* 嘴巴动画关键帧 */
          @keyframes talk {
            0% { 
              d: path("M135,115 Q150,120 165,115 Q150,125 135,115");
            }
            25% { 
              d: path("M135,115 Q150,125 165,115 Q150,130 135,115");
            }
            50% { 
              d: path("M135,115 Q150,115 165,115 Q150,120 135,115");
            }
            75% { 
              d: path("M135,115 Q150,122 165,115 Q150,127 135,115");
            }
            100% { 
              d: path("M135,115 Q150,120 165,115 Q150,125 135,115");
            }
          }
          
          @keyframes lip-gloss {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 0.9; }
          }
          
          @keyframes teeth-talk {
            0%, 100% { opacity: 0.9; }
            50% { opacity: 1; }
          }
          
          @keyframes tongue-move {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(1px); }
          }
          
          @keyframes ear-move {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(1px); }
          }
          
          @keyframes waveLeftArm {
            from { transform: rotate(10deg); }
            to { transform: rotate(-20deg); }
          }
          
          @keyframes waveRightArm {
            from { transform: rotate(-10deg); }
            to { transform: rotate(20deg); }
          }
          
          @keyframes waveLeftLeg {
            from { transform: rotate(5deg); }
            to { transform: rotate(-15deg); }
          }
          
          @keyframes waveRightLeg {
            from { transform: rotate(-5deg); }
            to { transform: rotate(15deg); }
          }
          
          .blink {
            animation: blink 4s infinite;
          }
          
          .subtle-move {
            animation: subtle-move 4s infinite ease-in-out;
          }
          
          .talking-mouth {
            animation: talk 0.4s infinite;
          }
          
          .talking-teeth {
            animation: teeth-talk 0.4s infinite;
          }
          
          .talking-tongue {
            animation: tongue-move 0.6s infinite;
          }
          
          .lip-gloss {
            animation: lip-gloss 3s infinite;
          }
          
          .wave-left-arm {
            animation: waveLeftArm 1s infinite alternate;
            transform-origin: 10px 0;
          }
          
          .wave-right-arm {
            animation: waveRightArm 1s infinite alternate;
            transform-origin: 10px 0;
          }
          
          .wave-left-leg {
            animation: waveLeftLeg 1.5s infinite alternate;
            transform-origin: 10px 0;
          }
          
          .wave-right-leg {
            animation: waveRightLeg 1.5s infinite alternate;
            transform-origin: 10px 0;
          }
        `}
      </style>
    </div>
  );
};

export default SVGCharacter;