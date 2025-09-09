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
   * Applies gravity to the object, updating its vertical position and speed.
   * Starts an interval that simulates gravity until the object is on the ground.
   */
  applyGravity() {
    this.clearGravityInterval();
    this.gravityInterval = setInterval(() => {
      this.applyGravityPhysics();
      this.checkGroundCollision();
    }, 1000 / 25);
  }

  /**
   * Updates position and velocity based on gravity physics
   */
  applyGravityPhysics() {
    if (this.isAboveGround() || this.speedY > 0) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
    }
  }

  /**
   * Checks if the object has reached the ground and resets properties
   */
  checkGroundCollision() {
    if (this.y > Pepe.GROUND_Y) {
      this.y = Pepe.GROUND_Y;
      this.speedY = 0;
      this.isJumping = false;
    }
  }

  /**
   * Clears the gravity interval to stop the gravity effect.
   */
  clearGravityInterval() {
    if (this.gravityInterval) {
      clearInterval(this.gravityInterval);
      this.gravityInterval = null;
    }
  }

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

/**
 * Checks if this object is colliding with an enemy from above (main method)
 * @param {Object} enemy - The enemy to check collision with
 * @returns {boolean} - True if colliding from above
 */
isCollidingAboveEnemy(enemy) {
  enemy = this.ensureEnemyOffset(enemy);
  const horizontalOverlap = this.isHorizontallyOverlapping(enemy);
  const enemyHeadZone = this.calculateEnemyHeadZone(enemy);
  const isOnTop = this.isOnTopOfEnemy(enemy, enemyHeadZone);
  return horizontalOverlap && isOnTop && this.isFalling();
}

/**
 * Ensures the enemy has valid offset values
 * @param {Object} enemy - The enemy to check
 * @returns {Object} - Enemy with valid offset
 */
ensureEnemyOffset(enemy) {
  if (enemy.offset === undefined) {
    enemy.offset = { left: 12, right: 12, top: 12, bottom: 12 };
  }
  return enemy;
}

/**
 * Checks if this object horizontally overlaps with the enemy
 * @param {Object} enemy - The enemy to check
 * @returns {boolean} - True if horizontally overlapping
 */
isHorizontallyOverlapping(enemy) {
  return (
    this.x + this.width - this.offset.right > enemy.x + enemy.offset.left &&
    this.x + this.offset.left < enemy.x + enemy.width - enemy.offset.right
  );
}

/**
 * Calculates the enemy's head zone (upper portion of body)
 * @param {Object} enemy - The enemy
 * @returns {number} - Y-coordinate of the bottom of head zone
 */
calculateEnemyHeadZone(enemy) {
  return enemy.y + enemy.offset.top + enemy.height * 0.3;
}

/**
 * Checks if this object is positioned on top of the enemy
 * @param {Object} enemy - The enemy
 * @param {number} enemyHeadZone - The bottom Y of enemy's head zone
 * @returns {boolean} - True if on top
 */
isOnTopOfEnemy(enemy, enemyHeadZone) {
  const pepeBottom = this.y + this.height - this.offset.bottom;
  return (pepeBottom >= enemy.y + enemy.offset.top && pepeBottom <= enemyHeadZone);
}

/**
 * Checks if the object is falling downward
 * @returns {boolean} - True if falling
 */
isFalling() {
  return this.speedY < 0;
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
     if (this.hurtAnimationActive) return
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
     if (this.hurtAnimationActive) return;
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
    this.hurtAnimationActive = true;

    let damage = 0.001;
    if (attacker instanceof Endboss) {
      damage *= 90;
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
    clearInterval(Pepe.fallInterval);
    clearInterval(this.animateBounceMiniInterval);
    clearInterval(this.animateDeathInterval);
    clearInterval(ThrowableObject.throwInterval);
    clearInterval(ThrowableObject.splashInterval);
    clearInterval(ThrowableObject.rotationInterval)
  }
}
