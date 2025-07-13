class DrawableObject{
  x;
  y;
  height;
  width;
  world;
  drawDebug = false;
  otherDirection = false;
  img;
  audioCache = {};
  currentImage = 0;
  itemCounter = 0;
  factor = 1;


  /**
   * Loads a single image.
   * @param {Object} entry 
   */
  loadImage(entry) {
    const path = typeof entry === "string" ? entry : entry.src;

    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads all images from an array.
   * @param {Array} arr 
   */
  loadImages(arr) {
    arr.forEach((entry) => {
      const path = typeof entry === "string" ? entry : entry.src;

      if (!imgCache[path]) {
        let img = new Image();
        img.src = path;
        imgCache[path] = img;
      }
    });
  }

  /**
   * Draws the object on the canvas.
   */
  static draw(world) {
    const ctx = world.ctx;
    ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
    ctx.translate(world.cameraX, 0);
    world.handleEndbossCloseEffect();
    world.throwableObjects = world.throwableObjects.filter(
      (bottle) => !bottle.toBeRemoved
    );
    DrawableObject.addObjectsForDraw(world);
    world.handleEndboss();
    requestAnimationFrame(() => DrawableObject.draw(world));
  }


/**
 * Helper function to place the Objects on the canvas.
 */
  static addObjectsForDraw(world) {
    const ctx = world.ctx;
    DrawableObject.addToMap(world.background_static, ctx);
    ctx.filter = "none";
    DrawableObject.addObjects(world.level.clouds, ctx);
    DrawableObject.addObjects(world.level.background_moving, ctx);
    DrawableObject.addObjects(world.level.enemies, ctx);
    DrawableObject.addObjects(world.throwableObjects, ctx);
    DrawableObject.addObjects(world.level.coins, ctx);
    DrawableObject.addObjects(world.level.bottles, ctx);
    DrawableObject.addToMap(world.character, ctx);

    ctx.translate(-world.cameraX, 0);

    DrawableObject.addToMap(world.statusBarPepe, ctx);
    DrawableObject.addToMap(world.statusBarCoin, ctx);
    DrawableObject.addToMap(world.statusBarChilli, ctx);
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx 
   */
  drawObject(ctx) {
    if (!this.img) return;
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (error) {
      return;
    }
  }

  /**
   * In case of debugging (drawDebug is true) draws a rectangle around the object.
   * @param {CanvasRenderingContext2D} ctx 
   */
  drawOffset(ctx) {
    if (this.drawDebug) {
      if (this instanceof Pepe || this instanceof Chicken || this instanceof CollectableObject || this instanceof Endboss || this instanceof MiniChicken
      ) {
        ctx.beginPath();
        ctx.lineWidth = 0;
        ctx.strokeStyle = "orangered";
        ctx.rect(this.x + (this.offset?.left || 0),this.y + (this.offset?.top || 0),
          this.width - ((this.offset?.left || 0) + (this.offset?.right || 0)),
          this.height - ((this.offset?.top || 0) + (this.offset?.bottom || 0))
        );
        ctx.stroke();
      }
    }
  }

/**
 * Handles Image-Arrays to draw them on the canvas
 * @param {} objects 
 */
  static addObjects(objects, ctx) {
    objects.forEach((object) => {
      DrawableObject.addToMap(object, ctx);
    });
  }

/**
 * Handles each image of an array to draw it on the canvas
 * @param {Object} obj 
 */
  static addToMap(obj, ctx) {
    if (obj.otherDirection) {
      obj.flipImage(ctx);
    }
    obj.drawObject(ctx);
    obj.drawOffset(ctx);
    if (obj.otherDirection) {
      obj.flipImageBack(ctx);
    }
  }

/**
 * If otherDirection ist true flipImage works for Pepe and bottle throw
 * @param {Object} ctx 
 */
  flipImage(ctx) {
    ctx.save();
    ctx.translate(this.width, 0);
    ctx.scale(-1, 1);
    this.x = this.x * -1;
  }

/**
 * If Pepe turn back the function reset the direction.
 * @param {} ctx 
 */
  flipImageBack(ctx) {
    this.x = this.x * -1;
    ctx.restore();
  }

}
