class ThrowableObject extends MovableObject {
    IMAGES_BOTTLE_ROTATE = [
        './img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_BOTTLE_SPLASH = [
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    IMAGES_BOTTLE_ONGROUND = [
        './img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './img/6_salsa_bottle/2_salsa_bottle_on_ground_.png'
    ];
    world;
    offset;

    constructor(x,y,world){
        super().loadImage('./img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.IMAGES_BOTTLE_ONGROUND);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.loadImages(this.IMAGES_BOTTLE_ROTATE);
        this.height = 70;
        this.width = 70;
        this.x = x;
        this.y = y;
        this.offset = { top: 10, left: 10, right: 10, bottom: 5 }; // <-- Offset für Flasche
        this.img = this.imgCache[this.IMAGES_BOTTLE_ROTATE[0]]
        this.world = world;
        //this.throw();
    }

    throw() {
       
            this.speedY = 30;
            this.speedX = 20;
            this.applyGravity();
             
            this.throwInterval = setInterval(() => {
                this.x += this.speedX;
                 this.rotatingBottle();
                // this.y -= this.speedY;
                // this.speedY -= this.acceleration;
                // if (this.y >= 450) {
                //     this.y = 450;
                //     this.speedY = 0;
                //     this.speedX = 0;
                //     clearInterval(this.throwInterval);
                //     this.stopBottleAnimation();
                //     this.bottleSplash();
                // }

            },25);
    }

//     flyingBottle() {
//     this.speedY = 10;

//     // Stopp wenn Boden erreicht
//     if (this.y >= 450) {
//         this.y = 450;
//         this.speedY = 0;
//         this.speed = 0;

//         // Objekt vollständig aus der Liste entfernen
//         setTimeout(() => {
//             this.world.throwableObjects = this.world.throwableObjects.filter(obj => obj !== this);
//         }, 400);

//         return; // Damit moveBottle() nicht weiter ausgeführt wird
//     } else{
//             console.log("moveBottle", this.x, this.y);
//     this.x += this.speed ?? 0;
//     this.y -= this.speedY ?? 0;
//     this.speedY -= this.acceleration ?? 1.2; // Schwerkraft
//     }

//     // Bewegung berechnen

// }


    
    
    rotatingBottle() {
        this.bottleRotateIndex = 0;
        this.rotationInterval = setInterval(() => {
            this.bottleRotateIndex = (this.bottleRotateIndex + 1) % this.IMAGES_BOTTLE_ROTATE.length;
            let path = this.IMAGES_BOTTLE_ROTATE[this.bottleRotateIndex];
            this.img = this.imgCache[path];
        }, 100); 
    }

    
    stopBottleAnimation() {
        if (this.rotationInterval) clearInterval(this.rotationInterval);
        if (this.throwInterval) clearInterval(this.throwInterval);
    }


   
}
