'use strict';

class Spaceship extends Ball {
  constructor(x, y) {
    super(new Vector(x, y), 8);
    this.alive = true;
    this.vel = new Vector(0, 0);
    this.a = Math.PI * 2.0 * Math.random();
    this.speed = 0.0;
    this.maxSpeed = 5.0;
    this.moveSpeed = 0.035;
    this.turnSpeed = 0.08;
    this.drag = 0.98765;
    this.move = 0;
    this.turn = 0;
    this.fTime = 0;
    this.fRate = 30;
    this.movePoints = 0;
    this.timePoints = 0;
    this.memory = 0.0;
  };
  update() {
    // Fire Timer
    if (this.fTime > 0) {
      this.fTime -= 1;
    }
    // Turning
    this.a += this.turn * this.turnSpeed;
    // Clamp Angle
    if (this.a > Math.PI * 2) {
      this.a -= Math.PI * 2;
    }
    if (this.a < 0) {
      this.a += Math.PI * 2;
    }
    // Calculate Speed
    if (this.move == 1) {
      this.vel = this.vel.add(new Vector(this.move, 0).rot(this.a).mul(this.moveSpeed));
      // Clamp Velocity
      let mag = this.vel.mag();
      let f = Math.min(this.maxSpeed, mag) / mag;
      this.vel = this.vel.mul(f);
    } else {
      // Apply Drag
      this.vel = this.vel.mul(this.drag);
      // Auto-stop if below threshold
      if (this.vel.mag() < 0.1) {
        this.vel = new Vector(0, 0);
      }
    }
    // Apply Velocity
    this.pos = this.pos.add(this.vel);
  };
};