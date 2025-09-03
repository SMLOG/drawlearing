import React from 'react';

const VideoCover = () => {
    return (
        <div style={styles.container}>
            <div style={styles.overlay}>
                <h1 style={styles.title}>
                    <div>Welcome to ALearningApp</div>
                    <div>《少兒每日筆順學習書寫漢字系列》</div>
                    <div><b>（繁體中文+粵語）</b></div>
                </h1>
                <p style={styles.description}>
                    <i className="fas fa-pencil-alt"></i>
                    輕鬆掌握漢字書寫，從簡單基礎到高級進階，日日進步！
                </p>
                <PlayButton />
            </div>
        </div>
    );
};

const styles = {
    container: {
        margin: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#333', // Softer text color
        textAlign: 'center',
        fontFamily: '"Comic Sans MS", cursive, sans-serif', // Fun font
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Lighter overlay
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // Shadow for depth
    },
    title: {
        fontSize: '48px', // Slightly smaller
        margin: 0,
        lineHeight: 1.3,
        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.4)', // Softer shadow
        color: '#FF5722', // Bright title color
    },
    description: {
        fontSize: '20px', // Smaller font size
        margin: '10px 0 20px',
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
    },
    playButton: {
        backgroundColor: '#4caf50', // Softer button color
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: '36px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.3s, background-color 0.3s',
    },
};

// Add hover effect with JavaScript
const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'scale(1.1)';
    e.currentTarget.style.backgroundColor = '#388e3c'; // Darker on hover
};

const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.backgroundColor = '#4caf50'; // Reset color
};

// Attach event handlers to the button
const PlayButton = () => (
    <button
        style={styles.playButton}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        ▶
    </button>
);

export default VideoCover;