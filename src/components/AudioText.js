import React, { useState, useEffect, forwardRef, useImperativeHandle,useRef } from "react";
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

const AudioText = forwardRef(({ text,items,myIndex }, ref) => {
  const {  playAudio } = useAudio();
  const [tokens, setTokens] = useState([]);
  useEffect(()=>{
    setTokens(tokenize(text));
  },[text]);
  const preloadAndPlayAudios = async (audioList, callback, startIndex = 0) => {
    // Preload all audios
    const preloadAudio = (src) => {
      return (
        src &&
        new Promise((resolve) => {
          const audio = new Audio(src);
          audio.onerror = function() {
            console.error('Error loading audio:', audio.error);
            resolve(null);
        };
        //  audio.oncanplaythrough = () => resolve(audio);
        //  audio.load();
        resolve(audio);
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
    if(playIndex==index){
      playAudio('');
      return;
    }
    scrollToCenter(index);
    let audioList = tokens.map((token) =>
      token.t=='en'
        ? `/audio/us/${token.c.toLowerCase()}.mp3`
        : token.t=='cn'?`/sound/Cantonese/${encodeURIComponent(token.c)}.mp3`:null
    );
    try {
      await preloadAndPlayAudios(
        audioList,
        (index) => {
          setPlayIndex(index);
        },
        index
      );
      console.log('playtoken:',myIndex)

      items&&await items[myIndex+1]?.current?.playTextAudio();
    } catch (error) {
      setPlayIndex(-1);
    }
  };

  useImperativeHandle(ref, () => ({
    playTextAudio: async () => {
         await playTokens(0);
        },
}));

const itemRefs = useRef([]);

const scrollToCenter = (index) => {
  const container = document.getElementById('container');
  const element = itemRefs.current[index];
  
  if (container && element) {
    const rect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const elementHeight = rect.height;

    // Calculate the scroll position to center the item in the container
    const scrollPosition = container.scrollTop + rect.top - containerRect.top - (containerRect.height / 2) + (elementHeight / 2);

    container.scrollTo({ top: scrollPosition, behavior: 'smooth' });
  }
};

  return (
    <>
      {tokens.map((token, index) => (
        <Text
          $isActive={playIndex == index}
          onClick={() => playTokens(index)}
          key={index}
          ref={el => itemRefs.current[index] = el} 
        >
          {token.c}
        </Text>
      ))}
    </>
  );
});

export default AudioText;
