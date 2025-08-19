// import mainMenuText from "../content/mainMenuText.js";
// import { gameState } from "../state/stateManagers.js";
import { playerState } from "../states/stateManager.js";
import { fetchPlayerData, colorizeBackground } from "../utils.js";

export default function mainMenu(k) {
  colorizeBackground(k, "black");

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

  k.onKeyPress("f", () => {
    // gameState.loadFromRedis();
    fetchPlayerData("12345")
      .then((data) => {
        console.log(
          "Player data loaded:",
          data.documents[0].value.x + ", " + data.documents[0].value.y
        );
        playerState.setPosition(
          data.documents[0].value.x,
          data.documents[0].value.y
        );
        k.go("overworld");
      })
      .catch((error) => {
        console.error("Error loading player data:", error);
      });
  });

  k.onKeyPress("enter", () => {
    k.go("overworld");
  });
}
