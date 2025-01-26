class Level {
    enemies;
    clouds;
    background_moving;
    level_endX = 1600;

    constructor(en,cl,mB){
        this.enemies = en;
        this.clouds = cl;
        this.movingBackground = mB;
    }
}