import React, { createContext, useRef, useContext } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const audio = new Audio();
    const audioRef = useRef(audio);
    let lastReject;
    let lastResolve;

    audio.onended=()=>{
        lastResolve&&lastResolve();
        lastResolve = lastReject = null;
    };

    const playAudio=(src,resolve,reject)=>{
        if(lastReject){
            lastReject();
        }
        lastReject = reject;
        lastResolve = resolve;
        audio.src =src;
        audio.play().catch(()=>lastReject&&lastReject());
    }
    return (
        <AudioContext.Provider value={{audioRef,playAudio}}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    return useContext(AudioContext);
};
