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
    

    constructor(x,y,world){
        super().loadImage('./img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.IMAGES_BOTTLE_ONGROUND);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.height = 70;
        this.width = 70;
        this.x = x;
        this.y = y;
        this.world = world;
        //this.throw();
    }

    throw() {
        //if (this.world.collectedBottles > 0) { // Überprüfe, ob this.world definiert ist
            this.speedY = 30;
            this.applyGravity();
            setInterval(() => {
                this.x += 20; // Bewegt die Flasche nach rechts
            }, 1200 / 60);
        // } else {
        //     console.log("Wurf nicht möglich: canThrow ist nicht definiert oder false.");
        //     return;
        // }
    }
    // Last THROW-CHANGE##############################################
    // throw() {
    //     if (this.world && this.world.canThrow) { // Überprüfe, ob this.world definiert ist
    //         this.speedY = 30;
    //         this.applyGravity();
    //         setInterval(() => {
    //             this.x += 20; // Bewegt die Flasche nach rechts
    //         }, 1200 / 60);
    //     } else {
    //         console.error("Wurf nicht möglich: canThrow ist nicht definiert oder false.");
    //         return;
    //     }
    // }

//     throw(){
 
//         this.speedY = 30;
//         this.applyGravity();
//         setInterval(() => {
//             this.x += 20;
//         }, 1200 / 60);  
// }
    // throw() {
    //     setInterval(() => {
    //         this.x += this.speedX; // Bewegt die Flasche nach rechts
    //         this.y -= this.speedY; // Bewegt die Flasche nach oben
    //         this.speedY -= this.applyGravity(); // Schwerkraft wirkt auf die Flasche
    //     }, 25);
    // }
}
