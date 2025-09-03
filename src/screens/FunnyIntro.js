import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; } 
  to { opacity: 1; }
`;

// Styled components
const Container = styled.div`
    padding: 40px;
    border-radius: 15px;
    background: linear-gradient(135deg, #ffcc80, #80deea); /* Bright and playful gradient */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Light shadow for fun effect */
    width: 100%; /* Full width on smaller screens */
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    animation: ${fadeIn} 1s; /* Fade-in animation */
    font-size: 80px; /* Slightly larger font size for readability */
`;

const Title = styled.h1`
    font-size: 68px;
    margin: 20px 0;
    color: #ff5722; /* Bright color for the title */
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* Fun shadow effect */
    font-family: 'Comic Sans MS', cursive; /* Playful font */
`;

const Description = styled.p`
    font-size: 34px;
    margin: 15px 0;
    line-height: 1.6; /* Improved line spacing */
    color: #333; /* Darker gray for better readability */
    font-family: 'Comic Sans MS', cursive; /* Playful font */
`;

const Blockquote = styled.blockquote`
    font-size: 26px;
    margin: 20px 0;
    color: #ff5722; /* Highlight color */
    font-weight: bold; /* Bold text for emphasis */
    background-color: #fff9c4; /* Light yellow background for emphasis */
    padding: 10px; /* Padding around highlighted text */
    border-radius: 5px; /* Rounded corners */
    position: relative; /* For positioning the icon */
`;

const QuoteIcon = styled.i`
    margin-right: 10px; /* Space between icon and text */
    color: #ff5722; /* Icon color */
`;

const FunnyIntro = ({ title, description, description2 }) => {
    return (
        <Container>
            <Title>{title}</Title>
            <Description>{description2}</Description>
            <Blockquote>
                <QuoteIcon className="fas fa-quote-left" />
                {description}
            </Blockquote>
        </Container>
    );
};

export default FunnyIntro;