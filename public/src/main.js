import k from "./kaplayContext.js";
import overworld from "./scenes/overworld.js";
import mainMenu from "./scenes/mainMenu.js";
import cave from "./scenes/cave.js";
import castle from "./scenes/castle.js";
import home from "./scenes/home.js";

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
    "attack1-side": { from: 36, to: 41, speed: 10, loop: false },
    "attack2-side": { from: 42, to: 47, speed: 10, loop: false },
    "attack1-down": { from: 48, to: 53, speed: 10, loop: false },
    "attack2-down": { from: 54, to: 59, speed: 10, loop: false },
    "attack1-up": { from: 60, to: 65, speed: 10, loop: false },
    "attack2-up": { from: 66, to: 71, speed: 10, loop: false },
  },
});

//create scenes
const scenes = {
  mainMenu,
  overworld,
  cave,
  castle,
  home,
  //   house,
  //   dungeon,
};
for (const sceneName in scenes) {
  k.scene(sceneName, () => scenes[sceneName](k));
}

k.go("mainMenu");
