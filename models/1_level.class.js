class Level {
    enemies;
    clouds;
    background_moving;
    level_endX = 3430;

    constructor(en,cl,mB){
        this.enemies = en;
        this.clouds = cl;
        this.background_moving = mB;
    }
}