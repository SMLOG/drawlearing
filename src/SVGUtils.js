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
// Example usage
//const svgPath = "M 88 83 L 79 85 Q 73 86.5 67 88 Q 61 89 55 90";
//const jsonData = parseSVGPath(svgPath);
//console.log(JSON.stringify(jsonData, null, 2));