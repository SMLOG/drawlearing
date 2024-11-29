import React, { useEffect } from 'react';
import './PrintSheet.css'; // Import the updated CSS styles

const PrintSheet = () => {
    useEffect(() => {
        drawTextWithGuidelines();
    }, []);

    const calculateTextMetrics = (character, font) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = font;

        const metrics = context.measureText(character);
        return {
            ascent: metrics.actualBoundingBoxAscent,
            descent: metrics.actualBoundingBoxDescent,
        };
    };

    const drawTextWithGuidelines = () => {
       // const words = [ "hair", "arm"];
        const data = JSON.parse(localStorage.getItem('printData'));
        const words = data.map(e=>e.word);
        const fontSize = 40; 
        const font = `${fontSize}px 'Patrick Hand'`;
        const lineHeight = fontSize * 1.2;

        const svg = document.getElementById('text-svg');
        const topMargin = 40;
        const sideMargin = 40;
        const maxHeight = 1123 - topMargin;
        const maxLines = Math.floor(maxHeight / lineHeight);

        const metricsA = calculateTextMetrics("A", font);
        const limitedWords = words.slice(0, maxLines);

        limitedWords.forEach((word, index) => {
            const baseline = topMargin + (index * lineHeight) + metricsA.ascent;
            const meanLine = baseline - (metricsA.ascent + metricsA.descent) / 2;
            const capLine = baseline - metricsA.ascent;

            const baselineLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            baselineLine.setAttribute("x1", sideMargin);
            baselineLine.setAttribute("y1", baseline);
            baselineLine.setAttribute("x2", 794 - sideMargin);
            baselineLine.setAttribute("y2", baseline);
            baselineLine.setAttribute("class", "guideline");

            const meanLineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
            meanLineElement.setAttribute("x1", sideMargin);
            meanLineElement.setAttribute("y1", meanLine);
            meanLineElement.setAttribute("x2", 794 - sideMargin);
            meanLineElement.setAttribute("y2", meanLine);
            meanLineElement.setAttribute("class", "guideline dashed");

            const capLineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
            capLineElement.setAttribute("x1", sideMargin);
            capLineElement.setAttribute("y1", capLine);
            capLineElement.setAttribute("x2", 794 - sideMargin);
            capLineElement.setAttribute("y2", capLine);
            capLineElement.setAttribute("class", "guideline");

            svg.appendChild(baselineLine);
            svg.appendChild(meanLineElement);
            svg.appendChild(capLineElement);

            const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
            textElement.setAttribute("x", sideMargin + 10);
            textElement.setAttribute("y", baseline);
            textElement.setAttribute("class", "handwriting");
            textElement.textContent = `${index + 1}. ${word}`;
            svg.appendChild(textElement);
        });
    };

    return (
        <div className="print-area">
            <svg id="text-svg" width="794px" height="1123px" viewBox="0 0 794 1123" xmlns="http://www.w3.org/2000/svg">
                {/* Text will be added here dynamically */}
            </svg>
        </div>
    );
};

export default PrintSheet;
