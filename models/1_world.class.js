class World {
  ctx;
  canvas;
  level = Level01;
  character = new Pepe();
  background_static = new staticBackground();
  endboss = new Endboss(this);
  energy;
  keyboard;
  cameraX = 0;
  statusBarPepe = new StatusBarPepe();
  statusBarCoin = new StatusBarCoin();
  statusBarChilli = new StatusBarChilli();
  statusBarEndboss = new StatusBarEndboss();
  EndBossVisible;

  throwableObjects = [new ThrowableObject()];

  bottles;
  collectedBottles = 0;
  countBottles = 15;
  offset;
  canThrow;


  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");

    this.canvas = canvas;
    this.endboss.world = this; 
    this.EndBossVisible = false;
    this.endboss.animateStates(this);
    this.throwableObjects = [];
    
    this.canThrow = true;
    this.draw();
    this.setWorld();
    this.run();

  this.checkThrowObjects();
  }

  setWorld() {
    this.character.keyboard = keyboard;
    this.character.world = this;
    this.statusBarPepe.world = this.statusBar;
  
  }

  getAudio() {
    return audio; 
}

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.cameraX, 0);

    //console.log("draw - Endboss-Status", this.endboss.status);
    
    if (this.endboss.status === true) {
        this.ctx.filter = 'brightness(50%)';
           
        if (audio.buffers['endbossBackground'] && !audio.audioPlaying['endbossBackground']) {
            audio.playAudio('endbossBackground', { play: true, loop: false, volume: 0.8 });
        }
        this.addToMap(this.background_static);
      } else {
        this.ctx.filter = 'none'; 
        this.addToMap(this.background_static);
        }

  this.ctx.filter = 'none'; 

    this.addObjects(this.level.clouds);
    this.addObjects(this.level.background_moving);
    this.addObjects(this.level.enemies);
    this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.toBeRemoved);
    this.addObjects(this.throwableObjects);
    
    this.addObjects(this.level.coins);
    this.addObjects(this.level.bottles);
    this.addToMap(this.character);
 
    this.ctx.translate(-this.cameraX, 0);

    this.addToMap(this.statusBarPepe);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarChilli);
// console.log(
//   "Fliegende Flaschen:", this.throwableObjects.length,
//   "Sammelbare Flaschen:", this.level.bottles.length,
//   "Gesammelte Flaschen:", this.collectedBottles
// );

    this.handleEndboss();
    
    self = this; 
    requestAnimationFrame(() => self.draw());
  }
  
  run() {
    
    setInterval(() => {
      this.checkCollisions();
      this.checkCollisionBottleWithEndboss();
      this.checkCollisionPepeWithEndboss()
    }, 1000 / 25);
  }


handleEndboss(){
     if (
    this.character.x > 3100 || this.EndBossVisible === true) {
    this.EndBossVisible = true;
    this.addToMap(this.statusBarEndboss);

  }

  if (this.isPepeNearEndboss() < 350) {
    this.endboss.EndBossClose = true; 
    this.addToMap(this.statusBarEndboss);
    this.EndBossVisible = true; 
    this.endboss.status = true; 

    //console.log("draw / isPepeNearEndboss: EndbossClose", this.endboss.EndBossClose;
  } else {
      this.endboss.status = false; 
    this.endboss.EndBossClose = false; 
  }
  return;

}


checkThrowObjects(){
    let startThrow = new Date().getTime();

    setInterval(() => {
        let currentTime = new Date().getTime();
        let delta = currentTime - startThrow;

        if (keyboard.THROW && this.collectedBottles === 0) {
            audio.loadAudio('noBottlesLeft', './audio/bottle_no.mp3');
            audio.playEffect('noBottlesLeft', { volume: 0.5 });
            keyboard.THROW = false; // verhindert Dauerschleife beim Halten der Taste
        }

        if (keyboard.THROW && this.collectedBottles > 0 && delta > 1000 && this.canThrow) {

              let duration = Math.min(throwDuration || 0, 1000);
             (console.log("duration", duration));
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
        if (
          this.character.isColliding(enemy) &&
          this.character.energy > 0 &&
          !this.character.isAboveGround()
        ) {
          this.character.hit(enemy);
          this.statusBarPepe.setPercentage(this.character.energy);
        }

        if (this.character.isColliding(enemy) && this.character.energy == 0) {
          return;

        }

        if (
          this.character.isColliding(enemy) &&
          this.character.isAboveGround(
            (this.character.y + this.character.height) >= (enemy.y + enemy.height - enemy.offset.top)
          && enemy.type !== "endboss")
        ) {
          enemy.animateDeath();
          this.character.jump();
          this.character.speedY = 20;
          this.character.speed = 20;
        }
      });
        this.checkCollisionsCoins(this.character);
        this.checkCollisionsBottles();
    }, 300);

  }



