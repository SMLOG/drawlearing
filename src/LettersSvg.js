import React, { useState, useEffect } from 'react';

const LettersSvg = () => {
    const [svgs, setSvgs] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {

       let widths=  {"A":33.35416793823242,"a":27.8125,"B":33.35416793823242,"b":27.8125,"C":36.114585876464844,"c":25,"D":36.114585876464844,"d":27.8125,"E":33.35416793823242,"e":27.8125,"F":30.55208396911621,"f":13.895833969116211,"G":38.895835876464844,"g":27.8125,"H":36.114585876464844,"h":27.8125,"I":13.895833969116211,"i":11.114583969116211,"J":25,"j":11.114583969116211,"K":33.35416793823242,"k":25,"L":27.8125,"l":11.114583969116211,"M":41.65625,"m":41.65625,"N":36.114585876464844,"n":27.8125,"O":38.895835876464844,"o":27.8125,"P":33.35416793823242,"p":27.8125,"Q":38.895835876464844,"q":27.8125,"R":36.114585876464844,"r":16.65625,"S":33.35416793823242,"s":25,"T":30.55208396911621,"t":13.895833969116211,"U":36.114585876464844,"u":27.8125,"V":33.35416793823242,"v":25,"W":47.19791793823242,"w":36.114585876464844,"X":33.35416793823242,"x":25,"Y":33.35416793823242,"y":25,"Z":30.55208396911621,"z":25}

       const svgPaths = [];
       const upperLetters = 'ABC';//'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
       const lowerLetters = 'abc';//'abcdefghijklmnopqrstuvwxyz';
   
       for (let i = 0; i < upperLetters.length; i++) {
           svgPaths.push([upperLetters[i],`/letters/${upperLetters[i]}.svg`]);
           svgPaths.push([lowerLetters[i],`/letters/${lowerLetters[i]}1.svg`]);
       }
       
        const fetchSvgs = async () => {
            const svgData = await Promise.all(
                svgPaths.map(async (path) => {
                    const response = await fetch(path[1]);
                    if (response.ok) {
                        return (await response.text()).replace(/(viewBox="0) .*? (.*?")/,"$1 0 "+widths[path[0]]+" 56\" ").replace('<svg ','<svg height="112px" width="'+(2*widths[path[0]])+'px" ');
                    } else {
                        return null; // Handle error case
                    }
                })
            );
            setSvgs(svgData.filter(Boolean)); // Filter out null responses
            setLoading(false);
        };

        fetchSvgs();
    }, []);

    if (loading) {
        return <div>Loading SVGs...</div>;
    }

    return (
        <div style={{position:'absolute',top:'0',top:'50%',left:'50%',transform:'translate(-50%, -50%)',zIndex:-1,border:'1px solid red'}}>
            <div className="svg-container" style={{display:'flex'}} dangerouslySetInnerHTML={{ __html: svgs.join('') }} >
            </div>
        </div>
    );
};

export default LettersSvg;
