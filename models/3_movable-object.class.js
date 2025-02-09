class MovableObject {
  x;
  y;
  height;
  width;
  world;
  keyboard;
  img;
  cameraX;
  imgCache = {};
  currentIMG = 0;
  speed = 20;
  speedY = 2;
  acceleration = 4.2;
  energy = 1;
  otherDirection = false;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
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

  drawFrames(ctx) {
    if (this instanceof Pepe || this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "yellowgreen";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  drawObject(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  isColliding(Obj) {
    return (
      this.x + this.width > Obj.x &&
      this.y + this.height > Obj.y &&
      this.x < Obj.x &&
      this.y < Obj.y + Obj.height
    );
  }

  isDead(Obj){
    return this.energy == 0;
 }

 isHurt(){
  let timepassed = new Date().getTime() - this.lastHit; // Differenz in ms

  timepassed = timepassed / 1000; // Differenz in s
 
  return timepassed < 0.5;
 }


  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 34;
  }

  hit(){
    
    this.energy -= 0.02;
if(this.energy < 0){
  this.energy = 0;
} else {
  this.lastHit = new Date().getTime(); // Zeit gespeichert in Millisekunden als Zahl
  }
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
    let i = this.currentIMG % this.images.length;
    let path = this.images[i];
    let img = new Image();
    img.onload = () => {
      this.img = img;
    };
    img.src = path;
    this.currentIMG++;
  }
}