checkCollisionPepeWithEndboss() {
    const endboss = this.level.enemies.find(enemy => enemy.type === "endboss");
    if (
        endboss &&
        this.character.isColliding(endboss) &&
        this.character.energy > 0 &&
        !this.character.isAboveGround()
    ) {
        this.character.hit(endboss);
        this.statusBarPepe.setPercentage(this.character.energy);
    }
            if (endboss && this.character.energy == 0) {
          return;

        }
}


  isPepeNearEndboss() {
    //  if (this.character) {  // Sicherstellen, dass character existiert
    const endboss = this.level.enemies.find(
      (enemy) => enemy.type === "endboss"
    );
    const endbossX = endboss ? endboss.x : undefined;
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
            audio.loadAudio('WorldCoinCollecting', './audio/coin_success.mp3');
            audio.playEffect('WorldCoinCollecting', { loop: false, volume: 0.2, currentTime: 0});
            // Optional: coin.checkForCoinCollisions(this.character, this.level.coins);
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
            this.collectedBottles++ ;
            console.log("collectedBottles = ", this.collectedBottles);
         this.level.bottles.splice(index,1);
         console.log("Rest of collectable Bottles = ", this.level.bottles.length);
        this.statusBarChilli.setPercentage(this.collectedBottles);

        audio.loadAudio('WorldBottleCollecting', './audio/bottle_collect.mp3');
        audio.playAudio('WorldBottleCollecting', { loop: false, volume: 0.2, currentTime: 0});

      }});
  }

// checkCollisionBottleWithEndboss() {
  
//     let endboss = this.level.enemies.find((enemy) => enemy.type === "endboss");
//     console.log('Kollisionsprüfung läuft',endboss);
//     if (!endboss) return;
//     this.throwableObjects.forEach((bottle) => {
//         if (bottle.isColliding(endboss)) {
//            console.log('Kollision erkannt! Bottle', bottle);
//            console.log('Kollision erkannt! Endboss', endboss);
//             // Definiere den oberen Bereich des Endboss (z.B. oberes 40%)
//             // let hitZone = endboss.y + (endboss.height * 0.4);

//             // if (bottle.y + bottle.height < hitZone) {
//                 // Treffer im oberen Bereich: Endboss-Health reduzieren
//                 endboss.energy = Math.max(0, endboss.energy - 20); // z.B. 20 abziehen
//                if (typeof endboss.statusBar === "object" && typeof endboss.statusBar.setPercentage === "function") {
//     endboss.statusBar.setPercentage(endboss.energy);
//     console.log("Endboss Energie nach Treffer:", endboss.energy);
// }
//             // }
// if (typeof bottle.bottleSplash === "function") {
//     bottle.bottleSplash();
// }
//             bottle.splashed = true;

//             setTimeout(() => {
//                 this.throwableObjects = this.throwableObjects.filter(obj => obj !== bottle);
//                 bottle.speed = 0;
//                 bottle.speedY = 0;
//             }, 600);
//         }
//     });
// }

checkCollisionBottleWithEndboss() {
    let endboss = this.level.enemies.find((enemy) => enemy.type === "endboss");
    if (!endboss) return;
    this.throwableObjects.forEach((bottle) => {
        if (bottle.isColliding(endboss) && !bottle.splashed) {
            endboss.energy = Math.max(0, endboss.energy - 20);
            if (typeof endboss.statusBar === "object" && typeof endboss.statusBar.setPercentage === "function") {
                endboss.statusBar.setPercentage(endboss.energy);
            }
            if (typeof bottle.bottleSplash === "function") {
                bottle.bottleSplash();
            }
            // bottle.splashed wird in bottleSplash gesetzt!
        }
    });
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

    if (Obj !== staticBackground) {
      Obj.drawFrames(this.ctx);
      Obj.drawOffset(this.ctx);
    }

    Obj.drawObject(this.ctx);

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
