import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrash, faVolumeUp,faMusic } from '@fortawesome/free-solid-svg-icons';
import { useAudio } from './context/AudioContext';
import AudioText from './components/AudioText';
import AudioTextContainer from './components/AudioTextContainer';
import { useNavigate, useLocation,useParams } from 'react-router-dom';
import { 
    Container, 
    Heading, 
    List, 
    ListItem, 
    PlayButton, 
    EditButton, 
    DeleteButton,
    AddButton,
    BookContent,
    ButtonGroup,
    ModalBackground,
    ModalContainer,
    Input,
    Textarea,
    SubmitButton,
    CloseButton,
    PaginationContainer,
    PageButton
} from './BooksStyledComponents';


const Books = () => {
    const [books, setBooks] = useState([]);
    const [currentBook, setCurrentBook] = useState({ id: null, title: '', content: '', img: '',audio:'' });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    const { playAudio,togglePlayAudio,getSentenceSource,showAudio,isPlayingToken,minBtn } = useAudio();

    // Pagination states
    const { pageNo } = useParams();

    const [currentPage, setCurrentPage] = useState(parseInt(pageNo));
    const [booksPerPage,setBooksPerPage] = useState(1) // Changed to 5

    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
                const hash = location.pathname;            if (hash) {
                const pageMatch = hash.match(/\/books\/(\d+)/);
                const page = pageMatch ? parseInt(pageMatch[1]) : 1; // Default to 1 if no match
                setCurrentPage(page);
            }
        

    }, [location]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('/data/api/books.json');
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
        navigate(`/books/${pageNumber}`); // Update the URL
    };


    useEffect(() => {
        const hash = location.hash;
        if (hash) {
            const pageMatch = hash.match(/\/books\/(\d+)/);
            const page = pageMatch ? parseInt(pageMatch[1]) : 1; // Default to 1 if no match
            setCurrentPage(page);
        }
    }, [location.hash]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentBook({ ...currentBook, [name]: value });
    };

    const addBook = () => {
        fixBook();
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

    const fixBook = () =>{
        if(isRemoveNumber){
            currentBook.content = currentBook.content.replace(/\d+\s/g,' ');

        }
        if(isPretty){
            currentBook.content = currentBook.content.replace(/\n+/g,'\n').replace(/\s+/g,' ');
            currentBook.content = currentBook.content.replace(/\.\s/g,'.\n').trim();
        }


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
        const {content,title} = book;
       
        const lines = (title+'\n'+content).trim().split('\n');
        setCurBookIndex(bookIndex);
        for (let i = 0; i < lines.length; i++) {
            if(lines[i].trim()){
                setCurrentLineIndex(i); // Set current line index
                await playLine(lines[i]);
            }

        }
        setCurrentLineIndex(-1); // Reset after all lines have played
        setCurBookIndex(-1);

    };

    const [isPlayBookAudio,setIsPlayBookAudio] = useState(false);
    const togglePlayBookAudio=async(book,bookIndex)=>{
        let src=book.audio;
        setIsPlayBookAudio(!isPlayBookAudio);

        try{
            await new Promise((resolve) => {
                
                return togglePlayAudio(src,resolve);
            });
        }catch(e){

        }
        setIsPlayBookAudio(false);


    }

    const playLine = (line) => {
        return new Promise((resolve) => {
            return playAudio(getSentenceSource(line),resolve)
        });
    };

    const playBookLine = async (bookIndex,index,line)=>{
            setCurBookIndex(bookIndex);
            setCurrentLineIndex(index);
            await playLine(line);
            setCurBookIndex(-1);
            setCurrentLineIndex(-1);    
    }
    const scrollToCenter = (element) => {
        const container = document.getElementById('container');
    
        if (container && element) {
            const rect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const elementHeight = rect.height;
    
            // Check if the element is out of view
            const isElementInView = (
                rect.top >= containerRect.top && 
                rect.bottom <= containerRect.bottom
            );
    
            if (!isElementInView) {
                // Calculate the scroll position to center the item in the container
                const scrollPosition = container.scrollTop + rect.top - containerRect.top - (containerRect.height / 2) + (elementHeight / 2);
    
                container.scrollTo({ top: scrollPosition, behavior: 'smooth' });
            }
        }
    };

    useEffect(()=>{
        const element = document.querySelector(`[data-line="${curBookIndex+'-'+currentLineIndex}"]`);
        scrollToCenter(element);
    },[curBookIndex,currentLineIndex]);  


    const saveBooks = async (booksToSave) => {
        const fileName = 'books.json';

        const payload = {
            fileName,
            data: booksToSave,
        };

        for(let book of booksToSave){
            await saveBook(book);
        }

        

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


    const saveBook = async (book) => {
        const fileName = 'books/'+book.id+'.json';

        const payload = {
            fileName,
            data: book,
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
    const [isPretty, setIsPretty] = useState(false);
    
    
    const handleIsPretty = () => {
        setIsPretty(prevState => !prevState);
      };
    const handleIsRemoveNumber = () => {
      setIsRemoveNumber(prevState => !prevState);
    };
  
    const audioTextRefs = useRef([]);

    const onPage = ()=>{
        setTimeout(()=>{
            handlePageChange(totalPages<=currentPage?1:currentPage + 1);

        },1000);
    }
    useEffect(()=>{
            if(isPlayingToken){
                setTimeout(()=>{
                    audioTextRefs.current[0].playTextAudio();
                },1000);
            }
              
    },[currentPage]);
    return (

        <Container id="container">
            
            
            {/* Pagination Controls */}
            {(!minBtn&&<PaginationContainer>
                <div>
                <PageButton 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </PageButton>
                <PageButton 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </PageButton>
                </div>
                <div>
                <input
                type="number"
                style={{ width: '25px' }}
                value={booksPerPage}
                min={1}
                onChange={(event) => setBooksPerPage(parseInt(event.target.value) || 1)}
                />
                 <button> {currentPage}/{totalPages}  </button> 
                 </div>
                 <AddButton onClick={() => setIsModalOpen(true)}>New Book</AddButton>      
                </PaginationContainer>)}

            
            <List> 
                {currentBooks.map((book, bookIndex) => (
                    <ListItem key={book.id}>
                        <BookContent $image={book.img}>
         
                            <div>
                            <AudioText ref={(el) => (audioTextRefs.current[bookIndex] = el)} items={audioTextRefs.current} myIndex={bookIndex}   subject={book.title} text={book.content} onPage={onPage}></AudioText>
                             
                            </div>
                        </BookContent>
                        {!minBtn&&<ButtonGroup>
                        <div style={{display:'flex'}}>
                        <PlayButton onClick={() => playAudioSequentially(book,bookIndex)}>
                                 <FontAwesomeIcon icon={curBookIndex==bookIndex?faVolumeUp:faPlay} />
                        </PlayButton>
                        {(showAudio&&book.audio&&<PlayButton onClick={() => togglePlayBookAudio(book,bookIndex)}>
                                 <FontAwesomeIcon icon={isPlayBookAudio?faVolumeUp:faMusic} />
                        </PlayButton>)}
                        </div>
                            <div>
                                <EditButton onClick={() => { editBook(book); setIsModalOpen(true); }}>Edit</EditButton>
                                <DeleteButton onClick={() => deleteBook(book.id)}>
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </DeleteButton>
                            </div>
                        </ButtonGroup>}
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
                          <Input
                            type="text"
                            name="audio"
                            value={currentBook.audio}
                            onChange={handleInputChange}
                            placeholder="Audio Url(Optional)"
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
                        <label>
                            <input
                            type="checkbox"
                            checked={isPretty}
                            onChange={handleIsPretty}
                            />
                             Pretty
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
