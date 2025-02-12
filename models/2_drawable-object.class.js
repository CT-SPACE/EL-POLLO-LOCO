class DrawableObject {
    x;
    y;
    height;
    width;
    cameraX;
    world;
    energy;
    img;
    imgCache = {};
    currentIMG = 0;
    
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

}