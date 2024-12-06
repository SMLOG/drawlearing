import React, { useEffect, useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react"; // Import QRCodeSVG
import WordCard from "./WordCard";
import { Link, useParams, useNavigate } from "react-router-dom";

const WordCardList = () => {
  const { type } = useParams(); // Access the route parameter
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(type);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility
  const sidebarRef = useRef(null); // Ref for the sidebar
  const menuIconRef = useRef(null); // Ref for the menu icon

  // Fetch types from types.json
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("/api/types.json");
        const data = await response.json();
        setTypes(data.sort((a, b) => a.type.localeCompare(b.type)));
        if (!selectedType) {
          setSelectedType(data[0].type);
        }
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    fetchTypes();
  }, []);

  // Set default type from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeFromUrl = params.get("type");

    if (typeFromUrl) {
      setSelectedType(typeFromUrl);
    }
  }, []);

  useEffect(() => {
    navigate(`/cards/${selectedType}`, { replace: true });
  }, [selectedType]);
  // Fetch words based on the selected type
  useEffect(() => {
    const fetchWords = async () => {
      if (!selectedType) return;

      try {
        const response = await fetch(`/api/types/${selectedType}.json`);
        const data = await response.json();
        const formattedWords = data.map((item) => ({
          word: item.w,
          imageUrl: item.icon ? "/" + item.icon : "/square-dashed.svg",
          audioUrl: `/audio/us/${item.w.toLowerCase()}.mp3`,
        }));
        setWords(formattedWords.sort((a, b) => a.word.localeCompare(b.word)));
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    fetchWords();
  }, [selectedType]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Close sidebar when clicking outside
  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      menuIconRef.current &&
      !menuIconRef.current.contains(event.target) &&
      isSidebarOpen
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const [itemsPerRow, setItemsPerRow] = useState(4);
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = window.innerWidth;
      let newItemsPerRow = 2; // Default

      if (containerWidth >= 600 && containerWidth < 900) {
        newItemsPerRow = 4; // 4 items per row
      } else if (containerWidth >= 900 && containerWidth < 1200) {
        newItemsPerRow = 6; // 6 items per row
      } else if (containerWidth >= 1200) {
        newItemsPerRow = 8; // 8 items per row
      }

      setItemsPerRow(newItemsPerRow);
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const printToSheet = () => {
    localStorage.setItem("printData", JSON.stringify(words));
    window.open("/#printSheet/", "_blank");
  };
  return (
    <>
      <div style={styles.container}>
        <div
          ref={sidebarRef}
          style={{
            ...styles.sidebar,
            transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          }}
          className="no-print"
        >
          <div>
            <h3>Select Type</h3>
            {isSidebarOpen &&
              types.map((type) => (
                <button
                  key={type.type}
                  style={styles.button}
                  onClick={() => setSelectedType(type.type)}
                >
                  {type.type}
                </button>
              ))}
          </div>
          <div>
            <div>
              <button style={{ cursor: "pointer" }} onClick={printToSheet}>
                Print To Sheet
              </button>
            </div>

            <h3>Other App</h3>
            <div>
              <Link to="/draw" target="_blak">
                Draw
              </Link>

            </div>
            <div>
            <Link to="/books" target="_blak">
                Audio Books
              </Link>
            </div>
          </div>
        </div>

        <div style={styles.wordListContainer}>
          <div style={styles.titleContainer}>
            <div style={{display:'flex',alignItems:'center'}}>
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
                    <div
          ref={menuIconRef}
          style={styles.menuIcon}
          onClick={toggleSidebar}
        >
          {/* Menu icon (hamburger icon) */}
          <div style={styles.iconLine}></div>
          <div style={styles.iconLine}></div>
          <div style={styles.iconLine}></div>
        </div>
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
            {Array.from(
              { length: itemsPerRow - (words.length % itemsPerRow) },
              (_, index) => index + 1
            ).map((item, index) => (
              <div className="item" key={index}></div>
            ))}
          </div>
        </div>
        <style>
          {`
          @media print {
            .no-print {
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
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    padding: "20px",
    paddingTop: "0",
    position: "relative", // To position the menu icon absolutely
  },
  sidebar: {
    transition: "transform 0.3s ease", // Smooth transition for sliding effect
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%", // Full height
    width: "200px", // Width of the sidebar
    backgroundColor: "white", // Background color
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.5)", // Optional shadow
    zIndex: 999, // Ensure it is above other content
  },
  menuIcon: {
    cursor: "pointer",
  },
  iconLine: {
    width: "30px",
    height: "4px",
    backgroundColor: "#000",
    margin: "4px 0",
  },
  wordListContainer: {
    flex: 1,
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "white",
    padding: "0",
    borderBottom: "2px solid",
    justifyContent:'space-between'
  },
  title: {
    textAlign: "left",
    fontSize: "24px",
    marginLeft: "10px", // Space between QR code and title
  },
  qrCode: {
    // Additional styles can be added here if needed
  },
  wordList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: "8px",
  },
  button: {
    display: "block",
    margin: "8px 0",
    padding: "10px",
    background: "#f0f0f0",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  },
};

export default WordCardList;
