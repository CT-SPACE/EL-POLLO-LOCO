class StatusBarChilli extends StaticObject {
    x = 0;
    y = 0;
 energy = 1;
 percentage = 1;
    chillicount = 0;
    height;
    width;
    img;

    IMAGES_CHILLI = [
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    constructor() {
        super().loadImage('./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png');
        this.loadImages(this.IMAGES_CHILLI);
        
        this.x = 40;
        this.y = 54;
        this.width = 128;
        this.height = 34;
    

    }

    setPercentage(chillicount){
        this.chillicount = chillicount;
        console.log("How Many Chilli-Fläschen =", chillicount);
        let path = this.IMAGES_CHILLI[this.resolveImageChilli(chillicount)];
        this.img = this.imgCache[path];

        //console.log("chilli Index =", this.resolveImageChilli(chillicount));
 
    }


    resolveImageChilli(chillicount){
    
        if(chillicount < 2){
            return 1;
        } else if(chillicount < 4){
            return 2;
        } else if(chillicount < 6){
            return 3;
        } else if(chillicount < 8){
            return 4;
        } else if(chillicount <= 15){
           return 5;
        } else {
           return 0;
        }
    }



}