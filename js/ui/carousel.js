'use strict';

class CarouselItem {
  constructor(image, postback) {
    this.image = image;
    this.postback = postback;
  };
};

class Carousel {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.index = 0;
    this.items = [];
    this.hover = false;
    this.borderColor = "rgb(255,0,0)";
    this.borderWidth = 8;
  };
  addItem(image, postback) {
    this.items.push(new CarouselItem(image, postback));
  };
  update() {
    let x = MOUSE.x;
    let y = MOUSE.y;
    this.hover = false;
    if (x >= this.x && x <= this.x + this.width) {
      if (y >= this.y && y <= this.y + this.height) {
        this.hover = true;
        if (MOUSE.buttonLeft) {
          this.items[this.index].postback();
        }
      }
    }
  };
  draw(ctx) {
    if (this.hover) {
      ctx.beginPath();
      ctx.lineWidth = this.borderWidth;
      ctx.strokeStyle = this.borderColor;
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
    ctx.drawImage(
      this.items[this.index].image
      ,0
      ,0
      ,this.items[this.index].image.width
      ,this.items[this.index].image.height
      ,this.x
      ,this.y
      ,this.width
      ,this.height
    );
  };
  previous() {
    this.index -= 1;
    if (this.index < 0) {
      this.index = this.items.length - 1;
    }
  };
  next() {
    this.index += 1;
    if (this.index >= this.items.length) {
      this.index = 0;
    }
  };
  select() {
    this.items[this.index].postback();
  };
};
