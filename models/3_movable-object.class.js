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

  /**
   * Returns true if the object is above ground, false otherwise.
   * @returns 
   */
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

  /**
   * Determines whether the object is in a jump and therefore above the ground
   * @returns 
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 100;
    }
  }

  /**
   * Checks if the object is colliding with another object.
   * @param {Object} Obj 
   * @returns 
   */
  isColliding(Obj) {
    if (Obj.offset === undefined) {
      Obj.offset = { left: 12, right: 12,top: 12, bottom: 12,};
    }
    return (
      this.x + this.width - this.offset.right > Obj.x + Obj.offset.left &&
      this.y + this.height - this.offset.bottom > Obj.y + Obj.offset.top &&
      this.x + this.offset.left < Obj.x + Obj.width - Obj.offset.right &&
      this.y + this.offset.top < Obj.y + Obj.height - Obj.offset.bottom
    );
  }

  /**
   * Checks if the health scor of the object is zero or less.
   * This is used to determine if the object is dead.
   * @param {Object} character 
   * @param {Array} bottles 
   * @param {Array} coins 
   * @param {Array} enemies
   * @returns 
   */
  isZeroHealthscore() {
    return this.energy <= 0 || this.isDead;
  }

  /**
   * Checks if the object is hurt
   * @returns 
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.5;
  }

  /**
   * Special function to move the MiniChicken to the right with an higher Speed.
   * @param {Number} speed 
   * @returns 
   */
  moveRightMini(speed) {
    if (gamePaused) return;
    this.x += speed;
  }

  /**
   * Moves Pepe to the right.
   * @returns 
   */
  moveRight() {
    if (gamePaused) return;
    this.x += this.speed;
    this.otherDirection = false;
  }

  /**
   * Moves all moving objects to the left
   * @param {Number} speed 
   * @returns 
   */
  moveLeft(speed) {
    if (gamePaused) return;
    this.x -= speed;
  }

  /**
   *Let Pepe jump.
   */
  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 34;
      this.applyGravity();
    }
  }

  /**
   * Checks whether Pepe collides with the enemies and the damage is calculated according to the enemy type.
   * @param {String} attacker 
   * @returns 
   */
  hit(attacker) {
    if (gamePaused) return; 
    let damage = 0.0001; 

    if (attacker instanceof Endboss) {
      damage *= 150; 
    }
    if (attacker instanceof MiniChicken) {
      damage *= 0.2;
    }
    this.reduceEnergy(damage);
  }

  /**
   * Reduces the energy depending on which attacker causes the hit.
   * @param {Number} damage 
   */
  reduceEnergy(damage) {
        this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime(); 
    }
  }

  /**
   * Handles the animation of the object specific Image-arrays
   * @param {Array}Images 
   */
  playAnimation(images) {
    this.images = images;
    let i = this.currentImage % this.images.length;
    let frame = this.images[i];
    let path = typeof frame === "string" ? frame : frame.src;

    this.img = imgCache[path];
    this.currentImage++;
  }

  /**
   * Stops all intervals that are running for the object.
   * This is used to stop the animation and other intervals when the game is paused or the object is removed.
   */
  stopAllIntervals() {
    clearInterval(this.animateInterval);
    clearInterval(this.animateJumpInterval);
    clearInterval(this.animateHurtInterval);
    clearInterval(this.animateSleepInterval);
    clearInterval(this.animateAttackInterval);
    clearInterval(this.animateWalkInterval);
    clearInterval(this.animateXInterval);
    clearInterval(this.gravityInterval);
    clearInterval(this.animateBounceMiniInterval);
    clearInterval(this.animateDeathInterval);
  }

}
