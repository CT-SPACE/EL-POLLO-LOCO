class CollectableObject extends DrawableObject {
  x = 320;
  y = 300;
  width = 100;
  height = 100;
  audioManager;
  //CountableItem = 0;
  audio;
  images = [];
  currentImage = 0;
  world;
  level;
  count = 50;
  bottlesCount = 15;
  rows = 2;
  distanceX = 100;
  distanceY = 10;
  minX = 280;
  maxX = 3600;

  static BOTTLE_GROUND = [
    "./img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "./img/6_salsa_bottle/2_salsa_bottle_on_ground_.png",
  ];
  static COINS_BLINKING = ["./img/8_coin/coin_1.png", "./img/8_coin/coin_2.png"];
  offset;

  constructor(kindof, count, x, y, height, width, distanceX, Row2Probability) {
    super();

    // this.audio = new AudioManager();
    this.audio = audioManager;

    this.kindof = kindof; // Art des Objekts (bottle oder coin)

    if (kindof === "coin") {
      this.loadImages(CollectableObject.COINS_BLINKING);
      this.img = this.imgCache[CollectableObject.COINS_BLINKING[0]];
      this.offset = { left: 30, right: 30, top: 30, bottom: 30 };
    } else if (kindof === "bottle") {
      this.loadImages(CollectableObject.BOTTLE_GROUND);
      this.img = this.imgCache[CollectableObject.BOTTLE_GROUND[0]];
      this.offset = { left: 60, right: 5, top: 5, bottom: 5 };
    }

    this.x = x < this.minX ? this.minX : x > this.maxX ? this.maxX : x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.animateBasedOnKind(); // Animation starten
  }

  static createCoins(count, distanceX, Row2Probability) {
    let coins = [];
    this.height = 100;
    this.width = 100;
    const yRow1 = 280; // Y-Koordinate für Ebene 1
    const yRow2 = 150; // Ebene 2 liegt höher
    //console.log("yRow2", yRow2, yRow1);
    let coinsPerRow = Math.ceil(count); // Coins auf Reihen verteilen

    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < coinsPerRow; i++) {
        let index = row * coinsPerRow + i;
        if (index >= count) break; // Verhindert Überschuss an Coins

        let x = i * distanceX + 110;
        let y = Math.random() < Row2Probability ? yRow2 : yRow1;

        coins.push(
          new CollectableObject(
            "coin",
            count,
            x,
            y,
            this.height,
            this.width,
            distanceX,
            Row2Probability
          )
        );
      }
    }

    return coins;
  }

  static createBottles(bottlesCount, distanceX) {
    let bottles = [];
    this.height = 70;
    this.width = 70;
    let y = 380; // Y-Koordinate
    // console.log("createBottles - bottlesCount:", bottlesCount);

    for (let i = 0; i < bottlesCount; i++) {
      if (i >= bottlesCount) break;

      let x = Math.random() * (3400 - 100) + 100; // Berechnung der X-Koordinate

      bottles.push(
        new CollectableObject(
          "bottle",
          bottlesCount,
          x,
          y,
          this.height,
          this.width,
          distanceX
        )
      );
    }
    // console.log("Initialisierte Flaschen:", bottles.length);
    return bottles;
  }

  checkForBottleCollisions(character, bottles) {
    // console.log("checkForBottleCollisions - bottles:", bottles);
    this.bottles = bottles;

    this.character = character;
    setInterval(() => {
      this.bottles.forEach((bottle, index) => {
        if (this.character.isColliding(bottle)) {
          this.bottles.splice(index, 1);
          // console.log("CheckforBottleCollisions", this.bottles);
        }
      });
    }, 500);
  }

  checkForCoinCollisions(character, coins) {
    this.character = character;
    setInterval(() => {
      coins.forEach((coin, index) => {
        if (this.character.isColliding(coin)) {
          coins.splice(index, 1);
        }
      });
    }, 500);
  }


  animateThings(images) {
    if (this.kindof === "bottle" || this.kindof === "coin") {
      this.images = images;
      let i = this.currentImage % this.images.length;
      let path = this.images[i];
      if (this.imgCache[path]) {
        this.img = this.imgCache[path];
      }
      this.currentImage++;
    }
  }

  animateBasedOnKind() {
    if (this.kindof === "coin") {
      setInterval(() => {
        this.animateThings(CollectableObject.COINS_BLINKING);
      }, 300);
    } else if (this.kindof === "bottle") {
      setInterval(() => {
        this.animateThings(CollectableObject.BOTTLE_GROUND); 
      }, 800);
    }
  }
}
