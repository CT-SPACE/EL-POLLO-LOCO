class MovableObject extends DrawableObject {

  world;
  keyboard;
  keyboardEnabled = true;
  cameraX;
  factor = 1;
  speed = 20;
  speedY;
  acceleration = 4.2;
  energy = 1;
  offset;
  gravityInterval;
  gamePaused = false;
  // gameRestarted = false; // Flag to check if the game has been restarted
 isDead = false;
  
  lastHit = 0;

  applyGravity() {
    if (this.gravityInterval) return;

    this.gravityInterval = setInterval(() => {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        } else {
            this.speedY = 0;
            clearInterval(this.gravityInterval); // Intervall stoppen
            this.gravityInterval = null; // Intervall-Referenz zurücksetzen
        }
    }, 1000 / 25);
}

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
  
    } else {
      return this.y < 100;
    }
    
  }

 isColliding(Obj) {
    if(Obj.offset === undefined){
      Obj.offset = {
        left: 12,
        right: 12,
        top: 12,
        bottom: 12
      };
    } 

    return (
      this.x + this.width - this.offset.right > Obj.x + Obj.offset.left &&
      this.y + this.height - this.offset.bottom > Obj.y  + Obj.offset.top &&
      this.x + this.offset.left < Obj.x + Obj.width - Obj.offset.right &&
      this.y + this.offset.top < Obj.y + Obj.height - Obj.offset.bottom
    );
  }

//   isDead(Obj){
//     return this.energy == 0;
//  }

isZeroHealthscore(){
          return this.energy <= 0 || this.isDead;
}

 isHurt(){
  let timepassed = new Date().getTime() - this.lastHit; // Differenz in ms
  timepassed = timepassed / 1000; // Differenz in s
  return timepassed < 0.5;
 }

   moveRightMini(speed) {
     if (gamePaused) return;
    this.x += speed;
  }
 
  moveRight() {
     if (gamePaused) return;
    this.x += this.speed;
    this.otherDirection = false;
  }

  // moveRight(speed) {
  //   let minichicken = this.level.enemies.find( (enemy) => enemy.type === "minichicken");

  //   if (gamePaused) return;
  //   if (minichicken){
  //     this.otherDirection = true; // Setzt die Richtung auf "umgekehrt" für Minichicken
  //   } else {
  //   this.otherDirection = false;
  //   } 
  //             this.x += speed;// Setzt die Richtung auf "nicht umgekehrt"
  // }

  moveLeft(speed) {
    if (gamePaused) return;
    this.x -= speed;
  }

  jump() {
 
      if (!this.isAboveGround()) { // Nur springen, wenn Pepe auf dem Boden ist
          this.speedY = 34; // Sprunggeschwindigkeit setzen
          this.applyGravity(); // Gravitation anwenden
      }
  }
  

hit(attacker) {
  let damage = 0.0001; // Standard-Schaden

  // Überprüfen, ob der Angreifer der Endboss ist
  if (attacker instanceof Endboss) {
      damage *= 150; // Schaden verdoppeln, wenn der Angreifer der Endboss ist
  }
    if (attacker instanceof MiniChicken) {
      damage *= 0.2;
  }

  this.energy -= damage;

  if (this.energy < 0) {
      this.energy = 0; // Energie kann nicht negativ sein
  } else {
      this.lastHit = new Date().getTime(); // Zeit des letzten Treffers speichern
  }
}

//   playAnimation(images) {
//     this.images = images;
//    let i = this.currentIMG % this.images.length;
//    let path = this.images[i];
//    console.log("playAnimation:",this.images);

// if (this.isDead && i === this.images.length - 1) {
//   this.img = this.imgCache[this.images[i]];
//   this.currentIMG = i;
//   this.handleGameOver() ;
//   this.disableKeyboard();
  
//     // if (typeof stopGame === 'function') stopGame();
    
//  } else {
//       this.img = this.imgCache[path];
//         this.currentIMG++;
//     }
// }

playAnimation(images) {
    this.images = images;
    let i = this.currentIMG % this.images.length;
    let path = this.images[i];

    if (this.isDead) {
      //  console.log('playAnimation - 1 isDead:', this.isDead, gameRestarted); 
        const isLastFrame = (this instanceof Pepe && i === Pepe.IMAGES_DYING.length - 2) || 
                              (this instanceof Endboss && i === Endboss.IMAGES_DEAD.length - 1);

        if (isLastFrame) {
            // Stop at last frame
            this.img = this.imgCache[this.images[i]];
            this.currentIMG = i;

            // Handle death only once
            if (!this.deathHandled) {
                this.deathHandled = true;
                // this.stopAllIntervals();
                  gamePaused = true;
                this.disableKeyboard();

                const deathCharacter = this instanceof Pepe ? "Pepe" : "Endboss";
                this.world.handleGameOver(deathCharacter);
            }
        } else {

            this.img = this.imgCache[path];
            this.currentIMG++;
        }
    } else {
      //  console.log('playAnimation - 3 isDead / gameRestarted:', this.isDead, gameRestarted); 

        // Normal animation
        this.img = this.imgCache[path];
        this.currentIMG++;
    }
}

stopAllIntervals() {
        clearInterval(this.animateInterval);
        clearInterval(this.animateWalkInterval);
        clearInterval(this.animateXInterval);
        clearInterval(this.gravityInterval);
        clearInterval(this.animateBounceMiniInterval);
        clearInterval(this.animateDeathInterval);
}


disableKeyboard() {
  keyboardEnabled = false; // Steuerung deaktivieren
}
  }
