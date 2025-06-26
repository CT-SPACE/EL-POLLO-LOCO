class World {
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
  // gameRestarted = false;
  bottles;
  collectedBottles = 0;
  countBottles = 15;
  offset;
  canThrow;
  isGameEnding;

  constructor(canvas, level) {
    this.ctx = canvas.getContext("2d");
    this.cameraX = 0;
    this.level = level;  

    this.canvas = canvas;
    this.endboss.world = this;
    this.EndBossVisible = false;
    this.endbossOfEnemies.EndBossClose = false;
    this.isGameEnding = false;
    this.throwableObjects = [];
    // this.enemies = this.level.enemies;

    this.canThrow = true;
    this.draw();
    this.setWorld();
    this.run();

    this.checkThrowObjects();
  }

  setWorld() {
    this.character.keyboard = keyboard;
    this.character.world = this;
    this.minichicken.world = this;
    this.endbossOfEnemies.world = this;
    this.endboss.world = this;
    this.statusBarPepe.world = this.statusBar;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.cameraX, 0);
    try {
      if (this.endbossOfEnemies.EndBossClose) {
        this.handleEndbossCloseEffect();
      // if (gamePaused) {
      //   this.drawObjects();
      //   requestAnimationFrame(() => this.draw());
      //   return;
      //     }
      }
    } catch {
      return;
    }

    this.addToMap(this.background_static);
    this.ctx.filter = "none";

    this.addObjects(this.level.clouds);
    this.addObjects(this.level.background_moving);
    this.addObjects(this.level.enemies);
    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.toBeRemoved
    );
    this.addObjects(this.throwableObjects);

    this.addObjects(this.level.coins);
    this.addObjects(this.level.bottles);
    this.addToMap(this.character);

    this.ctx.translate(-this.cameraX, 0);

    this.addToMap(this.statusBarPepe);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarChilli);

    this.handleEndboss();
    // this.checkGameOver()

    self = this;
    requestAnimationFrame(() => self.draw());
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkCollisionBottleWithEndboss();
      this.checkCollisionPepeWithEndboss();
    }, 1000 / 60);
  }

  handleEndboss() {
    if (this.character.x > 3100 || this.EndBossVisible === true) {
      this.EndBossVisible = true;
      this.addToMap(this.statusBarEndboss);
    }

    if (this.isPepeNearEndboss() < 700) {
      this.endbossOfEnemies.EndBossClose = true;
      this.addToMap(this.statusBarEndboss);
      this.EndBossVisible = true;
      this.endbossOfEnemies.status = true;

    } else {
      this.endbossOfEnemies.status = false;
      this.endbossOfEnemies.EndBossClose = false;
    }
    return;
  }

  handleEndbossCloseEffect() {
    let flash = false;
    if (this.endbossOfEnemies.EndBossClose === true) {
      // 8% Chance pro Frame für einen Blitz
      if (Math.random() < 0.008) {
        flash = true;
      }
    }

    if (flash) {
      this.ctx.filter = "brightness(250%)";
      
    } else if (
      this.endbossOfEnemies.status === true &&
      !this.endbossOfEnemies.isDead
    ) {
       this.ctx.filter = "brightness(50%)";
      if (
        audioManager.buffers["endbossBackground"] &&
        !audioManager.audioPlaying["endbossBackground"]
      ) {
        audioManager.playAudio("endbossBackground", {
          play: true,
          loop: false,
          volume: 0.8,
        });
      }
    } else if (this.endbossOfEnemies.isDead) {
       flash = false;
      this.ctx.filter = "none";
      audioManager.controlAudio("endbossBackground", {
        play: false,
        pause: true,
        currentTime: 0,
      });
    } else {
       flash = false;
      this.ctx.filter = "none";
    }
  }

  checkThrowObjects() {
    let startThrow = new Date().getTime();

    setInterval(() => {
      let currentTime = new Date().getTime();
      let delta = currentTime - startThrow;

      if (keyboard.THROW && this.collectedBottles === 0) {
        audioManager.loadAudio("noBottlesLeft", "./audio/bottle_no.mp3");
        audioManager.playEffect("noBottlesLeft", { volume: 0.5 });
        keyboard.THROW = false; // verhindert Dauerschleife beim Halten der Taste
      }

      if (
        keyboard.THROW &&
        this.collectedBottles > 0 &&
        delta > 1000 &&
        this.canThrow
      ) {
        let duration = Math.min(throwDuration || 0, 1000);
        // console.log("duration", duration);
        let speed = 10 + (duration / 1000) * 20;

        let bottle = new ThrowableObject(
          this.character.x + 50,
          this.character.y + 150
        );
        bottle.speedX = speed;
        bottle.speedY = speed;
        this.throwableObjects.push(bottle);
        keyboard.THROW = false;
        startThrow = new Date().getTime();
        bottle.throw();
        this.collectedBottles--;
        this.statusBarChilli.setPercentage(this.collectedBottles);
        this.canThrow = false;
        setTimeout(() => {
          this.canThrow = true;
        }, 300);
      }
    }, 50);
    throwDuration = 0;
  }

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (enemy.type === "endboss") return;
        if (this.character.isColliding(enemy) && this.character.speedY < 0) {
            if (enemy.type === "minichicken") {
              enemy.animateBounce();
              clearInterval(enemy.animateWalkInterval);
              this.character.speedY = 40; 
              this.character.speed = 30; 
            } else {
              enemy.animateDeath();
              this.character.speedY = 20; // Standard-Sprunghöhe
              this.character.speed = 20;
            }
          }

            if (
              this.character.isColliding(enemy) &&
              this.character.energy > 0 &&
              !this.character.isAboveGround()
            ) {
              this.character.hit(enemy);
              this.statusBarPepe.setPercentage(this.character.energy);
            }

            if (
              this.character.isColliding(enemy) &&
              this.character.energy == 0
            ) {
              return;
            }
          
        });
    }, 400);

    this.checkCollisionsCoins(this.character);
    this.checkCollisionsBottles();
  }

  checkCollisionPepeWithEndboss() {
    // const endboss = this.level.enemies.find(
    //   (enemy) => enemy.type === "endboss"
    // );
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

  isPepeNearEndboss() {

    const endbossX = this.endbossOfEnemies
      ? this.endbossOfEnemies.x
      : undefined;
    //console.log("Distanz zum Endboss:", distance);

    let distance = Math.abs(this.character.x - endbossX);

    return distance;
  }

  checkCollisionsCoins() {
    let collected = 0;
    const totalCoins = 50; // Ursprüngliche Anzahl der Coins

    this.level.coins = this.level.coins.filter((coin) => {
      if (this.character.isColliding(coin)) {
        collected++;
        audioManager.loadAudio(
          "WorldCoinCollecting",
          "./audio/coin_success.mp3"
        );
        audioManager.playEffect("WorldCoinCollecting", {
          loop: false,
          volume: 0.2,
          currentTime: 0,
        });
        return false; // Coin wird entfernt
      }
      return true; // Coin bleibt
    });

    if (collected > 0) {
      this.statusBarCoin.setPercentage(totalCoins - this.level.coins.length);
    }
  }

  checkCollisionsBottles() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.collectedBottles++;
        this.level.bottles.splice(index, 1);
        this.statusBarChilli.setPercentage(this.collectedBottles);

        audioManager.loadAudio(
          "WorldBottleCollecting",
          "./audio/bottle_collect.mp3"
        );
        audioManager.playAudio("WorldBottleCollecting", {
          loop: false,
          volume: 0.2,
          currentTime: 0,
        });
      }
    });
  }

  checkCollisionBottleWithEndboss() {
    if (!this.endbossOfEnemies) return;
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isColliding(this.endbossOfEnemies) && !bottle.splashed) {
        this.endbossOfEnemies.energy = Math.max(
          0,
          this.endbossOfEnemies.energy - 10 // ZURÜCKSETZEN AUF 10 WENN #DEBUGGING VORBEI IST
        );

        if (
          typeof this.statusBarEndboss === "object" &&
          typeof this.statusBarEndboss.setPercentage === "function"
        ) {
          this.statusBarEndboss.setPercentage(this.endbossOfEnemies.energy);
        }

        if (
          this.endbossOfEnemies.energy <= 0 &&
          typeof this.endbossOfEnemies.animateDeath === "function" &&
          !this.endbossOfEnemies.isDead
        ) {
          this.endbossOfEnemies.animateDeath();
          return; // Nach dem Tod keine weiteren Animationen!
        }
        if (
          this.endbossOfEnemies.energy <= 20 &&
          typeof this.endbossOfEnemies.animateHurt === "function" &&
          !this.endbossOfEnemies.isDead
        ) {
          this.endbossOfEnemies.animateHurt();
        } else if (
          typeof this.endbossOfEnemies.startAttackMode === "function" &&
          this.endbossOfEnemies.energy > 20 &&
          !this.endbossOfEnemies.isDead
        ) {
          this.endbossOfEnemies.startAttackMode();
        }

        if (typeof bottle.bottleSplash === "function") {
          bottle.bottleSplash();
        }
      }
    });
  }

