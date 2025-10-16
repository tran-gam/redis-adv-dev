import k from "../kaplayContext.js";

export function playAnimIfNotPlaying(gameObj, animName) {
  if (gameObj.curAnim() !== animName) {
    gameObj.play(animName);

    // if (gameObj.getCurAnim.name !== animName) {
    //   gameObj.play(animName);
  }
}

export function areAnyOfTheseKeysDown(keys) {
  for (const key of keys) {
    if (k.isKeyDown(key)) return true;
  }

  return false;
}

export function setBackgroundColor(hexColor) {
  k.add([k.rect(k.canvas.width, k.canvas.height), k.color(k.Color.fromHex(hexColor)), k.fixed()]);
}

export function processData(map, data, offset) {
  console.log("Processing map data...");
  for (const layer of data.layers) {
    //skip non-object layers
    if (layer.type !== "objectgroup") continue;

    //if collisions layer, generate collisions
    if (layer.name === "collisions") {
      for (const object of layer.objects) {
        map.add(generateCollision(object, offset));
      }
      continue;
    }

    //if entities layer, spawn entities
    if (layer.name === "entities") {
      for (const object of layer.objects) {
        map.add(spawnEntity(object, offset));
      }
      continue;
    }
  }
}

export function generateCollision(collision) {
  if (collision.polygon) {
    const points = collision.polygon.map((point) => k.vec2(point.x, point.y));
    return [
      k.area({ shape: new k.Polygon(points) }),
      k.pos(collision.x, collision.y),
      k.body({ isStatic: true }),
      collision.name,
    ];
  } else {
    return [
      k.area({
        shape: new k.Rect(k.vec2(0), collision.width, collision.height),
      }),
      k.pos(collision.x, collision.y),
      k.body({ isStatic: true }),
      collision.name,
    ];
  }
}

export function generateCollisionWithOffset(collision, offset) {
  if (collision.polygon) {
    const points = collision.polygon.map((point) => k.vec2(point.x, point.y));
    return [
      k.area({ shape: new k.Polygon(points) }),
      k.pos(collision.x + offset.x, collision.y + offset.y),
      k.body({ isStatic: true }),
      collision.name,
    ];
  } else {
    return [
      k.area({
        shape: new k.Rect(k.vec2(0), collision.width, collision.height),
      }),
      k.pos(collision.x + offset.x, collision.y + offset.y),
      k.body({ isStatic: true }),
      collision.name,
    ];
  }
}

export function generateLink(map, text, url, position) {
  const myLink = map.add([
    k.text(text, { size: 16, font: "gameboy" }),
    k.pos(position),
    k.color(255, 255, 255), // Start with white text
    k.area(),
    text + " link",
  ]);

  myLink.onHover(() => {
    // myLink.color = k.rgb(0, 0, 255); // Blue
    myLink.color = k.rgb(255, 68, 56); // Redis Red
    // myLink.textSize = 18;
  });

  myLink.onHoverEnd(() => {
    myLink.color = k.rgb(255, 255, 255); // White
    // myLink.textSize = 16;
  });

  // Open a new tab when the link is clicked
  myLink.onClick(() => {
    window.open(url, "_blank");
  });
}

export function debugLog(verbosity, message) {
  switch (verbosity) {
    case "warn":
      console.warn(message);
      k.debug.log(message);
      break;
    case "error":
      console.error(message);
      k.debug.error(message);
      break;
    default:
      console.log(message);
      k.debug.log(message);
      break;
  }
}

export async function blinkEffect(entity) {
  await k.tween(entity.opacity, 0, 0.1, (val) => (entity.opacity = val), k.easings.linear);
  await k.tween(entity.opacity, 1, 0.1, (val) => (entity.opacity = val), k.easings.linear);
}

export function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

export function randomIntRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + 1);
}
