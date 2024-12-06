import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useAudio } from "../context/AudioContext.js";
import { tokenize } from "../lib/Text.js";

const Text = styled.span`
  ${(props) =>
    props.$isActive &&
    `
        color: red; /* Highlight color */
    `}
`;

const AudioText = ({ text }) => {
  const audioRef = useAudio();
  const [tokens, setTokens] = useState(tokenize(text));

  const preloadAndPlayAudios = async (audioList, callback, startIndex = 0) => {
    // Preload all audios
    const preloadAudio = (src) => {
        return src&&new Promise((resolve) => {
          const audio = new Audio(src);
          audio.oncanplaythrough = () => resolve(audio);
          audio.load();
        });
    };

    // Load all audios
    const audioElements = await Promise.all(audioList.map(preloadAudio));
    const audio = audioRef.current;

    // Play audios sequentially
    for (let i = startIndex; i < audioElements.length; i++) {
      let isPlayable = audioElements[i];
      callback(i, "start");
      if (isPlayable) {
        audio.src = audioElements[i].src;
        await new Promise((resolve) => {
          audio.onended = () => {
            resolve();
          };
          audio.play();
        });
      }
      callback(i, "end");
    }
    callback(-1, "end");
  };

  const [playIndex, setPlayIndex] = useState(-1);
  const playTokens = async (index) => {
    let audioList = tokens.map((token) =>
      token.t
        ? `/audio/us/${token.c.toLowerCase().replace(/[^a-z]/gi, "")}.mp3`
        : null
    );
    await preloadAndPlayAudios(
      audioList,
      (index) => {
        setPlayIndex(index);
      },
      index
    );
  };

  return (
    <>
      {tokens.map((token, index) => (
        <Text
          $isActive={playIndex == index}
          onClick={() => playTokens(index)}
          key={index}
        >
          {token.c}
        </Text>
      ))}
    </>
  );
};

export default AudioText;