// checkGameOver() {
//     if (this.isGameEnding) return; // Prevent multiple triggers

//     const isDead = (obj, images) => 
//         obj.currentIMG === images.length - 1;

//     if (isDead(this.character, Pepe.IMAGES_DYING) || 
//         isDead(this.endbossOfEnemies, Endboss.IMAGES_DEAD)) {
        
//         this.isGameEnding = true;
//         this.handleGameOver();
//     }
// }

handleGameOver(deathCandidate) {

      if (this.isGameEnding === true) return;
        console.log("Game Over triggered for:", deathCandidate, this.isGameEnding);

          this.isGameEnding = true;

        this.stopAllAnimations();
        
        setTimeout(() => {
          showGameOverScreen(deathCandidate);
          
        }, 500);
    }

stopAllAnimations() {
        // Stop all animations
        this.character.stopAllIntervals();
        this.endbossOfEnemies.stopAllIntervals();
        this.level.enemies.forEach(enemy => enemy.stopAllIntervals());
        
        // Disable controls
        keyboardEnabled = false;
        gamePaused = true;
        
        // Stop sounds
        audioManager.setMuted(true);
        
        // Update UI
        togglePlay("content", true);
    }



  addObjects(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }
  addToMap(Obj) {
    if (Obj.otherDirection) {
      this.flipImage(Obj);
    }

    Obj.drawObject(this.ctx);
    Obj.drawOffset(this.ctx);

    if (Obj.otherDirection) {
      this.flipImageBack(Obj);
    }
  }

  flipImage(Obj) {
    this.ctx.save();
    this.ctx.translate(Obj.width, 0);
    this.ctx.scale(-1, 1);
    Obj.x = Obj.x * -1;
  }
  flipImageBack(Obj) {
    Obj.x = Obj.x * -1;
    this.ctx.restore();
  }
}
