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

  drawFrames(ctx){
    ctx.beginPath();
    ctx.lineWidth = '5';
    ctx.strokeStyle = 'yellowgreen';
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  }
  
  drawObject(ctx){
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

}