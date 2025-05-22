class Chicken extends MovableObject{
    x = 400;
    y = 350;
    speed = 0.15;
    height = 80;
    width = 80;
    world;
    audio;

    IMAGES_WALKING = [
        './img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    img_death = './img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    animateXInterval;
    offset = {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
    }
    


        constructor(world) {
            super().loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
            this.loadImages(this.IMAGES_WALKING);
            this.world = world;

            // this.audio = world.getAudio(); // Zugriff auf die Audio-Variable aus World
            this.audio = audio; // Zugriff auf die Audio-Variable aus World
            this.x +=  300 + Math.random() * 1600;
            this.speed = 0.1 + Math.random() * 0.5; // Zufällige Geschwindigkeit zwischen 0.1 und 0.6
            this.animationSpeed = Math.random() * 20 + 100; // Zufällige Animationsgeschwindigkeit zwischen 100 und 300 ms
            this.type = 'chicken';
            this.animateX();
            this.animateWalk();
            this.isDead = false;
            
        }
    

animateX() {  
    this.animateXInterval = setInterval(() => { // Speichere die Intervall-ID
        this.moveLeft(this.speed);
    }, 1000 / 60);
}

animateWalk() {
    this.x += 1200;
    this.animateWalkInterval = setInterval(() => { // Speichere die Intervall-ID
        this.playAnimation(this.IMAGES_WALKING);
    }, this.animationSpeed);
}

animateDeath() {
    if (this.isDead) return; // Wenn das Huhn bereits tot ist, nichts tun
    this.isDead = true; // Status auf tot setzen

    clearInterval(this.animateXInterval);
    clearInterval(this.animateWalkInterval);
    audio.playAudio("chicken_splat", {play:true, loop: false, volume: 0.5});

    this.loadImage(this.img_death);
    this.y = 362;
    setTimeout(() => {
       if (window.world && window.world.level && window.world.level.enemies) {
                window.world.level.enemies.splice(window.world.level.enemies.indexOf(this), 1);
            }
        }, 1000); // Verzögerung von 1 Sekunde   

}

   startingChickenSound(pepeX){


    if((this.x - pepeX) > 700 && this.x == 0 && this.audio[chicken_run].playing){
        this.audio.controlAudio("chicken_run", {pause:true, currentTime: 0});
   
    } else {
        this.audio.playAudio("chicken_run", {play:true, loop: true, volume: 0.05});

    }
}




}
