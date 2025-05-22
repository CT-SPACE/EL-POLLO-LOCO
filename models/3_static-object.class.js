class StaticObject extends DrawableObject {
  x;
  y;
  height;
  width;
  img;
  energy;

  world;
  keyboard;
  cameraX;


  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }


}