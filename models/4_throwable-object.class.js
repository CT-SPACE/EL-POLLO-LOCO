class ThrowableObject extends MovableObject {
  static IMAGES_BOTTLE_ROTATE = [
    "./img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  static IMAGES_BOTTLE_SPLASH = [
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  static IMAGES_BOTTLE_ONGROUND = [
    "./img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "./img/6_salsa_bottle/2_salsa_bottle_on_ground_.png",
  ];
  world;
  offset;
  speedX;
  speedY;
  splashed = false;
  toBeRemoved = false;

  constructor(x, y, world) {
    super().loadImage("./img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(ThrowableObject.IMAGES_BOTTLE_ONGROUND);
    this.loadImages(ThrowableObject.IMAGES_BOTTLE_SPLASH);
    this.loadImages(ThrowableObject.IMAGES_BOTTLE_ROTATE);
    this.height = 70;
    this.width = 70;
    this.x = x;
    this.y = y;
    this.offset = { top: 10, left: 10, right: 10, bottom: 5 }; 
    this.img = this.imgCache[ThrowableObject.IMAGES_BOTTLE_ROTATE[0]];
    this.world = world;
  }

throw() {
   
    this.rotatingBottle();
    this.throwInterval = setInterval(() => {
      this.x += this.speedX;
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      if (this.y >= 450 && !this.splashed) {
        this.y = 450;
        this.speedY = 0;
        this.speedX = 0;
        this.toBeRemoved = true;
        this.stopBottleAnimation();
      }
    }, 1000 / 25);
}

  // bottleSplash() {

  //   if (this.throwInterval) clearInterval(this.throwInterval);
  //   if (this.rotationInterval) clearInterval(this.rotationInterval);
  //   this.speedX = 0;
  //   this.speedY = 0;
  //   this.width = 180;
  //   this.height = 180;
  //   this.splashed = true;
  //   this.bottleSplashIndex = 0;
  //   this.splashInterval = setInterval(() => {
  //     this.bottleSplashIndex =
  //       (this.bottleSplashIndex + 1) % this.IMAGES_BOTTLE_SPLASH.length;
  //     let path = this.IMAGES_BOTTLE_SPLASH[this.bottleSplashIndex];
  //     this.img = this.imgCache[path];
  //     if (this.bottleSplashIndex === 5) {
  //       this.stopBottleAnimation();
  //     }
  //   }, 500);
  // }
// bottleSplash() {
//     // Bewegung und Rotation stoppen
//     if (this.throwInterval) clearInterval(this.throwInterval);
//     if (this.rotationInterval) clearInterval(this.rotationInterval);
//     this.speedX = 0;
//     this.speedY = 0;

//     // Splash-Animation initialisieren
//     this.splashed = true;
//     this.bottleSplashIndex = 0;
//     this.width = 180;
//     this.height = 180;

//     // Splash-Animation: Größe wächst mit jedem Frame
//     this.splashInterval = setInterval(() => {
//         // Größe mit jedem Bild um 10px erhöhen
//         this.width = this.width + this.bottleSplashIndex * 10;
//         this.height = this.width + this.bottleSplashIndex * 10;

//         let path = this.IMAGES_BOTTLE_SPLASH[this.bottleSplashIndex];
//         this.img = this.imgCache[path];

//         this.bottleSplashIndex++;

//         // Wenn alle Splash-Bilder durch sind, Animation stoppen
//         if (this.bottleSplashIndex >= this.IMAGES_BOTTLE_SPLASH.length) {
//             clearInterval(this.splashInterval);
//             // Optional: Flasche entfernen oder Größe zurücksetzen
//             // this.width = this._originalWidth;
//             // this.height = this._originalHeight;
//             this.toBeRemoved = true;
//         }
//     }, 500); // Passe das Intervall nach Wunsch an (z.B. 200ms pro Frame)
// }

bottleSplash() {
    if (this.splashed) return; // Doppelte Animation verhindern

    // Bewegung und Rotation stoppen
    if (this.throwInterval) clearInterval(this.throwInterval);
    if (this.rotationInterval) clearInterval(this.rotationInterval);
    this.speedX = 0;
    this.speedY = 0;

    // Ursprungsgröße merken
    this._originalWidth = this.width;
    this._originalHeight = this.height;

    // Splash-Animation initialisieren
    this.splashed = true;
    this.bottleSplashIndex = 0;

    this.splashInterval = setInterval(() => {
        // Größe mit jedem Bild um 10px erhöhen, Startwert ist 180
        this.width = 180 + this.bottleSplashIndex * 10;
        this.height = 180 + this.bottleSplashIndex * 10;

        let path = ThrowableObject.IMAGES_BOTTLE_SPLASH[this.bottleSplashIndex];
        this.img = this.imgCache[path];

        this.bottleSplashIndex++;

        // Wenn alle Splash-Bilder durch sind, Animation stoppen und Flasche entfernen
        if (this.bottleSplashIndex >= ThrowableObject.IMAGES_BOTTLE_SPLASH.length) {
            clearInterval(this.splashInterval);
            this.toBeRemoved = true; // Flasche wird im nächsten Frame entfernt
            // Größe zurücksetzen (falls nötig)
            this.width = this._originalWidth;
            this.height = this._originalHeight;
        }
    }, 200); // Passe das Intervall nach Wunsch an
}

// rotatingBottle() {
//     this.width = 70;
//     this.height = 70;
//     this.bottleRotateIndex = 0;
//     if (this.rotationInterval) clearInterval(this.rotationInterval);
//     this.rotationInterval = setInterval(() => {
//       this.bottleRotateIndex =
//         (this.bottleRotateIndex + 1) % this.IMAGES_BOTTLE_ROTATE.length;
//       let path = this.IMAGES_BOTTLE_ROTATE[this.bottleRotateIndex];
//       this.img = this.imgCache[path];
//     }, 100);
// }

rotatingBottle() {
    if (this.rotationInterval) clearInterval(this.rotationInterval);
    if (!this.splashed) {
        this.width = 70;
        this.height = 70;
        this.bottleRotateIndex = 0;
        this.rotationInterval = setInterval(() => {
            this.bottleRotateIndex =
                (this.bottleRotateIndex + 1) % ThrowableObject.IMAGES_BOTTLE_ROTATE.length;
            let path = ThrowableObject.IMAGES_BOTTLE_ROTATE[this.bottleRotateIndex];
            this.img = this.imgCache[path];
        }, 100);
    }
}

  stopBottleAnimation() {
    if (this.rotationInterval) clearInterval(this.rotationInterval);
    if (this.throwInterval) clearInterval(this.throwInterval);
    if (this.splashInterval) clearInterval(this.splashInterval);
  }
}
