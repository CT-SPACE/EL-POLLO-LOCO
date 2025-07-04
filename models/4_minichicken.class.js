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

  constructor(world) {
    super().loadImage("./img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(MiniChicken.IMAGES_WALKING);
    this.loadImages(MiniChicken.IMAGES_HIT);
    this.world = world;
    this.chickId = Math.random().toString(36).substring(7);
    this.soundName = `mini_run_${this.chickId}`;
    this.x += 300 + Math.random() * 1600;
    this.speed = 3.2 + Math.random() * 1.0; 
    this.animationSpeed = 50 + Math.random() * 100; // Zufällige Animationsgeschwindigkeit
    this.type = "minichicken";
    this.visible_width = 800;
    this.animateX();
    this.animateWalk();
    this.setupSoundInterval();
    this.audio = audioManager;
    this.audio.playAudio(this.soundName, { volume: 0, loop: true });
  }

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

  animateWalk() {
    this.animateWalkInterval = setInterval(() => {
      this.playAnimation(MiniChicken.IMAGES_WALKING); 
    }, this.animationSpeed);
  }
  
  animateBounce() {
    if (this.animateBounceActive) return;

    this.animateBounceActive = true;
    let defaultSpeed = this.speed;
    this.speed = 0;

    clearInterval(this.animateWalkInterval);

    this.audio.playEffect("mini_bounce", { volume: 0.3, loop: false });
    this.audio.controlAudio(this.soundName, { play: false, pause: true });

    this.animateBounceMiniInterval = setInterval(() => {
      this.playAnimation(MiniChicken.IMAGES_HIT);
    }, 300);

    setTimeout(() => {
        this.clearBounceEffect(defaultSpeed)
    }, 3000);
  }

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


  setupSoundInterval() {
    setTimeout(() => {
      setInterval(() => {
        if (this.animateBounceActive) return;

        const volume = this.calculateVolume();
        if (volume > 0) {
          this.audio.controlAudio(this.soundName, {
            volume: volume * 0.3,
            loop: false,
          });
        }
      }, 200); 
    }, 300); 
  }

  isVisible() {
    if (!this.world) return false;

    const camera_x = this.world.cameraX;
    return (
      this.x + this.width >= -camera_x &&
      this.x <= -camera_x + this.visible_width
    );
  }

  calculateVolume() {
    if (!this.isVisible()) return 0;

    const camera_x = this.world.cameraX;
    const center_x = -camera_x + this.visible_width / 2;
    const distance = Math.abs(this.x - center_x);
    const max_distance = this.visible_width / 2;

    return Math.max(0, 1 - distance / max_distance);
  }
}
