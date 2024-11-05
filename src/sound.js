export function playSound(url,loop) {
  const audio = new Audio(url);
  audio.loop=loop;
  audio.play().catch((error) => {
    console.error("Error playing audio:", error);
  });
  return audio;
}
