class StatusBar extends StaticObject {
    x = 0;
    y = 0;
    energy;
    world;
    cameraX;
    percentage;
    height = 50;
    width = 5000;
    img;

    IMAGES_HEALTH = [
        './img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    constructor() {
        super().loadImage('./img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png')
        this.loadImages(this.IMAGES_HEALTH);
        this.x = 40;
        this.y = 20;
        this.setPercentage(this.energy);
       

    }

    setPercentage(percentage){
        this.percentage = percentage;
        console.log("Health % =", percentage);
        let path = this.IMAGES_HEALTH[this.resolveImagePercent()];
        this.img = this.imgCache[path];
        this.width = 105;
        this.height = 26;
        console.log("Health score =", this.resolveImagePercent());
 
    }


    resolveImagePercent(percentage){
        if(percentage > 0.10 && percentage < 0.30){
            return 1;
        } else if(percentage >= 0.30 && percentage < 0.50){
            return 2;
        } else if(percentage >= 0.50 && percentage < 0.70){
            return 3;
        } else if(percentage >= 0.70 && percentage < 0.95){
            return 4;
        } else if(percentage >= 0.95){
           return 5;
        } else {
           return 0;
        }
    }



}