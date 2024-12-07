import React, { useRef, useEffect } from "react";
import AudioText from "./AudioText";

const AudioTextContainer = ({ children }) => {
    const childRefs = useRef([]);
    
    // Reset refs when children change
    useEffect(() => {
        childRefs.current = []; // Reset refs
    }, [children]);

    // This function will collect refs and render children
    const renderChildren = (childrenArray) => {
        return React.Children.map(childrenArray, (child) => {
            if (React.isValidElement(child)) {
                // Collect refs for AudioText components
                if (child.type === AudioText) {
                    const currentRef = React.createRef();
                    childRefs.current.push(currentRef); // Store the ref
                    
                    // Calculate the index based on the current length
                    const index = childRefs.current.length - 1;
                    return React.cloneElement(child, { ref: currentRef, myIndex: index, items: childRefs.current });
                }

                // Recursively handle nested children
                return React.cloneElement(child, {
                    children: renderChildren(child.props.children),
                });
            }
            return child; // Return as is if it's not a valid element
        });
    };

    return <>{renderChildren(children)}</>;
};

export default AudioTextContainer;