import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay,faTrash,faVolumeUp } from '@fortawesome/free-solid-svg-icons';
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
    display:inline-block;
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
    background-size: contain;
    background-position: right;
    background-repeat: no-repeat;
        ${(props) => props.$image && `
       background-image: url('${props.$image}');
    `}
`;
const BookContent = styled.div`
text-align:left;
    background-size: contain;
    background-position: right;
    background-repeat: no-repeat;

    display:flex;

    @media (max-width: 480px) {
            flex-direction:column;

  }
                @media (min-width: 480px) {
                       ${(props) => props.$image && `
       background-image: url('${props.$image}');
    `}
     img{ display:none;};
  }
    img{ max-width:min(100%, 100px)};
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
    const [currentBook, setCurrentBook] = useState({ id: null, title: '', content: '',img:'' });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(-1); // Track the currently playing line
    const {playAudio} = useAudio();
    // Fetch books from the API on component mount
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('/api/books.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBooks(data.sort((a,b)=>b.id-a.id));
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentBook({ ...currentBook, [name]: value });
    };

    const addBook = () => {
        fixBook();
        if (!currentBook.title.trim() && !currentBook.content.trim()) return;

        const newBook = { ...currentBook, id: Date.now() };

        setBooks([newBook,...books]);
        resetForm();
        saveBooks([...books, newBook]);
    };

    const editBook = (book) => {
        setIsEditing(true);
        setCurrentBook(book);
        setIsModalOpen(true);
    };

    const fixBook = () =>{
        if(isRemoveNumber){
            currentBook.content = currentBook.content.replace(/\d+\s/g,' ');

        }
        currentBook.content = currentBook.content.replace(/\n+/g,'\n').replace(/\s+/g,' ');
        currentBook.content = currentBook.content.replace(/\.\s/g,'.\n').trim();

    }
    const updateBook = () => {
        fixBook();

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

    const [curBookIndex,setCurBookIndex] = useState(-1);
    const playAudioSequentially = async (book,bookIndex) => {
        console.log(book)
        const {content,title} = book;
       
        const lines = (title+'\n'+content).trim().split('\n');
        setCurBookIndex(bookIndex);
        for (let i = 0; i < lines.length; i++) {
            setCurrentLineIndex(i); // Set current line index
            await playLine(lines[i]);
        }
        setCurrentLineIndex(-1); // Reset after all lines have played
        setCurBookIndex(-1);

    };

    const playLine = (line) => {
        return new Promise((resolve) => {
            const audioFileName = line.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]+/ig, '_') + '.mp3';
            return playAudio(`/short/${audioFileName}?txt=${encodeURIComponent(line)}`,resolve)
        });
    };

    const playBookLine = async (bookIndex,index,line)=>{
            setCurBookIndex(bookIndex);
            setCurrentLineIndex(index);
            await playLine(line);
            setCurBookIndex(-1);
            setCurrentLineIndex(-1);    
    }

    const renderContentWithLineBreaks = (title, content,bookIndex) => {
        const combinedContent = `${title}\n${content}`.trim();
        return combinedContent.split('\n').map((line, index) => (
            <div key={index}><Line  $isActive={curBookIndex==bookIndex&&currentLineIndex === index}>
               <span>{index+1}.</span> <AudioText text={line}></AudioText>
            </Line> 
            <button onClick={() => playBookLine(bookIndex,index,line)}>
            <FontAwesomeIcon icon={curBookIndex==bookIndex&&currentLineIndex === index?faVolumeUp:faPlay} />
            </button>
            </div>
        ));
    };

    const saveBooks = async (booksToSave) => {
        const fileName = 'books.json';

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


    const modalRef = useRef();
      const handleClickOutside = (event) => {
    if (
        modalRef.current &&
      !modalRef.current.contains(event.target) &&
      isModalOpen
    ) {
        resetForm();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);



  const [isRemoveNumber, setIsRemoveNumber] = useState(false);

  const handleIsRemoveNumber = () => {
    setIsRemoveNumber(prevState => !prevState);
  };


    return (
        <Container>
            <AddButton onClick={() => setIsModalOpen(true)}>New Book</AddButton>
            <Heading><AudioText text={"Book List"}></AudioText></Heading>
            <List>
                {books.map((book,bookIndex) => (
                    <ListItem key={book.id}>
                        <BookContent $image={book.img} >
                            <div>
                            {book.img&&<img src = {book.img}/>}
                            </div>
                            <div>
                            <AudioTextContainer>
                            {renderContentWithLineBreaks(book.title, book.content,bookIndex)}
                            </AudioTextContainer>
                            </div>
                        </BookContent>
                        <ButtonGroup>
                            <PlayButton onClick={() => playAudioSequentially(book,bookIndex)}>
                                 <FontAwesomeIcon icon={curBookIndex==bookIndex?faVolumeUp:faPlay} />
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
                            $image={currentBook.img}
                        />
                        <Input type="text" name="img"   onChange={handleInputChange}   placeholder="Image URL" value={currentBook.img}/>
                        <div>
                        <label>
                            <input
                            type="checkbox"
                            checked={isRemoveNumber}
                            onChange={handleIsRemoveNumber}
                            />
                             Remove Number
                        </label>
                        </div>
                        <div style={{display:'flex'}}>
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
