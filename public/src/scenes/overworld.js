import { setBackgroundColor, generateLink, generateCollision } from "../utils/utils.js";
import { fetchData } from "../utils/saveload.js";
import { playerTopDown } from "../entities/player.js";
import { playerState, gameState } from "../states/stateManager.js";

export default async function overworld(k) {
  setBackgroundColor("#47ABA9");

  //fetch map data
  const overworldData = await fetchData("./assets/data/protoIsland.json");
  const collisions = overworldData.layers.find((layer) => layer.name === "collisions").objects;

  //render base map layer and collisions
  const map = k.add([k.sprite("protoIsland"), k.pos(0)]);
  for (const col of collisions) map.add(generateCollision(col));

  generateLink(map, "redis.io", "https://redis.io", k.vec2(1000, 400));
  generateLink(map, "Try Redis", "https://redis.io/try-free/", k.vec2(1000, 425));

  //interactions
  //add interaction to single object
  // map.get("cave")[0].on("onInteract", () => {
  //   console.log("Interacted with cave");
  //   k.go("cave");
  // });

  //add interaction to all objects with same tag (e.g. castle)
  k.on("onInteract", "castle-door", () => {
    console.log("Interacted with castle door");
    // k.go("castle");
  });

  //spawn player
  const player = k.add(playerTopDown());
  player.setControls();

  //spawn enemies

  //render top map layer
  map.add = k.add([k.sprite("protoIsland1"), k.pos(0)]);

  //render UI
  //   healthBar(k);

  //scene transitions
  player.onCollide("cave", () => k.go("cave"));
  // player.onCollide("castle-door", () => k.go("castle"));

  //camera follow player
  k.setCamPos(player.worldPos());
  k.onUpdate(async () => {
    // k.setCamPos(player.worldPos());

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

  k.setCamScale(1.5);
}
