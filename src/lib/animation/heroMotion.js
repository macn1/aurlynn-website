const heroMotion = {
  // waveform + streak intro progress, 0 → 1
  wave: 0,
  // scroll progress out of the hero, 0 → 1
  scroll: 0,
  // pointer, -1 → 1 (fine pointers only)
  px: 0,
  py: 0,
  // live voice amplitude 0 → 1 (driven by the audio analyser in the voice demo)
  voice: 0
};
export {
  heroMotion
};
