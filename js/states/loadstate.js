'use strict';

class LoadState extends State {
  constructor() {
    super();
  };
  update(dt) {
    // Images
    for (let asset in ASSETS.images) {
      if (Object.prototype.hasOwnProperty.call(ASSETS.images, asset)) {
        if (!ASSETS.images[asset].loaded) {
          return;
        }
      }
    }
    // Audio
    for (let asset in ASSETS.sounds) {
      if (Object.prototype.hasOwnProperty.call(ASSETS.sounds, asset)) {
        if (!ASSETS.sounds[asset].loaded) {
          return;
        }
      }
    }
    // Switch to Start State
    STATE = new StartState();
    STATE.update(dt);
  };
  render(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, SCREEN.width, SCREEN.height);
    ctx.font = "64px Monospace";
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.textAlign = "center";
    ctx.fillText(
      "Loading..."
      ,Math.floor(SCREEN.width * 0.5)
      ,Math.floor(SCREEN.height * 0.5)
    );
  };
};