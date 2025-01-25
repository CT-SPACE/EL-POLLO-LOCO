class StaticObject{
  x;
  y;
  height;
  width;
  img;



  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }



}