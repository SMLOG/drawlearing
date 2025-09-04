import React from 'react';
import BubbleCanvas from '../components/effect/BubbleCanvas';

const VideoEndScreen = () => {
    return (
        <div style={styles.container}>
            <div className='absolute insert-0' style={{zIndex:-1}}><BubbleCanvas/></div>
            <h1 style={styles.title}>🎉 Thank You for Watching! 🎉</h1>
            <p style={styles.description}>We hope you had a blast! 🌟</p>
            <SubscribeButton />
            
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: '#333', // Dark text color
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)', // Light shadow for depth
    },
    title: {
        fontSize: '60px', // Increased font size
        margin: '20px 0',
        color: '#ff6f00', // Bright orange color
        textShadow: '2px 2px 5px rgba(255, 255, 255, 0.7)', // Soft white shadow
    },
    description: {
        fontSize: '32px', // Increased font size
        margin: '10px 0 30px',
        color: '#3f51b5', // Bright blue
        textShadow: '1px 1px 4px rgba(255, 255, 255, 0.5)', // Soft white shadow
    },
    subscribe: {
        fontSize: '28px', // Increased font size
        margin: '20px 0',
        color: '#282c34', // Dark text color for contrast
        backgroundColor: '#ffcc00', // Highlight background color
        padding: '20px 30px', // Padding around the text
        borderRadius: '8px', // Rounded corners
        display: 'inline-block', // To fit the background
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Shadow for depth
        transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition
        cursor: 'pointer', // Pointer cursor
    },
};

// Add hover effect with JavaScript
const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'scale(1.1)'; // Slightly enlarge on hover
    e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.5)'; // Deeper shadow on hover
};

const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)'; // Reset scale
    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)'; // Reset shadow
};

const SubscribeButton = () => (
    <p
        style={styles.subscribe}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        🌈 Don't forget to subscribe for more fun! 🎈
    </p>
);

export default VideoEndScreen;