import React from 'react';
import LettersSvg from './LettersSvg'; // Ensure this is a valid component
import SvgEditPlayer from "./SvgEdit2/SvgPlayer"; // Ensure this is a valid component

const SvgEditorWrap = () => {
    return (
        <div style={{ position: 'absolute', inset: 0 }}>
            <LettersSvg />
            <SvgEditPlayer />
        </div>
    );
};

export default SvgEditorWrap;