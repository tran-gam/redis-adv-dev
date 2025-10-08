import { setBackgroundColor, generateCollision, generateLink } from "../utils/utils.js";
import { fetchData } from "../utils/saveload.js";
import { playerTopDown, setControlsTopDown } from "../entities/player.js";
import { playerState, gameState } from "../states/stateManager.js";

export default async function overworld(k) {
  setBackgroundColor("#47ABA9");

  //fetch map data
  const collisionData = await fetchData("./assets/data/protoIsland.json");

  //render base map layer and collisions
  const map = k.add([k.sprite("protoIsland"), k.pos(0)]);
  generateCollision(map, collisionData, k.vec2(0, 0), 1);
  generateLink(map, "redis.io", "https://redis.io", k.vec2(1000, 400));
  generateLink(map, "Try Redis", "https://redis.io/try-free/", k.vec2(1000, 425));

  //add interactions
  //add interaction to single object
  // map.get("cave")[0].on("onInteract", () => {
  //   console.log("Interacted with cave");
  //   k.go("cave");
  // });

  //add interaction to all objects with same tag (e.g. castle)
  k.on("onInteract", "castle", () => {
    console.log("Interacted with castle");
    // k.go("castle");
  });

  const entities = {
    player: null,
    slimes: [],
  };

  //spawn player
  entities.player = k.add(playerTopDown(k));
  setControlsTopDown(k, entities.player);

  //spawn enemies
  // const enemySpawnPoints = k.get("enemy");
  // for (const enemySpawnPoint of enemySpawnPoints) {
  //   k.add([
  //     k.sprite("spritesheet", { frame: 35 }),
  //     k.area({ shape: new k.Rect(k.vec2(0, 7), 16, 16) }),
  //     k.anchor("center"),
  //     k.scale(2),
  //     k.pos(enemySpawnPoint.pos),
  //     k.body(),
  //   ]);
  // }

  //   for (const slime of entities.slimes) {
  //     setSlimeAI(k, slime);
  //     onAttacked(k, slime);
  //     onCollideWithPlayer(k, slime);
  //   }

  //render top map layer
  map.add = k.add([k.sprite("protoIsland1"), k.pos(0)]);

  //render UI
  //   healthBar(k);
  //   watchPlayerHealth(k);

  //scene transitions
  entities.player.onCollide("cave", () => k.go("cave"));
  // entities.player.onCollide("door-entrance", () => k.go("house"));
  // entities.player.onCollide("dungeon-door-entrance", () => k.go("dungeon"));

  //camera follow player
  k.setCamPos(entities.player.worldPos());
  k.onUpdate(async () => {
    // k.setCamPos(entities.player.pos, k.getCamPos());
    // console.log("FPS: " + k.debug.fps());
    if (entities.player.pos.dist(k.getCamPos()) > 3) {
      await k.tween(
        k.getCamPos(),
        entities.player.worldPos(),
        0.15,
        (newPos) => k.setCamPos(newPos),
        k.easings.linear
      );
    }
  });

  // k.setCamScale(1);
}
