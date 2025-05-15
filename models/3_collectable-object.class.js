class CollectableObject extends DrawableObject {
  x = 320;
  y = 300;
  width = 100;
  height = 100;
  //CountableItem = 0;
  audio;
  images = [];
  currentIMG = 0;
   world;
  level;
  count = 50;
  bottlesCount = 15;
  rows = 2;
  distanceX = 100;
  distanceY = 10;
  minX = 280;
  maxX = 3600;
  // bottleCollecting = new Audio('./audio/bottle_collect.mp3');
  // coinCollecting = new Audio('./audio/coin_success.mp3');

  BOTTLE_GROUND = ["./img/6_salsa_bottle/1_salsa_bottle_on_ground.png", "./img/6_salsa_bottle/2_salsa_bottle_on_ground_.png"];
  BOTTLE_SPLASH = ["./img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png", "./img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png", "./img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png", "./img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png", "./img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png", "./img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"];
  BOTTLE_THROW = [ "./img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png", "./img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png", "./img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png", "./img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"];
  COINS_ROTATING = ["./img/8_coin/coin_1.png", "./img/8_coin/coin_2.png"];
    offset = { 
      left: 30,
      right: 30,      
      top: 30,
      bottom: 30
    };

  constructor(kindof, count, x, y, height, width, distanceX, Row2Probability) {
    super();
    //.loadImage("./img/8_coin/coin_1.png");
   // this.loadImage("./img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.COINS_ROTATING);
    this.loadImages(this.BOTTLE_GROUND);
    this.loadImages(this.BOTTLE_SPLASH);  
    this.loadImages(this.BOTTLE_THROW);
    this.audio = new AudioManager();

    this.kindof = kindof; // Art des Objekts (bottle oder coin)
    
    if (kindof === 'coin') {
        this.loadImages(this.COINS_ROTATING);
        this.offset = { 
          left: 30,
          right: 30,      
          top: 30,
          bottom: 30
        };
    } else if (kindof === 'bottle') {
        this.loadImages(this.BOTTLE_GROUND);
        this.offset = { 
          left: 5,
          right: 0,      
          top: 0,
          bottom: 0
        };
    }

    this.x = x < this.minX ? this.minX : x > this.maxX ? this.maxX : x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.animateBasedOnKind(); // Animation starten

    // this.animateRotation();
    // this.checkForCoinCollisions(character, coins);
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

        let x = i * distanceX + 110; // Berechnung der X-Koordinate
        let y = Math.random() < Row2Probability ? yRow2 : yRow1; // Y-Koordinate

        coins.push(new CollectableObject('coin', count, x, y,this.height,this.width, distanceX, Row2Probability))
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

        let x =  Math.random() * (3400 - 100) + 100; ; // Berechnung der X-Koordinate
   
        bottles.push(new CollectableObject('bottle', bottlesCount, x, y, this.height,this.width, distanceX));
            }
            // console.log("Initialisierte Flaschen:", bottles.length);
    return bottles;
  }



  checkForBottleCollisions(character, bottles) {
    // console.log("checkForBottleCollisions - bottles:", bottles);
   this.bottles = bottles;
    this.bottles.offset = { 
      left: 5,
      right: 0,      
      top: 0,
      bottom: 0
    };
    //console.log("bottles", bottles);
    // let audio = new AudioManager();
    // bottleCollecting.loop = false;
    // this.audio.loadAudio('bottleCollecting','./audio/bottle_collect.mp3');
    // this.audio.playAudio('bottleCollecting', {play: true, loop: false , volume: 0.2 });

    this.character = character;
    setInterval(() => {
      this.bottles.forEach((bottle, index) => {

        if (this.character.isColliding(bottle)) {
          // this.bottleCollecting.play();

          this.bottles.splice(index, 1);
        }
      });
    }, 500);
  }

checkForCoinCollisions(character, coins) {

  // let coinCollecting = new Audio('../audio/coin_success.mp3');
  // coinCollecting.loop = false;
  // this.audio.loadAudio('coinCollecting','./audio/coin_success.mp3');
  // this.audio.playAudio('coinCollecting', {play:true, loop: false , volume: 0.2 });
  this.character = character;
  setInterval(() => {
  coins.forEach((coin, index) => {

      if (this.character.isColliding(coin)) {
          coins.splice(index, 1);
      }
  });}, 500);
 
}


  animateRotation() {
    setInterval(() => {
      this.animateThings(this.COINS_ROTATING);
    }, 300);
  }

  animateThings(images) {
    if (this.kindof === 'bottle' || this.kindof === 'coin') {
        this.images = images;
        let i = this.currentIMG % this.images.length;
        let path = this.images[i];
        this.img = this.imgCache[path];
        this.currentIMG++;
    }
}

animateBasedOnKind() {
  if (this.kindof === 'coin') {
      setInterval(() => {
          this.animateThings(this.COINS_ROTATING);
      }, 300);
  } else if (this.kindof === 'bottle') {
      setInterval(() => {
          this.animateThings(this.BOTTLE_GROUND); // Verwende statische Bilder für Bottles
      }, 500); // Langsamere Animation für Flaschen
  }
}

}