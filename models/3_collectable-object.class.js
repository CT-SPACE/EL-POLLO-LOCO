class CollectableObject extends DrawableObject {
  x = 320;
  y = 300;
  width = 100;
  height = 100;
  CountableItem = 0;
  images = [];
  currentIMG = 0;
  world;
  level;
  count = 30;
  rows = 2;
  distanceX = 10;
  distanceY = 10;
  minX = 280;
  maxX = 3600;
  coinColleting = new Audio('./audio/coin_success.mp3');

  COINS_ROTATING = ["./img/8_coin/coin_1.png", "./img/8_coin/coin_2.png"];
  static allCoins = [];

  constructor(count, x, y, distanceX, Row2Probability) {
    super().loadImage("./img/8_coin/coin_1.png");
    this.loadImages(this.COINS_ROTATING);

    this.x = x < this.minX ? this.minX : x > this.maxX ? this.maxX : x;
    this.y = y;
    this.animateRotation();
    // this.checkForCoinCollisions(character, coins);
  }

  offset = {
    left: 30,
    right: 30,
    top: 30,
    bottom: 30
}

  static createCoins(count, distanceX, Row2Probability) {
    let coins = [];
    const yRow1 = 280; // Y-Koordinate für Ebene 1
    const yRow2 = 150; // Ebene 2 liegt höher
    console.log("yRow2", yRow2, yRow1);
    let coinsPerRow = Math.ceil(count); // Coins auf Reihen verteilen

    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < coinsPerRow; i++) {
        let index = row * coinsPerRow + i;
        if (index >= count) break; // Verhindert Überschuss an Coins

        let x = i * distanceX + 110; // Berechnung der X-Koordinate
        let y = Math.random() < Row2Probability ? yRow2 : yRow1; // Y-Koordinate

        console.log(`Position: x=${x}, y=${y}`);
        console.log("coins =", coins);

        // Coin hinzufügen
        coins.push(
          new CollectableObject(count, x, y, distanceX, Row2Probability)
        );
      }
    }

    return coins;
  }

  checkForCoinCollisions(character, coins) {
    this.world.character = character;
    console.log("character", this.world.character, character);
    coins.forEach((coin, index) => {
        if (this.world.character.isColliding(coin, offset)) {
            // Sound abspielen
            coinCollecting.play();
            coinCollecting.Volume = 0.5;

            // Coin entfernen
            coins.splice(index, 1);
        }
    });
}


  animateRotation() {
    setInterval(() => {
      this.animateThings(this.COINS_ROTATING);
    }, 300);
  }

  animateThings(images) {
    this.images = images;
    let i = this.currentIMG % this.COINS_ROTATING.length;
    let path = this.images[i];
    this.img = this.imgCache[path];
    this.currentIMG++;
  }
}
