/**
 * Initializes the first Level of the game with all its components.
 * @returns {Promise} A promise that resolves when the level is initialized.
 */
async function initLevel() {
    Level01 = new Level(

        [
            
            new Clouds(),
            new Clouds(),
            new Clouds(),
            new Clouds()
        ],
        [
            new movingBackground(0),
            new movingBackground(4),
            new movingBackground(8),
            new movingBackground(12),

            new movingBackground(1),
            new movingBackground(2),
            new movingBackground(5),
            new movingBackground(6),
            new movingBackground(9),
            new movingBackground(10),
            new movingBackground(13),
            new movingBackground(14),

            new movingBackground(3),
            new movingBackground(7),
            new movingBackground(11),
            new movingBackground(15),

        ],
        [ 
            new Chicken(world),
            new Chicken(world), 
            new Chicken(world), 
            new Chicken(world),
            new Chicken(world),
            new Chicken(world),
            new Chicken(world),

            new MiniChicken(world),
            new MiniChicken(world),
            new MiniChicken(world),
            new MiniChicken(world),     
            new MiniChicken(world),

        ],

     
    CollectableObject.createCoins(40, 80, 0.3),
    CollectableObject.createBottles(15, 80)

)
}