// StyledComponents.js
import styled from 'styled-components';

export const Container = styled.div`
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
    padding-top:0;
`;

export const Heading = styled.h1`
    text-align: center;
    color: #333;
    font-size: 1em;
    margin-bottom: 20px;
`;

export const List = styled.ul`
    list-style: none;
    padding: 0;
`;

export const ListItem = styled.li`
    background-color: #fff;
    margin: 10px 0;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
`;

export const Line = styled.p`
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

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
`;

export const Button = styled.button`
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 1em; /* Increased font size for buttons */
`;

export const PlayButton = styled(Button)`
    background-color: #008cba;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const EditButton = styled(Button)`
    background-color: #4caf50;
    color: white;
`;

export const DeleteButton = styled(Button)`
    background-color: #f44336;
    color: white;
`;

export const ModalBackground = styled.div`
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

export const ModalContainer = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

export const Input = styled.input`
    width: calc(100% - 20px);
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 1em; /* Increased font size for input */
`;

export const Textarea = styled.textarea`
    width: calc(100% - 20px)!important;
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

export const BookContent = styled.div`
    text-align: left;
    background-size: contain;
    background-position: right;
    background-repeat: no-repeat;
    display: flex;

    @media (max-width: 480px) {
        flex-direction: column;
    }
    
    @media (min-width: 480px) {
        ${(props) => props.$image && `
            background-image: url('${props.$image}');
        `}
        img { 
            display: none; 
        }
    }
    
    img { 
        max-width: min(100%, 100px); 
    }
`;

export const SubmitButton = styled(Button)`
    background-color: #008cba;
    color: white;
    width: 100%;
    margin-top: 10px;
`;

export const CloseButton = styled(Button)`
    background-color: #aaa;
    color: white;
    margin-top: 10px;
    width: 100%;
`;

export const AddButton = styled(Button)`
    background-color: #008cba;
    color: white;
`;

export const PaginationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    top: 0;
    position:sticky;
    background:rgba(100,100,100,0.6);
    padding-top:10px;
`;

export const PageButton = styled.button`
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
