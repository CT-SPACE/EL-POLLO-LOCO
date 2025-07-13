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

    /**
     * Loads the image for the status bar endboss and initializes its position and dimensions.
     */
    constructor() {
        super().loadImage('./img/7_statusbars/2_statusbar_endboss/green/green100.png');
        this.loadImages(StatusBarEndboss.IMAGES_SALUD_ENDBOSS);
        
        this.x = 650;
        this.y = 20;
        this.width = 128;
        this.height = 34;

    }
/** 
 * This function sets the percentage of the endboss health and updates the image based on the current percentage.
 * @param {Number}percentage 
 */
    setPercentage(percentage){
        this.percentage = percentage;
        let path = StatusBarEndboss.IMAGES_SALUD_ENDBOSS[this.resolveImageEndboss(percentage)];
        this.img = imgCache[path];
    }

/**
 * This function represents the logic to resolve which image to use based on the endboss health percentage.
 * It returns an index based on the percentage, which corresponds to the images in the IMAGES_SALUD_ENDBOSS array.
 * The images are displayed in a range from 0 to 5, depending on the endboss health percentage.
 * @param {Number} percentage 
 * @returns 
 */
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