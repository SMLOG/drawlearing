import React, { useEffect, useState } from 'react';
import WordCard from './WordCard';

const WordCardList = () => {
  const [words, setWords] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  // Fetch types from types.json
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('/api/types.json');
        const data = await response.json();
        setTypes(data); // Assuming data is an array of objects with a "type" property
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };

    fetchTypes();
  }, []);

  // Fetch words based on the selected type
  useEffect(() => {
    const fetchWords = async () => {
      if (!selectedType) return;

      try {
        const response = await fetch(`/api/types/${selectedType}.json`);
        const data = await response.json();
        const formattedWords = data.map(item => ({
          word: item.w,
          imageUrl: item.icon,
          audioUrl: `/audio/${item.w.toLowerCase()}.mp3`
        }));
        setWords(formattedWords);
      } catch (error) {
        console.error('Error fetching words:', error);
      }
    };

    fetchWords();
  }, [selectedType]);

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h3>Select Type</h3>
        {types.map((type) => (
          <button 
            key={type.type} // Use "type" as the unique key
            style={styles.button}
            onClick={() => setSelectedType(type.type)} // Set selectedType to the "type" property
          >
            {type.type} {/* Display the "type" property */}
          </button>
        ))}
      </div>
      <div style={styles.wordList}>
        {words.map((item, index) => (
          <WordCard 
            key={index} 
            index={index + 1} 
            word={item.word} 
            imageUrl={item.imageUrl} 
            audioUrl={item.audioUrl} 
          />
        ))}
      </div>
      <style>
        {`
          @media print {
            .no-print {
              display: none !important; /* Hides the element when printing */
            }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    padding: '20px',
  },
  sidebar: {
    width: '200px',
    paddingRight: '20px',
    borderRight: '1px solid #ccc',
  },
  wordList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '16px',
    flex: 1,
  },
  button: {
    display: 'block',
    margin: '8px 0',
    padding: '10px',
    background: '#f0f0f0',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
  },
};

export default WordCardList;
