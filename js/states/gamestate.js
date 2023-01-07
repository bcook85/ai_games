'use strict';

class GameState extends State {
  constructor(screen, mouse, keys, setState) {
    super(screen, mouse, keys, setState);
    // Temp Map Grid
    this.grid = [];

    // Images
    this.tileImages = [];

    this.cam = undefined;
    this.player = undefined;
  };
  init() {
    // Temp Grid
    this.grid = [
      [1,1,1,1,1,1,1,1,1,1]
      ,[1,2,2,2,2,0,-1,-1,-1,1]
      ,[1,2,-1,-1,-1,-1,-1,-1,-1,1]
      ,[1,2,-1,1,-1,-1,-1,-1,-1,1]
      ,[1,2,-1,-1,3,-1,-1,-1,-1,1]
      ,[1,0,-1,-1,-1,-1,-1,-1,-1,1]
      ,[1,-1,-1,-1,-1,-1,-1,-1,-1,1]
      ,[1,-1,-1,-1,-1,-1,-1,-1,-1,1]
      ,[1,-1,-1,-1,-1,-1,-1,-1,-1,1]
      ,[1,-1,-1,-1,-1,-1,-1,-1,-1,1]
      ,[1,-1,-1,-1,-1,-1,-1,-1,-1,1]
      ,[1,-1,-1,-1,-1,-1,2,-1,-1,1]
      ,[1,-1,1,-1,-1,-1,-1,-1,-1,1]
      ,[1,-1,-1,-1,0,-1,-1,-1,-1,1]
      ,[1,-1,-1,-1,-1,-1,-1,-1,-1,1]
      ,[1,1,1,1,1,1,1,1,1,1]
    ];
    // Images
    this.tileImages = [];
    this.tileImages.push(AssetManager.tilesImage.cut(0, 0, 16, 16));
    this.tileImages.push(AssetManager.tilesImage.cut(16, 0, 16, 16));
    this.tileImages.push(AssetManager.tilesImage.cut(32, 0, 16, 16));
    this.tileImages.push(AssetManager.tilesImage.cut(48, 0, 16, 16));
    // Camera
    this.cam = new WolfCam(
      this.screen.height
      ,this.screen.height
    );
    this.cam.set(0,0,0);
    // Player
    this.player = new Entity(6.5, 6.5, 0, 0.25);
  };
  update(dt) {
    if (dt > 0.034) {
      dt = 0.034;
    }
    this.updatePlayer(dt);
    // Bots

    // Bullets

  };
  render() {
    // World
    this.cam.drawSkyBasic("#1a1a1a", "#1e0d00");
    this.cam.drawWalls(this.tileImages);
    this.cam.render(this.ctx, 0, 0, this.cam.width, this.cam.height);
    // UI
    this.ctx.fillStyle = "rgb(0,0,0)";
    this.ctx.fillRect(this.screen.height, 0, this.screen.width - this.screen.height, this.screen.height);
    this.ctx.font = "16px Monospace";
    this.ctx.fillStyle = "rgb(255,0,0)";
    this.ctx.textAlign = "left";
    this.ctx.fillText(
      `(${this.cam.x.toFixed(4)}, ${this.cam.y.toFixed(4)}), ${this.cam.a.toFixed(4)}`
      ,this.screen.height
      ,20
    );
  };
  updatePlayer(dt) {
    if (this.keys.pressed("KeyQ")) {
      this.player.turn = -1;
    } else if (this.keys.pressed("KeyE")) {
      this.player.turn = 1;
    } else {
      this.player.turn = 0;
    }
    if (this.keys.pressed("KeyW")) {
      this.player.move = 1;
    } else if (this.keys.pressed("KeyS")) {
      this.player.move = -1;
    } else {
      this.player.move = 0;
    }
    if (this.keys.pressed("KeyA")) {
      this.player.strafe = -1;
    } else if (this.keys.pressed("KeyD")) {
      this.player.strafe = 1;
    } else {
      this.player.strafe = 0;
    }
    this.player.updateMove(dt);
    this.player.resolveGridCollision(this.grid);
    this.player.applyMove();
    // Keep camera in bounds
    /*this.player.pos.x = Math.min(
      this.grid.length - this.player.radius
      ,Math.max(this.player.radius, this.player.pos.x)
    );
    this.player.pos.y = Math.min(
      this.grid[Math.floor(this.player.pos.x)].length - this.player.radius
      ,Math.max(this.player.radius, this.player.pos.y)
    );*/
    this.cam.set(this.player.pos.x, this.player.pos.y, this.player.a);
    this.cam.projectWalls(this.grid);
  };
};