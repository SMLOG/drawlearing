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
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Lighter overlay
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '15px',
        padding: '20px',
    },
    title: {
        fontSize: '50px', // Slightly smaller
        margin: 0,
        lineHeight: 1.3,
        textShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)', // Softer shadow
    },
    description: {
        fontSize: '24px', // Smaller font size
        margin: '10px 0 20px',
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
    },
    playButton: {
        backgroundColor: '#4caf50', // Softer button color
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '90px',
        height: '90px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: '32px',
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