import React, {
  createContext,
  useRef,
  useContext,
  useState,
  useEffect,
} from "react";
const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  //const audio = new Audio();
  const audioRef = useRef(null);
  let lastRejectRef= useRef();;
  let lastResolveRef= useRef();

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    audio.loop = isLooping;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [isLooping]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (event) => {
    const speed = parseFloat(event.target.value);
    setPlaybackRate(speed);
    audioRef.current.playbackRate = speed;
  };

  const handleLoopToggle = () => {
    setIsLooping(!isLooping);
  };

  const handleProgressClick = (event) => {
    const totalWidth = event.currentTarget.offsetWidth;
    const offsetX = event.nativeEvent.offsetX;
    const percentage = offsetX / totalWidth;
    audioRef.current.currentTime = percentage * audioRef.current.duration;
  };

  const playAudio = (src, resolve, reject) => {
    const audio = audioRef.current;
    if (!audio.onended)
      audio.onended = () => {
        lastResolveRef.current && lastResolveRef.current();
        lastResolveRef.current = lastRejectRef.current = null;
      };

    if (lastRejectRef.current) {
      lastRejectRef.current(1);
    }
    lastRejectRef.current = reject;
    lastResolveRef.current = resolve;
    audio.src = src;
    audio.play().catch(() => lastRejectRef.current && lastRejectRef.current());
  };
  const togglePlayAudio = (src, resolve, reject) => {
    const audio = audioRef.current;
    if (audio.src == src) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    } else {
      return playAudio(src, resolve, reject);
    }
  };
  const seekTo = (position) => {
    const audio = audioRef.current;
    audio.currentTime = position;
  };

  const [isShow,setIsShow] = useState(false);
  const toggleShow = ()=>{
    setIsShow(!isShow);
  }
  return (
    <AudioContext.Provider
      value={{ audioRef, playAudio, togglePlayAudio, seekTo }}
    >
      {children}
      <div style={{ position: "fixed", bottom: 0, width: "100%",background:'#ccc' }}>
        <div style={{position:'absolute',top:'-2em',width:'100%',textAlign:'right',right:'10px'}}><a onClick={toggleShow}>Show</a></div>
        <div style={{margin:'10px',display:isShow?'':'none'}} >
          <audio
            rel="noreferrer"
            referrerpolicy="no-referrer"
            ref={audioRef}
            controls
          ></audio>
          <div>
            <button onClick={togglePlayPause}>
              {isPlaying ? "Pause" : "Play"}
            </button>
            <select onChange={handleSpeedChange} value={playbackRate}>
            {[0.5,0.75,1.0,1.25,1.5,1.75,2.0].map((speed)=><option value={speed}>{speed}x</option>)}
        
            </select>
            <label>
              <input
                type="checkbox"
                checked={isLooping}
                onChange={handleLoopToggle}
              />{" "}
              Loop
            </label>
          </div>
          <div
            style={{
              width: "100%",
              height: "5px",
              background: "#ddd",
              cursor: "pointer",
              margin: "10px 0",
            }}
            onClick={handleProgressClick}
          >
            <div
              style={{
                height: "100%",
                background: "#4285F4",
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  return useContext(AudioContext);
};
