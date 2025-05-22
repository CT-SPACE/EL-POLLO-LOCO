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
       // console.log("How Many Chilli-Fläschchen =", chillicount);
        let path = this.IMAGES_CHILLI[this.resolveImageChilli(this.chillicount)];
        this.img = this.imgCache[path];
        return;
    }


    resolveImageChilli(chillicount){

        //console.log("How Many Chilli-Fläschchen rIC(chillicount) =", chillicount);
    if (chillicount >= 10) return 5;
    if (chillicount >= 8) return 4;
    if (chillicount >= 6) return 3;
    if (chillicount >= 3) return 2;
    if (chillicount >= 1) return 1;
    return 0;
    
    }



}