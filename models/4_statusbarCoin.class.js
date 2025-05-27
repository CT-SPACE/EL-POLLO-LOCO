class StatusBarCoin extends StaticObject {
    x = 0;
    y = 0;

    energy = 1;
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
        this.coincount = coincount;
        //console.log("Coins =", this.coincount);

        let path = this.IMAGES_COIN[this.resolveImageCoin(this.coincount)];
        this.img = this.imgCache[path];

        //console.log("Coin Count =", this.resolveImageCoin(this.coincount));
 
    }

    
        resolveImageCoin(coincount){
    //console.log("resolveImageCoin", coincount);
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