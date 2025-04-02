class DrawableObject {
    x;
    y;
    height;
    width;
    otherDirection = false;
    img;
    imgCache = {};
    audioCache = {};
    currentIMG = 0;
    itemCounter = 0;
    
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

      /**
   *
   * @param {Array} arr
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imgCache[path] = img;
    });
  }

  loadAudio(arr) {
    arr.forEach((path) => {
      let audio = new Audio(path);
      //audio.src = path;
      this.audioCache[path] = audio;
    });
  }

  drawObject(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrames(ctx) {
    if (this instanceof Pepe || this instanceof Chicken || this instanceof CollectableObject) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "yellowgreen";
      ctx.rect(this.x, this.y, this.width, this.height);
      //ctx.rect(this.offset.x, this.offset.y, this.width - this.offset.x, this.height - this.offset.y);
      ctx.stroke();
    }
  }

  drawOffset(ctx) {
    if (this instanceof Pepe || this instanceof Chicken || this instanceof CollectableObject) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "orangered";
      ctx.rect(this.offset.x, this.offset.y, this.width - this.offset.x, this.height - this.offset.y);
      ctx.stroke();
    }
  }




}