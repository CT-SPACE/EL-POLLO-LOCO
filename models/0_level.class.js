class Level {
    clouds;
    enemies;
    coins;
    bottles;
    background_moving;
    level_endX = 3800;

    constructor(cl,mB,en, co, bo){
        
        this.enemies = en;
        this.clouds = cl;
        this.background_moving = mB;
        this.coins = co;
        this.bottles = bo;
        

    }
}