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

  loadImage(entry) {
    const path = typeof entry === "string" ? entry : entry.src;

    this.img = new Image();
    this.img.src = path;
  }

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

  loadAudio(arr) {
    arr.forEach((path) => {
      let audio = new Audio(path);
      this.audioCache[path] = audio;
    });
  }

  drawObject(ctx) {
    if (!this.img) return;
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (error) {
      return;
    }
  }

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
}
