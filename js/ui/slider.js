'use strict';

class Slider {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.position = 0;
    this.percent = 0.0;
    this.mouseX = 0;
    this.lineWidth = 2;
    this.lineColor = "rgb(255,255,255)";
    this.indicatorSize = Math.ceil(this.height * 0.34);
    this.indicatorColor = "rgb(255,255,255)";
    this.hover = false;
    this.xPad = Math.floor(this.width * 0.1);
  };
  update() {
    let x = MOUSE.x;
    let y = MOUSE.y;
    this.hover = false;
    if (x >= this.x - this.xPad && x <= this.x + this.width + this.xPad) {
      if (y >= this.y && y <= this.y + this.height) {
        this.hover = true;
        if (MOUSE.buttonLeft) {
          this.position = Math.floor(Math.min(this.x + this.width, Math.max(this.x, x)) - this.x);
          this.percent = Math.max(0, Math.min(1, this.position / this.width));
        }
      }
    }
    this.mouseX = Math.floor(x);
  };
  draw(ctx) {
    // Draw Horizontal Line
    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.lineColor;
    ctx.moveTo(Math.floor(this.x), Math.floor(this.y + (this.height * 0.5)));
    ctx.lineTo(Math.floor(this.x + this.width), Math.floor(this.y + (this.height * 0.5)));
    ctx.stroke();
    // End Lines
    ctx.beginPath();
    ctx.moveTo(Math.floor(this.x), Math.floor(this.y));
    ctx.lineTo(Math.floor(this.x), Math.floor(this.y + this.height));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(Math.floor(this.x + this.width), Math.floor(this.y));
    ctx.lineTo(Math.floor(this.x + this.width), Math.floor(this.y + this.height));
    ctx.stroke();
    // Center Line
    ctx.beginPath();
    ctx.moveTo(Math.floor(this.x + (this.width * 0.5)), Math.floor(this.y + (this.height * 0.2)));
    ctx.lineTo(Math.floor(this.x + (this.width * 0.5)), Math.ceil(this.y + (this.height * 0.8)));
    ctx.stroke();
    // Quarter Line
    ctx.beginPath();
    ctx.moveTo(Math.floor(this.x + (this.width * 0.25)), Math.floor(this.y + (this.height * 0.3)));
    ctx.lineTo(Math.floor(this.x + (this.width * 0.25)), Math.ceil(this.y + (this.height * 0.7)));
    ctx.stroke();
    // 3 Quarter Line
    ctx.beginPath();
    ctx.moveTo(Math.floor(this.x + (this.width * 0.75)), Math.floor(this.y + (this.height * 0.3)));
    ctx.lineTo(Math.floor(this.x + (this.width * 0.75)), Math.ceil(this.y + (this.height * 0.7)));
    ctx.stroke();
    // Indicator
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.fillStyle = this.indicatorColor;
    ctx.strokeStyle = this.indicatorColor;
    ctx.arc(
      Math.floor(this.position + this.x)
      ,Math.floor(this.y + (this.height * 0.5))
      ,this.indicatorSize
      ,0
      ,2 * Math.PI
      ,false
    );
    ctx.fill();
    ctx.stroke();
    // Draw hover amount
    if (this.hover) {
      ctx.font = `${Math.floor(this.height)}px Monospace`;//"8px Monospace";
      ctx.fillStyle = this.indicatorColor;
      ctx.textAlign = "center";
      let percentText = Math.min(100, Math.max(0,
        Math.floor((this.mouseX - this.x) / this.width * 100)
      ));
      ctx.fillText(
        percentText
        ,Math.floor(this.x + (this.width * 0.5))
        ,Math.floor(this.y + (this.height * 2))
      );
    }
  };
};