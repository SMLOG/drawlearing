import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import './card.css';

const WordCard = ({ index, word, imageUrl, audioUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="item" style={{ ...styles.card, position: 'relative' }}>
      <span style={styles.index}>{index}</span>
      <img 
        src={imageUrl} 
        alt={word} 
        style={styles.image} 
        onClick={playAudio} 
      />
      <h2 style={styles.text}>{word}</h2>
      <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} />
      <div style={styles.iconContainer} onClick={playAudio} className="no-print"> {/* Add no-print class here */}
        <FontAwesomeIcon 
          icon={isPlaying ? faVolumeUp : faVolumeMute} 
          style={styles.icon} 
        />
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    boxSizing:'border-box',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#f9f9f9',
    transition: 'box-shadow 0.3s',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  
  index: {
    fontSize: '16px',
    fontWeight: 'bold',
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    padding: '2px 4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  image: {
    width: '100%',
    height: 'auto',
    maxHeight: '50%',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  text: {
    marginTop: '8px',
    fontSize: '24px',
    color: '#333',
  },
  iconContainer: {
    marginTop: '10px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: '#e0e0e0',
    borderRadius: '50%',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  icon: {
    color: '#007BFF',
    fontSize: '24px',
  },
};

export default WordCard;
