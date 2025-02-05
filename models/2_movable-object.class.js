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

drawFrames(ctx){
  if( this instanceof Pepe || this instanceof Chicken){
      ctx.beginPath();
    	ctx.lineWidth = '5';
    	ctx.strokeStyle = 'yellowgreen';
    	ctx.rect(this.x, this.y, this.width, this.height);
    	ctx.stroke();
  }

}

drawObject(ctx){
  ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
}

  moveRight() {
         this.x += this.speed;
      this.otherDirection = false;
                       
  }

  moveLeft() {
      this.x -= this.speed;
  }

  jump(){
    this.speedY = 34;
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