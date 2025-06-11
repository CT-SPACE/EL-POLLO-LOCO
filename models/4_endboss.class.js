class Endboss extends MovableObject {
  height = 450;
  width = 380;
  speed = 0;
  speedY = 0.5;
  world;
  audioManager;
  character;
  EndBossClose = false;
  deathHandled = false;
  energy = 100;
  status = false;
  isDead = false;

  y = 12;
  animationSpeed = 1000;
  animateWalkInterval;
  animateAttackInterval;
  animateAlertInterval;

  offset = {
    left: 60,
    right: 130,
    top: 100,
    bottom: 180,
  };
  static IMAGES_WALK = [
    "./img/4_enemie_boss_chicken/1_walk/G1.png",
    "./img/4_enemie_boss_chicken/1_walk/G2.png",
    "./img/4_enemie_boss_chicken/1_walk/G3.png",
    "./img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  static IMAGES_ALERT = [
    "./img/4_enemie_boss_chicken/2_alert/G5.png",
    "./img/4_enemie_boss_chicken/2_alert/G6.png",
    "./img/4_enemie_boss_chicken/2_alert/G7.png",
    "./img/4_enemie_boss_chicken/2_alert/G8.png",
    "./img/4_enemie_boss_chicken/2_alert/G9.png",
    "./img/4_enemie_boss_chicken/2_alert/G10.png",
    "./img/4_enemie_boss_chicken/2_alert/G11.png",
    "./img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  static IMAGES_ATTACK = [
    "./img/4_enemie_boss_chicken/3_attack/G13.png",
    "./img/4_enemie_boss_chicken/3_attack/G14.png",
    "./img/4_enemie_boss_chicken/3_attack/G15.png",
    "./img/4_enemie_boss_chicken/3_attack/G16.png",
    "./img/4_enemie_boss_chicken/3_attack/G17.png",
    "./img/4_enemie_boss_chicken/3_attack/G18.png",
    "./img/4_enemie_boss_chicken/3_attack/G19.png",
    "./img/4_enemie_boss_chicken/3_attack/G20.png",
  ];
  static IMAGES_HURT = [
    "./img/4_enemie_boss_chicken/4_hurt/G21.png",
    "./img/4_enemie_boss_chicken/4_hurt/G22.png",
    "./img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  static IMAGES_DEAD = [
    "./img/4_enemie_boss_chicken/5_dead/G24.png",
    "./img/4_enemie_boss_chicken/5_dead/G25.png",
    "./img/4_enemie_boss_chicken/5_dead/G26.png",
    "./img/4_enemie_boss_chicken/5_dead/G27.png",
  ];

  constructor(world) {
    super().loadImage(Endboss.IMAGES_ALERT[0]);
    this.loadImages(Endboss.IMAGES_ALERT);
    this.loadImages(Endboss.IMAGES_WALK);
    this.loadImages(Endboss.IMAGES_ATTACK);
    this.loadImages(Endboss.IMAGES_HURT);
    this.loadImages(Endboss.IMAGES_DEAD);
    this.type = "endboss";
    this.world = world;
    this.EndBossClose = false;
    this.isDead = false;
    this.status = false;
    this.audio = audioManager;

    this.animateWalk();

    this.x = 3800;
  }


  animateWalk() {
    clearInterval(this.animateAttackInterval);
    clearInterval(this.animateAlertInterval);

    this.animateWalkInterval = setInterval(() => {
      this.speed = 0.8;
      this.playAnimation(Endboss.IMAGES_WALK);
      this.moveLeft(this.speed);
    }, 6000 / 25);
  }

  animateAlert() {
    clearInterval(this.animateAttackInterval);
    clearInterval(this.animateWalkInterval);
    this.animateAlertInterval = setInterval(() => {
      this.speed = 0;
      this.moveLeft(this.speed);
      this.playAnimation(Endboss.IMAGES_ALERT);
    }, 2000 / 25);
  }

animateAttack() {
    clearInterval(this.animateWalkInterval);
    clearInterval(this.animateAlertInterval);
    if (this.animateAttackInterval) clearInterval(this.animateAttackInterval);

    let jumpDistance = 40;
    this.animateAttackInterval = setInterval(() => {
        if (gamePaused) return;
        this.playAnimation(Endboss.IMAGES_ATTACK);
        if (this.currentIMG % Endboss.IMAGES_ATTACK.length === 5) {
            this.x -= jumpDistance;
        }
    }, 3000 / 25);
}

  animateDeath() {
    this.isDead = true;
    this.deathHandled = false; 
    this.playAnimation(Endboss.IMAGES_DEAD);
 this.audio.controlAudio("endbossBackground", { play: false, pause: true});

  }

// animateDeath() {
//     if (this.isDead) return;
//     this.isDead = true;
//     this.deathHandled = false; 
//      this.status = false;
//     clearInterval(this.animateWalkInterval);
//     clearInterval(this.animateAttackInterval);
//     clearInterval(this.animateAlertInterval);

//     let deathFrame = 0;
//     this.deathInterval = setInterval(() => {
//         if (deathFrame < Endboss.IMAGES_DEAD.length) {
//             this.img = this.imgCache[Endboss.IMAGES_DEAD[deathFrame]];
//             deathFrame++;
//         } else {
//             clearInterval(this.deathInterval);
//             this.status = false;
//              this.audio.playAudio("endbossBackground", { play: false, pause: true});
//         }
//     }, 500); 
   
//     this.speed = 0;
//     // audio.controlAudio("endboss_attack", {play: false, pause: true, currentTime: 0});
//     this.audio.playAudio("endbossBackground", {play: false, pause: true});
// }


  isAttacking(status) {
    if (status === true) {
       this.audio.playAudio("endboss_attack", {play: true});
      return true;
    } else {
      this.audio.controlAudio("endboss_attack", {
        play: false,
        pause: true,
        currentTime: 0,
      });
      return false;
    }
  }

startAttackMode() {
    this.status = true;
    this.isAttacking(this.status);
    if (this.animateAttackInterval) clearInterval(this.animateAttackInterval);
    this.animateAttack();
}

  isAlert() {
    return (
      this.currentImage < Endboss.IMAGES_ALERT.length && this.currentImage > 0
    );
  }

animateHurt() {
    clearInterval(this.animateAttackInterval);
    clearInterval(this.animateWalkInterval);
    clearInterval(this.animateAlertInterval);

    if (this.animateHurtInterval) clearInterval(this.animateHurtInterval);

    let hurtFrame = 0;
    this.animateHurtInterval = setInterval(() => {
        if (this.isDead) {

            clearInterval(this.animateHurtInterval);
            return;
        }
        this.img = this.imgCache[Endboss.IMAGES_HURT[hurtFrame]];
        hurtFrame = (hurtFrame + 1) % Endboss.IMAGES_HURT.length; // Endlos-Schleife

    }, 500);
}


  


}
