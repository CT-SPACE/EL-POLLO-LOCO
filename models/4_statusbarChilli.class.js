class StatusBarChilli extends StaticObject {
    x = 0;
    y = 0;
 energy = 1;
 percentage = 1;
    chillicount = 0;
    height;
    width;
    img;

   static IMAGES_CHILLI = [
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    /**
     * Loads the image for the status bar chilli and initializes its position and dimensions.
     * The chilli count is used to determine which image to display based on the current chilli count.
     * The images are loaded from a predefined array of image paths.    
     */
    constructor() {
        super().loadImage('./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png');
        this.loadImages(StatusBarChilli.IMAGES_CHILLI);
        
        this.x = 40;
        this.y = 54;
        this.width = 128;
        this.height = 34;
    }

    /**
     * This function sets the percentage of the chilli count and updates the image based on the current chilli count.
     * It uses the resolveImageChilli function to determine which image to use based on the chilli count.
     * The img property is updated with the corresponding image from the imgCache.  
     * @param {Number} chillicount 
     * @returns 
     */
    setPercentage(chillicount){
        this.chillicount = chillicount;
        let path = StatusBarChilli.IMAGES_CHILLI[this.resolveImageChilli(this.chillicount)];
        this.img = imgCache[path];
        return;
    }

/**
 * this function represents the logic to resolve which image to use based on the chilli count.
 * It returns an index based on the chilli count, which corresponds to the images in the IMAGES_CHILLI array.
 * The images are displayed in a range from 0 to 5, depending on the chilli count.  
 * @param {Number} chillicount 
 * @returns 
 */
    resolveImageChilli(chillicount){
    if (chillicount >= 15) return 5;
    if (chillicount >= 11) return 4;
    if (chillicount >= 8) return 3;
    if (chillicount >= 4) return 2;
    if (chillicount >= 1) return 1;
    return 0;
    
    }



}