import { gameState, playerState } from "../states/stateManager.js";
import { areAnyOfTheseKeysDown, playAnimIfNotPlaying } from "../utils/utils.js";
import { savePlayerData } from "../utils/saveload.js";

export function playerTopDown(k) {
  //generate player with top down components
  return [
    k.sprite("player", {
      anim: "idle-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(0, 20), 55, 40) }),
    k.body(),
    k.pos(playerState.getPosition().x, playerState.getPosition().y),
    k.opacity(),
    k.scale(0.75),
    k.anchor("center"),
    k.health(playerState.getHealth()),
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
  k.onKeyPress("!", () => {
    //sessionId, data obj
    let result = savePlayerData("12345", player.worldPos());
    console.log("Player data saved:", result);
  });

  // k.onKeyPress("space", () => {
  //   if (player.isFrozen || player.isAttacking) return;

  //   player.doubleJump();
  // });

  k.onKeyPress("e", () => {
    // k.debug.log(player);
    if (player.getCollisions().length === 0) return;
    k.debug.log("Interacted with " + player.getCollisions()[0].target.tags[1]);
    player.getCollisions()[0].target.trigger("onInteract");
  });

  k.onKeyDown((key) => {
    // if (gameState.getFreezePlayer()) return;
    if (player.isFrozen || player.isAttacking) return;
    if (["left"].includes(key)) {
      if (areAnyOfTheseKeysDown(["up", "down"])) return;
      player.flipX = true;
      playAnimIfNotPlaying(player, "run-side");
      player.move(-player.speed, 0);
      player.direction = "side";
      return;
    }

    if (["right"].includes(key)) {
      if (areAnyOfTheseKeysDown(["up", "down"])) return;
      player.flipX = false;
      playAnimIfNotPlaying(player, "run-side");
      player.move(player.speed, 0);
      player.direction = "side";
      return;
    }

    if (["up"].includes(key)) {
      playAnimIfNotPlaying(player, "run-up");
      player.move(0, -player.speed);
      player.direction = "up";
      return;
    }

    if (["down"].includes(key)) {
      playAnimIfNotPlaying(player, "run-down");
      player.move(0, player.speed);
      player.direction = "down";
      return;
    }
  });

  k.onKeyRelease((key) => {
    if (player.isFrozen || player.isAttacking) return;
    playAnimIfNotPlaying(player, `idle-${player.direction}`);
  });

  k.onKeyPress("f", () => {
    if (player.isFrozen || player.isAttacking) return;
    player.isAttacking = true;
    player.add([
      k.pos(),
      k.area({ shape: new k.Rect(k.vec2(player.flipX ? -70 : 30, 0), 40, 10) }),
      "swordHitBox",
    ]);

    player.play(`attack${player.attackCombo}-${player.direction}`);

    // increment attack combo or reset to 1 if at max
    player.attackCombo = player.attackCombo < player.attackComboMax ? player.attackCombo + 1 : 1;
  });
  //on animation end
  player.onAnimEnd((anim) => {
    if (anim.substring(0, 6) === "attack") {
      console.log("Attack animation ended");
      k.destroy(player.get("swordHitBox")[0]);
      player.isAttacking = false;
      playAnimIfNotPlaying(player, `idle-${player.direction}`);
    }
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
    // k.body({ mass: 100, jumpForce: 600 }),
    k.body(),
    k.pos(playerState.getPosition().x, playerState.getPosition().y),
    k.opacity(),
    k.scale(1),
    k.doubleJump(2),
    k.anchor("center"),
    k.health(playerState.getHealth()),
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
  // k.onKeyPress("!", () => {
  //   //sessionId, data obj
  //   let result = savePlayerData("12345", player.worldPos());
  //   console.log("Player data saved:", result);
  // });

  k.onKeyPress("space", () => {
    if (player.isFrozen || player.isAttacking) return;

    player.doubleJump();
  });

  k.onKeyPress("e", () => {
    // k.debug.log(player);
    if (player.getCollisions().length === 0) return;
    k.debug.log("Interacted with " + player.getCollisions()[0].target.tags[1]);
    player.getCollisions()[0].target.trigger("onInteract");
  });

  k.onKeyDown((key) => {
    // if (gameState.getFreezePlayer()) return;
    if (player.isFrozen || player.isAttacking) return;
    if (["left"].includes(key)) {
      if (areAnyOfTheseKeysDown(["up", "down"])) return;
      player.flipX = true;
      playAnimIfNotPlaying(player, "run-side");
      player.move(-player.speed, 0);
      player.direction = "side";
      return;
    }

    if (["right"].includes(key)) {
      if (areAnyOfTheseKeysDown(["up", "down"])) return;
      player.flipX = false;
      playAnimIfNotPlaying(player, "run-side");
      player.move(player.speed, 0);
      player.direction = "side";
      return;
    }

    // if (["up"].includes(key)) {
    //   playAnimIfNotPlaying(player, "run-up");
    //   player.move(0, -player.speed);
    //   player.direction = "up";
    //   return;
    // }

    // if (["down"].includes(key)) {
    //   playAnimIfNotPlaying(player, "run-down");
    //   player.move(0, player.speed);
    //   player.direction = "down";
    //   return;
    // }
  });

  k.onKeyRelease((key) => {
    if (player.isFrozen || player.isAttacking) return;
    playAnimIfNotPlaying(player, `idle-${player.direction}`);
  });

  k.onKeyPress("f", () => {
    if (player.isFrozen || player.isAttacking) return;
    player.isAttacking = true;
    player.add([
      k.pos(),
      k.area({ shape: new k.Rect(k.vec2(player.flipX ? -70 : 30, 0), 40, 10) }),
      "swordHitBox",
    ]);

    player.play(`attack${player.attackCombo}-${player.direction}`);

    // increment attack combo or reset to 1 if at max
    player.attackCombo = player.attackCombo < player.attackComboMax ? player.attackCombo + 1 : 1;
  });

  //on animation end
  player.onAnimEnd((anim) => {
    if (anim.substring(0, 6) === "attack") {
      console.log("Attack animation ended");
      k.destroy(player.get("swordHitBox")[0]);
      player.isAttacking = false;
      playAnimIfNotPlaying(player, `idle-${player.direction}`);
    }
  });
}
