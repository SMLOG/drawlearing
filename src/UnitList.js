import React, { useState, useRef, useEffect } from 'react';

const UnitList = ({ isShowUnitList, setIsShowUnitList,activeCategory,setActiveCategory }) => {
  const [categories, setCategories] = useState([]);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories.json'); 

        const data = await response.json();
        setCategories(data);
        setActiveCategory(data[0].name)
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target) &&isShowUnitList) {
        setTimeout(()=>setIsShowUnitList(false),100)
        ;
      }
    };

    // Add event listener to handle clicks outside
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShowUnitList]);

  const handleItemClick = (item) => {
    // Handle item click as needed
  };

  const addItem = (category) => {
    const newItem = `${category} Item ${categories.find(cat => cat.name === category).items.length + 1}`;
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.name === category ? { ...cat, items: [...cat.items, newItem] } : cat
      )
    );
  };

  return (
    <div
  
      style={{
        position: "absolute",
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        display: isShowUnitList ? 'block' : 'none',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
      }}
    >
      <div  ref={containerRef} style={{
        position: "absolute",
        maxHeight: '100%',
        background: '#fff',
        maxWidth: '100%',
        right: 0,
        overflow: 'auto',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #007bff', // Border for the outer container
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #007bff',
          background: '#e7f1ff', // Distinct background for the tab area
          padding: '10px', // Padding around the tabs
          borderRadius: '8px 8px 0 0', // Rounded top corners
        }}>
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
              style={{
                padding: '10px 20px',
                background: activeCategory === category.name ? '#007bff' : 'transparent',
                color: activeCategory === category.name ? '#fff' : '#007bff',
                border: 'none',
                borderBottom: activeCategory === category.name ? '3px solid #fff' : 'none',
                cursor: 'pointer',
                outline: 'none',
                transition: 'background 0.3s, color 0.3s',
                borderRadius: '4px 4px 0 0',
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
        {categories.map((category) => (
          activeCategory === category.name && (
            <div key={category.name} style={{
              marginTop: '10px',
              display: 'flex',
              flexWrap: 'wrap',
              padding: '15px',
              backgroundColor: '#f0f4ff', // Light blue background for items area
              border: '1px solid #007bff', // Border for the items container
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Light shadow for depth
            }}>
              {category.items.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => handleItemClick(item)} 
                  style={{ 
                    padding: '10px', 
                    margin: '5px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    transition: 'background 0.3s, transform 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  {item}
                </div>
              ))}
              <button 
                onClick={() => addItem(category.name)} 
                style={{ 
                  marginTop: '10px', 
                  padding: '10px 15px',
                  background: '#28a745', // Green background
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#218838'} // Darker green on hover
                onMouseLeave={e => e.currentTarget.style.background = '#28a745'} // Reset
              >
                Add Item
              </button>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default UnitList;
