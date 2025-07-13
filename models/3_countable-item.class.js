class CountableItem extends DrawableObject {
    start = 0;
    world;
    maxCoins = 20;
    kindof;
    
  /**
   * Prepares the countable item based on its type.
   * @param {String} kindof 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} width 
   */
    constructor(kindof, x, y, width) {
      super();
      this.kindof = kindof;
      this.loadImage(this.getImage());
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = width;
    }
  
    /**
     * Load the image for bottle or coin.
     * @returns Returns the image path.
     */
    getImage() {
      if (this.kindof === 'bottle') {
        return './img/6_salsa_bottle/salsa_bottle.png';
      } else if (this.kindof === 'coin') {
        return './img/8_coin/coin_2.png';
      }
    }
  }
  