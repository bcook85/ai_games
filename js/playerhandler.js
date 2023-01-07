/*
  Holds global player information and system objects
*/

class PlayerHandler {
  constructor() {
    this.isPaused = false;
    this.screen = new Screen(document.getElementById("screen"), 640, 360, true);
    this.mouse = new MouseManager(this.screen.canvas);
    this.keys = new KeyManager();
    this.state = new LoadState(); // Default State, wait to load assets
    this.images =  {
      "sprites_bird_brains": new SpriteSheet("images/sprites_bird_brains.png")
    };
    this.sounds = {};
  };
  areAssetsLoaded() {
    // Sprites
    for (let asset in this.images) {
      if (Object.prototype.hasOwnProperty.call(this.images, asset)) {
        if (!this.images[asset].loaded) {
          return false;
        }
      }
    }
    // Audio
    for (let asset in this.sounds) {
      if (Object.prototype.hasOwnProperty.call(this.sounds, asset)) {
        if (!this.sounds[asset].loaded) {
          return false;
        }
      }
    }
    return true;
  };
};
