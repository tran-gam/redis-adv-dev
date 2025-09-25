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

export async function fetchMapData(mapPath) {
  return await (await fetch(mapPath)).json();
}

export function generateCollision(map, collisionData, position, scale) {
  for (const layer of collisionData.layers) {
    if (layer.type !== "objectgroup") continue;

    for (const object of layer.objects) {
      if (object.polygon) {
        const points = object.polygon.map((point) => k.vec2(point.x, point.y));
        map.add([
          k.area({ shape: new k.Polygon(points) }),
          k.scale(scale),
          k.pos((object.x + position.x) * scale, (object.y + position.y) * scale),
          k.body({ isStatic: true }),
          object.name,
        ]);

        continue;
      } else {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), object.width, object.height),
          }),
          k.scale(scale),
          k.pos((object.x + position.x) * scale, (object.y + position.y) * scale),
          k.body({ isStatic: true }),
          object.name,
        ]);
      }
    }
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

export async function blinkEffect(k, entity) {
  await k.tween(entity.opacity, 0, 0.1, (val) => (entity.opacity = val), k.easings.linear);
  await k.tween(entity.opacity, 1, 0.1, (val) => (entity.opacity = val), k.easings.linear);
}

export function onAttacked(k, entity) {
  entity.onCollide("swordHitBox", async () => {
    if (entity.isAttacking) return;

    if (entity.hp() <= 0) {
      k.destroy(entity);
    }

    await blinkEffect(k, entity);
    entity.hurt(1);
  });
}

export function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}
