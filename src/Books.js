import React, { useState } from 'react';

const Books = () => {
    const [books, setBooks] = useState([
        { id: 1, title: '1984', content: 'Dystopian novel by George Orwell.' },
        { id: 2, title: 'To Kill a Mockingbird', content: 'Novel by Harper Lee.' },
        { id: 3, title: 'The Great Gatsby', content: 'Novel by F. Scott Fitzgerald.' }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [newBook, setNewBook] = useState({ title: '', content: '' });

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectBook = (book) => {
        setSelectedBook(book);
    };

    const handleAddBook = () => {
        const updatedBooks = [...books, { id: Date.now(), ...newBook }];
        setBooks(updatedBooks);
        setNewBook({ title: '', content: '' });
    };

    const handleSaveBook = () => {
        const updatedBooks = books.map(book =>
            book.id === selectedBook.id ? selectedBook : book
        );
        setBooks(updatedBooks);
    };

    const handleEditBook = (key, value) => {
        setSelectedBook({ ...selectedBook, [key]: value });
    };

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
            <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #ccc', height: '100%', overflow: 'hidden' }}>
                <input
                    type="text"
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                />
                <ul style={{ listStyleType: 'none', padding: 0, height: 'calc(100% - 50px)', overflow: 'hidden' }}>
                    {filteredBooks.map(book => (
                        <li key={book.id} onClick={() => handleSelectBook(book)} style={{ cursor: 'pointer' }}>
                            {book.id}. {book.title}
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ flex: 1, padding: '10px', height: '100%', overflow: 'hidden' }}>
                <div style={{ marginBottom: '10px' }}>
                    <button onClick={handleAddBook}>New Book</button>
                    <button onClick={handleSaveBook} disabled={!selectedBook}>Save Book</button>
                    <button onClick={() => handleEditBook('content', prompt('Edit content:', selectedBook?.content))} disabled={!selectedBook}>Edit</button>
                </div>
                {selectedBook ? (
                    <div>
                        <h2>{selectedBook.title}</h2>
                        <p>{selectedBook.content}</p>
                    </div>
                ) : (
                    <p>Select a book to see details.</p>
                )}
                <div style={{ marginTop: '20px' }}>
                    <input
                        type="text"
                        placeholder="New Book Title"
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <textarea
                        placeholder="New Book Content"
                        value={newBook.content}
                        onChange={(e) => setNewBook({ ...newBook, content: e.target.value })}
                        style={{ width: '100%', height: '100px' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Books;
