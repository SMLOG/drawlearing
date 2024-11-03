function isASCII(char) {
    // Check if the input is a single character
    if (char.length !== 1) {
        throw new Error("Input must be a single character.");
    }
    // Get the character's Unicode code point
    const code = char.charCodeAt(0);
    // Check if the code point is within the ASCII range
    return code >= 0 && code <= 127;
}