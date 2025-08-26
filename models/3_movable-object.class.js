class MovableObject extends DrawableObject {
  world;
  keyboard;
  keyboardEnabled = true;
  cameraX;
  factor = 1;
  speedX = 20;
  speedY;
  acceleration = 4.2;
  energy = 1;
  offset;
  gravityInterval;
  currentImage = 0;
  isDead = false;
  isJumping = false;

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
      }

      if (this.y > Pepe.GROUND_Y) {
        this.y = Pepe.GROUND_Y;
        this.speedY = 0;
        isJumping = false
       clearInterval(this.gravityInterval);
      this.gravityInterval = null;
      }
    }, 1000 / 25);
  }

  //   applyGravity() {
  //   if (this.gravityInterval) return;
  // this.gravityInterval = this.stopAllIntervals(() => {
  //     if (this.y <= Pepe.GROUND_Y || this.speedY <= 0)  {
  //       this.y -= this.speedY;
  //       this.speedY -= this.acceleration;
  //     }
  //     if (this.y >= Pepe.GROUND_Y) {
  //       this.y = Pepe.GROUND_Y;
  //       this.speedY = 0;
  //     }
  //   }, 1000 / 25);
  // }

  /**
   * Determines whether the object is in a jump and therefore above the ground
   * @returns
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < Pepe.GROUND_Y;
    }
  }

  /**
   * Checks if the object is colliding with another object.
   * @param {Object} Obj
   * @returns
   */
  isColliding(Obj) {
    if (Obj.offset === undefined) {
      Obj.offset = { left: 12, right: 12, top: 12, bottom: 12 };
    }
    return (
      this.x + this.width - this.offset.right > Obj.x + Obj.offset.left &&
      this.y + this.height - this.offset.bottom > Obj.y + Obj.offset.top &&
      this.x + this.offset.left < Obj.x + Obj.width - Obj.offset.right &&
      this.y + this.offset.top < Obj.y + Obj.height - Obj.offset.bottom
    );
  }

isCollidingAboveEnemy(enemy) {
  if (enemy.offset === undefined) {
    enemy.offset = { left: 12, right: 12, top: 12, bottom: 12 };
  }
  
  // Horizontale Überlappung (korrekt)
  const horizontalOverlap = 
    this.x + this.width - this.offset.right > enemy.x + enemy.offset.left && 
    this.x + this.offset.left < enemy.x + enemy.width - enemy.offset.right;
  
  // Vertikale Position (korrigiert)
  const enemyHeadZone = enemy.y + enemy.offset.top + (enemy.height * 0.3); // Obere 30% des Feindes
  const pepeBottom = this.y + this.height - this.offset.bottom;
  
  const isOnTop = 
    pepeBottom >= enemy.y + enemy.offset.top && // Pepe's Füße sind mindestens auf Kopfhöhe
    pepeBottom <= enemyHeadZone;                // Aber nicht tiefer als 30% der Feind-Höhe
  
  // Debug
  console.log(`Horizontal: ${horizontalOverlap}, OnTop: ${isOnTop}, Falling: ${this.speedY < 0}`);
  
  return horizontalOverlap && isOnTop && this.speedY < 0;
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
   * @param {Number} speedX
   * @returns
   */
  moveRightMini(speedX) {
    if (gamePaused) return;
    this.x += speedX;
  }

  /**
   * Moves Pepe to the right.
   * @returns
   */
  moveRight() {
    if (gamePaused) return;
    this.x += this.speedX;
    this.otherDirection = false;
  }

  /**
   * Moves all moving objects to the left
   * @param {Number} speedX
   * @returns
   */
  moveLeft(speedX) {
    if (gamePaused) return;
    this.x -= speedX;
  }

  /**
   *Let Pepe and Endboss jump.
   */
  jump() {
    this.speedY = 34;
 
  }

  /**
   * Checks whether Pepe collides with the enemies and the damage is calculated according to the enemy type.
   * @param {String} attacker
   * @returns
   */
  hit(attacker) {
    if (gamePaused) return;
    let damage = 0.001;

    if (attacker instanceof Endboss) {
      damage *= 100;
    }
    if (attacker instanceof MiniChicken) {
      damage *= 1;
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

// ifPepeJumps(i) {
//   if (i <= 2 || i >= 6) {
//     this.y = Pepe.GROUND_Y;
//     this.speedY = 0;
//   } else if ( i === 3 || i === 4 || i === 5) {
//     this.speedY = 34
//   }
// }

// arraysEqual(a, b) {
//   return Array.isArray(a) &&
//          Array.isArray(b) &&
//          a.length === b.length &&
//          a.every((val, index) => val === b[index]);
// }

  /**
   * Stops all intervals that are running for the object.
   * This is used to stop the animation and other intervals when the game is paused or the object is removed.
   */
  stopAllIntervals() {
    clearInterval(this.animateInterval);
    clearInterval(this.animateJumpInterval);
    clearInterval(this.animateHurtInterval);
    clearInterval(this.animateSleepInterval);
    clearInterval(this.animateDeathInterval);
    clearInterval(this.animateAttackInterval);
    clearInterval(this.animateWalkInterval);
    clearInterval(this.animateXInterval);
    clearInterval(this.gravityInterval);
    clearInterval(this.animateBounceMiniInterval);
    clearInterval(this.animateDeathInterval);
  }
}
