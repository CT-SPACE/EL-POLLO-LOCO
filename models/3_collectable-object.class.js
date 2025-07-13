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
  count = 50;
  bottlesCount = 15;
  rows = 2;
  distanceX = 100;
  distanceY = 10;
  minX = 280;
  maxX = 3600;

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
  constructor(kindof, count, x, y, height, width, distanceX, Row2Probability) {
    super();
    this.audio = audioManager;
    this.kindof = kindof; 
    this.kindofCollectableObject(this.kindof);
    this.x = x < this.minX ? this.minX : x > this.maxX ? this.maxX : x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.animateBasedOnKind(); 
  }

  /**
   * Seperates the logic for loading images based on the type of collectable object.
   * @param {String} kindof 
   */
  kindofCollectableObject(kindof){
    if (kindof === "coin") {
      this.loadImages(CollectableObject.COINS_BLINKING);
      this.img = imgCache[CollectableObject.COINS_BLINKING[0]];
      this.offset = { left: 30, right: 30, top: 30, bottom: 30 };
    } else if (kindof === "bottle") {
      this.loadImages(CollectableObject.BOTTLE_GROUND);
      this.img = imgCache[CollectableObject.BOTTLE_GROUND[0]];
      this.offset = { left: 60, right: 5, top: 5, bottom: 5 };
    }
    }

/**
 * Fills an Array with coins and spreads them across the game world.
 * The coins are placed in two rows with a specified probability for the second row.
 * @param {Number} count - Total number of coins to create.
 * @param {Number} distanceX - Horizontal distance between coins.
 * @param {Number} Row2Probability - Probability of placing a coin in the second row.
 */
static createCoins(count, distanceX, Row2Probability) {
  let coins = [], yRow1 = 280, yRow2 = 150, coinsPerRow = Math.ceil(count);
  for (let row = 0; row < 2; row++)
    for (let i = 0; i < coinsPerRow; i++) {
      let index = row * coinsPerRow + i;
      if (index >= count) break;
      let x = i * distanceX + 110;
      let y = Math.random() < Row2Probability ? yRow2 : yRow1;
      coins.push(new CollectableObject("coin", count, x, y, 100, 100, distanceX, Row2Probability));
    }
  return coins;
}

/**
 * Creates bottles and spread them across the game world.
 * @param {Number} bottlesCount 
 * @param {Number} distanceX 
 * @returns bottles
 */
  static createBottles(bottlesCount, distanceX) {
    let bottles = [];
    this.height = 70;
    this.width = 70;
    let y = 380; 
    for (let i = 0; i < bottlesCount; i++) {
      if (i >= bottlesCount) break;
      let x = Math.random() * (3400 - 100) + 100; 
      bottles.push(
        new CollectableObject("bottle", bottlesCount, x, y, this.height, this.width, distanceX)
      );
    }
    return bottles;
  }

  /**
   * Checks for collision between Pepe and bottles.
   * If a collision is detected, the bottle is removed from the array.
   * @param {Object} character 
   * @param {Array} bottles 
   */
  checkForBottleCollisions(character, bottles) {
    this.bottles = bottles;

    this.character = character;
    setInterval(() => {
      this.bottles.forEach((bottle, index) => {
        if (this.character.isColliding(bottle)) {
          this.bottles.splice(index, 1);
        }
      });
    }, 500);
  }

  /**
   * Checks for collision between Pepe and coins.
   * This function is used to remove coins from the game when Pepe collects them.
   * If a collision is detected, the coin is removed from the array.
   * @param {Object} character 
   * @param {Array} coins 
   */
  checkForCoinCollisions(character, coins) {
    this.character = character;
    setInterval(() => {
      coins.forEach((coin, index) => {
        if (this.character.isColliding(coin)) {
          coins.splice(index, 1);
        }
      });
    }, 500);
  }

/**
 * Iterate through the images of the collectable object.
 * @param {String} images 
 */
  animateThings(images) {
    if (this.kindof === "bottle" || this.kindof === "coin") {
      this.images = images;
      let i = this.currentImage % this.images.length;
      let path = this.images[i];
      if (imgCache[path]) {
        this.img = imgCache[path];
      }
      this.currentImage++;
    }
  }

  /**
   * Animates the collectable object based on its kind.
   */
  animateBasedOnKind() {
    if (this.kindof === "coin") {
      setInterval(() => {
        this.animateThings(CollectableObject.COINS_BLINKING);
      }, 300);
    } else if (this.kindof === "bottle") {
      setInterval(() => {
        this.animateThings(CollectableObject.BOTTLE_GROUND); 
      }, 800);
    }
  }
}
