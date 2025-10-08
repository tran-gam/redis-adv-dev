// import mainMenuText from "../content/mainMenuText.js";

import { debugLog, setBackgroundColor } from "../utils/utils.js";
import { loadPlayerData } from "../utils/saveload.js";
import { playerState, gameState } from "../states/stateManager.js";

export default function mainMenu(k) {
  setBackgroundColor("#000000");

  k.add([
    k.text("Redis Adventure", { size: 32, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 100),
  ]);

  k.add([
    k.text("Type Player ID", { size: 24, font: "gameboy" }),
    k.textInput(),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 20),
    "inputId",
  ]);

  k.add([
    k.text("Press Shift+1 to load game", { size: 24, font: "gameboy" }),
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

  k.add([
    k.text("2025 Redis Labs", { size: 16, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.height() - 50),
  ]);

  k.onKeyPress("!", async () => {
    //get player id from text input
    const input = k.get("inputId")[0];

    input.hasFocus = false;

    const playerId = parseInt(input.text);
    if (isNaN(playerId)) {
      debugLog("error", "Invalid Player ID. Please enter a numeric ID.");
      input.hasFocus = true;
      return;
    }

    // load player data from Redis
    const load = await loadPlayerData(playerId);

    if (load) {
      debugLog("log", load);
      k.go("overworld");
    } else {
      debugLog("error", "Unable to load game");
      input.text = "Type Player ID";
      // input.textInput = "";
      input.hasFocus = true;
    }
  });

  k.onKeyPress("enter", () => {
    k.go("overworld");
  });
}
