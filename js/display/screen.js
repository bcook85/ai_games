'use strict';

class Screen {
  constructor(canvas, width, height, fullScreen) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    // Stop default actions
    this.canvas.oncontextmenu = () => { return false; };
    this.canvas.onselectstart = () => { return false; };
    if (fullScreen) {
      // Automatically re-size game canvas
      window.addEventListener(
        "resize", () => { this.autoFullscreen(); }
        ,false
      );
      window.addEventListener(
        "orientationchange", () => { this.autoFullscreen(); }
        ,false
      );
      this.autoFullscreen();
    }
  };
  autoFullscreen() {
    let newWidth = Math.floor(this.canvas.parentElement.clientWidth);
    let newHeight = Math.floor(window.innerHeight);
    let aspectRatio = this.canvas.width / this.canvas.height;
    if (newWidth / newHeight > aspectRatio) {//wide
      newWidth = Math.floor(newHeight * aspectRatio);
      this.canvas.style.height = newHeight + "px";
      this.canvas.style.width = newWidth + "px";
    }
    else {//tall
      newHeight = Math.floor(newWidth / aspectRatio);
      this.canvas.style.width = newWidth + "px";
      this.canvas.style.height = newHeight + "px";
    }
  };
};