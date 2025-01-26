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
  display: inline-block;
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
  const { playAudio, getTextAudioUrl,looplay } = useAudio();
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

      if (type == 1) {
        if (looplay) await playTokens(type == 0 ? 1 : 0, 0);
        else items && (await items[myIndex + 1]?.current?.playTextAudio());
      } else await playTokens(type == 0 ? 1 : 0, 0);
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

  return (
    <Article>
      <Title>
        {subjectTokens.map((token, index) =>
          token.c == "\n" ? (
            <br  key={index} />
          ) : token.c == " " ? (
            "\u00A0"
          ): (
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
            <br  key={index} />
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
