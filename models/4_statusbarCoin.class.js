class StatusBarCoin extends StaticObject {
    x = 0;
    y = 0;

    energy = 1;
    //world;
    //cameraX;
    percentage = 1;
    height;
    width;
    img;

    IMAGES_COIN = [
        './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    constructor() {
        super().loadImage('./img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png');
        this.loadImages(this.IMAGES_COIN);
        this.x = 40;
        this.y = 90;
        this.width = 128;
        this.height = 34;

    }

    setPercentage(coincount){
        this.percentage = coincount;
        console.log("Coins =", coincount);
        let path = this.IMAGES_COIN[this.resolveImageCoin(coincount)];
        this.img = this.imgCache[path];

        console.log("Coin Count =", this.resolveImageCoin(coincount));
 
    }

    
        resolveImageCoin(coincount){
    
            if(coincount == 1){
                return 5;
            } else if(coincount == 2){
                return 4;
            } else if(coincount == 3){
                return 3;
            } else if(coincount == 4){
                return 2;
            } else if(coincount == 5){
               return 1;
            } else {
               return 0;
            }
        }



}