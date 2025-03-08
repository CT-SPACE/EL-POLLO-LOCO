class DrawableObject {
    x;
    y;
    height;
    width;
    otherDirection = false;
    img;
    imgCache = {};
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

  drawObject(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrames(ctx) {
    if (this instanceof Pepe || this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "yellowgreen";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }


}