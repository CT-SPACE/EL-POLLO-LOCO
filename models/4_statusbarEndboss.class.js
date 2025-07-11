class StatusBarEndboss extends StaticObject {
    x = 0;
    y = 0;

    energy = 1;
    percentage = 1;
    height;
    width;

    img;

    static IMAGES_SALUD_ENDBOSS = [
        './img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        './img/7_statusbars/2_statusbar_endboss/green/green60.png',
        './img/7_statusbars/2_statusbar_endboss/green/green80.png',
        './img/7_statusbars/2_statusbar_endboss/green/green100.png'
    ];

    constructor() {
        super().loadImage('./img/7_statusbars/2_statusbar_endboss/green/green100.png');
        this.loadImages(StatusBarEndboss.IMAGES_SALUD_ENDBOSS);
        
        this.x = 650;
        this.y = 20;
        this.width = 128;
        this.height = 34;

    }

    setPercentage(percentage){
        this.percentage = percentage;
        let path = StatusBarEndboss.IMAGES_SALUD_ENDBOSS[this.resolveImageEndboss(percentage)];
        this.img = imgCache[path];
    }


    resolveImageEndboss(percentage){
        if(percentage > 10 && percentage < 30){
            return 1;
        } else if(percentage >= 30 && percentage < 50){
            return 2;
        } else if(percentage >= 50 && percentage < 70){
            return 3;
        } else if(percentage >= 70 && percentage < 95){
            return 4;
        } else if(percentage >= 95){
           return 5;
        } else {
           return 0;
        }
    }



}