//debug function to spawn test entities
export function spawnDebugEntity(k, entity) {
  return [
    k.rect(25, 30),
    k.outline(1),

    k.area({ shape: new k.Rect(k.vec2(0), 25, 30) }),
    k.pos(entity.x, entity.y),
    k.anchor("center"),
    k.body({ mass: 100 }),
    k.opacity(),
    k.timer(), //Optimization: use GameObject local timers
    k.offscreen({ distance: 400 }), //Optimization: hide offscreen objects
    k.state("patrol-right", ["patrol-right", "patrol-left", "alert", "attack", "retreat"]),
    k.health(3),
    "debugEntity",
    {
      speed: 100,
      pursuitSpeed: 150,
      range: 100,
      direction: "side",
      isAttacking: false,
      isFrozen: false,

      setBehavior() {
        const player = k.get("player", { recursive: true })[0];

        this.onStateEnter("patrol-right", async () => {
          await this.wait(3); //Optimization: use GameObject local timers
          if (this.state === "patrol-right") this.enterState("patrol-left");
        });

        this.onStateUpdate("patrol-right", () => {
          if (this.pos.dist(player.pos) < this.range) {
            this.enterState("alert");
            return;
          }
          this.flipX = false;
          this.move(this.speed, 0);
        });

        this.onStateEnter("patrol-left", async () => {
          await this.wait(3);
          if (this.state === "patrol-left") this.enterState("patrol-right");
        });

        this.onStateUpdate("patrol-left", () => {
          if (this.pos.dist(player.pos) < this.range) {
            this.enterState("alert");
            return;
          }
          this.flipX = true;
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
      },

      setEvents() {
        // this.on("customEvent", () => {
        //   console.log("Custom event triggered on debug entity!");
        //   }
        // });

        // this.onCollide("player", () => {
        //   console.log("Debug entity collided with player!");
        //   this.hurt(1);
        // });

        this.onHurt(() => {
          console.log("Debug entity hurt! Current HP: " + this.hp());
          if (this.hp() <= 0) {
            console.log("Debug entity died!");
            k.destroy(this);
          }
        });

        //>>>>>>>>><<<<<<<<<<<\\
        this.onCollide("playerSword", () => {
          console.log("Debug entity hit by sword!");
          this.hurt(1);
        });
      },
    },
  ];
}
