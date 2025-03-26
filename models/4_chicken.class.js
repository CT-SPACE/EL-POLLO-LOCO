class Chicken extends MovableObject{
    x = 400;
    y = 350;
    speed = 0.15;
    height = 80;
    width = 80;
    // enemies = [];
    chicken_run = new Audio('./audio/chicken_group.mp3');
    IMAGES_WALKING = [
        './img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];


        constructor() {
            super().loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
            this.loadImages(this.IMAGES_WALKING);
            this.x +=  300 + Math.random() * 1600;
            this.speed = 0.5 + Math.random() * 0.5; // Zufällige Geschwindigkeit zwischen 0.1 und 0.6
            this.animationSpeed = Math.random() * 20 + 100; // Zufällige Animationsgeschwindigkeit zwischen 100 und 300 ms
            this.animateX();
            this.animateWalk();
            
        }
    
// animateX() {  
//     if(!this.chicken_run.play()){
//         this.startingChickenSound();
//     } 

//     setInterval(() => {
//     this.moveLeft();
    
//     }, 1000 / 60);
//             }
offset = {
    left: 10,
    right: 10,
    top: 10,
    bottom: 10
}


animateX() {  
    const canvasWidth = 800; // Beispiel für die Canvas-Breite
    const pepeX = 200; // Pepe's Position vom linken Canvas-Rand
    console.log("chicken =", this.x);
    // Funktion zur Überprüfung, ob mindestens ein Huhn im sichtbaren Bereich ist
    const isChickenVisible = () => {
        if((this.x - pepeX) > canvasWidth && (Chicken.x) < 0){
            return false;

        } else{
                    return true;
                }        
    }

    // if(!this.chicken_run.play() && isChickenVisible()){
    //     this.startingChickenSound();
    // } 
    if(isChickenVisible() && this.chicken_run.pause()){
            this.startingChickenSound(pepeX);
        };
    setInterval(() => {
        this.moveLeft();
        
        // Überprüfen, ob nach der Bewegung Hühner im sichtbaren Bereich sind
        // 
        
    }, 1000 / 60);
}



animateWalk() {
    this.x += 1200;
            setInterval(() => { 
                this.playAnimation(this.IMAGES_WALKING);
      }, this.animationSpeed);
   }

   startingChickenSound(pepeX){
    // Beispielcharakter Pepe
   // const pepeX = 200;

    if((this.x - pepeX) > 700 && this.x == 0 && this.chicken_run.play()){
        this.chicken_run.pause();
    } else {
        this.chicken_run.play();
        this.chicken_run.volume = 0.05;
    }
}

}
