class MovableObject {
  x;
  y;
  height;
  width;
  world;
  keyboard;
  img;
  imgCache = {};
  currentIMG = 0;
  v1 = 0.15;
  otherDirection = false;

  loadImage(path) {
    this.img = new Image();
    // console.log('X:', x);
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
    console.log("move right");
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.v1;
    }, 1000 / 60);
    console.log("move left");
  }
}
