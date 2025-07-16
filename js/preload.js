
let IMAGES_FASTLOAD = [
  "./img/fondo_cactus.png",
  "./img/Desierto-portada_con_pepe.jpg",
  "./img/paper-bg.png",
  "./img/5_background/layers/air.png",
  "./img/skelett_gallina.png",
  "./img/lightning.png",
  "./img/2_character_pepe/1_idle/idle/I-1.png"
];

let imagePaths = [
  ...movingBackground.IMAGES_MOVING,
  ...ThrowableObject.IMAGES_BOTTLE_ONGROUND,
  ...Chicken.IMAGES_WALKING,
  ...MiniChicken.IMAGES_WALKING,
  ...Pepe.IMAGES_WALKING,
  ...Pepe.IMAGES_JUMPING,
  ...Pepe.IMAGES_DYING,
  ...Pepe.IMAGES_HURT,
  ...Pepe.IMAGES_SLEEPING,
  ...Pepe.IMAGES_IDLE,
  ...StatusBarPepe.IMAGES_SALUD_PEPE,
  ...StatusBarCoin.IMAGES_COIN,
  ...StatusBarChilli.IMAGES_CHILLI,
  ...Clouds.IMAGES_MOVING,
  ...ThrowableObject.IMAGES_BOTTLE_ROTATE,
  ...ThrowableObject.IMAGES_BOTTLE_SPLASH,
  ...MiniChicken.IMAGES_HIT,

  ...StatusBarEndboss.IMAGES_SALUD_ENDBOSS,
  ...Endboss.IMAGES_ALERT,
  ...Endboss.IMAGES_WALK,
  ...Endboss.IMAGES_ATTACK,
  ...Endboss.IMAGES_HURT,
  ...Endboss.IMAGES_DEAD,
];

/**
 * Gives the Loading Visual a nice effect by animating the letters of the text "LOADING ...".
 */
function LoadingVisual() {
  const loaderText = "LOADING ...";
  const loaderContainer = document.getElementById("loader");

  loaderContainer.innerHTML = "";
  const chars = loaderText.split("");
  chars.forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.animationDelay = `${index * 0.2}s`;
    loaderContainer.appendChild(span);

    setTimeout(() => {
      span.style.opacity = 1;
    }, index * 1000);
  });
}


/**
 * 
 * @returns {Promise} A promise that resolves when all fast-loading images are preloaded.
 */
async function fastPreload() {
  return Promise.all(
    IMAGES_FASTLOAD.map((entry) =>
      new Promise((resolve, reject) => {
        const path = typeof entry === "string" ? entry : entry.src;

        const IMG = new Image();
        IMG.onload = () => {
          imgCache[path] = IMG;   
          resolve({ path, IMG });  
        };
        IMG.onerror = reject;
        IMG.src = path;
      })
    )
  );
}


/**
 * Preloads all audio files used in the game.
 */
async function preloadAudio() {
  await Promise.all([
    audioManager.loadAudio("pepe_ambient", "./audio/pepe_ambient.mp3"),

    audioManager.loadAudio("pepe_hurt", "./audio/pepe_grunts_2.mp3"),
    audioManager.loadAudio("pepe_pollo", "./audio/pepe_pollo_funny.mp3"),
    audioManager.loadAudio("pepe_snore", "./audio/pepe_snore.mp3"),
    audioManager.loadAudio("chicken_splat", "./audio/chicken_splat.mp3"),
  
    audioManager.loadAudio("mini_bounce", "./audio/mini_chicken_squeeze_1.mp3"),
    audioManager.loadAudio("endbossBackground", "./audio/endboss_thunder.mp3"),
    audioManager.loadAudio("endboss_attack", "./audio/endboss_attack.mp3"),

    audioManager.loadAudio("bottleCollecting", "./audio/bottle_collect.mp3"),
    audioManager.loadAudio("WorldBottleCollecting", "./audio/bottle_collect.mp3"),
    audioManager.loadAudio("coinCollecting", "./audio/coin_success.mp3"),
    audioManager.loadAudio("WorldCoinCollecting", "./audio/coin_success.mp3"),
    audioManager.loadAudio("mini_run", "./audio/mini_chicken_run.mp3"),
    audioManager.loadAudio("pepe_wins", "./audio/winning_whoppi.mp3"),
    audioManager.loadAudio("pepe_loses", "./audio/failed_drum.mp3"),
    audioManager.loadAudio("clock_ticking", "./audio/clock_ticking.mp3"),
  ]);
}

/**
 * 
 * @returns #{Promise} A promise that resolves when all images are preloaded.
 */
async function preloadImages() {
  return Promise.all(
    imagePaths.map((entry) => {
      let path = typeof entry === "string" ? entry : entry.src;
      return new Promise((resolve, reject) => {
        let IMG = new Image();
        IMG.src = path;
        IMG.onload = () => {
          imgCache[path] = IMG;
          resolve();
        };
        IMG.onerror = () => {
          reject(new Error(`Bild konnte nicht geladen werden: ${path}`));
        };}); }));
}