'use strict';

class Bird {
  constructor(x, y, r) {
    this.alive = true;
    this.x = x;
    this.y = y;
    this.r = r;
    this.ySpeed = 0.0;
    this.jumpSpeed = 6.0;
    this.jumpThreshold = 1.0;
  };
  jump() {
    if (this.ySpeed > this.jumpThreshold) {
      this.ySpeed = -this.jumpSpeed;
    }
  };
  draw(ctx, image) {
    let rot = 0;
    if (this.ySpeed < -this.jumpThreshold) {
      rot = Math.PI * -0.25;
    } else if (this.ySpeed > this.jumpThreshold) {
      rot = Math.PI * 0.25;
    }

    ctx.save();
    // Move to Draw Position
    ctx.translate(
      Math.floor(this.x)
      ,Math.floor(this.y)
    );
    // Rotate to Player.Direction
    ctx.rotate(rot);
    // Draw Image
    ctx.drawImage(
      image
      ,0
      ,0
      ,image.width
      ,image.height
      ,Math.floor(image.width * -0.5)
      ,Math.floor(image.height * -0.5)
      ,Math.floor(image.width)
      ,Math.floor(image.height)
    );
    ctx.restore();
  };
};
