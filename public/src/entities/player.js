import { gameState, playerState } from "../states/stateManager.js";
import { areAnyOfTheseKeysDown, playAnimIfNotPlaying, debugLog } from "../utils/utils.js";
import { savePlayerData } from "../utils/saveload.js";

export function playerTopDown(k) {
  //generate player with top down components
  return [
    k.sprite("player", {
      anim: "idle-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(0, 20), 50, 35) }),
    k.body(),
    k.pos(playerState.get().position.x, playerState.get().position.y),
    k.opacity(),
    k.scale(0.75),
    k.anchor("center"),
    k.health(playerState.get().health),
    {
      speed: 200,
      attackPower: 1,
      attackCombo: 1,
      attackComboMax: 2,
      direction: "down",
      isAttacking: false,
      isFrozen: false,
    },
    "player",
  ];
}

export function setControlsTopDown(k, player) {
  //movement
  k.onKeyDown((key) => {
    if (player.isFrozen || player.isAttacking) return;

    if (["up"].includes(key)) {
      if (areAnyOfTheseKeysDown(["left", "right"])) return;
      playAnimIfNotPlaying(player, "run-up");
      player.move(0, -player.speed);
      player.direction = "up";
      return;
    }

    if (["down"].includes(key)) {
      if (areAnyOfTheseKeysDown(["left", "right"])) return;
      playAnimIfNotPlaying(player, "run-down");
      player.move(0, player.speed);
      player.direction = "down";
      return;
    }

    if (["left"].includes(key)) {
      player.flipX = true;
      playAnimIfNotPlaying(player, "run-side");
      player.move(-player.speed, 0);
      player.direction = "side";
      return;
    }

    if (["right"].includes(key)) {
      player.flipX = false;
      playAnimIfNotPlaying(player, "run-side");
      player.move(player.speed, 0);
      player.direction = "side";
      return;
    }
  });

  //return to idle
  k.onKeyRelease((key) => {
    if (player.isFrozen || player.isAttacking) return;
    playAnimIfNotPlaying(player, `idle-${player.direction}`);
  });

  //save
  k.onKeyPress("!", async () => {
    playerState.set("position", { x: player.worldPos().x, y: player.worldPos().y });
    const save = await savePlayerData();
    if (save) debugLog("log", save);
  });

  //jump
  // k.onKeyPress("space", () => {
  //   if (player.isFrozen || player.isAttacking) return;

  //   player.doubleJump();
  // });

  //interact
  k.onKeyPress("z", () => {
    if (player.getCollisions().length === 0) return;
    k.debug.log("Interacted with " + player.getCollisions()[0].target.tags[1]);
    player.getCollisions()[0].target.trigger("onInteract");
  });

  //attack
  k.onKeyPress("x", () => {
    if (player.isFrozen || player.isAttacking) return;
    player.isAttacking = true;

    switch (player.direction) {
      case "up":
        player.add([
          k.pos(),
          k.area({ shape: new k.Rect(k.vec2(-5, -70), 10, 40) }),
          "swordHitbox",
        ]);
        break;
      case "down":
        player.add([k.pos(), k.area({ shape: new k.Rect(k.vec2(-5, 45), 10, 30) }), "swordHitbox"]);
        break;
      default:
        player.add([
          k.pos(),
          k.area({ shape: new k.Rect(k.vec2(player.flipX ? -70 : 30, 0), 40, 10) }),
          "swordHitbox",
        ]);
        break;
    }

    player.play(`attack${player.attackCombo}-${player.direction}`);
    // playAnimIfNotPlaying(player, `attack${player.attackCombo}-${player.direction}`);

    // increment attack combo or reset to 1 if at max
    player.attackCombo = player.attackCombo < player.attackComboMax ? player.attackCombo + 1 : 1;
  });

  //on animation end
  player.onAnimEnd((anim) => {
    if (anim.substring(0, 6) === "attack") {
      console.log("Attack animation ended");
      if (player.get("swordHitbox")[0]) k.destroy(player.get("swordHitbox")[0]);
      player.isAttacking = false;
      playAnimIfNotPlaying(player, `idle-${player.direction}`);
    }
  });

  //debug
  k.onKeyPress("p", () => {
    let state = playerState.get();
    debugLog("log", "playerState:\n" + JSON.stringify(state, null, 2));

    k.setCamPos(player.worldPos());
  });
}

// side scrolling player setup\\
//
//

export function playerSideScrolling(k) {
  //generate player with side scrolling components
  return [
    k.sprite("player", {
      anim: "idle-side",
    }),
    k.area({ shape: new k.Rect(k.vec2(0, 0), 45, 60) }),
    k.body({ mass: 100, jumpForce: 600 }),
    // k.body(),
    k.pos(playerState.get().position.x, playerState.get().position.y),
    k.opacity(),
    k.scale(1),
    k.doubleJump(2),
    k.anchor("center"),
    k.health(playerState.get().health),
    {
      speed: 200,
      attackPower: 1,
      attackCombo: 1,
      attackComboMax: 2,
      direction: "side",
      isAttacking: false,
      isFrozen: false,
    },
    "player",
  ];
}

export function setControlsSideScrolling(k, player) {
  //movement
  k.onKeyDown((key) => {
    if (player.isFrozen || player.isAttacking) return;

    if (["left"].includes(key)) {
      player.flipX = true;
      player.move(-player.speed, 0);
      player.direction = "side";

      if (player.isJumping()) {
        playAnimIfNotPlaying(player, "jump");
        return;
      }

      if (player.isFalling()) {
        playAnimIfNotPlaying(player, "fall");
        return;
      }

      playAnimIfNotPlaying(player, "run-side");
      return;
    }

    if (["right"].includes(key)) {
      player.flipX = false;
      player.move(player.speed, 0);
      player.direction = "side";

      if (player.isJumping()) {
        playAnimIfNotPlaying(player, "jump");
        return;
      }

      if (player.isFalling()) {
        playAnimIfNotPlaying(player, "fall");
        return;
      }

      playAnimIfNotPlaying(player, "run-side");
      return;
    }
  });

  //return to idle
  k.onKeyRelease((key) => {
    if (player.isFrozen || player.isAttacking || player.isJumping()) return;
    if (key === "left" || key === "right") playAnimIfNotPlaying(player, `idle-${player.direction}`);
  });
  player.onGround(() => playAnimIfNotPlaying(player, `idle-${player.direction}`));

  //save
  // k.onKeyPress("!", () => {
  //   //sessionId, data obj
  //   let result = savePlayerData("12345", player.worldPos());
  //   console.log("Player data saved:", result);
  // });

  //jump
  k.onKeyPress("space", () => {
    if (player.isFrozen || player.isAttacking) return;
    playAnimIfNotPlaying(player, "jump");
    player.doubleJump();
  });

  //interact
  k.onKeyPress("z", () => {
    if (player.isFrozen || player.isAttacking) return;
    if (player.getCollisions().length === 0) return;
    k.debug.log("Interacted with " + player.getCollisions()[0].target.tags[1]);
    player.getCollisions()[0].target.trigger("onInteract");
  });

  //attack
  k.onKeyPress("x", () => {
    if (player.isFrozen || player.isAttacking) return;
    player.isAttacking = true;
    player.add([
      k.pos(),
      k.area({ shape: new k.Rect(k.vec2(player.flipX ? -70 : 30, 0), 40, 10) }),
      "swordHitbox",
    ]);

    // if (player.isJumping()) {
    //   console.log("initial pos: " + player.worldPos());
    //   player.applyImpulse(0, 300);
    //   console.log(player.worldPos());
    // }

    // player.play(`attack${player.attackCombo}-${player.direction}`, {
    //   onEnd: () => {
    //     console.log("Attack animation ended");
    //     if (player.get("swordHitbox")[0]) k.destroy(player.get("swordHitbox")[0]);
    //     player.isAttacking = false;
    //     playAnimIfNotPlaying(player, `idle-${player.direction}`);
    //   },
    // });

    player.play(`attack${player.attackCombo}-${player.direction}`);
    // playAnimIfNotPlaying(player, `attack${player.attackCombo}-${player.direction}`);

    // increment attack combo or reset to 1 if at max
    player.attackCombo = player.attackCombo < player.attackComboMax ? player.attackCombo + 1 : 1;
  });

  //on animation end
  player.onAnimEnd((anim) => {
    if (anim.substring(0, 6) === "attack") {
      console.log("Attack animation ended");
      if (player.get("swordHitbox")[0]) k.destroy(player.get("swordHitbox")[0]);
      player.isAttacking = false;
      playAnimIfNotPlaying(player, `idle-${player.direction}`);
    }
  });

  //debug
  k.onKeyPress("p", () => {
    let state = playerState.get();
    debugLog("log", "playerState:\n" + JSON.stringify(state, null, 2));

    k.setCamPos(player.worldPos());
  });
}
