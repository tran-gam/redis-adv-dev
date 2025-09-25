import { setBackgroundColor, fetchMapData, generateCollision } from "../utils/utils.js";
import { playerSideScrolling, setControlsSideScrolling } from "../entities/player.js";
import { playerState } from "../states/stateManager.js";
import { clamp } from "../utils/utils.js";

export default async function cave(k) {
  setBackgroundColor("#313131");

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
  entities.player = k.add(playerSideScrolling(k));
  setControlsSideScrolling(k, entities.player);

  entities.player.onCollide("exit", () => {
    k.setGravity(0);
    playerState.setPosition(1625, 200);
    k.go("overworld");
  });

  //camera follow player
  k.setCamPos(entities.player.worldPos());
  k.onUpdate(async () => {
    // k.setCamPos(entities.player.pos, k.getCamPos());
    // console.log("FPS: " + k.debug.fps());
    if (entities.player.pos.dist(k.getCamPos()) > 3) {
      await k.tween(
        k.getCamPos(),
        k.vec2(entities.player.worldPos().x, clamp(entities.player.worldPos().y, 350, 450)),
        0.15,
        (newPos) => k.setCamPos(newPos),
        k.easings.linear
      );
    }
  });

  k.setCamScale(1);
  k.setGravity(1000);

  k.add([
    k.text("Lair\nof\nLatency\n(Goblins)", { size: 28, font: "gameboy", align: "center" }),
    // k.area(),
    // k.anchor("center"),
    k.pos(-300, 500),
    "title",
  ]);

  k.wait(5, () => {
    k.destroy(k.get("title")[0]);
  });
}
