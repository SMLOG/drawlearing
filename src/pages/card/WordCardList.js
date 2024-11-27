import React from 'react';
import WordCard from './WordCard';

const WordCardList = () => {
  const words = [
    {
      word: "Apple",
      imageUrl: "/svg/apple.svg",
      audioUrl: "/audio/apple.mp3"
    },
    {
      word: "Banana",
      imageUrl: "/svg/banana.svg",
      audioUrl: "/audio/banana.mp3"
    },
    {
      word: "Cherry",
      imageUrl: "/svg/cherry.svg",
      audioUrl: "/audio/cherry.mp3"
    },
    // Add more word objects as needed
  ];

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
