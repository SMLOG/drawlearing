import React, { useEffect, useState } from 'react';
import WordCard from './WordCard';

const WordCardList = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('/api/types/Fruits.json');
        const data = await response.json();
        // Assuming data is an array of objects with properties w and icon
        const formattedWords = data.map(item => ({
          word: item.w, // Maps to word
          imageUrl: item.icon, // Maps to imageUrl
          audioUrl: `/audio/${item.w.toLowerCase()}.mp3` // Assuming audio file naming convention
        }));
        setWords(formattedWords);
      } catch (error) {
        console.error('Error fetching words:', error);
      }
    };

    fetchWords();
  }, []);

  return (
    <div style={styles.container}>
      {words.map((item, index) => (
        <WordCard 
          key={index} 
          index={index + 1} // Pass the index (1-based)
          word={item.word} 
          imageUrl={item.imageUrl} 
          audioUrl={item.audioUrl} 
        />
      ))}
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '16px',
    padding: '20px',
  },
};

export default WordCardList;
