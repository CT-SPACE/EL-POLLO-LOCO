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

  COINS_ROTATING = ["./img/8_coin/coin_1.png", "./img/8_coin/coin_2.png"];
  static allCoins = [];

  constructor(count, x, y, distanceX, Row2Probability) {
    super().loadImage("./img/8_coin/coin_1.png");
    this.loadImages(this.COINS_ROTATING);

    this.x = x < this.minX ? this.minX : x > this.maxX ? this.maxX : x;
    this.y = y;
    this.animateRotation();
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

  // Hilfsmethode zur Überprüfung von Überlappungen
  static isOverlapping(existingCoins, x, y, minDistance) {
    for (let coin of existingCoins) {
      // Überprüfung der Koordinaten des bestehenden Coins
      let dx = coin.x - x;
      let dy = coin.y - y;
      let distance = Math.sqrt(dx * dx + dy * dy); // Abstand zwischen zwei Coins
      if (distance < minDistance) {
        return true; // Coins überlappen sich
      }
    }
    return false; // Kein Coin in der Nähe
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
