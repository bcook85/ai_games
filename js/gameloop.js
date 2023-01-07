'use strict';

// Global Objects
var SCREEN = new Screen(document.getElementById("screen"), 640, 360, true);
var MOUSE = new MouseManager(SCREEN.canvas);
var KEYS = new KeyManager();
var ASSETS = GetAssets(); //assets/assetlist.js
var STATE = new LoadState(); // default state, wait for assets to load
/*
  Could add a MENU state that can be shown over STATE
    Only STATE.update() if !MENU.isPaused
  Each state would call if (KEYS.isPress("Space") {MENU.isPaused = !MENU.isPaused})
    Don't call on StartState
*/

function startGame() {
  // HTML Elements
  let title = document.title;

  // Timing
  let now = performance.now();
  let last = now;
  let elapsed = 0;
  let deltaTime = 0;
  let animationFrameId = 0;
  let fpsFrame = 0;
  let fpsTime = 0;

  // Game Loop
  function GameLoop() {
    // Loop
    animationFrameId = requestAnimationFrame(GameLoop);

    // Timing
    now = performance.now();
    elapsed = now - last;
    last = now;
    deltaTime = Math.min(elapsed, 50) * 0.001;
    // FPS
    fpsFrame += 1;
    fpsTime += elapsed;
    if (fpsFrame >= 60) {
      document.title = `${title} - ${Math.floor(1000 / fpsTime * fpsFrame)}fps`;
      fpsFrame = 0;
      fpsTime = 0;
    }

    // Update
    STATE.update(deltaTime);

    // Render
    STATE.render(SCREEN.ctx);
  }

  // Start Loop
  animationFrameId = requestAnimationFrame(GameLoop);
}
startGame();