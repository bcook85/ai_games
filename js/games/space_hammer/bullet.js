'use strict';

class Bullet extends Ball {
  constructor(x, y, a) {
    super(new Vector(x, y), 4); // Radius of 4
    this.alive = true;
    this.life = 15; // Number of frames to live
    this.a = a;
    this.speed = 10;
    this.vel = Vector.fromAngle(a).mul(this.speed);
  };
  update() {
    // Timer
    this.life -= 1;
    if (this.life > 0) {
      // Apply Velocity
      this.pos = this.pos.add(this.vel);
    } else {
      this.alive = false;
    }
  };
};
