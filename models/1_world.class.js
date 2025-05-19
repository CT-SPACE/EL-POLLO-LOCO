class World {
  ctx;
  canvas;
  level = Level01;
  character = new Pepe();
  background_static = new staticBackground();
  endboss = new Endboss(this);
  energy;
  //audio = new AudioManager();
  keyboard;
  cameraX = 0;
  statusBarPepe = new StatusBarPepe();
  statusBarCoin = new StatusBarCoin();
  statusBarChilli = new StatusBarChilli();
  statusBarEndboss = new StatusBarEndboss();
  EndBossVisible;

  throwableObjects = [new ThrowableObject()];
  // coinCollecting = new Audio("./audio/coin_success.mp3");
  // bottleCollecting = new Audio("./audio/bottle_collect.mp3./audio/bottle_collect.mp3");
  bottles;
  collectedBottles = 0;
  countBottles = 15;
  offset;
  canThrow = false;
  // endbossBackground = new Audio("./audio/endboss_thunder.mp3");
  //bottle;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");

    this.canvas = canvas;
    this.keyboard = keyboard;
    this.endboss.world = this; 
    this.EndBossVisible = false;
    this.endboss.animateStates(this);
    this.throwableObjects = [];
    
    this.canThrow = true; // Flasche kann geworfen werden
    this.draw();
    this.setWorld();
    this.run();

    // this.checkThrowObjects();
  }

  setWorld() {
    this.character.keyboard = this.keyboard;
    this.character.world = this;
    this.statusBarPepe.world = this.statusBar;
  
  }

  getAudio() {
    return audio; // Methode zum Abrufen von Audio
}

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.cameraX, 0);
;
   // console.log("draw - Endboss-Status", this.endboss.status);
    if (this.endboss.status === true) {
        this.ctx.filter = 'brightness(50%)'; //  Hintergrund Helligkeit verringern
            this.addToMap(this.background_static);
        if (audio.buffers['endbossBackground'] && !audio.audioPlaying['endbossBackground']) {
            audio.playAudio('endbossBackground', { play: true, loop: false, volume: 0.8 });
        }

    } else {
          this.ctx.filter = 'none'; // Filter zurücksetzen
         this.addToMap(this.background_static);
    
        audio.controlAudio('endbossBackground', {pause: true});

        // this.endbossBackground.pause(); // Hintergrundmusik anhalten
        // this.endbossBackground.currentTime = 0; // Zurücksetzen des Audio-Elements
    }
  this.ctx.filter = 'none'; 

    this.addObjects(this.level.clouds);
    this.addObjects(this.level.background_moving);
    this.addObjects(this.throwableObjects);
    this.addObjects(this.level.enemies);

    this.addObjects(this.level.coins);
    this.addObjects(this.level.bottles);
    this.addToMap(this.character);

    this.ctx.translate(-this.cameraX, 0);

    this.addToMap(this.statusBarPepe);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarChilli);

    this.handleEndboss();
    

    self = this; // This is a trick to access the "this" object inside the function. Die This-Information wird in self gespeichert, weil this in der Funktion nicht mehr verfügbar ist.
    requestAnimationFrame(() => self.draw());
  }
  
  run() {
    
    setInterval(() => {
     
      this.checkCollisions();
      this.checkCollisionBottleWithEndboss()
    }, 1000 / 25);
  }


