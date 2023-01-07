'use strict';

class BirdBrainsGame extends State {
  constructor() {
    super();
    this.birdImage = ASSETS.images.sprites_bird_brains.cut(360, 64, 16, 16);
    this.backgroundImage = ASSETS.images.sprites_bird_brains.cut(0, 0, 360, 360);
    this.neckImage = ASSETS.images.sprites_bird_brains.cut(360, 0, 64, 32);
    this.mouthImage = ASSETS.images.sprites_bird_brains.cut(360, 32, 64, 32);
    this.birdX = 120;
    this.birdY = 180;
    this.birdR = 8;
    this.birds = [];
    this.pipes = [];
    this.pipeMouthHeight = 32;
    this.birdBrains = new Species(100, [6, 4, 2], 0.1, 0.25);
    this.gravity = 0.4;
    this.aliveCount = 0;
    this.score = 0;
    this.bestPipes = 0;
    this.pipeCount = 0;
    this.pipeXSpawn = 0;
    this.pipeGapSize = 0;
    this.pipeSpeed = 0;
    this.uiPadding = {
      "headerLargeY": 76
      ,"headerSmallY": 28
      ,"line": 18
      ,"rightColumnX": 150
      ,"leftColumnX": 130
    };

    this.initBirds();
    this.initPipes();
  };
  initBirds() {
    this.birds = [];
    for (let i = 0; i < this.birdBrains.populationSize; i++) {
      this.birds.push(new Bird(
        this.birdX
        ,this.birdY
        ,this.birdR
      ));
    }
  };
  initPipes() {
    this.pipes = [];
    this.pipeXSpawn = 64;
    this.pipeGapSize = 128;
    this.pipeSpeed = 2.5;
    this.newPipe();
  };
  newPipe() {
    let top = this.pipeMouthHeight + (Math.random() * (SCREEN.height - (this.pipeMouthHeight * 2) - this.pipeGapSize));
    this.pipes.push(new Pipe(
      SCREEN.height
      ,top
      ,this.pipeGapSize
    ));
  };
  getCurrentPipe() {
    for (let i = 0; i < this.pipes.length; i++) {
      if (this.pipes[i].x + this.pipes[i].width >= this.birdX - this.birdR) {
        return this.pipes[i];
      }
    }
    return undefined;
  };
  nextGeneration() {
    // Neural Networks
    this.birdBrains.nextGeneration();
    // Reset Counters
    this.score = 0;
    this.pipeCount = 0;
    this.aliveCount = 0;
    // Reset Birds and Pipes
    this.initBirds();
    this.initPipes();
  };
  update(dt) {
    // Update Score
    this.score += 1;
    // Pipes
    this.updatePipes();
    // Birds
    this.updateBirds();
    // Reset if all dead
    if (this.aliveCount == 0) {
      this.nextGeneration();
    }
  };
  updateBirds() {
    this.aliveCount = 0;
    let pipe = this.getCurrentPipe();
    for (let i = 0; i < this.birds.length; i++) {
      if (this.birds[i].alive) {
        // Bird Vision
        let inputs = [
          this.birds[i].y / SCREEN.height
          ,this.birds[i].ySpeed / 50
          ,Math.max(0, pipe.x / SCREEN.height)
          ,pipe.top / SCREEN.height
          ,pipe.bottom / SCREEN.height
          ,1
        ];
        // Bird Control
        let controls = this.birdBrains.brains[i].feedForward(inputs);
        // Apply Gravity
        this.birds[i].ySpeed += this.gravity;
        // Apply Jump
        if (controls[0] - controls[1] > 0) {
          this.birds[i].jump();
        }
        // Apply Speed
        this.birds[i].y += this.birds[i].ySpeed;
        // Out of Bounds check
        if (this.birds[i].y + this.birdR >= SCREEN.height) {
          this.birds[i].alive = false;
        } else if (this.birds[i].y - this.birdR <= 0) {
          this.birds[i].alive = false;
        }
        // Pipe Collision
        if (pipe.collides(this.birds[i].x, this.birds[i].y, this.birds[i].r)) {
          this.birds[i].alive = false;
          // Add points proportional to distance to center of pipe gap
          let proxPoints = SCREEN.height - (Math.abs((pipe.top + (this.pipeGapSize * 0.5)) - this.birds[i].y));
          this.birdBrains.addScore(i, proxPoints * 0.1);
        }
        // Update Alive Count
        if (this.birds[i].alive) {
          this.aliveCount += 1;
        } else {
          this.birdBrains.addScore(i, this.score * this.pipeCount);
          if (this.pipeCount > this.bestPipes) {
            this.bestPipes = this.pipeCount;
          }
        }
      }
    }
  };
  updatePipes() {
    // Move Pipes
    for (let i = 0; i < this.pipes.length; i++) {
      this.pipes[i].x -= this.pipeSpeed;
    }
    // Check Pipe Cleared
    if (this.pipes[0].x + this.pipes[0].width < this.birdX) {
      if (!this.pipes[0].cleared) {
        this.pipes[0].cleared = true;
        this.pipeCount += 1;
        // Update Difficulty
        if (this.pipeCount % 3 == 0) {
          this.pipeXSpawn += 8;
          this.pipeGapSize -= 6;
          this.pipeSpeed += 0.15;
        }
      }
    }
    // Remove off-screen pipes
    if (this.pipes[0].x + this.pipes[0].width < 0) {
      this.pipes.splice(0, 1);
    }
    // Add New Pipe
    if (this.pipes[this.pipes.length - 1].x < this.pipeXSpawn) {
      this.newPipe();
    }
  };
  render(ctx) {
    // Background
    ctx.drawImage(
      this.backgroundImage
      ,0
      ,0
      ,this.backgroundImage.width
      ,this.backgroundImage.height
      ,0
      ,0
      ,SCREEN.height
      ,SCREEN.height
    );
    // Birds
    for (let i = 0; i < this.birds.length; i++) {
      if (this.birds[i].alive) {
        this.birds[i].draw(ctx, this.birdImage);
      }
    }

    // Pipes
    for (let i = 0; i < this.pipes.length; i++) {
      this.pipes[i].draw(ctx, this.neckImage, this.mouthImage);
    }

    // Menu
    this.drawUI(ctx);
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
    let genText = `Generation ${this.birdBrains.generation}`;
    ctx.fillText(genText, SCREEN.height + Math.floor((SCREEN.width - SCREEN.height) * 0.5), y);
    y += this.uiPadding.headerSmallY;
    ctx.font = "16px Monospace";
    ctx.textAlign = "right";
    ctx.fillText("Alive", SCREEN.height + this.uiPadding.leftColumnX, y);
    ctx.textAlign = "left";
    ctx.fillText(this.aliveCount, SCREEN.height + this.uiPadding.rightColumnX, y);
    y += this.uiPadding.line;
    ctx.textAlign = "right";
    ctx.fillText("Pipes", SCREEN.height + this.uiPadding.leftColumnX, y);
    ctx.textAlign = "left";
    ctx.fillText(this.pipeCount, SCREEN.height + this.uiPadding.rightColumnX, y);
    y += this.uiPadding.line;
    ctx.textAlign = "right";
    ctx.fillText("Distance", SCREEN.height + this.uiPadding.leftColumnX, y);
    ctx.textAlign = "left";
    ctx.fillText(this.score, SCREEN.height + this.uiPadding.rightColumnX, y);

    // Best Generation
    y += this.uiPadding.headerLargeY;
    ctx.font = "24px Monospace";
    ctx.textAlign = "center";
    let bestText = "Best";
    ctx.fillText(bestText, SCREEN.height + Math.floor((SCREEN.width - SCREEN.height) * 0.5), y);
    y += this.uiPadding.headerSmallY;
    ctx.font = "16px Monospace";
    ctx.textAlign = "right";
    ctx.fillText("Generation", SCREEN.height + this.uiPadding.leftColumnX, y);
    ctx.textAlign = "left";
    ctx.fillText(this.birdBrains.bestGeneration, SCREEN.height + this.uiPadding.rightColumnX, y);
    y += this.uiPadding.line;
    ctx.textAlign = "right";
    ctx.fillText("Score", SCREEN.height + this.uiPadding.leftColumnX, y);
    ctx.textAlign = "left";
    ctx.fillText(this.birdBrains.bestScore.toFixed(1), SCREEN.height + this.uiPadding.rightColumnX, y);
    y += this.uiPadding.line;
    ctx.textAlign = "right";
    ctx.fillText("Pipes", SCREEN.height + this.uiPadding.leftColumnX, y);
    ctx.textAlign = "left";
    ctx.fillText(this.bestPipes, SCREEN.height + this.uiPadding.rightColumnX, y);
  };
};