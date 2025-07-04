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
  currentImage = 0;
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
        clearInterval(this.gravityInterval);
        this.gravityInterval = null;
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
    if (Obj.offset === undefined) {
      Obj.offset = {
        left: 12,
        right: 12,
        top: 12,
        bottom: 12,
      };
    }

    return (
      this.x + this.width - this.offset.right > Obj.x + Obj.offset.left &&
      this.y + this.height - this.offset.bottom > Obj.y + Obj.offset.top &&
      this.x + this.offset.left < Obj.x + Obj.width - Obj.offset.right &&
      this.y + this.offset.top < Obj.y + Obj.height - Obj.offset.bottom
    );
  }

  isZeroHealthscore() {
    return this.energy <= 0 || this.isDead;
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
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

  moveLeft(speed) {
    if (gamePaused) return;
    this.x -= speed;
  }

  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 34;
      this.applyGravity();
    }
  }

  hit(attacker) {
    if (gamePaused) return; 
    let damage = 0.0001; // Standard-Schaden, sehr klein, da pro Intervall-Durchlauf vervielfacht wird.

    if (attacker instanceof Endboss) {
      damage *= 150; // der Schaden muss so hoch sein, dass ein Durchlaufen durch den Endboss immer zum Tode führt.
    }
    if (attacker instanceof MiniChicken) {
      damage *= 0.2;
    }
    this.energy -= damage;

    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime(); // Zeit des letzten Treffers speichern
    }
  }

  playAnimation(images) {
    this.images = images;
    let i = this.currentImage % this.images.length;
    let frame = this.images[i];
    let path = typeof frame === "string" ? frame : frame.src;

    this.img = imgCache[path];
    this.currentImage++;
  }

  playAnimation(images) {
    this.images = images;

    let i = this.currentImage % this.images.length;
    let frame = this.images[i];

    let path = typeof frame === "string" ? frame : frame.src;

    this.img = imgCache[path];

    this.currentImage++;
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
    keyboardEnabled = false;
  }
}
