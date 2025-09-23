import kaplay from "../lib/kaplay.mjs";

const k = kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  global: false,
  debug: true,
});

export default k;
