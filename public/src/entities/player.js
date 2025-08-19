// import { gameState, playerState } from "../state/stateManagers.js";
import {
  areAnyOfTheseKeysDown,
  playAnimIfNotPlaying,
  savePlayerData,
} from "../utils.js";

export function generatePlayerComponents(k, pos) {
  return [
    k.sprite("player", {
      anim: "idle-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(3, 4), 10, 12) }),
    k.body(),
    k.pos(pos),
    k.opacity(),
    k.scale(0.75),
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

export function setPlayerControls(k, player) {
  k.onKeyPress("!", () => {
    let result = savePlayerData("12345", player.worldPos());
    console.log("Player data saved:", result);
  });

  k.onKeyPress("space", () => {
    if (player.isFrozen || player.isAttacking) return;
    player.isAttacking = true;

    playAnimIfNotPlaying(
      player,
      `attack${player.attackCombo}-${player.direction}`
    );

    k.wait(0.6, () => {
      player.isAttacking = false;

      // Reset attack combo after the attack animation finishes
      player.attackCombo =
        player.attackCombo < player.attackComboMax ? player.attackCombo + 1 : 1;
      playAnimIfNotPlaying(player, `idle-${player.direction}`);
    });
  });

  k.onKeyDown((key) => {
    // if (gameState.getFreezePlayer()) return;
    if (player.isFrozen || player.isAttacking) return;
    if (["left"].includes(key)) {
      if (areAnyOfTheseKeysDown(k, ["up", "down"])) return;
      player.flipX = true;
      playAnimIfNotPlaying(player, "run-side");
      player.move(-player.speed, 0);
      player.direction = "side";
      return;
    }

    if (["right"].includes(key)) {
      if (areAnyOfTheseKeysDown(k, ["up", "down"])) return;
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

    // player.isAttacking = false;
    // if (["up", "down", "left", "right"].includes(key)) {
    //   playAnimIfNotPlaying(player, `idle-${player.direction}`);
    // }
    // player.stop();
    // if (k.isKeyDown("space")) return;

    // if(!player.isAttacking) playAnimIfNotPlaying(player, `idle-${player.direction}`);
  });
}
