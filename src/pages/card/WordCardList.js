import React, { useEffect, useState } from 'react';
import WordCard from './WordCard';

const WordCardList = () => {
  const [words, setWords] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to control sidebar visibility

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

  // Set default type from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeFromUrl = params.get('type');
    
    if (typeFromUrl) {
      setSelectedType(typeFromUrl);
    }
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

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.sidebar, width: isSidebarOpen ? '200px' : '0px' }} className="no-print">
        <h3 style={{ display: isSidebarOpen ? 'block' : 'none' }}>Select Type</h3>
        {isSidebarOpen && types.map((type) => (
          <button 
            key={type.type} // Use "type" as the unique key
            style={styles.button}
            onClick={() => setSelectedType(type.type)} // Set selectedType to the "type" property
          >
            {type.type} {/* Display the "type" property */}
          </button>
        ))}
      </div>
      <div style={styles.toggleButton} onClick={toggleSidebar} className="no-print">
        {isSidebarOpen ? '→' : '←'} {/* Right arrow when open, left when closed */}
      </div>
      <div style={styles.wordListContainer}>
        {selectedType && <h2 style={styles.title}>{selectedType}</h2>} {/* Title for selected type */}
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
    transition: 'width 0.3s ease',
    overflow: 'hidden',
    borderRight: '1px solid #ccc',
  },
  toggleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    cursor: 'pointer',
    fontSize: '24px',
    marginLeft: '10px',
  },
  wordListContainer: {
    flex: 1,
    paddingLeft: '20px',
  },
  title: {
    textAlign: 'left', // Align text to the left
    marginBottom: '20px',
    fontSize: '24px',
  },
  wordList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Align items to the left
    gap: '16px',
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
