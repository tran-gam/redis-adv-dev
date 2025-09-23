// import mainMenuText from "../content/mainMenuText.js";
// import { gameState } from "../state/stateManagers.js";
import { playerState } from "../states/stateManager.js";
import { setBackgroundColor } from "../utils/utils.js";
import { loadPlayerData } from "../utils/saveload.js";

export default function mainMenu(k) {
  setBackgroundColor("#000000");

  k.add([
    k.text("Redis Adventure", { size: 32, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 100),
  ]);

  k.add([
    k.text("Press F to load game", { size: 24, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 100),
  ]);

  k.add([
    k.text("Press Enter for new game", { size: 24, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 150),
  ]);

  k.onKeyPress("f", async () => {
    // gameState.loadFromRedis();
    const data = await loadPlayerData("12345");
    console.log("Player data loaded:", data.documents[0].value.x + ", " + data.documents[0].value.y);

    playerState.setPosition(data.documents[0].value.x, data.documents[0].value.y);

    k.go("overworld");
  });

  //load map data before going to overworld scene
  // let mapData;
  // k.scene("loading", async () => {
  //   k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0)]);
  //   k.add([
  //     k.text("Loading...", { size: 32, font: "gameboy" }),
  //     k.pos(k.center().x, k.center().y),
  //     k.anchor("center"),
  //   ]);

  //   const mapResponse = await fetch("assets/data/protoIsland.json");
  //   mapData = await mapResponse.json();

  //   k.go("oveworld", { mapData });
  // });

  k.onKeyPress("enter", () => {
    k.go("overworld");
  });
}
