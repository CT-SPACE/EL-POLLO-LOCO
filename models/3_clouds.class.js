class Clouds extends MovableObject{
    y = 50;
    x = 0;
    width = 800;
    height = 300;
    IMAGES_MOVING = [
        '../img/5_background/layers/4_clouds/1.png',
        '../img/5_background/layers/4_clouds/2.png'
    ];
    

constructor(){
    super().loadImage('../img/5_background/layers/4_clouds/1.png');
    this.x =  -100 + Math.random() * 1000;
    this.animateX();

}
 animateX() {
    this.moveLeft();
    }


    // constructor() {

    //  super().loadImage('../img/5_background/layers/4_clouds/full.png');
     
    //     this.x =  -100 + Math.random() * 1000;
    //     this.loadImages(this.IMAGES_MOVING);

    //     // this.x1 = canvas.width; // Startposition der ersten Wolke
    //     // this.x2 = canvas.width - Math.random() * 1000; // Startposition der zweiten Wolke
    //     this.v1 = 0.05 // Geschwindigkeit der ersten Wolke
    //     this.v2 = 0.3; // Geschwindigkeit der zweiten Wolke
    //     this.animateX();
    // }

    // animateX() {
    //     // Erste Wolke
    //     setInterval(() => {
        
    //         let path = this.IMAGES_MOVING[0];
    //         this.img1 = this.imgCache[path];

    //         if (this.img1) {
    //             this.x -= this.v1; // Geschwindigkeit der ersten Wolke

    //             // Wenn die Wolke das Canvas verlässt
    //             if (this.x < -this.img1.width) {
    //                 this.x = this.canvas.width; // Startet am anderen Ende
    //                 setTimeout(() => {
    //                     this.x -= this.v1;
    //                 }, Math.random() * 3000); // Zufällige Zeit bis zum Neustart
    //             }
    //         }
    //        else {
    //             this.x2 -= this.v2; // Geschwindigkeit der zweiten Wolke

    //             // Wenn die Wolke das Canvas verlässt
    //             if (this.x2 < -this.img2.width) {
    //                 this.x2 = this.canvas.width; // Startet am anderen Ende
    //                 setTimeout(() => {
    //                     this.x2 -= this.v2;
    //                 }, Math.random() * 500); // Zufällige Zeit bis zum Neustart
    //             }
    //         }
    //     }, 1000 / 60); // 60 FPS

    //     // // Zweite Wolke
    //     // setInterval(() => {
           
    //     //     let path = this.IMAGES_MOVING[1];
    //     //     this.img2 = this.imgCache[path];

            
    //     //     }
    //     // }, 1000 / 60); // 60 FPS


       
       
}