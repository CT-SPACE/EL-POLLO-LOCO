class Chicken extends MovableObject {
  x = 400;
  y = 350;
  speed = 0.15;
  height = 80;
  width = 80;
  world;
  audioManager;

  static IMAGES_WALKING = [
    "./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  img_death = "./img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

  animateXInterval;
  offset = {
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
  };

  /**
   * Defines the all properties of the Chicken class, including its position, speed, and dimensions.
   * Loads the walking images and sets up the initial position and speed.
   * @param {Object} world - The world object that contains the game state and environment.
   * @param {Object} audioManager - The audio manager for handling sound effects.
   * @param {Number} x - The initial x-coordinate of the chicken.
   * @param {Number} y - The initial y-coordinate of the chicken.
   * @param {Number} speed - The speed of the chicken.
   */
  constructor(world) {
    super().loadImage("./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(Chicken.IMAGES_WALKING);
    this.world = world;

    this.audio = audioManager;
    this.x += 300 + Math.random() * 1600;
    this.speed = 0.1 + Math.random() * 0.5;
    this.animationSpeed = Math.random() * 20 + 100;
    this.type = "chicken";
    this.animateX();
    this.animateWalk();
    this.isDead = false;
  }

  /**
   * Animates the chicken's movement along the x-axis by moving it left at a defined speed.
   */
  animateX() {
    this.animateXInterval = setInterval(() => {
      this.moveLeft(this.speed);
    }, 1000 / 60);
  }

  /**
   * Animates the chicken's walk movement.
   */
  animateWalk() {
    this.x += 1200;
    this.animateWalkInterval = setInterval(() => {
      this.playAnimation(Chicken.IMAGES_WALKING);
    }, this.animationSpeed);
  }

  /**
   * @returns Prepares the chicken for death by stopping its animations and playing the death image.
   * If the chicken is dead, it removes itself from the world.
   */
  animateDeath() {
    if (this.isDead) return;
    this.isDead = true;
    clearInterval(this.animateXInterval);
    clearInterval(this.animateWalkInterval);
    audioManager.playAudio("chicken_splat", { play: true, loop: false, volume: 0.5 });

    this.loadImage(this.img_death);
    this.y = 362;
    setTimeout(() => {
      if (window.world && window.world.level && window.world.level.enemies) {
        window.world.level.enemies.splice(window.world.level.enemies.indexOf(this), 1);
      }
    }, 1000);
  }
}
