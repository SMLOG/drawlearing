import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { updateSettings } from './features/settingsSlice';
const SearchDropdown = () => {
    const settings = useSelector((state) => state.settings);
    const dispatch = useDispatch();

    const [data, setData] = useState(() => {
        const storedData = localStorage.getItem('items');
        return storedData ? JSON.parse(storedData) : [];
    });

    const [query, setQuery] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(data));
    }, [data]);

    const handleInputChange = (event) => {
        const value = event.target.value.toLowerCase();
        setQuery(value);

        if (value) {
            const filtered = data.filter(item => item.toLowerCase().includes(value));
            setFilteredData(filtered);
            setDropdownVisible(filtered.length > 0);
        } else {
            setFilteredData(data);
            setDropdownVisible(true); // Show all items if input is empty
        }
    };



    const selectItem = (item) => {
        setQuery(item);
        setDropdownVisible(false);
        dispatch(updateSettings({item:item}));

    };

    const handleClickOutside = (event) => {
        if (event.target.closest('.dropdown') === null) {
            setDropdownVisible(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const trimmedQuery = query.trim();
            if (trimmedQuery && !data.some(item => item.toLowerCase() === trimmedQuery.toLowerCase())) {
                setData([trimmedQuery,...data]);
                setQuery('');
            }
            if(trimmedQuery)dispatch(updateSettings({item:trimmedQuery}));
            setDropdownVisible(false);

        }
    };

    const showAllItems = (event) => {
        event.stopPropagation();
        setFilteredData(data);
        setDropdownVisible(true);
    };

    const deleteItem = (itemToDelete) => {
        setData(data.filter(item => item !== itemToDelete)); // Remove the item
        setFilteredData(filteredData.filter(item => item !== itemToDelete)); // Remove the item

    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type to search..."
                autoComplete="off"
                style={{
                    width: 'calc(100% - 10px)', // Set to 100% - 10px for spacing
                    padding: '10px',
                    paddingRight: '40px',
                    margin: '0 2px',
                    boxSizing: 'border-box',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#ccc'}
            />
            <button 
                onClick={showAllItems}
                style={{
                    position: 'absolute',
                    right: '5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: '10px',
                    outline: 'none',
                    color: '#007bff',
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 8 10 12 14 8"></polyline>
                </svg>
            </button>
            {isDropdownVisible && (
                <div className="dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    border: '1px solid #ccc',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    background: 'white',
                    zIndex: 1000,
                    width: 'calc(100% - 4px)', // Account for margins in dropdown width
                    borderRadius: '5px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}>
                    {filteredData.map((item, index) => (
                        <div
                            key={index}
                            className="result-item"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <span onClick={() => selectItem(item)}>{item}</span>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent item selection on delete button click
                                    deleteItem(item);
                                }}
                                style={{
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    color: 'red'
                                }}
                            >
                                🗑️ {/* Delete Icon */}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchDropdown;
