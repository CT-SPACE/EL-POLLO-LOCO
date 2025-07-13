class Clouds extends MovableObject {
  y = 50;
  x = 0;
  speed = 0.2 + Math.random() * 0.5; 
  offset = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };
  width = 700;
  height = 300;
  static IMAGES_MOVING = [
    "./img/5_background/layers/4_clouds/1.png",
    "./img/5_background/layers/4_clouds/2.png",
  ];

  /**
   * Defines the properties of the Clouds class, including its position, speed, and dimensions.
   */
  constructor() {
    super().loadImage("./img/5_background/layers/4_clouds/1.png");
    this.loadImages(Clouds.IMAGES_MOVING);
    this.x += 300 + Math.random() * 5000;

    this.animateX();
  }

  /**
   * Animates the clouds by moving them to the left at a defined speed.
   */
  animateX() {
    setInterval(() => {
      this.moveLeft(this.speed);
    }, 1000 / 25);
  }
}
