class MovableObject extends DrawableObject {

  world;
  keyboard;
  keyboardEnabled = true;
  cameraX;
  factor = 1
  speed = 20;
  speedY = 2;
  acceleration = 4.2;
  energy = 1;
  offset;
  gravityInterval;
  
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

  isDead(Obj){
    return this.energy == 0;
 }

 isHurt(){
  let timepassed = new Date().getTime() - this.lastHit; // Differenz in ms
  timepassed = timepassed / 1000; // Differenz in s
  return timepassed < 0.5;
 }
 isAttacking(){
  
 }




  moveRight() {
    this.x += this.speed * this.factor;
    this.otherDirection = false;
  }

  moveLeft() {

    this.x -= this.speed * this.factor;
  }

  jump() {
    // this.speedY = 34;
 
      if (!this.isAboveGround()) { // Nur springen, wenn Pepe auf dem Boden ist
          this.speedY = 34; // Sprunggeschwindigkeit setzen
          this.applyGravity(); // Gravitation anwenden
      }
  }
  

hit(attacker) {
  let damage = 0.0001; // Standard-Schaden

  // Überprüfen, ob der Angreifer der Endboss ist
  if (attacker instanceof Endboss) {
      damage *= 100; // Schaden verdoppeln, wenn der Angreifer der Endboss ist
  }

  this.energy -= damage;

  if (this.energy < 0) {
      this.energy = 0; // Energie kann nicht negativ sein
  } else {
      this.lastHit = new Date().getTime(); // Zeit des letzten Treffers speichern
  }
}

  playAnimation(images) {
    this.images = images;
   let i = this.currentIMG % this.images.length;
   let path = this.images[i];
   //console.log("playAnimation:",this.images);

    if (this.images === this.IMAGES_DYING && i === this.images.length - 1) {
      this.img = this.imgCache[this.images[i]];
      this.disableKeyboard();
      
      
    } else {
      this.img = this.imgCache[path];
        this.currentIMG++;
    }
}

disableKeyboard() {
  keyboardEnabled = false; // Steuerung deaktivieren
}
  }
