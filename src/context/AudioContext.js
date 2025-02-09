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
  let lastRejectRef = useRef();
  let lastResolveRef = useRef();

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [progress, setProgress] = useState(0);

  const [isPlayingToken, setIsPlayingToken] = useState(false);
  const togglePlayingToken=(value)=>{
    if(value!=undefined){
      setIsPlayingToken(value);
    }else{
      setIsPlayingToken(!isPlayingToken);

    }
  }

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

  const [isShow, setIsShow] = useState(false);
  const toggleShow = () => {
    setIsShow(!isShow);
  };

  const [minBtn, setMinBtn] = useState(false);


  const [curSource, setCurSource] = useState(localStorage.getItem("curSource"));

  useEffect(() => {
    console.log(curSource);
    localStorage.setItem("curSource", curSource);
  }, [curSource]);
  const curSourceRef = useRef();
  useEffect(() => {
    curSourceRef.current = curSource;
  }, [curSource]);

  const getSentenceSource=(text)=>{
    const audioFileName = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]+/ig, '_') + '.mp3';

    return curSourceRef.current == "YD-en"
    ? `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(
        text
      )}&type=1`
    : curSourceRef.current == "YD-us"
    ? `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(
        text
      )}&type=2`
    : curSourceRef.current == "BD-en"
    ? `https://fanyi.baidu.com/gettts?lan=en&text=${encodeURIComponent(
        text
      )}&spd=5&source=web`
    : curSourceRef.current == "BD-us"
    ? `https://fanyi.baidu.com/gettts?lan=us&text=${encodeURIComponent(
        text
      )}&spd=5&source=web`
    : curSourceRef.current == "Local-en"
    ? `/short/en/${audioFileName}?txt=${encodeURIComponent(text)}`
    : `/short/us/${audioFileName}?txt=${encodeURIComponent(text)}`;


  }

  const getPrefix = (text)=>{
   let prefix= text.toLowerCase().replace(/[^a-z]/gi,'').substring(0,4);

   let remap = text.replace(/[^a-zA-Z0-9-.]/g, (match) => {
    return `-${match.charCodeAt(0)}-`;
    });
    remap = remap.replace(/^-|-$/g, '');
    if(text.length>1&&text.replace(/[^A-Z]/g,'').length==text.length){
	remap='$'+text+'$';

}
   return (prefix.length<4?'':prefix+'/')+remap;

  }
  const getTextAudioUrl = (token) => {
    const type = token.t;
    const text = token.c;
    if (type == "en") {
      return curSourceRef.current == "YD-en"
        ? `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(
            text
          )}&type=1`
        : curSourceRef.current == "YD-us"
        ? `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(
            text
          )}&type=2`
        : curSourceRef.current == "BD-en"
        ? `https://fanyi.baidu.com/gettts?lan=en&text=${encodeURIComponent(
            text
          )}&spd=5&source=web`
        : curSourceRef.current == "BD-us"
        ? `https://fanyi.baidu.com/gettts?lan=us&text=${encodeURIComponent(
            text
          )}&spd=5&source=web`
        : curSourceRef.current == "Local-en"
        ? `/data/audio/en/${getPrefix(text)}.mp3?q=${encodeURIComponent(text)}`
        : `/data/audio/us/${getPrefix(text)}.mp3?q=${encodeURIComponent(text)}`;
    } else if (type == "cn") {
      return `/data/audio/Cantonese/${encodeURIComponent(text)}.mp3`;
    } else if (type == "zh") {
    }
  };

  const [looplay, setLoopPlay] = useState(() => {
    const saved = localStorage.getItem("looplay");
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("looplay", JSON.stringify(looplay));
  }, [looplay]);
  const [showAudioSetting, setShowAudioSetting] = useState(false);

  const toggleShowAudioSetting = () => {
    setShowAudioSetting(!showAudioSetting);
  };
  
  const [showAudio,setShowAudio] = useState(false);
  return (
    <AudioContext.Provider
      value={{
        audioRef,
        playAudio,
        togglePlayAudio,
        seekTo,
        getTextAudioUrl,
        looplay,
        getSentenceSource,showAudio,
        isPlayingToken,togglePlayingToken,minBtn
      }}
    >
      {children}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          background: "#ccc",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-2em",
            width: "100%",
            textAlign: "right",
            right: "10px",
          }}
        >
         <span><input
                  type="checkbox"
                  checked={minBtn}
                  onChange={() => setMinBtn(!minBtn)}
                />
          Text only </span> <span> | </span>
          <a onClick={toggleShow}>Show</a>
        </div>

        <div style={{ margin: "10px", display: isShow ? "" : "none" }}>
          <div>
            <div onClick={toggleShowAudioSetting}>Setting</div>
            {showAudioSetting && (
              <div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {["YD-en", "YD-us", "Local-en", "Local-us"].map((src) => (
                    <button
                      key={src}
                      onClick={() => setCurSource(src)}
                      style={{
                        cursor: "pointer",
                        fontSize: "1em",
                        marginRight: "1em",
                        color: curSource == src ? "green" : "black",
                      }}
                    >
                      {src}
                    </button>
                  ))}
                </div>
                <input
                  type="checkbox"
                  checked={looplay}
                  onChange={() => setLoopPlay(!looplay)}
                />
                Loop
                <input
                  type="checkbox"
                  checked={showAudio}
                  onChange={() => setShowAudio(!showAudio)}
                />
                A

              </div>
            )}
          </div>
          <audio
            rel="noreferrer"
            referrerPolicy="no-referrer"
            ref={audioRef}
            controls
          ></audio>
          <div>
            <button onClick={togglePlayPause}>
              {isPlaying ? "Pause" : "Play"}
            </button>
            <select onChange={handleSpeedChange} value={playbackRate}>
              {[0.5,0.75,1.0,1.25,1.5,1.75,2.0,2.25,2.5,3.0].map((speed) => (
                <option value={speed} key={speed}>{speed}x</option>
              ))}
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