handleEndboss(){
     if (
    this.character.x > 3100 || this.EndBossVisible === true) {
    this.EndBossVisible = true; // Eigenschaft der EndBoss-Instanz setzen
    this.addToMap(this.statusBarEndboss);
    //console.log("draw: EndbossClose", this.endboss.EndBossClose);
  }

  if (this.isPepeNearEndboss() < 300) {
    this.endboss.EndBossClose = true; 
    this.addToMap(this.statusBarEndboss);
    this.EndBossVisible = true; 
    this.endboss.status = true; // Eigenschaft setzen

    //console.log("draw / isPepeNearEndboss: EndbossClose", this.endboss.EndBossClose;
  } else {
      this.endboss.status = false; // Eigenschaft setzen
    this.endboss.EndBossClose = false; // Eigenschaft setzen
  }
  return;

}
   checkThrowObjects(){
    let startThrow = new Date().getTime(); // Startzeit des Wurfs
    // console.log('cTO - collectedBottles = ', this.collectedBottles);
    setInterval(() => {
        let currentTime = new Date().getTime(); // Aktuelle Zeit  
        let delta = currentTime - startThrow; // Zeitdifferenz in Millisekunden
      if(keyboard.THROW && this.collectedBottles > 0 && delta > 1000 && this.canThrow) {
            this.throwableObjects.push(bottle); // Hier wird die Flasche zum Array hinzugefügt.

          let bottle = new ThrowableObject(this.character.x + this.character.width, this.character.y + this.character.height / 2);
          // this.throwableObjects.splice(bottle);
            keyboard.THROW = false;
          startThrow = new Date().getTime(); // Startzeit des Wurfs zurücksetzen
          bottle.throw(); 
          // console.log('collectedbottles', this.collectedBottles);         
         
      }
      else{
          this.canThrow = false; // Nach einer kurzen Zeit wieder erlauben, eine Flasche zu werfen    
          console.log("Keine Flaschen verfügbar!");
          keyboard.THROW = false; 
          this.statusBarChilli.setPercentage(0);
          return;
    
      }
     
  });
}
  
  // Methode zum Überprüfen des Flaschenwurfs aktualisieren
  // checkThrowObjects() {
  //   if (keyboard.THROW) {
  //     console.log("Flasche geworfen!");
  //     let bottle = new ThrowableObject(
  //       this.character.x + this.character.width,
  //       this.character.y + this.character.height / 2
  //     );
  //     this.throwableObjects.push(bottle); // Hier wird die Flasche zum Array hinzugefügt.

  //     // Optional: Verhindern, dass mehrere Flaschen auf einmal geworfen werden
  //     keyboard.THROW = false;
  //   }
  // }

//   checkThrowObjects() {
//     // console.log("checkThrowObjects: canThrow", this.canThrow);
//     this.collectedBottles = this.countBottles - this.level.bottles.length - this.throwableObjects.length;
//  // Anzahl der gesammelten Flaschen aktualisieren
//     // console.log("1. Anzahl der eingesammelten Flaschen: collectedBottles", this.collectedBottles);
//     // console.log("1. countBottles:", this.countBottles);
//     // console.log("1. this.level.bottles.length:", this.level.bottles.length);
//     // console.log("1. throwableObjects:", this.throwableObjects.length);
//     // console.log("Keyboard THROW:", keyboard.THROW);
//     // console.log("this.canThrow:", this.canThrow);

//     if (keyboard.THROW && this.collectedBottles > 0 && this.canThrow) {
      
       
//         // console.log("Anzahl der Flaschen vor dem Wurf:", this.collectedBottles);
//         // Neue Flasche erstellen und von Pepes aktueller Position werfen
//         let bottle = new ThrowableObject(
//             this.character.x + this.character.width / 4 , // Startpunkt X: Mitte von Pepe
//             this.character.y + this.character.height / 2, // Startpunkt Y: Mitte von Pepe
//         this);
//         this.throwableObjects.push(bottle); // Flasche zum Array der geworfenen Flaschen hinzufügen
// // console.log("2. Anzahl der Flaschen vor dem Wurf:", this.collectedBottles);
// // console.log("2. throwableObjects:", this.throwableObjects.length);
//         // Eine Flasche aus dem gesammelten Flaschen-Array entfernen
//         this.level.bottles.pop();
//         // bottle.throw();
//         this.collectedBottles = (this.countBottles - this.level.bottles.length) - this.throwableObjects.length;
// //         console.log("3. countBottles:", this.countBottles);
// //         console.log("3. this.level.bottles.length:", this.level.bottles.length);
// //         console.log("3. throwableObjects:", this.throwableObjects.length);
// // console.log("3. Anzahl der Flaschen nach dem Wurf:", this.collectedBottles);

//         // Statusbar für Flaschen aktualisieren
//          // Ursprüngliche Anzahl der Flaschen
//         this.statusBarChilli.setPercentage(this.collectedBottles);
//         this.canThrow = false; 
//         // Optional: Verhindern, dass mehrere Flaschen auf einmal geworfen werden
//         if (this.collectedBottles > 0){
//             setTimeout(() => {
//             this.canThrow = true; // Nach einer kurzen Zeit wieder erlauben, eine Flasche zu werfen    
//         },200);
//         } else {
//             this.canThrow = false; // Nach einer kurzen Zeit wieder erlauben, eine Flasche zu werfen    
//         }
      
