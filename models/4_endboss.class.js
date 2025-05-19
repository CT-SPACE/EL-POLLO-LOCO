class Endboss extends MovableObject {
    height = 450;
    width = 380;
    speed = 0;
    speedY = 0.5;
    world;
    audio;
    character;
    EndBossClose = false;
   energy = 100;
   status = false;

    //endboss_attack = new Audio("./audio/endboss_attack.mp3");

    y = 12;
    animationSpeed = 1000;
    animateXInterval;
    animateWalkInterval;
    animateAttackInterval;
    animateAlertInterval;

    offset = {
        left: 40,
        right: 10,
        top: 10,
        bottom: 10
    }
    IMAGES_WALK = [
        "./img/4_enemie_boss_chicken/1_walk/G1.png",
        "./img/4_enemie_boss_chicken/1_walk/G2.png",
        "./img/4_enemie_boss_chicken/1_walk/G3.png",
        "./img/4_enemie_boss_chicken/1_walk/G4.png",
    ];
    IMAGES_ALERT = [
"./img/4_enemie_boss_chicken/2_alert/G5.png",
"./img/4_enemie_boss_chicken/2_alert/G6.png",
"./img/4_enemie_boss_chicken/2_alert/G7.png",
"./img/4_enemie_boss_chicken/2_alert/G8.png",
"./img/4_enemie_boss_chicken/2_alert/G9.png",
"./img/4_enemie_boss_chicken/2_alert/G10.png",
"./img/4_enemie_boss_chicken/2_alert/G11.png",
"./img/4_enemie_boss_chicken/2_alert/G12.png"
    ];
    IMAGES_ATTACK = [
        "./img/4_enemie_boss_chicken/3_attack/G13.png",
        "./img/4_enemie_boss_chicken/3_attack/G14.png",
        "./img/4_enemie_boss_chicken/3_attack/G15.png",
        "./img/4_enemie_boss_chicken/3_attack/G16.png",
        "./img/4_enemie_boss_chicken/3_attack/G17.png",
        "./img/4_enemie_boss_chicken/3_attack/G18.png",
        "./img/4_enemie_boss_chicken/3_attack/G19.png",
        "./img/4_enemie_boss_chicken/3_attack/G20.png"
    ];
        IMAGES_HURT = [
        "./img/4_enemie_boss_chicken/4_hurt/G21.png",   
        "./img/4_enemie_boss_chicken/4_hurt/G22.png",
        "./img/4_enemie_boss_chicken/4_hurt/G23.png"
    ]
    IMAGES_DEAD = [
        "./img/4_enemie_boss_chicken/5_dead/G24.png",
        "./img/4_enemie_boss_chicken/5_dead/G25.png",
        "./img/4_enemie_boss_chicken/5_dead/G26.png",
        "./img/4_enemie_boss_chicken/5_dead/G27.png"
    ];




    constructor(world){
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ATTACK);    
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.type = "endboss";
        this.world = world;
        this.EndBossClose = false;
        this.status = false;
        // this.endboss_attack.pause();
        // this.endboss_attack.currentTime = 0; 
        //  this.animateStates(this.world);
         this.animateWalk();
        //  this.animateAlert();
        // this.animateAttack();
        //  this.animateWalk();
        // this.character = this.world ? this.world.character : undefined;
        
        // this.character = character;
        // this.world = world;
        this.x = 3800;
      
    }

    // animate(EndBossVisible, EndBossClose) {
    //     this.EndBossVisible = EndBossVisible;
    //     this.EndBossClose = EndBossClose;
    //     console.log("animate: EndBossVisible", EndBossVisible);
    //     console.log("animate: EndBossClose", EndBossClose);
    //     setInterval(() => {
            
    //         if(this.isDead()) {
    //             this.playAnimation(this.IMAGES_DEAD);
    //         }
    //         else if(this.isHurt()) {
    //             this.playAnimation(this.IMAGES_HURT);
    //         }
    //         else if(EndBossClose === true) {
    //             this.playAnimation(this.IMAGES_ATTACK);
    //             this.endboss_attack.play();
    //             this.endboss_attack.volume = 0.5;
    //             this.endboss_attack.loop = false;
    //         }
    //         // else if(this.isAlert()){
    //         //     this.playAnimation(this.IMAGES_ALERT);
    //         // }   
    //         else if(EndBossVisible === true) {
    //         //    setTimeout(() => {

    //             this.animateWalk() ;
    //         //    }, 3000)
    //         }
    //         else {
    //             //this.playAnimation(this.IMAGES_ALERT);
    //             EndBossVisible = false;
    //         }
    
    //     }, this.animationSpeed);
    // }

    animateStates(world) {
        this.world = world;
        setInterval(() => {
            //console.log("animateStates - Endboss-Status", this.status);


            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);

            }
            else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                audio.controlAudio('endboss_attack', {pause:true, currentTime: 0});
                // this.endboss_attack.pause();

            }
            
            else { // Zugriff auf Eigenschaft
                //console.log("world:", this.world);
                //console.log("animate: EndbossClose", this.EndBossClose);
               //console.log("animate: EndbossVisible", this.world.EndBossVisible);
               if (this.EndBossClose === true) {
                this.status = true;
                world.EndBossVisible = true; // Setze EndBossVisible auf true
                this.isAttacking(this.status);
               this.animateAttack();
               audio.playAudio('endboss_attack', {play: true, loop: false, volume: 0.6, currentTime: 0});
              
            //    this.endboss_attack.play();
            //    this.endboss_attack.volume = 0.5;
            //    this.endboss_attack.loop = false;
            //    this.playAnimation(this.IMAGES_ATTACK);
            //    this.speed = 0.5;
            //    this.moveLeft();
            //    this.endboss_attack.play();
            //    this.endboss_attack.volume = 0.5;
            //    this.endboss_attack.loop = false;
               
               }
    
                 if (world.EndBossVisible === true && this.EndBossClose === false){
                   this.animateAlert();
                   this.status = false;
                  this.isAttacking(this.status);

                }  
                else {
                    this.status = false;
                    this.isAttacking(this.status);
                    audio.controlAudio('endboss_attack', {play: false,pause:true, currentTime: 0});
                    // this.endboss_attack.pause();
                    // this.endboss_attack.currentTime = 0; 
                }
                // else {
                //     //this.animateX();
                //     this.speed = 5;
                //     this.playAnimation(this.IMAGES_WALK);
                //     this.moveLeft();
                //     //this.EndBossVisible = false;
                //     this.EndBossClose = false; // Setze EndBossClose zurück
                // }

            }
        }, this.animationSpeed);
    }
    

    animateWalk() {
        clearInterval(this.animateAttackIntervall); // Stoppe das Animationsintervall
        clearInterval(this.animateAlertIntervall);
        // this.animationSpeed = Math.random() * 20 + 100; // Zufällige Animationsgeschwindigkeit zwischen 100 und 300 ms
       // this.x += 1200;
       this.animateWalkIntervall =  setInterval(() => { // Speichere die Intervall-ID
                // if (this.energy > 0 || this.energy === null) {
                    this.speed = 1;
                    this.playAnimation(this.IMAGES_WALK);
                    this.moveLeft(this.speed);
     //}
     },3000 /25);
    }
    
    animateAlert(){
        clearInterval(this.animateAttackIntervall); // Stoppe das Animationsintervall
        clearInterval(this.animateWalkIntervall);
        this.animateAlertIntervall =  setInterval(() => { // Speichere die Intervall-ID
                // if (this.energy > 0 || this.energy === null) {
                this.speed = 0;
                this.moveLeft(this.speed);
                this.playAnimation(this.IMAGES_ALERT);
        },2000 / 25);
    }

    animateAttack() {      
        clearInterval(this.animateWalkIntervall); // Stoppe das Animationsintervall
        clearInterval(this.animateAlertIntervall);
        this.animateAttackIntervall =  
        setInterval(() => {     
        this.playAnimation(this.IMAGES_ATTACK);
        this.speed = 0.5;
        this.moveLeft(this.speed);

        }, 3000 / 25); // Setze das Intervall auf 1000 ms (1 Sekunde)
    }

    animateDeath() {
        if (!this.isDead) return;
        this.isDead = true; // Setze den Status auf "tot"
        clearInterval(this.animateWalkIntervall); // Stoppe das Animationsintervall
        clearInterval(this.animateAttackIntervall); // Stoppe das Animationsintervall
        clearInterval(this.animateAlertIntervall); // Stoppe das Animationsintervall
         
        this.playAnimation(this.IMAGES_DEAD);
        this.speed = 0;
        audio.controlAudio('endboss_attack', {play: false,pause:true, currentTime: 0}); 
        // this.endboss_attack.pause();
        // this.endboss_attack.currentTime = 0; // Setze den Audio-Player zurück
    
}
    isAttacking(status) {
        if (status === true) {
            //console.log("Endboss greift an!");

            return true;
        } else {
            audio.controlAudio('endboss_attack', {play: false,pause:true, currentTime: 0});
            // this.endboss_attack.pause();
            // this.endboss_attack.currentTime = 0; // Setze den Audio-Player zurück
            return false;
        }
   
    }
    


// isAttacking(){
//     if(this.character.isColliding(this) ){
//         //console.log("this =", this.isColliding(), this);
//         return true;
//     } else {
//          return false;
//     }
   
// }

    // animateWalk() {
  
    //         this.playAnimation(this.IMAGES_WALK);
    //         this.moveLeft();
      
    // }

    
isAlert(){
    return this.currentImage < this.IMAGES_ALERT.length && this.currentImage > 0;           
}

isDead(){
    if(this.energy <= 0) {
        this.energy = 0;
   
    return true
    }
    else {
        return false;
    }
}


}