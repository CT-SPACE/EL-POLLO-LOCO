class CollectableObject extends DrawableObject  {
        y = 100;
        width = 100;
        height = 100;
        CountableItem = 0;
        world;
        static allCoins = [];
      
        constructor(x) {
          super().loadImage('./img/8_coin/coin_1.png');
      
          this.x = x;
          CollectableObject.allCoins.push(this);
        }
      
        /**
         * Create the coins.
         * @param {number} count - Set the quantity of objects.
         * @param {number} startPositionX - Set the start position in x.
         * @param {number} minDistance Set the min distance between the coins.
         * @returns {Array} Returns an array with created coins.
         */
        static createCoins(count, x, distanceFactor) {
          let coins = [];
      
          for (let i = 0; i < count; i++) {
            coins.push(new CollectableObject(x));
            x += distanceFactor;
          }
      
          return coins;
        }

}