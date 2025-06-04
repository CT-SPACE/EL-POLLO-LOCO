class movingBackground extends MovableObject{
    x = 0;
    y = 0;
    height = 488;
    width = 1600;
    static IMAGES_MOVING = [
        './img/5_background/layers/3_third_layer/full.png',  // 0
        './img/5_background/layers/2_second_layer/full.png',  // 1
        './img/5_background/layers/2_second_layer/full.png',   // 2
        './img/5_background/layers/1_first_layer/full.png',    // 3

        './img/5_background/layers/3_third_layer/full.png',   // 4
        './img/5_background/layers/2_second_layer/full.png',   // 5
        './img/5_background/layers/2_second_layer/full.png',  // 6
        './img/5_background/layers/1_first_layer/full.png',  // 7

        './img/5_background/layers/3_third_layer/full.png',   // 8
        './img/5_background/layers/2_second_layer/full.png',   // 9
        './img/5_background/layers/2_second_layer/full.png',  // 10
        './img/5_background/layers/1_first_layer/full.png',  // 11
        
        './img/5_background/layers/3_third_layer/full.png',  // 12
        './img/5_background/layers/2_second_layer/full.png',  // 13
        './img/5_background/layers/2_second_layer/full.png',  // 14
        './img/5_background/layers/1_first_layer/full.png'  // 15
    ];
    
        positions = [
            { x: 0, y: 60, height: 380, width: 1600 },  // 0
            { x: 0, y: 190, height: 220, width: 850 },  // 1
            { x: 850, y: 190, height: 220, width: 850 },  // 2
            { x: 0, y: -20, height: 508, width: 1500 },  // 3
            { x: 1600, y: 60, height: 380, width: 1600 },  // 4
            { x: 1700, y: 190, height: 220, width: 850 },  // 5
            { x: 2550, y: 190, height: 220, width: 850 },  // 6
            { x: 1500, y: -20, height: 508, width: 1500 },  // 7
            { x: 3200, y: 60, height: 380, width: 1600 },  // 8
            { x: 3400, y: 190, height: 220, width: 850 },  // 9
            { x: 4250, y: 190, height: 220, width: 850 },  // 10
            { x: 3000, y: -20, height: 508, width: 1500 },  // 11
            { x: 4800, y: 60, height: 380, width: 1600 },  // 12
            { x: 0, y: 0, height: 0, width: 0 },  // 13 (default)
            { x: 0, y: 0, height: 0, width: 0 },  // 14 (default)
            { x: 4500, y: -20, height: 508, width: 1500 }  // 15
        ];
    
        constructor(i, factor = 1) {
            super().loadImage(movingBackground.IMAGES_MOVING[i]);
            const pos = this.positions[i] || { x: 0, y: 0, height: 0, width: 0 };
            this.x = pos.x;
            this.y = pos.y;
            this.height = pos.height;
            this.width = pos.width;
            this.factor = factor;
        }
    }
     