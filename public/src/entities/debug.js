//debug function to spawn test entities
export function spawnDebugEntity(k, position) {
  return [
    k.rect(25, 30),
    k.outline(1),

    k.area({ shape: new k.Rect(k.vec2(0), 25, 30) }),
    k.pos(position.x, position.y),
    k.anchor("center"),
    k.body({ mass: 100 }),
    k.doubleJump(),
    k.opacity(),
    k.timer(), //Optimization: use GameObject local timers
    k.offscreen({ hide: true, pause: true, unpause: true }), //Optimization: hide offscreen objects
    k.state("patrol-right", ["idle", "patrol-right", "patrol-left", "alert", "attack", "retreat"]),
    k.health(3),
    "debugEntity",
    "enemy",
    {
      speed: 50,
      pursuitSpeed: 100,
      attackPower: 1,
      range: 100,
      isAttacking: false,
      isFrozen: false,

      setEvents() {
        // this.on("customEvent", () => {
        //   console.log("Custom event triggered on debug entity!");
        // });

        this.onHurt(() => {
          console.log("Debug entity hurt! Current HP: " + this.hp());
          if (this.hp() <= 0) {
            console.log("Debug entity died!");
            this.destroy();
          }
        });

        //>>>>>>>>><<<<<<<<<<<\\
        // this.onCollide("playerSword", (sword) => {
        //   console.log("Debug entity hit by sword!");
        //   this.doubleJump(250);
        //   this.hurt(sword.atk);
        //   sword.destroy();
        // });

        this.on("onAttacked", (damage) => {
          console.log("debug attacked!");
          this.doubleJump(250);
          this.hurt(damage);
        });
      },

      setBehavior() {
        const player = k.get("player")[0]; //, { recursive: true })[0];

        this.onStateEnter("idle", async () => {
          await this.wait(2); //Optimization: use GameObject local timers
          this.enterState("patrol-right");
        });

        this.onStateEnter("patrol-right", async () => {
          this.flipX = false;
          await this.wait(3);
          if (this.state === "patrol-right") this.enterState("patrol-left");
        });

        this.onStateUpdate("patrol-right", () => {
          if (this.pos.dist(player.pos) < this.range) {
            this.enterState("alert");
            return;
          }
          this.move(this.speed, 0);
        });

        this.onStateEnter("patrol-left", async () => {
          this.flipX = true;
          await this.wait(3);
          if (this.state === "patrol-left") this.enterState("patrol-right");
        });

        this.onStateUpdate("patrol-left", () => {
          if (this.pos.dist(player.pos) < this.range) {
            this.enterState("alert");
            return;
          }
          this.move(-this.speed, 0);
        });

        this.onStateEnter("alert", async () => {
          await this.wait(1);
          if (this.pos.dist(player.pos) < this.range) {
            this.enterState("attack");
            return;
          }

          this.enterState("patrol-right");
        });

        this.onStateUpdate("attack", () => {
          if (this.pos.dist(player.pos) > this.range) {
            this.enterState("alert");
            return;
          }
          this.flipX = player.pos.x <= this.pos.x;
          this.moveTo(k.vec2(player.pos.x, player.pos.y + 12), this.pursuitSpeed);
        });

        //idle if collided with boundary, prevents ongoing collisions
        this.onCollide("", () => {
          this.enterState("idle");
        });

        //entity and player bounces away from each other, prevents ongoing collisions
        this.onCollide("player", () => {
          //bounce backwards away from player
          // this.move(this.flipX ? 300 : -300, 0);
          this.doubleJump(150);

          //player bounce away from this enity
          //move this to player.js if there are more player collision events
          player.doubleJump(150);
          player.hurt(this.attackPower);
        });
      },
    },
  ];
}
