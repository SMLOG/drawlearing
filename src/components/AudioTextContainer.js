import React, { useRef,useEffect } from "react";
import AudioText from "./AudioText";

const AudioTextContainer = ({ children }) => {
  const childRefs = useRef([]);
  const indexRef = useRef(0);

  const playTextAudioSequentially = async () => {
    for (const ref of childRefs.current) {
      if (ref) {
        await ref.playTextAudio(); // Call the playTextAudio method
      }
    }
  };

  useEffect(() => {
    childRefs.current = []; // Reset refs
    indexRef.current=0;
}, [children]); // Dependency array includes children

// This function will collect refs and render children
const renderChildren = (childrenArray) => {
    // First pass: collect refs
    const childrenWithRefs = React.Children.map(childrenArray, (child) => {
        if (React.isValidElement(child)) {
            if (child.type === AudioText) {
                const currentRef = React.createRef();
                childRefs.current.push(currentRef); // Store the ref
                return React.cloneElement(child, { ref: currentRef });
            }

            // Recursively handle children
            return React.cloneElement(child, {
                children: renderChildren(child.props.children),
            });
        }
        return child; // Return as is if it's not a valid element
    });
    // Second pass: assign nextChildRef
    return React.Children.map(childrenWithRefs, (child, index) => {
        if (React.isValidElement(child) && child.type === AudioText) {
            let myIndex=indexRef.current++;
            let items=childRefs.current;
            return React.cloneElement(child, {items ,myIndex });
        }
        return child; // Return child as is
    });
};

  return <>{renderChildren(children)}</>;
};

export default AudioTextContainer;
