import React from 'react';

const VideoEndScreen = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Thank You for Watching!</h1>
            <p style={styles.description}>We hope you enjoyed the video.</p>
            <p style={styles.subscribe}>Don't forget to subscribe for more content!</p>
        </div>
    );
};

const styles = {
    container: {
        padding: '30px',
        borderRadius: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Slightly transparent background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontSize: '48px', // Larger font size
        margin: '20px 0',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Shadow for depth
    },
    description: {
        fontSize: '28px', // Larger font size
        margin: '10px 0 30px',
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)', // Shadow for depth
    },
    subscribe: {
        fontSize: '24px', // Larger font size
        margin: '20px 0',
        color: '#282c34', // Dark text color for contrast
        backgroundColor: '#ffcc00', // Highlight background color
        padding: '15px 25px', // Padding around the text
        borderRadius: '5px', // Rounded corners
        display: 'inline-block', // To fit the background
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Shadow for depth
        transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition
    },
};

// Add hover effect with JavaScript
const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'scale(1.05)'; // Slightly enlarge on hover
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
        Don't forget to subscribe for more content!
    </p>
);

export default VideoEndScreen;