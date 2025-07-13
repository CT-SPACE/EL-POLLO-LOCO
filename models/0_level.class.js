class Level {
    clouds;
    enemies;
    coins;
    bottles;
    background_moving;
    level_endX = 3800;

    /**
     * Defines the Level class which contains all components of a game Level.
     * @param {Array} cl - Array of cloud objects.
     * @param {Array} mB - Array of moving background objects.
     * @param {Array} en - Array of enemy objects.
     * @param {Array} co - Array of coin objects.
     * @param {Array} bo - Array of bottle objects.
     */
    constructor(cl,mB,en, co, bo){
        
        this.enemies = en;
        this.clouds = cl;
        this.background_moving = mB;
        this.coins = co;
        this.bottles = bo;
        

    }
}