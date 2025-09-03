import React from 'react';

const VideoCover = () => {
    return (
        <div style={styles.container}>
            <div style={styles.overlay}>
                <h1 style={styles.title}>
                    <div>Welcome to ALearningApp</div>
                    <div style={styles.subtitle}>《少兒每日筆順學習書寫漢字系列》</div>
                    <div><b style={styles.boldText}>（繁體中文+粵語）</b></div>
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
        background: 'linear-gradient(135deg, #ffcc00, #ff6699)', // Bright gradient background
        color: '#333',
        textAlign: 'center',
        fontFamily: '"Comic Sans MS", cursive, sans-serif',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '25px',
        padding: '30px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    },
    title: {
        fontSize: '56px',
        margin: 0,
        lineHeight: 1.3,
        color: '#ff5722',
    },
    subtitle: {
        fontSize: '40px', // Larger subtitle
        color: '#007bff', // Different color for contrast
    },
    description: {
        fontSize: '28px',
        margin: '10px 0 20px',
        color: '#555',
    },
    boldText: {
        color: '#ff5722',
    },
    playButton: {
        backgroundColor: '#4caf50',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '100px',
        height: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: '40px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.3s, background-color 0.3s',
    },
};

const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'scale(1.1)';
    e.currentTarget.style.backgroundColor = '#388e3c';
};

const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.backgroundColor = '#4caf50';
};

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