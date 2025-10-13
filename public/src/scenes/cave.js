import { setBackgroundColor, generateCollision, clamp } from "../utils/utils.js";
import { fetchData } from "../utils/saveload.js";
import { playerState, gameState } from "../states/stateManager.js";
import { playerSideScrolling } from "../entities/player.js";
import { spawnDebugEntity } from "../entities/debug.js";

export default async function cave(k) {
  setBackgroundColor("#313131");

  const caveData = await fetchData("./assets/data/cave.json");
  const collisions = caveData.layers.find((layer) => layer.name === "collisions").objects;
  const entities = caveData.layers.find((layer) => layer.name === "entities").objects;

  //render base map layer and collisions
  const map = k.add([k.sprite("cave"), k.pos(0, 32), k.scale(2)]);
  for (const col of collisions) map.add(generateCollision(col));

  //interactions

  //spawn player
  playerState.set("position", { x: 200, y: 700 });
  const player = k.add(playerSideScrolling());
  player.setControls();

  //spawn enemies
  for (const ent of entities) {
    const entity = map.add(spawnDebugEntity(k, ent));
    console.log("Spawned entity at: ", ent.x, ent.y);
    entity.setEvents();
    entity.setBehavior();
  }

  //render top map layer

  //render UI

  //scene transitions
  player.onCollide("exit", () => {
    k.setGravity(0);
    playerState.set("position", { x: 1625, y: 200 });
    k.go("overworld");
  });

  //camera follow player
  k.setCamPos(player.worldPos());
  k.onUpdate(async () => {
    // k.setCamPos(player.worldPos());

    //tween camera to player position with clamp on y axis
    // if (player.pos.dist(k.getCamPos()) > 3) {
    //   await k.tween(
    //     k.getCamPos(),
    //     k.vec2(player.worldPos().x, clamp(player.worldPos().y, 350, 450)),
    //     0.15,
    //     (newPos) => k.setCamPos(newPos),
    //     k.easings.linear
    //   );
    // }

    //tween camera to player position
    if (player.pos.dist(k.getCamPos()) > 3) {
      await k.tween(
        k.getCamPos(),
        player.worldPos(),
        0.15,
        (newPos) => k.setCamPos(newPos),
        k.easings.linear
      );
    }

    // console.log("FPS: " + k.debug.fps());
  });

  // k.setCamScale(2);
  k.setGravity(1000);

  //level title, disappears after 5 seconds
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
