class MovableObject {
  x;
  y;
  height;
  width;
  img;
  imgCache = {};
  currentIMG = 0;
  v1 = 0.15;
  otherDirection = false;

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
  moveRight() {
    setInterval(() => {
      this.x = this.v1;
    }, 1000 / 60);
    console.log("move left");
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.v1;
    }, 1000 / 60);
    console.log("move left");
  }
}
