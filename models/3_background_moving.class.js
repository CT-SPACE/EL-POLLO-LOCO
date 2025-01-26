class movingBackground extends MovableObject{
    x = 0;
    y = 0;
    height = 488;
    width = 1600;
    hgparts = [
        '../img/5_background/layers/3_third_layer/full.png', 
        '../img/5_background/layers/2_second_layer/full.png', 
        '../img/5_background/layers/1_first_layer/full.png',
        '../img/5_background/layers/3_third_layer/full.png', 
        '../img/5_background/layers/2_second_layer/full.png', 
        '../img/5_background/layers/1_first_layer/full.png',
        '../img/5_background/layers/3_third_layer/full.png', 
        '../img/5_background/layers/2_second_layer/full.png', 
        '../img/5_background/layers/1_first_layer/full.png'
    ];
 

    constructor(i) {
        super().loadImage(this.hgparts[i]);
        switch (i) {
            case 0:
                this.x = 0;
                this.y = 60;
                this.height = 380;
                this.width = 1600;
                break;
            case 1:
                this.x = 0;
                this.y = 190;
                this.height = 220;
                this.width = 850;
                break;
            case 2:
                this.x = 0;
                this.y = 0;
                this.height = 488;
                this.width = 1600;
                break;
            case 4:
                this.y = 190;
                this.height = 220;
                this.width = 850;
                this.x = 850;
                    break;
            default:
                break;
        }
    }
}    