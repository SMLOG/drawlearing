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
    background: url('path/to/pattern.png'), linear-gradient(135deg, #ffeb3b, #80deea);
    background-size: cover, cover;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    animation: ${fadeIn} 1s;
    font-size: 90px;
`;

const Title = styled.h1`
    font-size: 80px;
    margin: 20px 0;
    color: #f44336;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
    font-family: 'Comic Sans MS', cursive, sans-serif;
    animation: bounce 1s infinite;

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
    }
`;

const Description = styled.p`
    font-size: 36px;
    margin: 15px 0;
    line-height: 1.6;
    color: #444;
    font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const Blockquote = styled.blockquote`
    font-size: 28px;
    margin: 20px 0;
    color: #f44336;
    font-weight: bold;
    background-color: #fff9c4;
    padding: 15px;
    border-radius: 10px;
    position: relative;
    border-left: 5px solid #f44336;
`;

const QuoteIcon = styled.i`
    margin-right: 10px;
    color: #f44336;
`;

const WordList = styled.div`
    font-size: 32px;
    margin-top: 20px;
    color: #1976d2;

    em {
        display: inline-block;
        padding: 12px 15px;
        border-radius: 10px;
        background-color: #e1f5fe;
        position: relative;
        transition: transform 0.2s, background-color 0.2s;
        margin: 5px;

        &:hover {
            transform: scale(1.1);
            background-color: #b3e5fc; /* Lighter blue on hover */
        }



        &:hover::after {
            transform: translateY(-5px); /* Move icon up on hover */
        }
    }
`;

const FunnyIntro = ({ title, description, weekDescription, characters, activity, repetitions }) => {
    return (
        <Container>
            <Title>{title}</Title>
            <Description>{weekDescription}</Description>
            <Blockquote>
                <QuoteIcon className="fas fa-quote-left" />
                {description}
            </Blockquote>
            <WordList>
                練習字詞：{characters.map((c) => <em key={c}>{c}</em>)}（重複練習{repetitions}次）
            </WordList>
        </Container>
    );
};

export default FunnyIntro;