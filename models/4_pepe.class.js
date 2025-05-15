class Pepe extends MovableObject {
  IMAGES_WALKING = [
    "./img/2_character_pepe/2_walk/W-21.png",
    "./img/2_character_pepe/2_walk/W-22.png",
    "./img/2_character_pepe/2_walk/W-23.png",
    "./img/2_character_pepe/2_walk/W-24.png",
    "./img/2_character_pepe/2_walk/W-25.png",
    "./img/2_character_pepe/2_walk/W-26.png",
  ];
  IMAGES_JUMPING = [
    "./img/2_character_pepe/3_jump/J-31.png",
    "./img/2_character_pepe/3_jump/J-32.png",
    "./img/2_character_pepe/3_jump/J-33.png",
    "./img/2_character_pepe/3_jump/J-34.png",
    "./img/2_character_pepe/3_jump/J-35.png",
    "./img/2_character_pepe/3_jump/J-36.png",
    "./img/2_character_pepe/3_jump/J-37.png",
    "./img/2_character_pepe/3_jump/J-38.png",
    "./img/2_character_pepe/3_jump/J-39.png",
  ];
  IMAGES_DYING = [
    "./img/2_character_pepe/5_dead/D-51.png",
    "./img/2_character_pepe/5_dead/D-52.png",
    "./img/2_character_pepe/5_dead/D-53.png",
    "./img/2_character_pepe/5_dead/D-54.png",
    "./img/2_character_pepe/5_dead/D-55.png",
    "./img/2_character_pepe/5_dead/D-56.png",
    "./img/2_character_pepe/5_dead/D-57.png",
  ];
  IMAGES_HURT = [
    "./img/2_character_pepe/4_hurt/H-41.png",
    "./img/2_character_pepe/4_hurt/H-42.png",
    "./img/2_character_pepe/4_hurt/H-43.png",
  ];
  IMAGES_SLEEPING = [
    "./img/2_character_pepe/1_idle/long_idle/I-11.png",
    "./img/2_character_pepe/1_idle/long_idle/I-12.png",
    "./img/2_character_pepe/1_idle/long_idle/I-13.png",
    "./img/2_character_pepe/1_idle/long_idle/I-14.png",
    "./img/2_character_pepe/1_idle/long_idle/I-15.png",
    "./img/2_character_pepe/1_idle/long_idle/I-16.png",
    "./img/2_character_pepe/1_idle/long_idle/I-17.png",
    "./img/2_character_pepe/1_idle/long_idle/I-18.png",
    "./img/2_character_pepe/1_idle/long_idle/I-19.png",
    "./img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];
  // pepe_pollo = new Audio("./audio/pepe_pollo_funny.mp3");
  // chicken_splat = new Audio("./audio/chicken_splat.mp3");
  // pepe_caramba = new Audio("./audio/pepe_caramba_funny.mp3");
  // pepe_snore = new Audio("./audio/pepe_snore.mp3");
  // pepe_hurt = new Audio("./audio/pepe_grunts_2.mp3");

  isPlayingHurtAudio = false;

  x = 0;
  y = 40;
  height = 340;
  width = 160;
  world;
  audio;
  lastKeyPressTime = Date.now();
  isSleepingState = false;
  timeToSleep = 60000;
  keyboard;
  //audioPlaying = {};
  cameraX;
  speed = 20;
  speedY = 0;
  frameIndex = 0;
  offset = {
    left: 30,
    right: 40,
    top: 130,
    bottom: 10,
  };

  constructor(keyboard) {
    super().loadImage("./img/2_character_pepe/2_walk/W-21.png");

    this.keyboard = keyboard;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DYING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_SLEEPING);
    this.audio = audio;
    this.animateWalk();
    this.applyGravity();
    this.listenForKeyPress(this.lastKeyPressTime);
    this.isPlayingHurtAudio = false;
    this.animateStates();
  }
  //   document.addEventListener("keydown", (event) => {
  //     if (event.key === "ArrowRight" && !audioPlaying["pepe_pollo"]) {
  //         playAudio("pepe_pollo", { loop: false, volume: 0.6 });
  //         audioPlaying["pepe_pollo"] = true;
  //     }
  // });

  // document.addEventListener("keyup", (event) => {
  //     if (event.key === "ArrowRight") {
  //         audioPlaying["pepe_pollo"] = false;
  //     }
  // });

  animateWalk() {
    this.x = 100;

    setInterval(() => {
         if (this.energy <= 0) return;

        if (keyboard.RIGHT && this.x < this.world.level.level_endX) {
          this.handleRightMovement();
      }
        if (keyboard.LEFT && this.x > 100) {
          this.handleLeftMovement();
        }
        if ((keyboard.UP || keyboard.SPACE) && this.y >= 100) {
          this.jump();
        }

        this.world.cameraX = -this.x + 100;
      
    }, 3000 / 25);
}

  listenForKeyPress(lastKeyPressTime) {
    this.lastKeyPressTime = lastKeyPressTime;
    document.addEventListener("keydown", () => {
      this.lastKeyPressTime = Date.now();
      // console.log("Key pressed at:", this.lastKeyPressTime);
      if (this.isSleepingState) {
        this.stopSleepAnimation();
      }
    });
  }

  handleRightMovement(){
             this.stopSleepAnimation();
          this.playAnimation(this.IMAGES_WALKING);
          this.moveRight();
          if (!this.audio.audioPlaying["pepe_pollo"]) {
            // this.audio.audioPlaying["pepe_pollo"] = true;
             this.audio.playAudio("pepe_pollo", { loop: false, volume: 0.4 });
            //     if (audioElement) {
            // audioElement.onended = () => {
            //     audioPlaying["pepe_pollo"] = false;
            // };
            //     } else {
            //       console.error("Audio konnte nicht abgespielt werden.");
            //        audioPlaying["pepe_pollo"] = false;
            //         };
        }
  }

  handleLeftMovement(){
          this.stopSleepAnimation();
          this.playAnimation(this.IMAGES_WALKING);
          this.moveLeft(this.speed);
          this.otherDirection = true;
  }

  stopSleepAnimation() {
    this.isSleepingState = false;
    //this.playAudio["pepe_snore"] = false;

    audio.controlAudio("pepe_snore", {
      play: false,
      pause: true,
      currentTime: 0,
    });
    // this.pepe_snore.pause();
  }

  animateStates() {
    this.isPlayingHurtAudio = false;

    setInterval(() => {
      if (this.isDead()) {
        this.animateDeath();
      } else if (this.isHurt()) {
        this.animateHurt();
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
        // if (this.isColliding(this.world.level.enemies)) {
        //   this.animateChickenSplat();
        // };
      } else if (Date.now() - this.lastKeyPressTime >= this.timeToSleep) {
        this.isSleepingState = true;
        this.animateSleep();
      } else {
        this.stopSleepAnimation();
      }
    }, 500);
  }

  animateSleep() {
    this.isSleepingState = true;

    this.playAnimation(this.IMAGES_SLEEPING);
    if (!audioPlaying["pepe_snore"]) {
      audio.playAudio("pepe_snore", { loop: true, volume: 0.4 });
      audioPlaying["pepe_snore"] = true;
    }
    audio.controlAudio("pepe_pollo", { play:false, pause: true, currentTime: 0 });

    // this.pepe_pollo.pause();
    // this.pepe_snore.play();
    // this.pepe_snore.volume = 0.3;
    // this.pepe_snore.loop = true;
  }

  animateDeath() {
    this.playAnimation(this.IMAGES_DYING);
    audio.controlAudio("pepe_snore", { pause: true, currentTime: 0 });
    // this.pepe_snore.pause();
  }

  animateJump() {
    this.playAnimation(this.IMAGES_JUMPING);
  }

  animateHurt() {
    this.playAnimation(this.IMAGES_HURT);

    if (!this.isPlayingHurtAudio) {
      audio.playAudio("pepe_hurt", { play: true, volume: 0.5, loop: false });
      // this.pepe_hurt.play();
      // this.pepe_hurt.loop = false;
      // this.isPlayingHurtAudio = true;
      // this.pepe_hurt.volume = 0.5;
    }
  }
}
