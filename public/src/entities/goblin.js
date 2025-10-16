import { blinkEffect, playAnimIfNotPlaying } from "../utils/utils.js";

//debug function to spawn test entities
export function spawnGoblin(k, enemy) {
  return [
    k.scale(1),
    k.sprite("goblin", { anim: "idle" }),
    k.area({ shape: new k.Rect(k.vec2(0, 5), 30, 50) }),
    k.pos(enemy.x, enemy.y),
    k.anchor("center"),
    k.body({ mass: 100 }),
    k.doubleJump(),
    k.opacity(),
    k.timer(), //Optimization: use GameObject local timers
    k.offscreen({ hide: true, pause: true, unpause: true }), //Optimization: hide offscreen objects
    k.state("patrol-right", ["idle", "patrol-right", "patrol-left", "alert", "attack", "retreat"]),
    k.health(3),
    enemy.name,
    enemy.type,
    {
      id: enemy.id,
      speed: 50,
      alertSpeed: 100,
      alertRange: 250,
      attackPower: 1,
      attackRange: 70,
      isAttacking: false,
      isFrozen: false,

      setEvents() {
        // this.on("customEvent", () => {
        //   console.log("Custom event triggered on debug entity!");
        // });

        //used for moving sword hitbox (slash)
        this.onHurt(() => {
          console.log(`Goblin ${this.id} hurt! Current HP: ${this.hp()}`);
          blinkEffect(this);
          this.doubleJump(150);
          if (this.hp() <= 0) {
            console.log(`Goblin ${this.id} died!`);
            this.destroy();
          }
        });

        //non-moving sword hitbox, more optimized way of handling damage,
        this.onCollide("playerSword", (sword) => {
          console.log("Goblin hit by sword!");
          this.doubleJump(250);
          this.hurt(sword.damage);
          sword.destroy();
        });

        //used for moving sword hitbox (slash)
        // this.on("onAttacked", (damage) => {
        //   console.log("debug attacked!");
        //   blinkEffect(this);
        //   this.doubleJump(150);
        //   this.hurt(damage);
        // });

        //entity and player bounces away from each other, prevents ongoing collisions
        this.onCollide("player", () => {
          //bounce backwards away from player
          // this.move(this.flipX ? 300 : -300, 0);
          this.doubleJump(150);
        });
      },

      setBehavior() {
        const player = k.get("player")[0]; //, { recursive: true })[0];

        this.onStateEnter("idle", async () => {
          console.log(
            `goblin ${this.id} entered idle, player distance: ${this.pos.dist(player.pos)}`
          );
          if (!this.isAttacking) playAnimIfNotPlaying(this, "idle");
          await this.wait(2); //Optimization: use GameObject local timers

          if (this.flipX) this.enterState("patrol-right");
          else this.enterState("patrol-left");
        });

        this.onStateEnter("patrol-right", async () => {
          console.log(
            `goblin ${this.id} entered patrol-right, player distance: ${this.pos.dist(player.pos)}`
          );

          this.flipX = false;
          if (!this.isAttacking) playAnimIfNotPlaying(this, "run");
          await this.wait(3);
          if (this.state === "patrol-right") this.enterState("patrol-left");
        });

        this.onStateUpdate("patrol-right", () => {
          if (this.pos.dist(player.pos) < this.alertRange) {
            this.enterState("alert");
            return;
          }
          this.move(this.speed, 0);
        });

        this.onStateEnter("patrol-left", async () => {
          console.log(
            `goblin ${this.id} entered patrol-left, player distance: ${this.pos.dist(player.pos)}`
          );
          this.flipX = true;
          if (!this.isAttacking) playAnimIfNotPlaying(this, "run");
          await this.wait(3);
          if (this.state === "patrol-left") this.enterState("patrol-right");
        });

        this.onStateUpdate("patrol-left", () => {
          if (this.pos.dist(player.pos) < this.alertRange) {
            this.enterState("alert");
            return;
          }
          this.move(-this.speed, 0);
        });

        this.onStateEnter("alert", () => {
          console.log(
            `goblin ${this.id} entered alert, player distance: ${this.pos.dist(player.pos)}`
          );
          if (!this.isAttacking) playAnimIfNotPlaying(this, "run");

          // await this.wait(2);
          // if (this.pos.dist(player.pos) < this.alertRange) this.enterState("idle");
        });

        this.onStateUpdate("alert", () => {
          this.flipX = player.pos.x <= this.pos.x;
          this.moveTo(k.vec2(player.pos), this.alertSpeed);
          // this.move(this.flipX ? -this.alertSpeed : this.alertSpeed, 0);

          if (this.pos.dist(player.pos) < this.attackRange) {
            this.enterState("attack");
            return;
          }

          // if (this.pos.dist(player.pos) > this.alertRange) this.enterState("idle");
        });

        this.onStateEnter("attack", () => {
          console.log("goblin attacking");
          this.isAttacking = true;
          playAnimIfNotPlaying(this, "attack");
        });

        this.onAnimEnd((anim) => {
          if (anim === "attack") {
            this.isAttacking = false;
            this.enterState("alert");
          }
        });

        // this.onStateUpdate("attack", () => {
        //   if (this.pos.dist(player.pos) > this.attackRange) {
        //     this.enterState("alert");
        //     return;
        //   }
        //   this.flipX = player.pos.x <= this.pos.x;
        //   this.moveTo(k.vec2(player.pos), this.alertSpeed);
        // });

        //idle if collided with boundary, prevents ongoing collisions
        // this.onCollide("", () => {
        //   this.enterState("idle");
        // });
      },
    },
  ];
}
