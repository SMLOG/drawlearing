import React from 'react';

const LearningAppTVPlayer = () => {
  const apkLink = '/data/alearningapp-v1.0.apk'; // Updated to the correct relative URL

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>A Learning App</h1>
      <p style={styles.description}>
        Unlock a world of knowledge with our Learning App TV Player! 
        This innovative platform puts the power of learning at your fingertips. 
        Whether you're looking to explore new subjects, enhance your skills, or dive into interactive quizzes, our app gives you all the choices once you provide the source material. 
        Join us to transform your educational experience and take control of your learning journey.
      </p>
      <a 
        href={apkLink} 
        download 
        style={styles.downloadButton}
      >
        Download Now
      </a>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2em',
    marginBottom: '10px',
  },
  description: {
    fontSize: '1.2em',
    marginBottom: '20px',
  },
  downloadButton: {
    display: 'inline-block',
    padding: '10px 20px',
    fontSize: '1em',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
  },
};

export default LearningAppTVPlayer;
