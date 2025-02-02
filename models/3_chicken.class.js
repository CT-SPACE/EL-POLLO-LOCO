class Chicken extends MovableObject{
    x = -80 + Math.random() * 800;
    y = 350;
    height = 80;
    width = 80;
    IMAGES_WALKING = [
        '../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        '../img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        '../img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];


        constructor() {
            super().loadImage('../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
            this.loadImages(this.IMAGES_WALKING);
            this.v1 = 0.15 + Math.random() * 0.5; // Zufällige Geschwindigkeit zwischen 0.1 und 0.6
            this.animationSpeed = Math.random() * 200 + 100; // Zufällige Animationsgeschwindigkeit zwischen 100 und 300 ms
            this.animateX();
            this.animateWalk();
        }
    
        animateX() {   

this.moveLeft();

}

    
        animateWalk() {
            setInterval(() => {
                
                this.playAnimation(this.IMAGES_WALKING);

            }, this.animationSpeed);
        }

    
    

}


