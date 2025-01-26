export function tokenize(str) {
    const words = [];
    let currentWord = '';

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        // Check if the character is a letter or apostrophe
        if (/[a-zA-Z0-9']/.test(char)) {
            currentWord += char; // Build the current word
        } else {
            // If we have a current word, push it to the words array
            if (currentWord) {
                words.push({c:currentWord,t:'en'});
                currentWord = ''; // Reset for the next word
            }
            // If the character is not a space, add it to symbols
            if(/[\u4e00-\u9fa5]/.test(char)){
                words.push({c:char,t:'cn'});
            }else if ( !/[a-zA-Z']/.test(char)) {
                words.push({c:char,t:''});
            }
        }
    }

    // If there's a word left at the end, push it to the words array
    if (currentWord) {
        words.push({c:currentWord,t:'en'});
    }

    return words;
}