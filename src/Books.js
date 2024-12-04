import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: relative; /* Helps position the button */
`;

const Heading = styled.h1`
    text-align: center;
    color: #333;
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
`;

const ListItem = styled.li`
    background-color: #fff;
    margin: 10px 0;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
    margin: 0;
    color: #333;
    text-align: left; /* Align text to the left */
`;

const Content = styled.p`
    margin: 10px 0;
    color: #444;
    text-align: left; /* Align text to the left */
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Button = styled.button`
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
`;

const EditButton = styled(Button)`
    background-color: #4caf50;
    color: white;
`;

const DeleteButton = styled(Button)`
    background-color: #f44336;
    color: white;
`;

const ModalBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    width: 400px;
`;

const Input = styled.input`
    width: calc(100% - 20px);
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

const Textarea = styled.textarea`
    width: calc(100% - 20px);
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

const SubmitButton = styled(Button)`
    background-color: #008cba;
    color: white;
    width: 100%;
    margin-top: 10px;
`;

const CloseButton = styled(Button)`
    background-color: #aaa;
    color: white;
    margin-top: 10px;
    width: 100%;
`;

const AddButton = styled(Button)`
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #008cba;
    color: white;
`;

const Books = () => {
    const [books, setBooks] = useState([]);
    const [currentBook, setCurrentBook] = useState({ id: null, title: '', content: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch books from the API on component mount
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('/api/books.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBooks(data); // Assuming the API returns an array of books
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []); // Empty dependency array means this runs once on mount

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentBook({ ...currentBook, [name]: value });
    };

    const addBook = () => {
        if (!currentBook.title || !currentBook.content) return;

        const newBook = { ...currentBook, id: Date.now() };
        setBooks([...books, newBook]);
        resetForm();
        saveBooks([...books, newBook]); // Save the updated books after adding
    };

    const editBook = (book) => {
        setIsEditing(true);
        setCurrentBook(book);
        setIsModalOpen(true);
    };

    const updateBook = () => {
        const updatedBooks = books.map((book) => (book.id === currentBook.id ? currentBook : book));
        setBooks(updatedBooks);
        resetForm();
        saveBooks(updatedBooks); // Save the updated books after editing
    };

    const deleteBook = (id) => {
        const updatedBooks = books.filter((book) => book.id !== id);
        setBooks(updatedBooks);
        saveBooks(updatedBooks); // Save the updated books after deletion
    };

    const resetForm = () => {
        setCurrentBook({ id: null, title: '', content: '' });
        setIsEditing(false);
        setIsModalOpen(false);
    };
    const audioRef = useRef();
    const playShort = (line) =>{
        let id=line.replace(/[^a-z]/ig,'');
        audioRef.current.src=`/short/${line.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]+/ig,'_')}.mp3?txt=${encodeURIComponent(line)}`;
        audioRef.current.playbackRate = parseFloat(0.8)
        audioRef.current.play();
    }
    const renderContentWithLineBreaks = (content) => {
        return content.split('\n').map((line, index) => (
            <p key={index} >
                <a style={{cursor:'pointer'}} onClick={()=>playShort(line)}>{line}</a>
            </p>
        ));
    };

    const saveBooks = async (booksToSave) => {
        const fileName = 'books.json'; // Set your desired filename here
        const payload = {
            fileName,
            data: booksToSave,
        };

        try {
            const response = await fetch('/save-json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Books saved successfully:', result);
        } catch (error) {
            console.error('Error saving books:', error);
        }
    };

    return (
        <Container>
            <AddButton onClick={() => setIsModalOpen(true)}>Add Book</AddButton>
            <Heading>Book List</Heading>
            <audio ref={audioRef} controls></audio>
            <List>
                {books.map((book) => (
                    <ListItem key={book.id}>
                        <Title style={{cursor:'pointer'}} onClick={()=>playShort(book.title)}>{book.title}</Title>
                        <div style={{textAlign:'left'}}>{renderContentWithLineBreaks(book.content)}</div>
                        <ButtonGroup>
                            <EditButton onClick={() => { editBook(book); setIsModalOpen(true); }}>Edit</EditButton>
                            <DeleteButton onClick={() => deleteBook(book.id)}>Delete</DeleteButton>
                        </ButtonGroup>
                    </ListItem>
                ))}
            </List>

            {isModalOpen && (
                <ModalBackground>
                    <ModalContainer>
                        <h2>{isEditing ? 'Edit Book' : 'Add Book'}</h2>
                        <Input
                            type="text"
                            name="title"
                            value={currentBook.title}
                            onChange={handleInputChange}
                            placeholder="Book Title"
                        />
                        <Textarea
                            name="content"
                            value={currentBook.content}
                            onChange={handleInputChange}
                            placeholder="Book Content"
                            rows="4"
                        />
                        <SubmitButton onClick={isEditing ? updateBook : addBook}>
                            {isEditing ? 'Update Book' : 'Add Book'}
                        </SubmitButton>
                        <CloseButton onClick={resetForm}>Close</CloseButton>
                    </ModalContainer>
                </ModalBackground>
            )}
        </Container>
    );
};

export default Books;
