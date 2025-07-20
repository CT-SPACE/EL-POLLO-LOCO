class movingBackground extends MovableObject{
    x = 10;
    y = 0;
    height = 488;
    width = 1600;

    static IMAGES_MOVING= [
        { 
            src: './img/5_background/layers/3_third_layer/full.png',
            x: -20, 
            y: 60, 
            height: 380, 
            width: 1600 
        },
        { 
            src: './img/5_background/layers/2_second_layer/full.png',
            x: -20, 
            y: 190, 
            height: 220, 
            width: 850 
        },
        { 
            src: './img/5_background/layers/2_second_layer/full.png',
            x: 830, 
            y: 190, 
            height: 220, 
            width: 850 
        },
        { 
            src: './img/5_background/layers/1_first_layer/full.png',
            x: -20, 
            y: -20, 
            height: 508, 
            width: 1500 
        },
        { 
            src: './img/5_background/layers/3_third_layer/full.png',
            x: 1580, 
            y: 60, 
            height: 380, 
            width: 1600 
        },
        { 
            src: './img/5_background/layers/2_second_layer/full.png',
            x: 1680, 
            y: 190, 
            height: 220, 
            width: 850 
        },
        { 
            src: './img/5_background/layers/2_second_layer/full.png',
            x: 2530, 
            y: 190, 
            height: 220, 
            width: 850 
        },
        { 
            src: './img/5_background/layers/1_first_layer/full.png',
            x: 1480, 
            y: -20, 
            height: 508, 
            width: 1500 
        },
        { 
            src: './img/5_background/layers/3_third_layer/full.png',
            x: 3180, 
            y: 60, 
            height: 380, 
            width: 1600 
        },
        { 
            src: './img/5_background/layers/2_second_layer/full.png',
            x: 3380, 
            y: 190, 
            height: 220, 
            width: 850 
        },
        { 
            src: './img/5_background/layers/2_second_layer/full.png',
            x: 4230, 
            y: 190, 
            height: 220, 
            width: 850 
        },
        { 
            src: './img/5_background/layers/1_first_layer/full.png',
            x: 2980, 
            y: -20, 
            height: 508, 
            width: 1500 
        },
        { 
            src: './img/5_background/layers/3_third_layer/full.png',
            x: 4780, 
            y: 60, 
            height: 380, 
            width: 1600 
        },
        { 
            src: './img/5_background/layers/2_second_layer/full.png',
            x: -20, 
            y: 0, 
            height: 0, 
            width: 0 
        },
        { 
            src: './img/5_background/layers/2_second_layer/full.png',
            x: -20, 
            y: 0, 
            height: 0, 
            width: 0 
        },
        { 
            src: './img/5_background/layers/1_first_layer/full.png',
            x: 4480, 
            y: -20, 
            height: 508, 
            width: 1500 
        }
    ];
    
    /**
    * These parts form the background and create the impression of movement when Pepe moves.
    * @param {Number} i 
    */
    constructor(i) {
       const data = movingBackground.IMAGES_MOVING[i] || { 
            src: '', 
            x: 0, 
            y: 0, 
            height: 0, 
            width: 0 
        };
        super().loadImage(data.src);
       
        this.x = data.x;
        this.y = data.y;
        this.height = data.height;
        this.width = data.width;
    }
}

     