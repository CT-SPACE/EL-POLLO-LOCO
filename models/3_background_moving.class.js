class movingBackground extends MovableObject{
    x = 0;
    y = 0;
    height = 488;
    width = 1600;
    hgparts = ['../img/5_background/layers/3_third_layer/full.png', '../img/5_background/layers/2_second_layer/full.png', '../img/5_background/layers/1_first_layer/full.png','../img/5_background/layers/3_third_layer/full.png', '../img/5_background/layers/2_second_layer/full.png', '../img/5_background/layers/1_first_layer/full.png'];
 

    constructor(i){
     
        super().loadImage(this.hgparts[i]);
        switch (i) {
            case (i == 0):
                    this.y = 60,
                    this.height = 380;
                    this.width = 1200;
                    break;
            case (i == 1): 
                    this.y = 220;
                    this.height = 200;
                    this.width = 800;
                    break;
            // case (i == 2):
            //         this.y = 60,
            //         this.height = 380;
            //         this.width = 1200 * i;
            //         break;
            case (i == 3):
                this.y = 60,
                this.height = 380;
                this.width = 1200 * i;
                break;
            case (i == 4): 
                this.y = 220;
                this.height = 200;
                this.width = 800 * i;
                break;
            // case (i == 5):
            //     this.y = 60,
            //     this.height = 380;
            //     this.width = 1200 * i;
            //     break;
            case (i == 6):
                this.y = 60,
                this.height = 380;
                this.width = 1200 * i;
                break;
            case (i == 7): 
                this.y = 220;
                this.height = 200;
                this.width = 800 * i;
                break;
            // case (i == 8):
            //     this.y = 60,
            //     this.height = 380;
            //     this.width = 1200 * i;
            //     break;
            
                    }
             
 
}
}