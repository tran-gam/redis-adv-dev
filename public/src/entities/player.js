import k from "../kaplayContext.js";
import { playerState, gameState } from "../states/stateManager.js";
import { areAnyOfTheseKeysDown, playAnimIfNotPlaying, debugLog } from "../utils/utils.js";
import { savePlayerData } from "../utils/saveload.js";

// top-down player setup
export function playerTopDown() {
  //generate player with top down components
  return [
    k.sprite("player", {
      anim: "idle-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(0, 20), 50, 35) }),
    k.body(),
    k.pos(playerState.get().position.x, playerState.get().position.y),
    k.opacity(),
    k.scale(0.65),
    k.anchor("center"),
    k.health(playerState.get().health),
    "player",
    {
      speed: 200,
      attackPower: 1,
      attackCombo: 1,
      attackComboMax: 2,
      direction: "down",
      isAttacking: false,
      isFrozen: false,
      setControls() {
        setControlsTopDown(this);
      },
    },
  ];
}

// top-down controls \\
//
//
export function setControlsTopDown(player) {
  //Optimization: use GameObject local input handlers
  //https://kaplayjs.com/docs/guides/optimization/

  //movement
  player.onKeyDown((key) => {
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
  player.onKeyRelease((key) => {
    if (player.isFrozen || player.isAttacking) return;
    playAnimIfNotPlaying(player, `idle-${player.direction}`);
  });

  //save
  player.onKeyPress("!", async () => {
    playerState.set("position", { x: player.worldPos().x, y: player.worldPos().y });
    const save = await savePlayerData();
    if (save) debugLog("log", save);
  });

  //jump disabled for top-down mode

  //interact
  player.onKeyPress("z", () => {
    if (player.getCollisions().length === 0) return;
    k.debug.log("Interacted with " + player.getCollisions()[0].target.tags[1]);
    player.getCollisions()[0].target.trigger("onInteract");
  });

  //attack
  player.onKeyPress("x", () => {
    if (player.isFrozen || player.isAttacking) return;
    player.isAttacking = true;

    switch (player.direction) {
      case "up":
        player.add([k.area({ shape: new k.Rect(k.vec2(-5, -70), 10, 40) }), "playerSword"]);
        break;
      case "down":
        player.add([k.area({ shape: new k.Rect(k.vec2(-5, 45), 10, 30) }), "playerSword"]);
        break;
      default:
        player.add([
          k.area({ shape: new k.Rect(k.vec2(player.flipX ? -70 : 30, 0), 40, 10) }),
          "playerSword",
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
      // console.log("Attack animation ended");
      if (player.get("playerSword")[0]) k.destroy(player.get("playerSword")[0]);
      player.isAttacking = false;
      playAnimIfNotPlaying(player, `idle-${player.direction}`);
    }
  });

  //debug
  player.onKeyPress("p", () => {
    let state = playerState.get();
    debugLog("log", "playerState:\n" + JSON.stringify(state, null, 2));
    console.log("player:", state);

    k.setCamPos(player.worldPos());
  });

  //collision
  //prevent sword collision with player
  // player.onBeforePhysicsResolve((collision) => {
  // if (collision.target.is("playerSword")) {
  //   //ignore collision with sword
  //   collision.resolve = false;
  // }
  // });

  // player.onCollide((other, collision) => {
  //   console.log("collided with:", other.tags[1]);
  //   console.log(collision);
  // });
}

// side-scrolling player setup\\
//
//
export function playerSideScrolling() {
  //generate player with side scrolling components
  return [
    k.sprite("player", { anim: "idle-side" }),
    k.area({ shape: new k.Rect(k.vec2(0), 45, 55) }),
    k.anchor("center"),
    k.body({ mass: 100, jumpForce: 550 }),
    // k.body(),
    k.pos(playerState.get().position.x, playerState.get().position.y),
    k.opacity(),
    k.timer(),
    // k.scale(1),
    k.doubleJump(2),
    k.health(playerState.get().health),
    "player",
    {
      speed: 200,
      attackPower: 1,
      attackCombo: 1,
      attackComboMax: 2,
      direction: "side",
      isAttacking: false,
      isFrozen: false,
      setup() {
        setBehaviorSideScrolling(this);
        setControlsSideScrolling(this);
      },
    },
  ];
}

//side-scrolling behaviors
//
//
export function setBehaviorSideScrolling(player) {
  player.onHurt(() => {
    console.log("player hurt, current HP: " + player.hp());
    if (player.hp() <= 0) {
      console.log("player died");
    }
  });

  //collision
  // player.onCollide((other, collision) => {
  //   console.log("collided with:", other.tags[1]);
  //   console.log(collision);
  // });

  player.onCollide("enemy", (enemy) => {
    player.doubleJump(150);
    player.hurt(enemy.attackPower);
  });
}

// side-scrolling controls \\
//
//
export function setControlsSideScrolling(player) {
  //Optimization: use GameObject local input handlers
  //https://kaplayjs.com/docs/guides/optimization/

  //movement
  player.onKeyDown((key) => {
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
  player.onKeyRelease((key) => {
    if (player.isFrozen || player.isAttacking || player.isJumping()) return;
    if (key === "left" || key === "right") playAnimIfNotPlaying(player, `idle-${player.direction}`);
  });

  player.onGround(() => playAnimIfNotPlaying(player, `idle-${player.direction}`));

  //save disabled for side-scrolling mode
  // player.onKeyPress("!", async () => {
  //   playerState.set("position", { x: player.worldPos().x, y: player.worldPos().y });
  //   const save = await savePlayerData();
  //   if (save) debugLog("log", save);
  // });

  //jump
  player.onKeyPress("space", () => {
    if (player.isFrozen || player.isAttacking) return;
    playAnimIfNotPlaying(player, "jump");
    player.doubleJump();
  });

  //interact disabled for side-scrolling mode
  // player.onKeyPress("z", () => {
  //   if (player.isFrozen || player.isAttacking) return;
  //   if (player.getCollisions().length <= 1) return;
  //   k.debug.log("Interacted with " + player.getCollisions()[0].target.tags[1]);
  //   player.getCollisions()[0].target.trigger("onInteract");
  // });

  //>>>>>>>>>>>>><<<<<<<<<<<<<<\\
  //attack
  player.onKeyPress("x", () => {
    if (player.isFrozen || player.isAttacking) return;
    player.isAttacking = true;
    const sword = player.add([
      k.area({
        shape: new k.Rect(k.vec2(player.flipX ? -70 : 35, -10), 40, 10),
        collisionIgnore: ["", "player", "boundary", "platform"],
      }),
      //required for moving sword hitbox
      // k.pos(),
      // k.rotate(),
      // k.timer(),
      // k.animate(), //({ followMotion: true, relative: true }),
      // k.anchor("left"),
      "playerSword",
      {
        //assign or calculate damage
        damage: player.attackPower,

        //moving sword hitbox
        // slash() {
        //   //lerp move sword hitbox, more efficient than tween, requires k.animate()
        //   // this.animate("pos", [k.vec2(0, 0), k.vec2(player.flipX ? -50 : 50, 50)], {
        //   //   duration: 0.3,
        //   // });

        //   //rotate sword hitbox, requires k.rotate() & k.timer()
        //   // this.tween(0, player.flipX ? -90 : 90, 0.3, (val) => (this.angle = val));

        //   console.log("playerSword slash");
        //   this.onCollide((other) => {
        //     console.log("sword hit: ", other.tags[1]);
        //     other.hurt(this.damage); //pass damage here
        //     // other.trigger("onAttacked", this.damage);
        //     this.destroy();
        //   });
        // },
      },
    ]);
    // sword.slash();

    //jump attack animation attempt
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

  //on attack animation end
  player.onAnimEnd((anim) => {
    if (anim.substring(0, 6) === "attack") {
      // console.log("Attack animation ended");
      if (player.get("playerSword")[0]) k.destroy(player.get("playerSword")[0]);
      player.isAttacking = false;
      playAnimIfNotPlaying(player, `idle-${player.direction}`);
    }
  });

  //debug
  player.onKeyPress("p", () => {
    let state = playerState.get();
    debugLog("log", "playerState:\n" + JSON.stringify(state, null, 2));

    k.setCamPos(player.worldPos());
  });
}
