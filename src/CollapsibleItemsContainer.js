import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUndo,
  faRedo,
  faPlay,
  faPause,
  faSync,
  faEllipsisH,
  faTrashAlt,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
const CollapsibleItemsContainer = ({ children }) => {
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState([]);
  const [overflowItems, setOverflowItems] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const  getElementWidthWithMargin = (element)=> {

    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const marginLeft = parseFloat(style.marginLeft);
    const marginRight = parseFloat(style.marginRight);

    // Total width including margins
    const totalWidth = rect.width + marginLeft + marginRight;
    return totalWidth;
}
  const calculateVisibleItems = () => {
    console.log('calculateVisibleItems')
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const buttonWidth = buttonRef.current?.offsetWidth || 0;  // Get button width
    const availableWidth = containerWidth - buttonWidth; // Adjust available width

    const itemWidths = Array.from(containerRef.current.children).map(
      item => getElementWidthWithMargin(item)
    );

    let totalWidth = 0;
    const newVisibleItems = [];
    const newOverflowItems = [];

    React.Children.forEach(children, (child, index) => {
      totalWidth += itemWidths[index] || 0;
      if (totalWidth <= availableWidth) {
        newVisibleItems.push(child);
      } else {
        newOverflowItems.push(child);
      }
    });

    setVisibleItems(newVisibleItems);
    setOverflowItems(newOverflowItems);
  };

  useEffect(() => {
    calculateVisibleItems(); // Initial calculation

    // Handle window resize
    const handleResize = () => {
      calculateVisibleItems();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [children]);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div style={{    position: "relative"}}>
      <div ref={containerRef} style={{ display: 'flex', overflow: 'hidden',justifyContent:'center ' }}>
        {visibleItems.map((item, index) => (
          <div key={index} style={{ margin: '5px' }}>{item}</div>
        ))}
          {overflowItems.length > 0 && (
        <button ref={buttonRef} onClick={togglePopup}>
        <FontAwesomeIcon icon={faEllipsisH} />
        </button>
      )}
      </div>
      {isPopupOpen && (
        <div className="popup" style={{position:'absolute',bottom:'100%',right:0,background:'#eee'}}>
          <div>
            {overflowItems.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
          <button onClick={togglePopup}>Close</button>
        </div>
      )}
    </div>
  );
};

export default CollapsibleItemsContainer;
