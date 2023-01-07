'use strict';

class SpaceHammerGame {
  constructor() {
    this.bgImage = ASSETS.images.sprites_space_hammer.cut(0, 0, 360, 360);
    this.shipImage = ASSETS.images.sprites_space_hammer.cut(360, 48, 16, 16);
    this.rockImages = [
      ASSETS.images.sprites_space_hammer.cut(376, 32, 8, 8)
      ,ASSETS.images.sprites_space_hammer.cut(360, 32, 16, 16)
      ,ASSETS.images.sprites_space_hammer.cut(360, 0, 32, 32)
    ];
    this.bulletImage = ASSETS.images.sprites_space_hammer.cut(384, 32, 8, 8);
    this.jetImage = ASSETS.images.sprites_space_hammer.cut(392, 32, 6, 6);
    this.ship = undefined;
    this.rocks = [];
    this.startingRocks = 0;
    this.bullets = [];
    this.gameTime = 0;
    this.maxGameTime = 60 * 60; // 60fps * N seconds
    this.score = 0;
    this.gameSpeed = 50;
    this.maxRays = 16;
    this.rayDist = SCREEN.height * 0.5;
    this.vision = [];
    this.showVision = false;
    this.inputCount = this.maxRays + 5;
    this.inputFrames = 3;
    this.species = new Species(100, [this.inputCount * this.inputFrames, 8, 8, 12, 5], 0.01, 0.1);
    this.brain = 0;
    this.visionButton = new ImageButton(
      SCREEN.height + 150
      ,240
      ,34
      ,16
      ,ASSETS.images.uiButtons.cut(0, 128, 34, 16)
      ,ASSETS.images.uiButtons.cut(34, 128, 34, 16)
    );
    this.speedSlider = new Slider(400, 308, 200, 16);
    this.uiPadding = {
      "headerLargeY": 48
      ,"headerSmallY": 28
      ,"line": 18
      ,"rightColumnX": 150
      ,"leftColumnX": 130
    };
    // Init Game
    this.initPlayer();
    this.initRocks();
  };
  initPlayer() {
    this.ship = new Spaceship(
      Math.floor(SCREEN.height * 0.5)
      ,Math.floor(SCREEN.height * 0.5)
    );
    // Init Vision
    this.vision = [];
    for (let i = 0; i < this.inputCount * this.inputFrames; i++) {
      this.vision.push(0);
    }
  };
  initRocks() {
    this.startingRocks = 5;
    this.rocks = [];
    for (let i = 0; i < this.startingRocks; i++) {
      let pos = this.getRandomRockPos();
      this.addRock(new Rock(pos.x, pos.y, 3));
    }
  };
  nextGeneration() {
    this.brain = 0;
    this.species.nextGeneration();
  };
  getRandomRockPos() {
    return this.ship.pos.add(
      Vector.fromAngle(Math.random() * Math.PI * 2
    ).mul((this.ship.radius * 8) + (SCREEN.height * 0.5 * Math.random())));
  };
  addRock(rock) {
    for (let i = 0; i < this.rocks.length; i++) {
      if (!this.rocks[i].alive) {
        this.rocks[i] = rock;
        return;
      }
    }
    this.rocks.push(rock);
  };
  resetGame() {
    this.gameTime = 0;
    this.score = 0;
    this.bullets = [];
    this.initPlayer();
    this.initRocks();
  };
  addBullet(bullet) {
    for (let i = 0; i < this.bullets.length; i++) {
      if (!this.bullets[i].alive) {
        this.bullets[i] = bullet;
        return;
      }
    }
    this.bullets.push(bullet);
  };
  getShipVision() {
    let vision = [];
    let pos = [];
    pos.push(this.ship.pos);
    // Toroidal Vision
    let quadX = Math.floor(this.ship.pos.x / (SCREEN.height * 0.5));
    let quadY = Math.floor(this.ship.pos.y / (SCREEN.height * 0.5));
    if (quadX == 0) {
      if (quadY == 0) {
        pos.push(new Vector(this.ship.pos.x + SCREEN.height, this.ship.pos.y));
        pos.push(new Vector(this.ship.pos.x, this.ship.pos.y + SCREEN.height));
        pos.push(new Vector(this.ship.pos.x + SCREEN.height, this.ship.pos.y + SCREEN.height));
      } else {
        pos.push(new Vector(this.ship.pos.x + SCREEN.height, this.ship.pos.y));
        pos.push(new Vector(this.ship.pos.x, this.ship.pos.y - SCREEN.height));
        pos.push(new Vector(this.ship.pos.x + SCREEN.height, this.ship.pos.y - SCREEN.height));
      }
    } else {
      if (quadY == 0) {
        pos.push(new Vector(this.ship.pos.x - SCREEN.height, this.ship.pos.y));
        pos.push(new Vector(this.ship.pos.x, this.ship.pos.y + SCREEN.height));
        pos.push(new Vector(this.ship.pos.x - SCREEN.height, this.ship.pos.y + SCREEN.height));
      } else {
        pos.push(new Vector(this.ship.pos.x - SCREEN.height, this.ship.pos.y));
        pos.push(new Vector(this.ship.pos.x, this.ship.pos.y - SCREEN.height));
        pos.push(new Vector(this.ship.pos.x - SCREEN.height, this.ship.pos.y - SCREEN.height));
      }
    }
    for (let i = 0; i < this.maxRays; i++) {
      let dist = 1;
      for (let j = 0; j < this.rocks.length; j++) {
        if (this.rocks[j].alive) {
          for (let k = 0; k < pos.length; k++) {
            let d = this.rocks[j].vsRay(
              pos[k]
              ,(i / this.maxRays * Math.PI * 2) + this.ship.a
              ,this.rayDist
            );
            d = d / this.rayDist; // normalize
            if (d < dist) {
              dist = d;
            }
          }
        }
      }
      vision.push(dist);
    }
    return vision;
  };
  playerControls() {
    let inputs = this.getShipVision();
    inputs.push(this.ship.vel.x / this.ship.maxSpeed);    // Ship X Speed
    inputs.push(this.ship.vel.y / this.ship.maxSpeed);    // Ship Y Speed
    inputs.push(this.ship.a / (Math.PI * 2));             // Ship Angle
    inputs.push(this.ship.fTime / this.ship.fRate);       // Ship Fire Timer
    inputs.push(this.ship.memory);                        // Ship memory value
    // Frame Stacking
    this.vision.splice(0, this.inputCount);
    this.vision = this.vision.concat(inputs);
    // Neural Network Output
    let controls = this.species.feedForward(this.brain, this.vision);
    // Translate output to ship controls
    this.ship.move = 0;
    this.ship.turn = 0;
    if (controls[0] > 0.5) {
      this.ship.move = 1;
    }
    if (controls[1] > 0.5) {
      this.ship.turn += 1;
    }
    if (controls[2] > 0.5) {
      this.ship.turn -= 1;
    }
    // Fire Bullet
    if (controls[3] > 0.5) {
      if (this.ship.fTime == 0) {
        this.addBullet(new Bullet(
          this.ship.pos.x
          ,this.ship.pos.y
          ,this.ship.a
        ));
        this.ship.fTime = this.ship.fRate;
      }
    }
    // Read in new memory value
    this.ship.memory = controls[4];
  };
  /*
  */
  update(dt) {
    for (let i = 0; i < this.gameSpeed; i++) {
      this.gameTime += 1;
      if (this.gameTime >= this.maxGameTime) {
        this.ship.alive = false;
      } else {
        this.ship.timePoints += 1;
        this.updatePlayer();
        this.updateBullets();
        this.updateRocks();
      }
      // If dead, next!
      if (!this.ship.alive) {
        // Calculate scores
        this.species.addScore(this.brain, this.score * 10);
        this.species.addScore(this.brain, this.ship.movePoints * 0.1);
        this.brain += 1;
        if (this.brain >= this.species.populationSize) {
          this.nextGeneration();
        }
        this.resetGame();
      }
    }
    this.visionButton.updateToggle();
    if (this.visionButton.clicked) {
      this.showVision = !this.showVision;
    }
    this.speedSlider.update()
    this.gameSpeed = Math.max(1, Math.min(100, Math.floor(this.speedSlider.percent * 100)));
  };
  updateBullets() {
    for (let i = 0; i < this.bullets.length; i++) {
      if (this.bullets[i].alive) {
        this.bullets[i].update();
        // Toroidal Positioning
        // Using SCREEN.height because game area is heightxheight
        if (this.bullets[i].pos.x >= SCREEN.height) {
          this.bullets[i].pos.x -= SCREEN.height;
        }
        if (this.bullets[i].pos.x < 0) {
          this.bullets[i].pos.x += SCREEN.height;
        }
        if (this.bullets[i].pos.y >= SCREEN.height) {
          this.bullets[i].pos.y -= SCREEN.height;
        }
        if (this.bullets[i].pos.y < 0) {
          this.bullets[i].pos.y += SCREEN.height;
        }
      }
    }
  };
  updatePlayer() {
    this.playerControls();
    this.ship.update();
    // Reward moving, but not spiraling
    if (this.ship.vel.mag() > 0.2 && this.ship.turn == 0) {
      this.ship.movePoints += 1;
    }
    // Toroidal Positioning
    // Using SCREEN.height because game area is heightxheight
    if (this.ship.pos.x >= SCREEN.height) {
      this.ship.pos.x -= SCREEN.height;
    }
    if (this.ship.pos.x < 0) {
      this.ship.pos.x += SCREEN.height;
    }
    if (this.ship.pos.y >= SCREEN.height) {
      this.ship.pos.y -= SCREEN.height;
    }
    if (this.ship.pos.y < 0) {
      this.ship.pos.y += SCREEN.height;
    }
  };
  updateRocks() {
    let hasRocks = false;
    for (let i = 0; i < this.rocks.length; i++) {
      if (this.rocks[i].alive) {
        hasRocks = true;
        this.rocks[i].update();
        // Toroidal Positioning
        // Using SCREEN.height because game area is heightxheight
        if (this.rocks[i].pos.x >= SCREEN.height) {
          this.rocks[i].pos.x -= SCREEN.height;
        }
        if (this.rocks[i].pos.x < 0) {
          this.rocks[i].pos.x += SCREEN.height;
        }
        if (this.rocks[i].pos.y >= SCREEN.height) {
          this.rocks[i].pos.y -= SCREEN.height;
        }
        if (this.rocks[i].pos.y < 0) {
          this.rocks[i].pos.y += SCREEN.height;
        }
        // Player Collision
        if (this.rocks[i].vsBall(this.ship)) {
          this.ship.alive = false;
          return;
        }
        // Bullet Collsion
        for (let j = 0; j < this.bullets.length; j++) {
          if (this.bullets[j].alive) {
            if (this.rocks[i].vsBall(this.bullets[j])) {
              this.score += 1;
              this.bullets[j].alive = false;
              if (this.rocks[i].size > 1) {
                for (let k = 0; k < 2; k++) {
                  this.addRock(new Rock(
                    this.rocks[i].pos.x
                    ,this.rocks[i].pos.y
                    ,this.rocks[i].size - 1
                  ));
                }
              }
              this.rocks[i].alive = false;
            }
          }
        }
      }
    }
    if (!hasRocks) {
      this.startingRocks = Math.ceil(this.startingRocks * 1.25);
      this.rocks = [];
      this.gameTime = 0;
      for (let i = 0; i < this.startingRocks; i++) {
        let pos = this.getRandomRockPos();
        this.addRock(new Rock(pos.x, pos.y, 3));
      }
    }
  };
  render(ctx) {
    // Draw Space
    ctx.drawImage(
      this.bgImage
      ,0
      ,0
      ,this.bgImage.width
      ,this.bgImage.height
      ,0
      ,0
      ,this.bgImage.width
      ,this.bgImage.height
    );
    if (this.showVision) {
      this.drawVision(ctx);
    }
    this.drawBullets(ctx);
    this.drawShip(ctx);
    this.drawRocks(ctx);
    this.drawUI(ctx);
  };
  drawBullets(ctx) {
    for (let i = 0; i < this.bullets.length; i++) {
      if (this.bullets[i].alive) {
        // Draw Image
        ctx.drawImage(
          this.bulletImage
          ,0
          ,0
          ,this.bulletImage.width
          ,this.bulletImage.height
          ,Math.floor(this.bullets[i].pos.x - (this.bulletImage.width * 0.5))
          ,Math.floor(this.bullets[i].pos.y - (this.bulletImage.height * 0.5))
          ,this.bulletImage.width
          ,this.bulletImage.height
        );
      }
    }
  };
  drawShip(ctx) {
    // Draw jet if moving
    if (this.ship.move > 0) {
      ctx.save();
      // Move to Draw Position
      let pos = this.ship.pos.sub(Vector.fromAngle(this.ship.a).mul(this.ship.radius));
      ctx.translate(
        Math.floor(pos.x)
        ,Math.floor(pos.y)
      );
      // Rotate to Player.Direction
      ctx.rotate(this.ship.a);
      // Draw Image
      ctx.drawImage(
        this.jetImage
        ,0
        ,0
        ,this.jetImage.width
        ,this.jetImage.height
        ,Math.floor(this.jetImage.width * -0.5)
        ,Math.floor(this.jetImage.height * -0.5)
        ,this.jetImage.width
        ,this.jetImage.height
      );
      ctx.restore();
    }
    ctx.save();
    // Move to Draw Position
    ctx.translate(
      Math.floor(this.ship.pos.x)
      ,Math.floor(this.ship.pos.y)
    );
    // Rotate to Player.Direction
    ctx.rotate(this.ship.a);
    // Draw Image
    ctx.drawImage(
      this.shipImage
      ,0
      ,0
      ,this.shipImage.width
      ,this.shipImage.height
      ,Math.floor(this.shipImage.width * -0.5)
      ,Math.floor(this.shipImage.height * -0.5)
      ,Math.floor(this.shipImage.width)
      ,Math.floor(this.shipImage.height)
    );
    ctx.restore();
  };
  drawRocks(ctx) {
    for (let i = 0; i < this.rocks.length; i++) {
      if (this.rocks[i].alive) {
        ctx.save();
        // Move to Draw Position
        ctx.translate(
          Math.floor(this.rocks[i].pos.x)
          ,Math.floor(this.rocks[i].pos.y)
        );
        // Rotate to Player.Direction
        ctx.rotate(this.rocks[i].a);
        // Draw Image
        ctx.drawImage(
          this.rockImages[this.rocks[i].size - 1]
          ,0
          ,0
          ,this.rockImages[this.rocks[i].size - 1].width
          ,this.rockImages[this.rocks[i].size - 1].height
          ,Math.floor(this.rockImages[this.rocks[i].size - 1].width * -0.5)
          ,Math.floor(this.rockImages[this.rocks[i].size - 1].height * -0.5)
          ,Math.floor(this.rockImages[this.rocks[i].size - 1].width)
          ,Math.floor(this.rockImages[this.rocks[i].size - 1].height)
        );
        ctx.restore();
      }
    }
  };
  drawVision(ctx) {
    for (let i = 0; i < this.maxRays; i++) {
      let countI = this.inputCount * (this.inputFrames - 1) + i;
      let pos = this.ship.pos.add(Vector.fromAngle(
        (i / this.maxRays * Math.PI * 2) + this.ship.a).mul(this.vision[countI] * this.rayDist)
      );
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.moveTo(Math.floor(this.ship.pos.x), Math.floor(this.ship.pos.y));
      ctx.lineTo(Math.floor(pos.x), Math.floor(pos.y));
      ctx.stroke();
    }
  };
  drawUI(ctx) {
    // Border & background
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(SCREEN.height, 0, SCREEN.width - SCREEN.height, SCREEN.height);
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgb(256,0,0)";
    ctx.rect(SCREEN.height, 0, SCREEN.width - SCREEN.height, SCREEN.height);
    ctx.stroke();

    let y = this.uiPadding.headerLargeY;
    // Current Generation Info
    ctx.font = "24px Monospace";
    ctx.fillStyle = "rgb(0,256,256)";
    ctx.textAlign = "center";
    let genText = `Generation ${this.species.generation}`;
    ctx.fillText(genText, SCREEN.height + Math.floor((SCREEN.width - SCREEN.height) * 0.5), y);
    y += this.uiPadding.headerSmallY;
    ctx.font = "16px Monospace";
    ctx.textAlign = "right";
    ctx.fillText("Brain", SCREEN.height + this.uiPadding.leftColumnX, y);
    ctx.textAlign = "left";
    ctx.fillText((this.brain + 1), SCREEN.height + this.uiPadding.rightColumnX, y);
    y += this.uiPadding.line;
    ctx.textAlign = "right";
    ctx.fillText("Rocks", SCREEN.height + this.uiPadding.leftColumnX, y);
    ctx.textAlign = "left";
    ctx.fillText(this.score, SCREEN.height + this.uiPadding.rightColumnX, y);
    y += this.uiPadding.line;
    ctx.textAlign = "right";
    ctx.fillText("Time", SCREEN.height + this.uiPadding.leftColumnX, y);
    ctx.textAlign = "left";
    ctx.fillText(Math.floor((this.maxGameTime - this.gameTime) / 60), SCREEN.height + this.uiPadding.rightColumnX, y);

    y += this.uiPadding.headerLargeY;
    // Best Generation
    ctx.font = "24px Monospace";
    ctx.textAlign = "center";
    let bestText = "Best";
    ctx.fillText(bestText, SCREEN.height + Math.floor((SCREEN.width - SCREEN.height) * 0.5), y);
    y += this.uiPadding.headerSmallY;
    ctx.font = "16px Monospace";
    ctx.textAlign = "right";
    ctx.fillText("Generation", SCREEN.height + this.uiPadding.leftColumnX, y);
    ctx.textAlign = "left";
    ctx.fillText(this.species.bestGeneration, SCREEN.height + this.uiPadding.rightColumnX, y);
    y += this.uiPadding.line;
    ctx.textAlign = "right";
    ctx.fillText("Score", SCREEN.height + this.uiPadding.leftColumnX, y);
    ctx.textAlign = "left";
    ctx.fillText(this.species.bestScore.toFixed(1), SCREEN.height + this.uiPadding.rightColumnX, y);

    // Vision Button
    y += this.uiPadding.headerLargeY;
    ctx.font = "16px Monospace";
    ctx.textAlign = "right";
    ctx.fillText("Vision", SCREEN.height + this.uiPadding.leftColumnX, this.visionButton.y + this.visionButton.height);
    this.visionButton.draw(ctx);

    // Speed Slider
    ctx.font = "16px Monospace";
    ctx.textAlign = "center";
    let speedText = `Game Speed x${this.gameSpeed}`;
    ctx.fillText(speedText, 500, 300);
    this.speedSlider.draw(ctx);
  };
};