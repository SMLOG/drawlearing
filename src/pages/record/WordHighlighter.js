import React from 'react';
import styled from 'styled-components';

const WordContainer = styled.div`
    font-size: 1.5rem;
    line-height: 1.5;
`;

const HighlightedWord = styled.span`
    background-color: yellow; /* Change as needed */
    font-weight: bold;
`;

const WordHighlighter = ({ wordsTimes, currentTime }) => {
    const times = wordsTimes[0]||[];
    const words = wordsTimes[1]||[];

    return (
        <WordContainer>
            {words.map((word, index) => {
                const wordTime = times[index];
                const isHighlighted = currentTime > wordTime;

                return (
                    <span key={index}>
                        {isHighlighted ? (
                            <HighlightedWord>{word}</HighlightedWord>
                        ) : (
                            word
                        )}{' '}
                    </span>
                );
            })}
        </WordContainer>
    );
};

export default WordHighlighter;
