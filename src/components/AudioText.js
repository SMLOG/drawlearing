import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import styled from "styled-components";
import { useAudio } from "../context/AudioContext.js";
import { tokenize } from "../lib/Text.js";

const Title = styled.div`
  font-weight: bold;
  padding: 10px 0;
`;
const Content = styled.div``;
const Text = styled.span`
display:inline-block;
  ${(props) =>
    props.$isActive &&
    `
        color: red; /* Highlight color */
    `}
`;
const Article = styled.div`
  font-size: 2em;
  word-break: break-word;
`;

const AudioText = forwardRef(({ text, subject, items, myIndex }, ref) => {
  const { playAudio } = useAudio();
  const [tokens, setTokens] = useState([]);
  const [subjectTokens, setSubjectTokens] = useState([]);
  useEffect(() => {
    setTokens(tokenize(text));
    setSubjectTokens(tokenize(subject || ""));
  }, [text]);
  const preloadAndPlayAudios = async (tokens, callback, startIndex = 0) => {
    const preloadAudio = (token) => {
      let src = getTextAudioUrl(token);
      return src && new Audio(src);
    };

    const audioElements = [];
    let loadedCount = 0; // Counter for loaded audios

    // Preload initial audios up to the preload limit
    let bufIndex = 0;
    for (let i = bufIndex; i < tokens.length && loadedCount < 5; i++) {
      if (getTextAudioUrl(tokens[i])) {
        audioElements[i] = preloadAudio(tokens[i]);
        if (audioElements[i]) loadedCount++;
      }
      bufIndex++;
    }

    for (let i = startIndex; i < tokens.length; i++) {
      callback(i, "start");

      const isPlayable = getTextAudioUrl(tokens[i]);

      if (isPlayable) {
        await new Promise((resolve, reject) => {
          playAudio(isPlayable, resolve, reject);
        });

        for (let j = bufIndex + 1; j < tokens.length; j++) {
          if (getTextAudioUrl(tokens[j])) {
            audioElements[j] = preloadAudio(tokens[j]);
            bufIndex++;
            break;
          }
        }
      }

      callback(i, "end");
    }

    callback(-1, "end");
  };

  const [looplay, setLoopPlay] = useState(() => {
    const saved = localStorage.getItem('looplay');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("looplay", JSON.stringify(looplay));
  }, [looplay]);

  const [curSource, setCurSource] = useState(localStorage.getItem("curSource"));

  useEffect(() => {
    console.log(curSource);
    localStorage.setItem("curSource", curSource);
  }, [curSource]);

  const curSourceRef = useRef();
  useEffect(() => {
    curSourceRef.current = curSource;
  }, [curSource]);
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
        ? `/audio/en/${text.toLowerCase()}.mp3`
        : `/audio/us/${text.toLowerCase()}.mp3`;
    } else if (type == "cn") {
      return `/sound/Cantonese/${encodeURIComponent(text)}.mp3`;
    } else if (type == "zh") {
    }
  };

  const [playIndex, setPlayIndex] = useState(-1);
  const playTokens = async (type, index) => {
    setTokenType(type);
    setPlayIndex(index);
    if (playIndex == index) {
      playAudio("");
      return;
    }

    scrollToCenter(index);

    try {
      await preloadAndPlayAudios(
        type == 0 ? subjectTokens : tokens,
        (index) => {
          setPlayIndex(index);
        },
        index
      );
      console.log("playtoken:", myIndex);

      
      if(type==1 ){
        if(looplay)await playTokens(type == 0 ? 1 : 0, 0);
        else items&&await items[myIndex+1]?.current?.playTextAudio(); 
      }else await playTokens(type == 0 ? 1 : 0, 0);
      
    } catch (error) {
      setPlayIndex(-1);
    }
  };

  useImperativeHandle(ref, () => ({
    playTextAudio: async () => {
      await playTokens(0, 0);
    },
  }));

  const [tokenType, setTokenType] = useState([0]);

  const subjectItemRefs = useRef([]);
  const itemRefs = useRef([]);

  const scrollToCenter = (index) => {
    const container = document.getElementById("container");
    const element = (tokenType == 0 ? subjectItemRefs : itemRefs).current[
      index
    ];

    if (container && element) {
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const elementHeight = rect.height;

      // Calculate the scroll position to center the item in the container
      const scrollPosition =
        container.scrollTop +
        rect.top -
        containerRect.top -
        containerRect.height / 2 +
        elementHeight / 2;

      container.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }
  };

  const [showAudioSetting, setShowAudioSetting] = useState(false);
  const toggleShowAudioSetting = () => {
    setShowAudioSetting(!showAudioSetting);
  };
  return (
    <Article>
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
            <input type="checkbox" checked={looplay} onChange={()=>setLoopPlay(!looplay)} /> Loop
          </div>
        )}
      </div>
      <Title>
        {subjectTokens.map((token, index) =>
          token.c == "\n" ? (
            <br />
          ) : (
            <Text
              $isActive={tokenType == 0 && playIndex == index}
              onClick={() => playTokens(0, index)}
              key={index}
              ref={(el) => (subjectItemRefs.current[index] = el)}
            >
              {token.c}
            </Text>
          )
        )}
      </Title>
      <Content>
        {tokens.map((token, index) =>
          token.c == "\n" ? (
            <br />
          ) : token.c == " " ? (
            "\u00A0"
          ) : (
            <Text
              $isActive={tokenType == 1 && playIndex == index}
              onClick={() => playTokens(1, index)}
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
            >
              {token.c}
            </Text>
          )
        )}
      </Content>
    </Article>
  );
});

export default AudioText;
