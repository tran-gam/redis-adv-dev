import k from "./kaplayContext.js";
import overworld from "./scenes/overworld.js";
import mainMenu from "./scenes/mainMenu.js";
import cave from "./scenes/cave.js";
import castle from "./scenes/castle.js";
import home from "./scenes/playerHome.js";

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
