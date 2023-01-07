'use strict';

class Rock extends Ball {
  constructor(x, y, size) {
    super(new Vector(x, y), 0); // Set Radius later
    this.alive = true;
    this.a = Math.random() * Math.PI * 2;
    this.spin = 0;
    this.size = size;
    // Update for size
    if (this.size == 3) {
      this.radius = 16;
      this.spin = ((Math.random() * 2) - 1) * 0.0625;
      this.vel = Vector.fromAngle(this.a).mul(0.75);
    } else if (this.size == 2) {
      this.radius = 8;
      this.spin = ((Math.random() * 2) - 1) * 0.125;
      this.vel = Vector.fromAngle(this.a).mul(1.25);
    } else {
      this.radius = 4;
      this.spin = ((Math.random() * 2) - 1) * 0.25;
      this.vel = Vector.fromAngle(this.a).mul(1.75);
    }
  };
  update() {
    // Spin
    this.a = this.a + this.spin;
    if (this.a > Math.PI * 2) {
      this.a -= Math.PI * 2;
    } else if (this.a < 0) {
      this.a += Math.PI * 2;
    }
    // Apply Velocity
    this.pos = this.pos.add(this.vel);
  };
};
