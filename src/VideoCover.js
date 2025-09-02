import React from 'react';

const VideoCover = () => {
    return (
<div style={styles.container}>
    <div style={styles.overlay}>
        <h1 style={styles.title}>Welcome to ALearnigApp<br />每日學習書寫漢字</h1>
        <p style={styles.description}>輕鬆掌握漢字，從基礎到進階，每日練習助你提升！</p>
        <button style={styles.playButton}>▶</button>
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
        backgroundImage: 'url(your-fun-background-image-url.jpg)', // Replace with your image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        padding: '20px',
    },
    title: {
        fontSize: '36px',
        margin: 0,
        lineHeight: 1.2,
        textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)', // Shadow for visibility
    },
    description: {
        fontSize: '22px',
        margin: '10px 0 20px',
        textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)',
    },
    playButton: {
        backgroundColor: '#ff5722', // Bright button color
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: '30px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        transition: 'transform 0.3s',
    },
};

// Add hover effect with JavaScript
const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'scale(1.1)';
    e.currentTarget.style.backgroundColor = '#e64a19'; // Darker on hover
};

const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.backgroundColor = '#ff5722'; // Reset color
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