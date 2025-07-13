class MiniChicken extends MovableObject {
  x = 400;
  y = 350;
  speed = 0.15;
  height = 80;
  width = 80;
  world;
  audioManager;
  playingBounceAudio = false;
  animateBounceActive = false;
  visible_width = 800;

  static IMAGES_WALKING = [
    "./img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "./img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "./img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  static IMAGES_HIT = [
    "./img/3_enemies_chicken/chicken_small/1_j.png",
    "./img/3_enemies_chicken/chicken_small/2_j.png",
    "./img/3_enemies_chicken/chicken_small/3_j.png",
  ];

  audioManager;
  animateXInterval;
  animateWalkInterval;
  animateBounceMiniInterval;
  offset = {
    left: 20,
    right: 20,
    top: 20,
    bottom: 10,
  };

  /**
   * Defines the properties of the MiniChicken class, including its position, speed, and dimensions.
   * Loads the walking and hit images, sets up the initial position and speed, and initializes the audio manager.
   * @param {Object} audioManager - The audio manager for handling sound effects.
   * @param {Object} world - The world object that contains the game state and environment.
   * @param {Number} x - The initial x-coordinate of the mini chicken.
   * @param {Number} y - The initial y-coordinate of the mini chicken.
   */
  constructor(world) {
    super().loadImage("./img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(MiniChicken.IMAGES_WALKING);
    this.loadImages(MiniChicken.IMAGES_HIT);
    this.world = world;
    this.chickId = Math.random().toString(36).substring(7);
    this.soundName = `mini_run_${this.chickId}`;
    this.x += 300 + Math.random() * 1600;
    this.speed = 3.2 + Math.random() * 1.0; 
    this.animationSpeed = 50 + Math.random() * 100;
    this.type = "minichicken";
    this.visible_width = 800;
    this.animateX();
    this.animateWalk();
    this.audio = audioManager;
    this.audio.playAudio(this.soundName, { volume: 0, loop: true });
  }

  /**
   * Animates the mini chicken's movement along the x-axis by moving it left or right based on its current position.
   * If the mini chicken reaches the left or right boundary, it changes direction.
   */
  animateX() {
    let movingRight = false;
    this.animateXInterval = setInterval(() => {
      if (this.x <= 40 && !movingRight) {
        movingRight = true;
        this.otherDirection = true;
      } else if (this.x >= 5800 && movingRight) {
        movingRight = false;
        this.otherDirection = false;
      }
      movingRight ? this.moveRightMini(this.speed) : this.moveLeft(this.speed);
    }, 1000 / 60);
  }

  /**
   * Animates the mini chicken's walk movement by playing the walking animation at a defined speed.
   */
  animateWalk() {
    this.animateWalkInterval = setInterval(() => {
      this.playAnimation(MiniChicken.IMAGES_WALKING); 
    }, this.animationSpeed);
  }
  
  /**
   * In case of Pepe jumping on a mini chicken, this function handles the bounce effect.
   * It plays the bounce animation, stops the walking animation, and resets the speed after a delay.
   * It also plays a bounce sound effect and controls the audio playback.
   */
  animateBounce() {
    if (this.animateBounceActive) return;

    this.animateBounceActive = true;
    let defaultSpeed = this.speed;
    this.speed = 0;
    clearInterval(this.animateWalkInterval);
    this.bounceEffect();
    setTimeout(() => {
        this.clearBounceEffect(defaultSpeed)
    }, 3000);
  }

/**
 * Handles the bounce effect by playing the bounce animation and sound.
 * It also stops the audio playback for the mini chicken.
 */
bounceEffect(){
      this.audio.playEffect("mini_bounce", { volume: 0.3, loop: false });
    this.audio.controlAudio(this.soundName, { play: false, pause: true });

    this.animateBounceMiniInterval = setInterval(() => {
      this.playAnimation(MiniChicken.IMAGES_HIT);
    }, 300);
}

/**
 * Clears the bounce effect by stopping the bounce animation, resetting the speed, and playing the walking animation again.
 * It also resumes the audio playback for the mini chicken.
 * @param {Number} defaultSpeed 
 */
clearBounceEffect(defaultSpeed){
     clearInterval(this.animateBounceMiniInterval);
      this.animateBounceMiniInterval = null;
      this.animateBounceActive = false;
      this.speed = defaultSpeed;
      this.audio.controlAudio(this.soundName, {
        play: true,
        pause: false,
        loop: true,
      });
      this.animateWalk();
}

}
