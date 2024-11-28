import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Import QRCodeSVG
import WordCard from './WordCard';

const WordCardList = () => {
  const [words, setWords] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility

  // Fetch types from types.json
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('/api/types.json');
        const data = await response.json();
        setTypes(data);
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
      <div style={{ ...styles.sidebar, left: isSidebarOpen ? '0' : '-200px' }} className="no-print">
        <h3 style={{ display: isSidebarOpen ? 'block' : 'none' }}>Select Type</h3>
        {isSidebarOpen && types.map((type) => (
          <button 
            key={type.type} 
            style={styles.button}
            onClick={() => setSelectedType(type.type)}
          >
            {type.type}
          </button>
        ))}
      </div>
      <div style={styles.menuIcon} onClick={toggleSidebar} className="no-print">
        {/* Menu icon (hamburger icon) */}
        <div style={styles.iconLine}></div>
        <div style={styles.iconLine}></div>
        <div style={styles.iconLine}></div>
      </div>
      <div style={styles.wordListContainer}>
        <div style={styles.titleContainer}>
          {selectedType && (
            <>
              <QRCodeSVG 
                value={window.location.href} // Generate QR code for current URL
                size={50} // Set QR code size to 50x50 pixels
                style={styles.qrCode} // Optional styling
              />
              <h2 style={styles.title}>{selectedType}</h2>
            </>
          )}
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
      </div>
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
          }
          .sticky {
            position: sticky;
            top: 0;
            background: white; /* Background color to cover content behind */
            z-index: 10; /* Ensure it is above other content */
            padding: 10px 0; /* Optional padding */
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
    position: 'relative', // To position the menu icon absolutely
  },
  sidebar: {
    transition: 'width 0.3s ease',
    overflow: 'hidden',
    borderRight: '1px solid #ccc',
    background:'white',
    top:0,
    bottom:0,
    position:'fixed',
    zIndex:999,
    width:'200px'
  },
  menuIcon: {
    position: 'fixed', // Change to fixed position
    top: '20px',
    right: '20px',
    cursor: 'pointer',
    zIndex: 10000, // Set z-index to 10000
  },
  iconLine: {
    width: '30px',
    height: '4px',
    backgroundColor: '#000',
    margin: '4px 0',
  },
  wordListContainer: {
    flex: 1,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: 'white',
    padding: '0',
    borderBottom:'2px solid'
  },
  title: {
    textAlign: 'left',
    fontSize: '24px',
    marginLeft: '10px', // Space between QR code and title
  },
  qrCode: {
    // Additional styles can be added here if needed
  },
  wordList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
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
