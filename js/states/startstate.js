'use strict';

class StartState extends State {
  constructor() {
    super();
    this.backgroundImage = ASSETS.images.background_start.fullImage;
    this.gameCarousel = new Carousel(140, 80, 360, 240);
    this.previousButton = new ImageButton(
      32
      ,148
      ,64
      ,64
      ,ASSETS.images.uiButtons.cut(0, 0, 64, 64)
      ,ASSETS.images.uiButtons.cut(0, 64, 64, 64)
    );
    this.nextButton = new ImageButton(
      544
      ,148
      ,64
      ,64
      ,ASSETS.images.uiButtons.cut(64, 0, 64, 64)
      ,ASSETS.images.uiButtons.cut(64, 64, 64, 64)
    );

    // Game Defnitions
    this.gameCarousel.addItem(
      ASSETS.images.background_bird_brains.fullImage
      ,() => {
        STATE = new BirdBrainsGame();
        STATE.update(0);
      }
    );
    this.gameCarousel.addItem(
      ASSETS.images.background_space_hammer.fullImage
      ,() => {
        STATE = new SpaceHammerGame();
        STATE.update(0);
      }
    );
  };
  update(dt) {
    this.gameCarousel.update();
    this.previousButton.update();
    this.nextButton.update();
    if (this.previousButton.clicked) {
      this.gameCarousel.previous();
    } else if (this.nextButton.clicked) {
      this.gameCarousel.next();
    }
  };
  render(ctx) {
    // Main Menu Background
    ctx.drawImage(
      this.backgroundImage
      ,0
      ,0
      ,this.backgroundImage.width
      ,this.backgroundImage.height
      ,0
      ,0
      ,SCREEN.width
      ,SCREEN.height
    );
    // Game Carousel
    this.gameCarousel.draw(ctx);
    // Buttons
    this.previousButton.draw(ctx);
    this.nextButton.draw(ctx);
  };
};