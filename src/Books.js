import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrash, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { useAudio } from './context/AudioContext';
import AudioText from './components/AudioText';
import AudioTextContainer from './components/AudioTextContainer';

// Styled Components
const Container = styled.div`
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 0;
    bottom: 0;
    overflow: auto;
    left: 0;
    right: 0;
`;

const Heading = styled.h1`
    text-align: center;
    color: #333;
    font-size: 2em;
    margin-bottom: 20px;
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
`;

const ListItem = styled.li`
    background-color: #fff;
    margin: 10px 0;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
`;

const Line = styled.p`
    margin: 0;
    color: #444;
    font-size: 2em;
    line-height: 1.6;
    background: rgba(255, 255, 255, 0.8);
    display: inline-block;
    ${(props) => props.$isActive && `
        background-color: #e0f7fa; /* Highlight color */
    `}
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
`;

const Button = styled.button`
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 1em; /* Increased font size for buttons */
`;

const PlayButton = styled(Button)`
    background-color: #008cba;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
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
`;

const Input = styled.input`
    width: calc(100% - 20px);
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 1em; /* Increased font size for input */
`;

const Textarea = styled.textarea`
    width: calc(100% - 20px);
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 1em; /* Increased font size for textarea */
`;

const BookContent = styled.div`
    text-align: left;
    display: flex;

    @media (max-width: 480px) {
        flex-direction: column;
    }

    img {
        max-width: min(100%, 100px);
    }
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

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

const PageButton = styled.button`
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 5px;
    background-color: #008cba;
    color: white;

    &:disabled {
        background-color: #aaa;
        cursor: not-allowed;
    }
`;

const Books = () => {
    const [books, setBooks] = useState([]);
    const [currentBook, setCurrentBook] = useState({ id: null, title: '', content: '', img: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    const { playAudio } = useAudio();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 5; // Changed to 5

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('/api/books.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBooks(data.sort((a, b) => b.id - a.id));
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

    // Calculate displayed books based on current page
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    const totalPages = Math.ceil(books.length / booksPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentBook({ ...currentBook, [name]: value });
    };

    const addBook = () => {
        if (!currentBook.title.trim() && !currentBook.content.trim()) return;

        const newBook = { ...currentBook, id: Date.now() };
        setBooks([newBook, ...books]);
        resetForm();
        saveBooks([...books, newBook]);
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
        saveBooks(updatedBooks);
    };

    const deleteBook = (id) => {
        const updatedBooks = books.filter((book) => book.id !== id);
        setBooks(updatedBooks);
        saveBooks(updatedBooks);
    };

    const resetForm = () => {
        setCurrentBook({ id: null, title: '', content: '' });
        setIsEditing(false);
        setIsModalOpen(false);
    };

    const saveBooks = async (booksToSave) => {
        const fileName = 'books.json';
        const payload = { fileName, data: booksToSave };

        try {
            const response = await fetch('/save-json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

    const modalRef = useRef();
    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target) && isModalOpen) {
            resetForm();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);

    return (
        <Container id="container">
            <AddButton onClick={() => setIsModalOpen(true)}>New Book</AddButton>
            <Heading><AudioText text={"Book List"}></AudioText></Heading>
            <List>
                {currentBooks.map((book, bookIndex) => (
                    <ListItem key={book.id}>
                        <BookContent $image={book.img}>
                            <div>
                                {book.img && <img src={book.img} alt={book.title} />}
                            </div>
                            <div>
                                <AudioTextContainer>
                                    <Line>{book.title}</Line>
                                    <Line>{book.content}</Line>
                                </AudioTextContainer>
                            </div>
                        </BookContent>
                        <ButtonGroup>
                            <PlayButton onClick={() => {/* Play logic */}}>
                                <FontAwesomeIcon icon={faPlay} />
                            </PlayButton>
                            <div>
                                <EditButton onClick={() => { editBook(book); setIsModalOpen(true); }}>Edit</EditButton>
                                <DeleteButton onClick={() => deleteBook(book.id)}>
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </DeleteButton>
                            </div>
                        </ButtonGroup>
                    </ListItem>
                ))}
            </List>

            {/* Pagination Controls */}
            <PaginationContainer>
                <PageButton 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </PageButton>
                {[...Array(totalPages)].map((_, index) => (
                    <PageButton 
                        key={index + 1} 
                        onClick={() => handlePageChange(index + 1)} 
                        disabled={currentPage === index + 1}
                    >
                        {index + 1}
                    </PageButton>
                ))}
                <PageButton 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </PageButton>
            </PaginationContainer>

            {isModalOpen && (
                <ModalBackground>
                    <ModalContainer ref={modalRef}>
                        <h2>{isEditing ? 'Edit Book' : 'Add Book'}</h2>
                        <Input
                            type="text"
                            name="title"
                            value={currentBook.title}
                            onChange={handleInputChange}
                            placeholder="Book Title(Optional)"
                        />
                        <Textarea
                            name="content"
                            value={currentBook.content}
                            onChange={handleInputChange}
                            placeholder="Book Content"
                            rows="4"
                        />
                        <Input 
                            type="text" 
                            name="img"   
                            onChange={handleInputChange}   
                            placeholder="Image URL" 
                            value={currentBook.img}
                        />
                        <div style={{ display: 'flex' }}>
                            <SubmitButton onClick={isEditing ? updateBook : addBook}>
                                {isEditing ? 'Update Book' : 'Add Book'}
                            </SubmitButton>
                            <CloseButton onClick={resetForm}>Close</CloseButton>
                        </div>
                    </ModalContainer>
                </ModalBackground>
            )}
        </Container>
    );
};

export default Books;
