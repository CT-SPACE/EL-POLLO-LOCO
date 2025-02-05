class Clouds extends MovableObject{
    y = 50;
    x = 0;
    width = 800;
    height = 300;
    IMAGES_MOVING = [
        './img/5_background/layers/4_clouds/1.png',
        './img/5_background/layers/4_clouds/2.png'
    ];
    

constructor(){
    super().loadImage('./img/5_background/layers/4_clouds/1.png');
    this.loadImages(this.IMAGES_MOVING);
    this.x =  -100 + Math.random() * 1000;
    this.animateX();

}
 animateX() {

    setInterval(() => {
        this.moveLeft();
        }, 60000 / 60);
    }
      
       
}