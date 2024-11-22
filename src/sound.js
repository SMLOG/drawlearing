const audio = new Audio();

export function playSound(url,loop) {
  audio.loop=loop;
  audio.src= url;
  audio.play().catch((error) => {
    console.error("Error playing audio:", error);
  });
  return audio;
}
