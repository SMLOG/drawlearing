import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay,faTrash,faVolumeUp } from '@fortawesome/free-solid-svg-icons';

// Styled Components
const Container = styled.div`
    max-width: 600px;
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
    font-size: 1.1em;
    line-height: 1.6;
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
    width: 400px;
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

const Word = styled.span`
    ${(props) => props.$isActive && `
        color: red; /* Highlight color */
    `}
`;
const Books = () => {
    const [books, setBooks] = useState([]);
    const [currentBook, setCurrentBook] = useState({ id: null, title: '', content: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(-1); // Track the currently playing line
    const audioRef = useRef();

    // Fetch books from the API on component mount
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('/api/books.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBooks(data);
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
        if (!currentBook.title || !currentBook.content) return;

        const newBook = { ...currentBook, id: Date.now() };
        setBooks([...books, newBook]);
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
       // saveBooks(updatedBooks);
    };

    const resetForm = () => {
        setCurrentBook({ id: null, title: '', content: '' });
        setIsEditing(false);
        setIsModalOpen(false);
    };

    const [curBookIndex,setCurBookIndex] = useState(-1);
    const playAudioSequentially = async (title, content,bookIndex) => {
        const lines = [title, ...content.split('\n')];
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
            audioRef.current.src = `/short/${audioFileName}?txt=${encodeURIComponent(line)}`;
            audioRef.current.play();

            audioRef.current.onended = () => {
                resolve(); // Resolve the promise when the audio ends
            };
        });
    };

    const renderContentWithLineBreaks = (title, content,bookIndex) => {
        const combinedContent = `${title}\n${content}`;
        return combinedContent.split('\n').map((line, index) => (
            <Line key={index} $isActive={curBookIndex==bookIndex&&currentLineIndex === index}>
               {index+1}. {line.split(/\s+/i).filter(e=>e).map((c,ci,words)=>(<Word $isActive={bookIndex==curBookIndex && index == currentLineIndex && curWordInex==ci} onClick={()=>playWordByWord(bookIndex,index,c,ci,words)}> {c}</Word>))}
            </Line>
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
    const [isView,setIsView]=useState(window.location.href.indexOf('localhost')>-1);


    const  preloadAndPlayAudios = async (audioList, callback, startIndex = 0) =>  {
        let currentAudioIndex = startIndex;
        let time = changed.current = +new Date();
        // Preload all audios
        const preloadAudio = (src) => {
            return new Promise((resolve) => {
                const audio = new Audio(src);
                audio.oncanplaythrough = () => resolve(audio);
                audio.load();
            });
        };
    
        // Load all audios
        const audioElements = await Promise.all(audioList.map(preloadAudio));
     
        // Play audios sequentially
        const playNext = async () => {
            if(time !== changed.current) throw 'abort';

            if (currentAudioIndex < audioElements.length) {
                const audio = audioElements[currentAudioIndex];
                audio.play();
                callback(currentAudioIndex,audio.src, 'start');
    
                return new Promise((resolve) => {
                    audio.onended = () => {
                        callback(currentAudioIndex,audio.src, 'end');
                        currentAudioIndex++;
                        resolve(playNext());
                    };
                });
            }
        };
        
        // Start playing from startIndex
        await playNext();
    }

    const [curWordInex,setCurWordIndex] = useState(-1);
    const changed = useRef(-1);
    const playWordByWord = async (bookIndex,lineIndex,word,index,words)=>{
       let audioList = words.map(w=>`/audio/us/${w.toLowerCase().replace(/[^a-z]/gi,'')}.mp3`);
       setCurBookIndex(bookIndex);
       setCurrentLineIndex(lineIndex);
       console.log(lineIndex);
       setCurWordIndex(index);
       
        await preloadAndPlayAudios(audioList,(wordIndex)=>{
            setCurWordIndex(wordIndex);
        },index).then(()=>{
            setCurrentLineIndex(-1);
            setCurWordIndex(-1);
            setCurBookIndex(-1);

        }).catch(error=>{

        });

    }

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

    return (
        <Container>
            <AddButton onClick={() => setIsModalOpen(true)}>Add Book</AddButton>
            <Heading>Book List</Heading>
            <audio ref={audioRef} controls style={{ display: 'none' }}></audio>
            <List>
                {books.map((book,bookIndex) => (
                    <ListItem key={book.id}>
                        <div style={{ textAlign: 'left' }}>
                            {renderContentWithLineBreaks(book.title, book.content,bookIndex)}
                        </div>
                        <ButtonGroup>
                            <PlayButton onClick={() => playAudioSequentially(book.title, book.content,bookIndex)}>
                                 <FontAwesomeIcon icon={curBookIndex==bookIndex?faVolumeUp:faPlay} />
                            </PlayButton>
                            {isView&&<div>
                            <EditButton onClick={() => { editBook(book); setIsModalOpen(true); }}>Edit</EditButton>
                            <DeleteButton onClick={() => deleteBook(book.id)}>
                                <FontAwesomeIcon icon={faTrash} /> Delete
                            </DeleteButton>
                            </div>}
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
