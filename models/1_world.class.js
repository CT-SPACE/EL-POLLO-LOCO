class World {

 audioManager;
  ctx;
  canvas;
  level = Level01;

  enemies;
  energy;
  keyboard;
  cameraX;

  statusBarPepe = new StatusBarPepe();
  statusBarCoin = new StatusBarCoin();
  statusBarChilli = new StatusBarChilli();
  statusBarEndboss = new StatusBarEndboss();
  EndBossVisible;

  endbossOfEnemies = this.level.enemies.find(
    (enemy) => enemy.type === "endboss"
  );
  throwableObjects = [new ThrowableObject()];
  character = new Pepe();
  background_static = new staticBackground();
  endboss = new Endboss(this);
  chicken = new Chicken(this);
  minichicken = new MiniChicken(this);

  bottles;
  collectedBottles = 0;
  countBottles = 15;
  offset;
  canThrow;
  isGameEnding;

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
    this.endboss.world = this;
    this.EndBossVisible = false;
    this.endbossOfEnemies = new Endboss(this);
    this.level.enemies.push(this.endbossOfEnemies);
    this.endbossOfEnemies.EndBossClose = false;
    this.isGameEnding = false;
    this.throwableObjects = [];
    this.canThrow = true;
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
    this.character.keyboard = keyboard;
    this.character.world = this;
    this.minichicken.world = this;
    this.endbossOfEnemies.world = this;
    this.endboss.world = this;
    this.statusBarPepe.world = this.statusBar;
  }

  /**
   * Runs the Main game interval.
   * checks very 1/60 second the collision for all characters, enemies and objects.
   */
  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkCollisionBottleWithEndboss();
      this.checkCollisionPepeWithEndboss();
    }, 1000 / 60);
  }

  /**
   * Creates the Endboss on the Map with a distance of 3800.
   * @returns 
   */
  handleEndboss() {
    if (this.character.x > 3100 || this.EndBossVisible === true) {
      this.EndBossVisible = true;
      DrawableObject.addToMap(this.statusBarEndboss,this.ctx);
    }
    if (this.isPepeNearEndboss() < 700) {
      this.endbossOfEnemies.EndBossClose = true;
      DrawableObject.addToMap(this.statusBarEndboss,this.ctx);
      this.EndBossVisible = true;
      this.endbossOfEnemies.status = true;
    } else {
      this.endbossOfEnemies.status = false;
      this.endbossOfEnemies.EndBossClose = false;
    }
    return;
  }

  /**
   * When Pepe can see the Endboss the Weather is changing a thunderstorm is on the way.
   * @returns 
   */
  handleEndbossCloseEffect() {
    try {
      let flash = false;
      if (this.endbossOfEnemies.EndBossClose === true) {
        if (Math.random() < 0.008) {
          flash = true;
        }
      }
      if (flash) {
        this.ctx.filter = "brightness(250%)";
      } else if (this.endbossOfEnemies.status === true && !this.endbossOfEnemies.isDead) {
        this.handleEndbossCloseDarknessAndSound();
      } else if (this.endbossOfEnemies.isDead) {
        this.handleEndbossIsDeadWhileClose();
      } else {
        flash = false;
        this.ctx.filter = "none";
      }
    } catch { return; }
  }

  /**
   * Reset the Thunderstorm, when the Endboss is died.
   */
  handleEndbossIsDeadWhileClose() {
    flash = false;
    this.ctx.filter = "none";
    audioManager.controlAudio("endbossBackground", {
      play: false,
      pause: true,
      currentTime: 0,
    });
  }

  /**
   * Thunderstorm: Made by 50% Brightness and EndbossBackground-Thunder-Sound
   */
  handleEndbossCloseDarknessAndSound() {
    this.ctx.filter = "brightness(50%)";
    if (
      audioManager.buffers["endbossBackground"] &&
      !audioManager.audioPlaying["endbossBackground"]
    ) {
      this.ctx.filter = "brightness(50%)";
      audioManager.playAudio("endbossBackground", {
        play: true,
        loop: false,
        volume: 0.8,
      });
    }
  }

  /**
   * Handled the Bottles that left in Pepe's pockets and can be thrown
   */
  checkThrowObjects() {
    let startThrow = Date.now();
    noBottles = false;

    setInterval(() => {
      let now = Date.now();
      let delta = now - startThrow;
      if (keyboard.THROW && this.collectedBottles === 0) {
        this.noBottlesTrue();
      }
      if (keyboard.THROW && this.collectedBottles > 0 && delta > 1000 && this.canThrow) {
        this.throwBottle();
      }
    }, 50);
    throwDuration = 0;
  }

  /**
   * Helper Function in case no bottles ar left in Pepe's pockets.
   * It will play a sound and set the noBottles variable to true.
   */
  noBottlesTrue(){
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
    let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 150);
    bottle.speedX = direction ? -speed : speed;
    bottle.speedY = speed;
    bottle.otherDirection = direction;
    this.throwableObjects.push(bottle);
    keyboard.THROW = false;
    bottle.throw();
    this.collectedBottles--;
    this.statusBarChilli.setPercentage(this.collectedBottles);
    this.canThrow = false;
    setTimeout(() => {
      this.canThrow = true;
    }, 400);
}

/**
 * Checks the Collision of Pepe with Enemies and collectable Objects like coins and bottles
 */
  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (enemy.type === "endboss") return;
        if (this.character.isColliding(enemy) && this.character.speedY < 0 && !enemy.isDead) {
          if (enemy.type === "minichicken") {
            this.jumpOnMiniChicken(enemy);
          } else { this.jumpOnStandardChicken(enemy);  }
        }
         this.collidesEnemiesOnEnergyLevel(enemy); });
    }, 400);
    this.checkCollisionsCoins(this.character);
    this.checkCollisionsBottles();
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


//   jumpOnMiniChicken(enemy) {
//     enemy.animateBounce();
//     clearInterval(enemy.animateWalkInterval);
//     this.character.speedY = 40;
//     this.character.speed = 30;
//     if (this.character.animateJumpInterval) {
//     clearInterval(this.character.animateJumpInterval);
//   }

//   this.character.jumpPhase = 'air';
//   // this.character.currentImage = 0;
//   this.character.playAnimation(Pepe.IMAGES_JUMPING_AIR);
// }
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
  collidesEnemiesOnEnergyLevel(enemy){
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
      this.character.energy > 0 &&
      !this.character.isAboveGround()
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
    let collected = 0;
    const totalCoins = 50; 

    this.level.coins = this.level.coins.filter((coin) => {
      if (this.character.isColliding(coin)) {
        collected++;
        audioManager.loadAudio("WorldCoinCollecting","./audio/coin_success.mp3");
        audioManager.playEffect("WorldCoinCollecting", {loop: false, volume: 0.2, currentTime: 0, });
        return false;
      }
      return true;
    });
    if (collected > 0) {
      this.statusBarCoin.setPercentage(totalCoins - this.level.coins.length);
    }
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

        audioManager.loadAudio("WorldBottleCollecting","./audio/bottle_collect.mp3" );
        audioManager.playAudio("WorldBottleCollecting", {loop: false,volume: 0.2,currentTime: 0,});
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
    this.endbossOfEnemies.hitEndbossZero();
    this.endbossOfEnemies.hitEndbossLessOrMoreThanTwenty();
    if (typeof bottle.bottleSplash === "function") {
        bottle.bottleSplash();
    }
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
