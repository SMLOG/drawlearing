import { svgPathProperties } from "svg-path-properties";

export function parseSVGPath(path) {
    const commands = path.match(/[a-zA-Z][^a-zA-Z]*/g);
    const points = [];

    commands.forEach(command => {
        const type = command[0];
        const params = command.slice(1).trim().split(/[\s,]+/).map(Number);
        
        switch (type) {
            case 'M':
            case 'L':
                for (let i = 0; i < params.length; i += 2) {
                    points.push({
                        x: params[i],
                        y: params[i + 1],
                        command: type,
                        params: [params[i], params[i + 1]]
                    });
                }
                break;
            case 'Q':
                for (let i = 0; i < params.length; i += 4) {
                    points.push({
                        x: params[i + 2],
                        y: params[i + 3],
                        command: type,
                        params: [params[i], params[i + 1], params[i + 2], params[i + 3]]
                    });
                }
                break;
            // Add more cases for other commands (e.g., C, Z, etc.) as needed
            default:
                console.warn(`Unsupported command: ${type}`);
        }
    });

    return { points };
}

export function translateAndScaleSvgPath(pathData, dx, dy, scaleX, scaleY) {
    return pathData.replace(/([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/g, (match, command, coords) => {
        const transformedCoords = coords.trim().split(/[\s,]+/).map((num, index) => {
            num = parseFloat(num);
            if (index % 2 === 0) { // x-coordinate
                return (num * scaleX) + dx;
            } else { // y-coordinate
                return (num * scaleY) + dy;
            }
        });
        return command + transformedCoords.join(' ');
    });
}

export function scaleStroke(stroke,scaleFactor,pointFactor)  {
    stroke.d=stroke.d.replace(/([MLHVCSQTAZ])|(-?\d+(\.\d+)?)/g, (match, command, number) => {
      if (number) {
        return ((number) * scaleFactor).toFixed(2); // Scale each number
      }
      return command; 
    });
    stroke.track=stroke.ps.map(p=>[parseFloat(p[0])*scaleFactor,parseFloat(p[1])*scaleFactor,120*pointFactor]);
    
    return stroke;
  };
export  function pointsSmooth  (list) {
    var returnVal = new Array();
    var prevX = -1;
    var prevY = -1;
    var prevSize = -1;
    for (var loop = 0; loop < list.length; loop++) {
      if (prevX == -1) {
        prevX = list[loop][0];
        prevY = list[loop][1];
        prevSize = list[loop][2]/2 || 0;
        returnVal.push([prevX, prevY, prevSize])
      } else {
        var dx = list[loop][0] - prevX;
        var dy = list[loop][1] - prevY;
        for (var adLoop = 0; adLoop < 8; adLoop++) {
          var addX = prevX + (dx / 8) * adLoop;
          var addY = prevY + (dy / 8) * adLoop;
          var addSize = prevSize;
          returnVal.push([addX, addY, addSize]);
        }
        prevX = list[loop][0];
        prevY = list[loop][1];
        prevSize = list[loop][2]/2 || 0;
        returnVal.push([prevX, prevY, prevSize])

      }
    }
    return returnVal;
  };
// Example usage
//const svgPath = "M 88 83 L 79 85 Q 73 86.5 67 88 Q 61 89 55 90";
//const jsonData = parseSVGPath(svgPath);
//console.log(JSON.stringify(jsonData, null, 2));

export function scaleSvgPath(path, scaleFactor) {
  return path.replace(/([MLZCQUHSVA])([^MLZCQUHSVA]*)/g, (match, command, coords) => {
      const scaledCoords = coords.trim().split(/[\s,]+/).map(num => {
          return (parseFloat(num) * scaleFactor).toFixed(6); // Scale and format to 6 decimal places
      }).join(' ');
      return command + ' ' + scaledCoords;
  });
}

export function getPointsOnPath(svgPath, minRadius,scaleFactor) {
  const path = scaleSvgPath(svgPath,scaleFactor);
  const pathProperties = new svgPathProperties(path);
  const length = pathProperties.getTotalLength();
  const points = [];
  
  // Start from the beginning of the path
  let currentLength = 0;

  while (currentLength <= length) {
    const point = pathProperties.getPointAtLength(currentLength);
    points.push({ x: point.x, y: point.y,r:minRadius });
    // Move to the next point based on minRadius
    currentLength += minRadius;
  }

  // Handle the case where the last point might be added beyond the path length
  if (currentLength - minRadius < length) {
    const point = pathProperties.getPointAtLength(length);
    points.push({ x: point.x, y: point.y,r:minRadius });
  }

  return points;
}