class StatusBarPepe extends StaticObject {
    x = 0;
    y = 0;

    energy = 1;
    //world;
    //cameraX;
    percentage = 1;
    height = 50;
    width = 5000;
    img;

    IMAGES_SALUD_PEPE = [
        './img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];

    constructor() {
        super().loadImage('./img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png');
        this.loadImages(this.IMAGES_SALUD_PEPE);
        //this.percentage = this.energy;
        this.x = 40;
        this.y = 20;
        this.width = 128;
        this.height = 34;
        //console.log('this.percentage =', character.energy);
        //this.setPercentage(this.percentage);
       

    }

    setPercentage(percentage){
        this.percentage = percentage;
        //console.log("Health % =", percentage);
        let path = this.IMAGES_SALUD_PEPE[this.resolveImagePercent(percentage)];
        this.img = this.imgCache[path];

        console.log("Health score =", this.resolveImagePercent(percentage));
 
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