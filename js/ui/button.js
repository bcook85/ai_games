'use strict';

class ImageButton {
  constructor(x, y, w, h, image, hoverImage) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.image = image;
    this.defaultImage = image;
    this.hoverImage = hoverImage;
    this.hover = false;
    this.clicked = false;
    this.hold = false;
    this.toggled = false;
  };
  update() {
    this.clicked = false;
    this.hover = false;
    this.image = this.defaultImage;
    if (this.hold) {
      if (!MOUSE.buttonLeft) {
        this.hold = false;
      }
    } else {
      let x = MOUSE.x;
      let y = MOUSE.y;
      if (x >= this.x && x <= this.x + this.width) {
        if (y >= this.y && y <= this.y + this.height) {
          this.hover = true;
          this.image = this.hoverImage;
          if (MOUSE.buttonLeft) {
            this.clicked = true;
            this.hold = true;
          }
        }
      }
    }
  };
  updateToggle() {
    this.clicked = false;
    this.hover = false;
    if (this.hold) {
      if (!MOUSE.buttonLeft) {
        this.hold = false;
      }
    } else {
      let x = MOUSE.x;
      let y = MOUSE.y;
      if (x >= this.x && x <= this.x + this.width) {
        if (y >= this.y && y <= this.y + this.height) {
          this.hover = true;
          if (MOUSE.buttonLeft) {
            this.clicked = true;
            this.hold = true;
            this.toggled = !this.toggled;
          }
        }
      }
    }
    if ((this.hover && !this.toggled) || (!this.hover && this.toggled)) {
      this.image = this.hoverImage;
    } else {
      this.image = this.defaultImage;
    }
  };
  draw(ctx) {
    ctx.drawImage(
      this.image
      ,0
      ,0
      ,this.image.width
      ,this.image.height
      ,Math.floor(this.x)
      ,Math.floor(this.y)
      ,Math.floor(this.width)
      ,Math.floor(this.height)
    );
  };
};
