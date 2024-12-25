import React, { useState } from 'react';

const URLsInputModal = ({ isOpen, onClose, onSubmit }) => {
    const [urls, setUrls] = useState(['']);

    const handleChange = (index, value) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    const handleAddUrl = () => {
        setUrls([...urls, '']);
    };

    const handleDeleteUrl = (index) => {
        const newUrls = urls.filter((_, i) => i !== index);
        setUrls(newUrls);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(urls.filter(url => url)); // Filter out empty URLs
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={modalStyles}>
            <div style={modalContentStyles}>
                <h2>Add URLs</h2>
                <form onSubmit={handleSubmit}>
                    {urls.map((url, index) => (
                        <div key={index} style={inputContainerStyles}>
                            <label style={labelStyles}>
                                URL {index + 1}:
                            </label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => handleChange(index, e.target.value)}
                                placeholder="Enter URL"
                                required
                                style={inputStyles}
                            />
                            <button 
                                type="button" 
                                onClick={() => handleDeleteUrl(index)} 
                                style={deleteButtonStyles}
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddUrl}>
                        + Add URL
                    </button>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    );
};

const URLInputButton = ({onSubmit}) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleUrlSubmit = (urls) => {
        console.log('Submitted URLs:', urls);
        // Handle the submitted URLs as needed
        onSubmit(urls);
    };

    return (
        <div>
            <h1>URLs Input Example</h1>
            <button onClick={() => setModalOpen(true)}>Add URLs</button>
            <URLsInputModal 
                isOpen={isModalOpen} 
                onClose={() => setModalOpen(false)} 
                onSubmit={handleUrlSubmit} 
            />
        </div>
    );
};

// Modal styles
const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Set high z-index
};

const modalContentStyles = {
    background: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '300px',
};

// Styles for input container
const inputContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
};

// Styles for label
const labelStyles = {
    marginRight: '10px',
    width: '70px', // Fixed width for labels to align inputs
};

// Styles for input
const inputStyles = {
    flex: 1, // Take remaining space
};

// Styles for delete button
const deleteButtonStyles = {
    marginLeft: '10px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    padding: '5px',
};

export default URLInputButton;
