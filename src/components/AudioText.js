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
  const { audioRef, playAudio } = useAudio();
  const [tokens, setTokens] = useState(tokenize(text));

  const preloadAndPlayAudios = async (audioList, callback, startIndex = 0) => {
    // Preload all audios
    const preloadAudio = (src) => {
      return (
        src &&
        new Promise((resolve) => {
          const audio = new Audio(src);
          audio.oncanplaythrough = () => resolve(audio);
          audio.load();
        })
      );
    };

    // Load all audios
    const audioElements = await Promise.all(audioList.map(preloadAudio));

    // Play audios sequentially
    for (let i = startIndex; i < audioElements.length; i++) {
      let isPlayable = audioElements[i];
      callback(i, "start");
      if (isPlayable) {
        await new Promise((resolve, reject) => {
          playAudio(audioElements[i].src, resolve, reject);
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
    try {
      await preloadAndPlayAudios(
        audioList,
        (index) => {
          setPlayIndex(index);
        },
        index
      );
    } catch (error) {
      setPlayIndex(-1);
    }
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
