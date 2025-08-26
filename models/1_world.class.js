class World {
  level = Level01;
  highscoreManager;
  keyboard;
  background_static = new staticBackground();
  minichicken;
  statusBarPepe;
  statusBarCoin;
  statusBarChilli;
  statusBarEndboss;
  throwableObjects;
  character;
  chicken;
  bottles;
  cameraX;
  canThrow;
  canvas;
  collectedBottles = 0;
  collectedCoins = 0;
  countBottles = 15;
  ctx;
  enemies;
  energy;
  isGameEnding;
  level = Level01;
  offset;

  /**
   * Initializes the World class components, sets up the game enviroment and gets the game ready to play.
   * @param {HTMLCanvasElement} canvas
   * @param {Level} level
   */
  constructor(canvas, level) {
    this.ctx = canvas.getContext("2d");
    this.cameraX = 0;
    this.level = level;
    this.canvas = canvas;
    this.minichicken = this.level.enemies.find((enemy) => enemy.type === "minichicken");
    this.statusBarPepe = new StatusBarPepe();
    this.statusBarCoin = new StatusBarCoin();
    this.statusBarChilli = new StatusBarChilli();
    this.statusBarEndboss = new StatusBarEndboss();
    this.throwableObjects = [new ThrowableObject()];
    this.character = new Pepe();
    this.chicken = this.level.enemies.find((enemy) => enemy.type === "chicken");
    this.highscoreManager = new HighscoreManager(this);
    this.endbossOfEnemies = this.level.enemies.find((enemy) => enemy.type === "endboss");
    this.isGameEnding = false;
    this.throwableObjects = [];
    this.canThrow = true;
    this.collectedCoins = this.statusBarCoin.coincount;
    DrawableObject.draw(this);
    DrawableObject.addObjectsForDraw(this);
    this.setWorld();
    this.run();
    this.checkThrowObjects();
  }

  /**
   * Create the World with all needed Components.
   */
  setWorld() {
    // this.character.keyboard = keyboard;
    this.character.world = this;
    this.minichicken.world = this;
    this.endbossOfEnemies.world = this;
    this.highscoreManager.world = this;
    this.statusBarCoin.world = this;
    this.statusBarPepe.world = this;
    this.statusBarChilli.world = this;
    this.statusBarEndboss.world = this;
  }

  /**
   * Runs the Main game interval.
   * checks very 1/60 second the collision for all characters, enemies and objects.
   */
  run() {
    intervalsToStop(() => {
      this.checkCollisions();
      this.checkCollisionBottleWithEndboss();
      this.checkCollisionPepeWithEndboss();
      this.highscoreManager.updateScore(this);
    }, 1000 / 60);
  }
 

  /**
   * Creates the Endboss on the Map with a distance of 3800.
   * @returns
   */
  handleEndboss() {
    if (this.character.x > 3100 || EndBossVisible === true) {
      EndBossVisible = true;
      DrawableObject.addToMap(this.statusBarEndboss, this.ctx);
    }
    if (this.isPepeNearEndboss() < 700) {
      EndBossClose = true;
      DrawableObject.addToMap(this.statusBarEndboss, this.ctx);
      EndBossVisible = true;
      this.endbossOfEnemies.status = true;
    } else {
      this.endbossOfEnemies.status = false;
      EndBossClose = false;
    }
    return;
  }

  /**
   * Handled the Bottles that left in Pepe's pockets and can be thrown
   */
  checkThrowObjects() {
    let startThrow = Date.now();
    noBottles = false;
    intervalsToStop(() => {
      this.intervalForCheckThrowObjects(startThrow)
    }, 50);
    throwDuration = 0;
  }

  /**
   * Interval function to check if Pepe can throw a bottle.
   * @param {Date} startThrow 
   */
  intervalForCheckThrowObjects(startThrow){
      let now = Date.now();
      let delta = now - startThrow;
      if (keyboard.THROW && this.collectedBottles === 0) {
        this.noBottlesTrue();
      }
      if (keyboard.THROW && this.collectedBottles > 0 && delta > 1000 && this.canThrow) {
        this.throwBottle();
      }
  }

  /**
   * Helper Function in case no bottles ar left in Pepe's pockets.
   * It will play a sound and set the noBottles variable to true.
   */
  noBottlesTrue() {
    noBottles = true;
    audioManager.loadAudio("noBottlesLeft", "./audio/bottle_no.mp3");
    audioManager.playEffect("noBottlesLeft", { volume: 0.5 });
    keyboard.THROW = false;
  }

  /**
   * Handle the number of bottles remaining in Pepe's pockets and give the throw the physical throw track
   */
  throwBottle() {
    let duration = Math.min(throwDuration || 0, 1000);
    let speed = 10 + (duration / 1000) * 20;
    let direction = this.character.otherDirection || false;
    this.handleBottleByThrowing(speed, direction);
    this.collectedBottles--;
    this.statusBarChilli.setPercentage(this.collectedBottles);
    this.canThrow = false;
    setTimeout(() => {
      this.canThrow = true;
    }, 400);
  }

  /**
   * Helper function to handle the throwing of bottles.
   * It creates a new ThrowableObject and sets its speed and direction based on the character's
   * @param {Number} speed
   * @param {String} direction
   */
  handleBottleByThrowing(speed, direction) {
    let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 150, this);
    bottle.speedX = direction ? -speed : speed;
    bottle.speedY = speed;
    bottle.otherDirection = direction;
    this.throwableObjects.push(bottle);
    keyboard.THROW = false;
    bottle.throw();
  }

  /**
   * Checks the Collision of Pepe with Enemies and collectable Objects like coins and bottles
   */
  checkCollisions() {
    this.checksCollisionForEachEnemy(); // TEST
    // intervalsToStop(this.checksCollisionForEachEnemy(), 400);
    this.checkCollisionsCoins(this.character);
    this.checkCollisionsBottles();
  }

  /**
   * Checks the collision for each enemy in the level.
   * It handles the collision with the endboss and other enemies.
   */
  checksCollisionForEachEnemy() {
    this.level.enemies.forEach((enemy) => {

      if (enemy.type === "endboss") return;
      if (this.character.isColliding(enemy) && this.character.isCollidingAboveEnemy(enemy) && this.character.speedY < 0 && !enemy.isDead) {
        this.chickenForCheckCollisions(enemy);
      }
      this.collidesEnemiesOnEnergyLevel(enemy);
    });
  }
  /**
   * Seperate the handling of standard chicken and mini chicken
   */
  chickenForCheckCollisions(enemy) {
    if (enemy.type === "minichicken") {
      this.jumpOnMiniChicken(enemy);
    } else {
      this.jumpOnStandardChicken(enemy);
      this.highscoreManager.addSquashedChicken();
    }
  }

  /**
   * Gives Pepe more speed when jumping on a minichicken
   * @param {Object} enemy
   */
  jumpOnMiniChicken(enemy) {
    enemy.animateBounce();
    clearInterval(enemy.animateWalkInterval);
    this.character.speedY = 40;
    this.character.speed = 30;
  }

  /**
   * The brown standard chicken can be killed by jumping on them.
   * @param {Object} enemy
   */
  jumpOnStandardChicken(enemy) {
    enemy.animateDeath();
    this.character.speedY = 20;
    this.character.speed = 20;
  }

  /**
   * Prepares the Energy for the statusbar of Pepe
   * @param {Object} enemy
   * @returns
   */
  collidesEnemiesOnEnergyLevel(enemy) {
    if (this.character.isColliding(enemy) && this.character.energy > 0 && !this.character.isAboveGround() && !enemy.isDead) {
      this.character.hit(enemy);
      this.statusBarPepe.setPercentage(this.character.energy);
    }
    if (this.character.isColliding(enemy) && this.character.energy == 0) {
      return;
    }
  }
  /**
   * Handles the collision of pepe and the endboss.
   * @returns
   */
  checkCollisionPepeWithEndboss() {
    if (
      this.endbossOfEnemies &&
      this.character.isColliding(this.endbossOfEnemies) &&
      this.character.energy > 0
    ) {
      this.character.hit(this.endbossOfEnemies);
      this.statusBarPepe.setPercentage(this.character.energy);
    }
    if (this.endbossOfEnemies && this.character.energy == 0) {
      return;
    }
  }
  /**
   * Calculation of the Distance between Pepe and Enboss
   * @returns
   */
  isPepeNearEndboss() {
    const endbossX = this.endbossOfEnemies ? this.endbossOfEnemies.x : undefined;
    let distance = Math.abs(this.character.x - endbossX);

    return distance;
  }

  /**
   * Handles the coin collision with Pepe to collect them
   */
  checkCollisionsCoins() {
    let collected = this.statusBarCoin.coincount || 0;
    this.level.coins = this.level.coins.filter((coin) => {
      if (this.character.isColliding(coin)) {
        collected = this.coinsCollisionByPepe(collected);
        return false;
      }
      return true;
    });
    if (collected > 0) {

        this.statusBarCoin.coincount = collected;  
  // Aktualisiere die Anzeige
  this.statusBarCoin.setPercentage(collected);
    //  this.statusBarCoin.setPercentage(totalCoins - this.level.coins.length);
    }
  }

  /**
   * increments the variable “collected” by on
   * @returns
   */
  coinsCollisionByPepe(collected) {
    collected++;
    this.highscoreManager.addCollectedCoin(collected);
    audioManager.loadAudio("WorldCoinCollecting", "./audio/coin_success.mp3");
    audioManager.playEffect("WorldCoinCollecting", { loop: false, volume: 0.1, currentTime: 0 });
   return collected;
  }

  /**
   * Handles the bottle collision with Pepe to collect them
   */
  checkCollisionsBottles() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.collectedBottles++;
        this.level.bottles.splice(index, 1);
        this.statusBarChilli.setPercentage(this.collectedBottles);
        audioManager.loadAudio("WorldBottleCollecting", "./audio/bottle_collect.mp3");
        audioManager.playAudio("WorldBottleCollecting", { loop: false, volume: 0.2, currentTime: 0 });
      }
    });
  }

  /**
   * Prepare the required stats to hit the final boss with a bottle
   * @returns
   */
  checkCollisionBottleWithEndboss() {
    if (!this.endbossOfEnemies) return;
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isColliding(this.endbossOfEnemies) && !bottle.splashed) {
        this.handleEndbossHit(bottle);
      }
    });
  }

  /**
   * Handle all behaviors when the enboss is hit like Energie, Hurt-Animatioen, Death-animation and Splash of the Bottle
   * @param {Object} bottle
   * @returns
   */
  handleEndbossHit(bottle) {
    this.endbossOfEnemies.reduceEndbossEnergy(10);
    this.endbossOfEnemies.updateEndbossStatusBar();
    this.endbossOfEnemies.hitEndbossLessOrMoreThanTwenty();
    this.endbossOfEnemies.hitEndbossZero();
    bottle.bottleSplash();
  }

  /**
   * Handle game over sequence depending on who dies.
   * @param {string} deathCandidate
   * @returns
   */
  handleGameOver(deathCandidate) {
    if (this.isGameEnding === true) return;
    this.isGameEnding = true;
    this.stopAllAnimations();
    setTimeout(() => {
      showGameOverScreen(deathCandidate);
    }, 500);
  }

  /**
   * By Game Over all Animations has to stop
   */
  stopAllAnimations() {
    this.character.stopAllIntervals();
    this.endbossOfEnemies.stopAllIntervals();
    this.level.enemies.forEach((enemy) => enemy.stopAllIntervals());
    keyboardEnabled = false;
   gamePaused = true;
    audioManager.setMuted(true);
    togglePlay("content", true);
  }
}
