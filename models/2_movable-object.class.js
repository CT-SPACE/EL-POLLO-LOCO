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
  speedY = 1;
  acceleration = 4.2;
  otherDirection = false;

  applyGravity(){
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0){
              this.y -=  this.speedY;
      this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround(){
    return this.y < 100;
  }


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

  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.v1;
    }, 1000 / 60);

  }


// playAnimation(images){
//   this.images = images;
//   let i = this.currentIMG % this.IMAGES_WALKING.length;
//   let path = this.images[i];
//   this.img = this.imgCache[path];  
//   this.currentIMG++;
// }

playAnimation(images) {
  this.images = images;
  let i = this.currentIMG % this.IMAGES_WALKING.length;
  let path = this.images[i];
  let img = new Image();
  img.onload = () => {
      this.img = img;
  };
  img.src = path;
  this.currentIMG++;
}
}