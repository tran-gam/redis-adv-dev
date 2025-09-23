import { setBackgroundColor, fetchMapData, generateCollision } from "../utils/utils.js";
import { generatePlayerComponents, setPlayerControls } from "../entities/player.js";
import { playerState } from "../states/stateManager.js";

export default async function cave(k) {
  setBackgroundColor("#000000");

  // k.add([
  //   k.text("Lair of Latency (Goblins)", { size: 32, font: "gameboy" }),
  //   k.area(),
  //   k.anchor("center"),
  //   k.pos(k.center().x, k.center().y - 100),
  // ]);

  const collisionData = await fetchMapData("./assets/data/caveCollision.json");

  //render base map layer and collisions
  const map = k.add([k.sprite("cave"), k.pos(0, 0), k.scale(2)]);
  generateCollision(map, collisionData, k.vec2(0, -32), 1);

  const entities = {
    player: null,
    slimes: [],
  };

  //spawn player
  playerState.setPosition(200, 700);
  entities.player = k.add(generatePlayerComponents(k));
  setPlayerControls(k, entities.player);

  //camera follow player
  k.setCamPos(entities.player.worldPos());
  k.onUpdate(async () => {
    // k.setCamPos(entities.player.pos, k.getCamPos());
    // console.log("FPS: " + k.debug.fps());
    if (entities.player.pos.dist(k.getCamPos()) > 3) {
      await k.tween(k.getCamPos(), entities.player.worldPos(), 0.15, (newPos) => k.setCamPos(newPos), k.easings.linear);
    }
  });

  k.setCamScale(1);
  k.setGravity(1000);
}
