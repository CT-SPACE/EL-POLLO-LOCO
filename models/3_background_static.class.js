class staticBackground extends StaticObject {
  x = 0;
  y = 0;
    height = 480 ;
    width = 5000 ;
    img;
    
    constructor(){
        super().loadImage('../img/5_background/layers/air.png');
        this.y = 480 - this.height;

    }
    

}