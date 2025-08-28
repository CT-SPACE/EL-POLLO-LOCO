class CollectableObject extends DrawableObject {
  x = 320;
  y = 300;
  width = 100;
  height = 100;
  audioManager;
  audio;
  images = [];
  currentImage = 0;
  world;
  level;
  count = 40;
  bottlesCount = 15;
  rows = 2;
  distanceX = 100;
  distanceY = 10;
  minX = 280;
  maxX = 3600;
  positions = [];

  static BOTTLE_GROUND = [
    "./img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "./img/6_salsa_bottle/2_salsa_bottle_on_ground_.png",
  ];
  static COINS_BLINKING = ["./img/8_coin/coin_1.png", "./img/8_coin/coin_2.png"];
  offset;

  /**
   * Initializes all collectable Objects like coins and bottles.
   * @param {String} kindof
   * @param {Number} count
   * @param {Number} x
   * @param {Number} y
   * @param {Number} height
   * @param {Number} width
   * @param {Number} distanceX
   * @param {Number} Row2Probability
   */

  /**
   * Initializes all collectable Objects like coins and bottles.
   */
  constructor(kindof, count, x, y, height, width, distanceX, Row2Probability) {
    super();
    this.audio = audioManager;
    this.world = world;
    this.kindof = kindof;
    this.kindofCollectableObject(this.kindof);
    this.setPosition(x, y);
    this.height = height;
    this.width = width;
    this.animateBasedOnKind();
  }

  /**
   * Sets position within valid boundaries
   */
  setPosition(x, y) {
    this.x = Math.min(Math.max(x, this.minX), this.maxX);
    this.y = y;
  }

  /**
   * Seperates the logic for loading images based on the type
   */
  kindofCollectableObject(kindof) {
    if (kindof === "coin") {
      this.coinsBlinking();
    } else if (kindof === "bottle") {
      this.bottleOnGround();
    }
  }

  /**
   * Creates coins and distributes them in the game world
   */
  static createCoins(count, distanceX, Row2Probability) {
    let coins = [];
    let positions = this.getOptimizedCoinPositions(count, Row2Probability);
    positions.forEach((pos) => {
      coins.push(this.createSingleCoin(pos.x, pos.y, distanceX));
    });
    return coins;
  }

  /**
   * Gets optimized positions for better distribution
   */
  static getOptimizedCoinPositions(count, Row2Probability) {
    let levelMinX = 110;
    let levelMaxX = 3400;
    let levelWidth = levelMaxX - levelMinX;
    let segmentWidth = levelWidth / count;

    return this.generateAllCoinPositions(count, segmentWidth, levelMinX, Row2Probability);
  }

  /**
   * Generates all coin positions across the level
   */
  static generateAllCoinPositions(count, segmentWidth, levelMinX, Row2Probability) {
    let positions = [];
    let yRow1 = 280;
    let yRow2 = 150;
    let coinsPerRow = Math.ceil(count / 2);

    this.fillCoinPositionsArray(positions, count, coinsPerRow, segmentWidth, levelMinX, yRow1, yRow2, Row2Probability);
    return positions;
  }

  /**
   * Fills the positions array with coin coordinates
   */
  static fillCoinPositionsArray(positions, count, coinsPerRow, segmentWidth, levelMinX, yRow1, yRow2, Row2Probability) {
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < coinsPerRow; i++) {
        if (positions.length >= count) break;
        let globalIndex = row * coinsPerRow + i;
        let position = this.getCoinPosition(globalIndex, segmentWidth, levelMinX, row, yRow1, yRow2, Row2Probability);
        positions.push(position);
      }
    }
  }

  /**
   * Gets position for a single coin
   */
  static getCoinPosition(index, segmentWidth, levelMinX, row, yRow1, yRow2, Row2Probability) {
    let x = this.calculateCoinX(index, segmentWidth, levelMinX);
    let y = this.calculateCoinY(row, yRow1, yRow2, Row2Probability);

    return { x, y };
  }

  /**
   * Calculates X position for a coin
   */
  static calculateCoinX(index, segmentWidth, levelMinX) {
    let segmentStart = levelMinX + index * segmentWidth;
    let randomOffset = Math.random() * (segmentWidth * 0.7);

    return segmentStart + randomOffset;
  }

  /**
   * Calculates Y position for a coin
   */
  static calculateCoinY(row, yRow1, yRow2, Row2Probability) {
    if (row === 0) {
      return yRow1;
    }
    return Math.random() < Row2Probability ? yRow2 : yRow1;
  }

  /**
   * Checks for collision between Pepe and bottles
   */
  checkForBottleCollisions(character, bottles) {
    this.bottles = bottles;
    this.character = character;
    intervalsToStop(() => {
      this.checkBottleCollisionsInterval();
    }, 500);
  }

  /**
   * Interval function for bottle collision check
   */
  checkBottleCollisionsInterval() {
    this.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.bottles.splice(index, 1);
      }
    });
  }

  /**
   * Animate collectible objects
   */
  animateThings(images) {
    if (this.kindof !== "bottle" && this.kindof !== "coin") return;
    this.images = images;
    this.updateCurrentImage();
  }

  /**
   * Updates the current image in animation sequence
   */
  updateCurrentImage() {
    const i = this.currentImage % this.images.length;
    const path = this.images[i];
    if (imgCache[path]) {
      this.img = imgCache[path];
    }
    this.currentImage++;
  }

  /**
   * Sets up animations based on object type
   */
  animateBasedOnKind() {
    if (this.kindof === "coin") {
      this.setupCoinAnimation();
    } else if (this.kindof === "bottle") {
      this.setupBottleAnimation();
    }
  }

  /**
   * Sets up coin animation
   */
  setupCoinAnimation() {
    intervalsToStop(() => {
      this.animateThings(CollectableObject.COINS_BLINKING);
    }, 300);
  }

  /**
   * Sets up bottle animation
   */
  setupBottleAnimation() {
    intervalsToStop(() => {
      this.animateThings(CollectableObject.BOTTLE_GROUND);
    }, 800);
  }

  /**
   * Loads the images for the blinking coins and sets the offset for collision detection.
   */
  coinsBlinking() {
    this.loadImages(CollectableObject.COINS_BLINKING);
    this.img = imgCache[CollectableObject.COINS_BLINKING[0]];
    this.offset = { left: 30, right: 30, top: 30, bottom: 30 };
  }

  /**
   * Loads the images for the bottles on the ground and sets the offset for collision detection.
   */
  bottleOnGround() {
    this.loadImages(CollectableObject.BOTTLE_GROUND);
    this.img = imgCache[CollectableObject.BOTTLE_GROUND[0]];
    this.offset = { left: 60, right: 5, top: 5, bottom: 5 };
  }

  /**
   * Creates a single coin object
   */
  static createSingleCoin(x, y, distanceX) {
    return new CollectableObject("coin", 1, x, y, 100, 100, distanceX);
  }

  /**
   * Creates bottles distributed across the game world
   */
  static createBottles(bottlesCount, distanceX) {
    const bottles = [];
    const height = 70;
    const width = 70;
    const y = 380;
    for (let i = 0; i < bottlesCount; i++) {
      const x = this.getRandomBottlePosition();
      bottles.push(this.createSingleBottle(x, y, height, width, distanceX));
    }
    return bottles;
  }

  /**
   * Generates a random x-position for a bottle
   */
  static getRandomBottlePosition() {
    return Math.random() * (3400 - 100) + 100;
  }

  /**
   * Creates a single bottle object
   */
  static createSingleBottle(x, y, height, width, distanceX) {
    return new CollectableObject("bottle", 1, x, y, height, width, distanceX);
  }

  /**
   * Sets the Interval to check for collision between Pepe and coins.
   * This function is used to remove coins from the game when Pepe collects them.
   * If a collision is detected, the coin is removed from the array.
   * @param {Object} character
   * @param {Array} coins
   */
  checkForCoinCollisions(character, coins) {
    intervalsToStop(this.intervalForCheckForCoinCollisions(character, coins), 500);
  }

  /**
   * Checks for collisions between Pepe and coins.
   * @param {String} character
   * @param {Number} coins
   */
  intervalForCheckForCoinCollisions(character, coins) {
    this.character = character;
    coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.world.highscoreManager.addCollectedCoin();
        coins.splice(index, 1);
      }
    });
  }
}
