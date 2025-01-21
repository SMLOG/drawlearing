import React, { useState, useEffect, forwardRef, useImperativeHandle,useRef } from "react";
import styled from "styled-components";
import { useAudio } from "../context/AudioContext.js";
import { tokenize } from "../lib/Text.js";

const Title = styled.div`
font-weight:bold;
padding:10px 0;
`
const Content = styled.div`
`
const Text = styled.span`
  ${(props) =>
    props.$isActive &&
    `
        color: red; /* Highlight color */
    `}
`;
const Article = styled.div`
font-size:2em;
`;

const AudioText = forwardRef(({ text,subject,items,myIndex }, ref) => {
  const {  playAudio } = useAudio();
  const [tokens, setTokens] = useState([]);
  const [subjectTokens, setSubjectTokens] = useState([]);
  useEffect(()=>{
    setTokens(tokenize(text));
    setSubjectTokens(tokenize(subject||''));
  },[text]);
  const preloadAndPlayAudios = async (audioList, callback, startIndex = 0) => {
    const preloadAudio = (src) => {
      return src&&new Audio(src);
    };
  
    const audioElements = [];
    let loadedCount = 0; // Counter for loaded audios
  
    // Preload initial audios up to the preload limit
    let bufIndex=0;
    for (let i =bufIndex; i < audioList.length && loadedCount < 5; i++) {
      if(audioList[i]){
        audioElements[i] =  preloadAudio(audioList[i]);
        if (audioElements[i]) loadedCount++;
      }
      bufIndex++;
    }
  
    for (let i = startIndex; i < audioList.length; i++) {
      callback(i, "start");
  
      const isPlayable = audioList[i];
      
      if (isPlayable) {
        await new Promise((resolve, reject) => {
          playAudio(audioList[i], resolve, reject);
        });

        for(let j=bufIndex+1;j<audioList.length;j++){
          
          if(audioList[j]){
            audioElements[j]=  preloadAudio(audioList[j]);
            bufIndex++;
             break;
          }
        }

      }
  
      callback(i, "end");
    }
  
    callback(-1, "end");
  };

  const [playIndex, setPlayIndex] = useState(-1);
  const playTokens = async (type,index) => {
    setTokenType(type);
    setPlayIndex(index);
    if(playIndex==index){
      playAudio('');
      return;
    }
    scrollToCenter(index);
    let audioList = (type == 0 ?subjectTokens:tokens).map((token) =>
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
      await playTokens(type==0?1:0,0);
    } catch (error) {
      setPlayIndex(-1);
    }
     
  };

  useImperativeHandle(ref, () => ({
    playTextAudio: async () => {
         await playTokens(0,0);
        },
}));

const [tokenType,setTokenType] = useState([0]);

const subjectItemRefs = useRef([]);
const itemRefs = useRef([]);

const scrollToCenter = (index) => {
  const container = document.getElementById('container');
  const element = (tokenType==0?subjectItemRefs:itemRefs).current[index];
  
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
    <Article>
      <Title>
      
      {subjectTokens.map((token, index) => (
        token.c=='\n'?<br/>:
        <Text
          $isActive={tokenType==0&&playIndex == index}
          onClick={() => playTokens(0,index)}
          key={index}
          ref={el => subjectItemRefs.current[index] = el} 
        >
          {token.c}
        </Text>
      ))}
      </Title>
      <Content>
      {tokens.map((token, index) => (
        token.c=='\n'?<br/>:
        <Text
          $isActive={tokenType==1&&playIndex == index}
          onClick={() => playTokens(1,index)}
          key={index}
          ref={el => itemRefs.current[index] = el} 
        >

          {token.c}
        </Text>
      ))}
        </Content>
    </Article>
  );
});

export default AudioText;
