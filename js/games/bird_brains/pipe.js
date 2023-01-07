'use strict';

class Pipe {
  constructor(x, top, gapSize) {
    this.alive = true;
    this.cleared = false;
    this.x = x;
    this.width = 64;
    this.height = 32;
    this.gapSize = gapSize;
    this.top = Math.floor(top);
    this.bottom = Math.floor(this.top + this.gapSize);
  };
  collides(x, y, r) {
    let pLeft = this.x - r;
    let pRight = this.x + this.width + r;
    let pTop = this.top + r;
    let pBottom = this.bottom - r;
    if (x > pLeft && x < pRight) {
      if (y < pTop || y > pBottom) {
        return true;
      }
    }
    return false;
  };
  draw(ctx, neckImage, mouthImage) {
    // Top Neck
    ctx.drawImage(
      neckImage
      ,0
      ,0
      ,neckImage.width
      ,neckImage.height
      ,Math.floor(this.x)
      ,0
      ,this.width
      ,this.top - this.height
    );

    // Top Mouth
    ctx.drawImage(
      mouthImage
      ,0
      ,0
      ,mouthImage.width
      ,mouthImage.height
      ,Math.floor(this.x)
      ,Math.floor(this.top - this.height)
      ,this.width
      ,this.height
    );

    // Bottom Neck
    ctx.drawImage(
      neckImage
      ,0
      ,0
      ,neckImage.width
      ,neckImage.height
      ,Math.floor(this.x)
      ,this.bottom + this.height
      ,this.width
      ,SCREEN.height - this.bottom
    );

    // Bottom Mouth
    ctx.drawImage(
      mouthImage
      ,0
      ,0
      ,mouthImage.width
      ,mouthImage.height
      ,Math.floor(this.x)
      ,Math.floor(this.bottom)
      ,this.width
      ,this.height
    );
  };
};
