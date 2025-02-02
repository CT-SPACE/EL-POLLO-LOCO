class Level {
    enemies;
    clouds;
    endboss;
    background_moving;
    level_endX = 3800;

    constructor(en,cl,mB,eb){
        this.endboss = eb
        this.enemies = en;
        this.clouds = cl;
        this.background_moving = mB;

    }
}