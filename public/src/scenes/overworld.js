import { playerState } from "../states/stateManager.js";
import {
  generatePlayerComponents,
  setPlayerControls,
} from "../entities/player.js";
import { colorizeBackground, fetchMapData, drawCollisions } from "../utils.js";

export default async function overworld(k) {
  // const previousScene = gameState.getPreviousScene();
  colorizeBackground(k, 71, 171, 169);
  // const mapData = await fetchMapData("./assets/maps/world.json");

  const map = k.add([k.sprite("map"), k.pos(0)]);

  const entities = {
    player: null,
    slimes: [],
  };

  entities.player = map.add(
    generatePlayerComponents(
      k,
      k.vec2(playerState.getPosition().x, playerState.getPosition().y)
    )
    // generatePlayerComponents(k, k.vec2(500, 400))
  );

  // const layers = mapData.layers;
  // for (const layer of layers) {
  //     if (layer.name === "Boundaries") {
  //     drawBoundaries(k, map, layer);
  //     continue;
  //     }

  //     if (layer.name === "SpawnPoints") {
  //     for (const object of layer.objects) {
  //         if (object.name === "player-dungeon" && previousScene === "dungeon") {
  //         entities.player = map.add(
  //             generatePlayerComponents(k, k.vec2(object.x, object.y))
  //         );
  //         continue;
  //         }

  //         if (
  //         object.name === "player" &&
  //         (!previousScene || previousScene === "house")
  //         ) {
  //         entities.player = map.add(
  //             generatePlayerComponents(k, k.vec2(object.x, object.y))
  //         );
  //         continue;
  //         }

  //         if (object.name === "slime") {
  //         entities.slimes.push(
  //             map.add(generateSlimeComponents(k, k.vec2(object.x, object.y)))
  //         );
  //         }
  //     }
  //     continue;
  //     }

  //     drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
  // }

  setPlayerControls(k, entities.player);
  // entities.player.onCollide("door-entrance", () => k.go("house"));
  // entities.player.onCollide("dungeon-door-entrance", () => k.go("dungeon"));

  k.camPos(entities.player.worldPos());
  k.onUpdate(async () => {
    if (entities.player.pos.dist(k.camPos()) > 3) {
      await k.tween(
        k.camPos(),
        entities.player.worldPos(),
        0.15,
        (newPos) => k.camPos(newPos),
        k.easings.linear
      );
    }
  });

  //   for (const slime of entities.slimes) {
  //     setSlimeAI(k, slime);
  //     onAttacked(k, slime);
  //     onCollideWithPlayer(k, slime);
  //   }

  //   healthBar(k);
  //   watchPlayerHealth(k);

  k.camScale(2);
}
