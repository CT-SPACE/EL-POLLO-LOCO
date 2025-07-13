class StatusBarCoin extends StaticObject {
    x = 0;
    y = 0;

    energy = 1;
    percentage = 1;
    height;
    width;
    img;

  static IMAGES_COIN = [
        './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    /**
     * Loads the image for the status bar coin and initializes its position and dimensions.
     * The coin count is used to determine which image to display based on the current coin count.
     * The images are loaded from a predefined array of image paths.    
     */
    constructor() {
        super().loadImage('./img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png');
        this.loadImages(StatusBarCoin.IMAGES_COIN);
        this.x = 40;
        this.y = 90;
        this.width = 128;
        this.height = 34;

    }

    /**
     * Calculates the percentage of coins collected and updates the image displayed in the status bar.
     * It uses the resolveImageCoin function to determine which image to use based on the coin count.
     * The img property is updated with the corresponding image from the imgCache.  
     * @param {Number} coincount 
     */
    setPercentage(coincount){
        this.coincount = coincount;
        let path = StatusBarCoin.IMAGES_COIN[this.resolveImageCoin(this.coincount)];
        this.img = imgCache[path];

    }

    /**
     * This function represents the logic to resolve which image to use based on the coin count.
     * It returns an index based on the coin count, which corresponds to the images in the IMAGES_COIN array.
     * The images are displayed in a range from 0 to 5, depending on the coin count.    
     * @param {Number} coincount 
     * @returns 
     */
    resolveImageCoin(coincount){
            if(coincount < 15 ){
                return 1;
            } else if(coincount < 25){
                return 2;
            } else if(coincount < 35){
                return 3;
            } else if(coincount < 50){
                return 4;
            } else if(coincount >= 50){
               return 5;
            } else {
               return 0;
            }
        }



}