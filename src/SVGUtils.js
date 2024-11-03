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

export  function pointsSmooth  (list) {
    var returnVal = new Array();
    var prevX = -1;
    var prevY = -1;
    var prevSize = -1;
    for (var loop = 0; loop < list.length; loop++) {
      if (prevX == -1) {
        prevX = list[loop][0];
        prevY = list[loop][1];
        prevSize = list[loop][2] || 0;
      } else {
        var dx = list[loop][0] - prevX;
        var dy = list[loop][1] - prevY;
        var dSize = list[loop][2] || 0 - prevSize;
        for (var adLoop = 0; adLoop < 10; adLoop++) {
          var addX = prevX + (dx / 10) * adLoop;
          var addY = prevY + (dy / 10) * adLoop;
          var addSize = prevSize + (dSize / 10) * adLoop;
          returnVal.push([addX, addY, addSize]);
        }
        prevX = list[loop][0];
        prevY = list[loop][1];
        prevSize = list[loop][2] || 0;
      }
    }
    return returnVal;
  };
// Example usage
//const svgPath = "M 88 83 L 79 85 Q 73 86.5 67 88 Q 61 89 55 90";
//const jsonData = parseSVGPath(svgPath);
//console.log(JSON.stringify(jsonData, null, 2));