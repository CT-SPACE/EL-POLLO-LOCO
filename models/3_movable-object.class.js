class MovableObject extends DrawableObject {

  world;
  keyboard;
  keyboardEnabled = true;
  cameraX;
  speed = 20;
  speedY = 2;
  acceleration = 4.2;
  energy = 1;
  offset;
  

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
    if (this instanceof ThrowableObject){
     return true;
    } else {
      return this.y < 100;
    }
    
  }

 isColliding(Obj, offset) {
    if(Obj.offset === undefined){
      Obj.offset = {
        left: 12,
        right: 12,
        top: 12,
        bottom: 12
      };
    } 

   // this.offset = offset;
//     console.log("Obj:", Obj);
// console.log("Obj.offset:", Obj ? Obj.offset : "undefined");

    // console.log("offset.right", Obj.offset.right);
    // console.log("offset.left", Obj.offset.left);
    return (
      this.x + this.width - this.offset.right > Obj.x + Obj.offset.left &&
      this.y + this.height - this.offset.bottom > Obj.y  + Obj.offset.top &&
      this.x + this.offset.left < Obj.x + Obj.width - Obj.offset.right &&
      this.y + this.offset.top < Obj.y + Obj.height - Obj.offset.bottom
    );
  }

  isDead(Obj){
    return this.energy == 0;
 }

 isHurt(){
  let timepassed = new Date().getTime() - this.lastHit; // Differenz in ms

  timepassed = timepassed / 1000; // Differenz in s
  // this.pepe_pollo.pause();
  // this.pepe_pollo.currentTime = 0; 
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
    // this.pepe_pollo.pause();
  
  }

  hit(){
    
    this.energy -= 0.001;
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

    if (this.images === this.IMAGES_DYING && i === this.images.length - 1) {
      this.img = this.imgCache[this.images[i]];
      this.disableKeyboard();
      
      
    } else {
      this.img = this.imgCache[path];
        this.currentIMG++;
    }
}

disableKeyboard() {
  keyboardEnabled = false; // Steuerung deaktivieren
}
  }