//     } -.lökj
//     } 
// }

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
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
          //this.character.energy = 0;
          //this.statusBarPepe.setPercentage(this.character.energy);
          // this.character.world.clearInterval(this.character);
          // this.character.world.gameOver();
          //this.character.world.playGameOverSound();
        }

        if (
          this.character.isColliding(enemy) &&
          this.character.isAboveGround(
            (this.character.y + this.character.height) >= (enemy.y + enemy.height - enemy.offset.top)
          )
        ) {
          enemy.animateDeath();
          this.character.jump();
          this.character.speedY = 20;
          this.character.speed = 20;
        }
        // if (enemy.type === "endboss" && (-50 < enemy.isPepeNear() < 50)) {
        //    EndBossClose = true
        // }

        //console.log("checkCollision Coins",this.character, this.level.coins);
        //console.log('Energy after Collision', (this.character.energy).toFixed(2));
        this.checkCollisionsCoins(this.character);
        this.checkCollisionsBottles();
      });
    }, 200);

    // setInterval(() => {

    // }, 200);
  }

  checkCollisionBottleWithEndboss() {
    this.throwableObjects.forEach((bottle) => {
        const endboss = this.level.enemies.find((enemy) => enemy.type === "endboss");
        if (bottle.isColliding(endboss)) {
            //console.log("Flasche trifft Endboss!");
            endboss.hit(); // Endboss Schaden zufügen

            bottle.playAnimation(bottle.IMAGES_BOTTLE_SPLASH);

            this.throwableObjects = this.throwableObjects.filter(obj => obj !== bottle); // Flasche entfernen
        }
    });
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

  checkCollisionsCoins(character) {
    this.character = character;
    const totalCoins = 50; // Ursprüngliche Anzahl der Coins
    this.level.coins.forEach((coin) => {
      if (this.character.isColliding(coin)) {
        // Coin entfernen
        this.level.coins = this.level.coins.filter((object) => object !== coin);
        // Statusbar aktualisieren
        // console.log("Rest of collectable Coins = ", this.level.coins.length);
        this.statusBarCoin.setPercentage(totalCoins - this.level.coins.length);
        // Kollision prüfen
        coin.checkForCoinCollisions(this.character, this.level.coins);

        // Sound abspielen

        audio.loadAudio('WorldCoinCollecting', './audio/coin_success.mp3');
        audio.playEffect('WorldCoinCollecting', { loop: false, volume: 0.2, currentTime: 0});
       
        // this.coinCollecting.play();
        // this.coinCollecting.volume = 0.2;
        // this.coinCollecting.loop = false;
        // this.coinCollecting.currentTime = 0; // Zurücksetzen des Audio-Elements
      }
    });
  }

  checkCollisionsBottles() {
    this.collectedBottles++ 

    
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
         this.level.bottles.splice(1, index);

        // console.log("Rest of collectable Bottles = ", this.level.Bottles.length);
        this.statusBarChilli.setPercentage(this.collectedBottles);
        // Kollision prüfen
        bottle.checkForBottleCollisions(this.character, this.level.bottles);

        // Sound abspielen
        audio.loadAudio('WorldBottleCollecting', './audio/bottle_collect.mp3');
        audio.playAudio('WorldBottleCollecting', { loop: false, volume: 0.2, currentTime: 0});
       
        // this.bottleCollecting.play();
        // this.bottleCollecting.volume = 0.2;
        // this.bottleCollecting.loop = false;
        // this.bottleCollecting.currentTime = 0; // Zurücksetzen des Audio-Elements
      }
    });
  }

  // checkCollisionsBottles(character) {
  //   this.collectedBottles = (this.countBottles - this.level.bottles.length) - this.throwableObjects.length;

  //   this.character = character;
  //   this.level.bottles.forEach((bottle) => {
  //     if (this.character.isColliding(bottle)) {
  //       this.level.bottles = this.level.bottles.filter(
  //         (object) => object !== bottle
  //       );

  //       // console.log("Rest of collectable Bottles = ", this.level.Bottles.length);
  //       this.statusBarChilli.setPercentage(this.collectedBottles);
  //       // Kollision prüfen
  //       bottle.checkForBottleCollisions(this.character, this.level.bottles);

  //       // Sound abspielen
  //       this.bottleCollecting.play();
  //       this.bottleCollecting.volume = 0.2;
  //       this.bottleCollecting.loop = false;
  //       this.bottleCollecting.currentTime = 0; // Zurücksetzen des Audio-Elements
  //     }
  //   });
  // }

  addObjects(objects) {
    //    console.log('objects = ', objects);
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
