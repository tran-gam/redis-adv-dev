import kaplay from "../lib/kaplay.mjs";

const k = kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  global: false, //Optimization: avoid global namespace
  debug: true,
});

//load assets
k.loadFont("gameboy", "assets/PressStart2P.ttf");
k.loadSprite("map", "assets/maps/map.png");
k.loadSprite("protoIsland", "assets/maps/protoIsland.png");
k.loadSprite("protoIsland1", "assets/maps/protoIsland1.png");
k.loadSprite("cave", "assets/maps/cave.png");
k.loadSprite("player", "assets/player.png", {
  sliceX: 6,
  sliceY: 12,
  anims: {
    "idle-side": { from: 0, to: 5, speed: 10, loop: true },
    "idle-down": { from: 6, to: 11, speed: 10, loop: true },
    "idle-up": { from: 12, to: 17, speed: 10, loop: true },
    "run-side": { from: 18, to: 23, speed: 10, loop: true },
    "run-down": { from: 24, to: 29, speed: 10, loop: true },
    "run-up": { from: 30, to: 35, speed: 10, loop: true },
    "attack1-side": { from: 36, to: 41, speed: 15, loop: false },
    "attack2-side": { from: 42, to: 47, speed: 15, loop: false },
    "attack1-down": { from: 48, to: 53, speed: 15, loop: false },
    "attack2-down": { from: 54, to: 59, speed: 15, loop: false },
    "attack1-up": { from: 60, to: 65, speed: 15, loop: false },
    "attack2-up": { from: 66, to: 71, speed: 15, loop: false },
    "jump": 18,
    "fall": 38,
  },
});

export default k;
