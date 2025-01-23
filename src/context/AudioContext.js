import React, { createContext, useRef, useContext } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    //const audio = new Audio();
    const audioRef = useRef(null);
    let lastReject;
    let lastResolve;


    const playAudio=(src,resolve,reject)=>{
        const audio = audioRef.current;
        console.log(audio)
        if(!audio.onended)
        audio.onended=()=>{
            lastResolve&&lastResolve();
            lastResolve = lastReject = null;
        };

        if(lastReject){
            lastReject(1);
        }
        lastReject = reject;
        lastResolve = resolve;
        audio.src =src;
        audio.play().catch(()=>lastReject&&lastReject());
    }
    return (
        <AudioContext.Provider value={{audioRef,playAudio}}>
            <audio rel="noreferrer" referrerpolicy="no-referrer" ref={audioRef} controls >
            </audio>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    return useContext(AudioContext);
};
