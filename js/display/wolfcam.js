'use strict';

class WolfCam {
  constructor(width, height) {
    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.width = width;
    this.halfWidth = Math.floor(this.width * 0.5);
    this.height = height;
    this.halfHeight = Math.floor(this.height * 0.5);
    this.fov = 65 * Math.PI / 180;
    this.wallHeight = (this.width * 0.5) / Math.tan((this.fov * 0.5));
    this.maxDist = 32;
    this.fadeScale = 2;
    this.walls = [];
    this.objects = [];
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
  };
  set(x, y, a) {
    this.x = x;
    this.y = y;
    this.a = a;
  };
  projectWalls(grid) {
    this.walls = [];
    for (let i = 0; i < this.width; i++) {
      this.walls[i] = {
        "z": this.maxDist
        ,"i": 0
        ,"top": 0
        ,"h": 0
        ,"tx": 0
        ,"f": 0
      };
      let x = this.x;
      let y = this.y;
      let ia = (this.a - (this.fov * 0.5)) + ((i / this.width) * this.fov);
      if (ia > Math.PI * 2) {
        ia -= Math.PI * 2;
      }
      if (ia < 0) {
        ia += Math.PI * 2;
      }
      let vx = Math.cos(ia);
      let vy = Math.sin(ia);
      let fac = Math.cos(ia - this.a);
      let dx = Math.abs(1 / vx);
      let dy = Math.abs(1 / vy);
      let ox = 0;
      let oy = 0;
      let ix = 0;
      let iy = 0;
      if (vx > 0) {
        ix = 1;
        ox = (Math.floor(x) - x + 1) / vx;
      } else {
        ix = -1;
        ox = Math.abs((x - Math.floor(x)) / vx);
      }
      if (vy > 0) {
        iy = 1;
        oy = (Math.floor(y) - y + 1) / vy;
      } else {
        iy = -1;
        oy = Math.abs((y - Math.floor(y)) / vy);
      }
      let counter = 0;
      while (counter < this.maxDist) {
        counter += 1;
        if (ox < oy) {
          x += ix;
          let d = ox * fac;
          if (x < 0 || x >= grid.length
            || y < 0 || y >= grid[Math.floor(x)].length) {
            break;
          } else if (grid[Math.floor(x)][Math.floor(y)] >= 0) {
            this.walls[i].z = ox;
            this.walls[i].i = grid[Math.floor(x)][Math.floor(y)];
            this.walls[i].h = Math.floor(this.wallHeight / d);
            this.walls[i].top = Math.floor((this.height - this.walls[i].h) * 0.5);
            this.walls[i].tx = (this.y + vy * ox) % 1;
            if (!(ia > Math.PI * 1.5 || ia < Math.PI * 0.5)) {
                this.walls[i].tx = 1 - this.walls[i].tx;
            }
            this.walls[i].f = d / this.maxDist * this.fadeScale;
            break;
          }
          ox += dx;
        } else {
          y += iy;
          let d = oy * fac;
          if (x < 0 || x > grid.length
            || y < 0 || y > grid[Math.floor(x)].length) {
            break;
          } else if (grid[Math.floor(x)][Math.floor(y)] >= 0) {
            this.walls[i].z = oy;
            this.walls[i].i = grid[Math.floor(x)][Math.floor(y)];
            this.walls[i].h = Math.floor(this.wallHeight / d);
            this.walls[i].top = Math.floor((this.height - this.walls[i].h) * 0.5);
            this.walls[i].tx = (this.x + vx * oy) % 1;
            if (!(ia < 0 || ia > Math.PI)) {
              this.walls[i].tx = 1 - this.walls[i].tx;
            }
            this.walls[i].f = d / this.maxDist * this.fadeScale;
            break;
          }
          oy += dy;
        }
      }
    }
  };
  projectObject(x, y, r, image, scale) {};
  drawSkyBasic(skyColor, floorColor) {
    this.ctx.fillStyle = skyColor;
    this.ctx.fillRect(
      0
      ,0
      ,this.width
      ,this.halfHeight
    );
    this.ctx.fillStyle = floorColor;
    this.ctx.fillRect(
      0
      ,this.halfHeight
      ,this.width
      ,this.halfHeight
    );
  };
  drawSkyImage(image) {};
  drawWalls(tileImages) {
    for (let i = 0; i < this.walls.length; i++) {
      if (this.walls[i].z < this.maxDist) {
        let image = tileImages[this.walls[i].i];
        this.ctx.drawImage(
          image
          ,Math.floor(this.walls[i].tx * image.width)
          ,0
          ,1
          ,image.height
          ,i
          ,this.walls[i].top
          ,1
          ,this.walls[i].h
        );
        //Fog
        this.ctx.fillStyle = "#000000";
        this.ctx.globalAlpha = this.walls[i].f;
        this.ctx.fillRect(
          i
          ,this.walls[i].top
          ,1
          ,this.walls[i].h
        );
        this.ctx.globalAlpha = 1;
      }
    }
  };
  drawObjects(ctx) {
    for (let i = 0; i < this.objects.length; i++) {

    }
    this.objects = [];
  };
  render(ctx, x, y, w, h) {
    ctx.drawImage(
      this.canvas
      ,0,0
      ,this.canvas.width,this.canvas.height
      ,x,y
      ,w,h
    );
  }
};
