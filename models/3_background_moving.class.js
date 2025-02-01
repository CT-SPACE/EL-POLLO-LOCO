class movingBackground extends MovableObject{
    x = 0;
    y = 0;
    height = 488;
    width = 1600;
    hgparts = [
        '../img/5_background/layers/3_third_layer/full.png',  // 0
        '../img/5_background/layers/2_second_layer/full.png',  // 1
        '../img/5_background/layers/2_second_layer/full.png',   // 2
        '../img/5_background/layers/1_first_layer/full.png',    // 3

        '../img/5_background/layers/3_third_layer/full.png',   // 4
        '../img/5_background/layers/2_second_layer/full.png',   // 5
        '../img/5_background/layers/2_second_layer/full.png',  // 6
        '../img/5_background/layers/1_first_layer/full.png',  // 7

        '../img/5_background/layers/3_third_layer/full.png',   // 8
        '../img/5_background/layers/2_second_layer/full.png',   // 9
        '../img/5_background/layers/2_second_layer/full.png',  // 10
        '../img/5_background/layers/1_first_layer/full.png',  // 11
        
        '../img/5_background/layers/3_third_layer/full.png',  // 12
        '../img/5_background/layers/2_second_layer/full.png',  // 13
        '../img/5_background/layers/2_second_layer/full.png',  // 14
        '../img/5_background/layers/1_first_layer/full.png'  // 15
    ];
 

    constructor(i) {
        super().loadImage(this.hgparts[i]);
        switch (i) {
            case 0: // 3rd
                this.x = 0;
                this.y = 60;
                this.height = 380;
                this.width = 1600;
                break;            
            case 4:  // 3rd
                this.x = 1600;
                this.y = 60;
                this.height = 380;
                this.width = 1600;
                break;
            case 8:  // 3rd
                this.x = 3200;
                this.y = 60;
                this.height = 380;
                this.width = 1600;
                break;
            case 12:  // 3rd
                this.x = 4800;
                this.y = 60;
                this.height = 380;
                this.width = 1600;
                break;
            
            case 1: // 2nd
                this.x = 0;
                this.y = 190;
                this.height = 220;
                this.width = 850;
                break;
            case 2: // 2nd
                this.x = 850;
                 this.y = 190;
                 this.height = 220;
                 this.width = 850;
                     break;
            case 5: // 2nd
                     this.x = 1700;
                     this.y = 190;
                     this.height = 220;
                     this.width = 850;
                     break;
            case 6: // 2nd
                     this.x = 2550;
                     this.y = 190;
                     this.height = 220;
                     this.width = 850;
                     break;  
          case 9: // 2nd
                     this.x = 3400;
                     this.y = 190;
                     this.height = 220;
                     this.width = 850;
                     break;
            case 10: // 2nd
                     this.x = 4250;
                     this.y = 190;
                     this.height = 220;
                     this.width = 850;
         case 13: // 2nd
                     this.x = 5100;
                     this.y = 190;
                     this.height = 220;
                     this.width = 850;
                     break;
            case 14: // 2nd
                     this.x = 5950;
                     this.y = 190;
                     this.height = 220;
                     this.width = 870;
            
            case 3: // 1st
                this.x = 0;
                this.y = -20;
                this.height = 508;
                this.width = 1500;
                break;
            case 7: // 1st
                this.x = 1500;
                this.y = -20;
                this.height = 508;
                this.width = 1500;
                     break;
            case 11: // 1st
                     this.x = 3000;
                     this.y = -20;
                     this.height = 508;
                     this.width = 1500;
                          break;
           case 15: // 1st
                          this.x = 4500;
                          this.y = -20;
                          this.height = 508;
                          this.width = 1500;
                               break;

            default:
                break;
        }
    }
}    