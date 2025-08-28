let IMAGES_FASTLOAD = [
  "./img/fondo_cactus.png",
  "./img/Desierto-portada_con_pepe.jpg",
  "./img/paper-bg.png",
  "./img/5_background/layers/air.png",
  "./img/skelett_gallina.png",
  "./img/lightning.png",
  "./img/2_character_pepe/1_idle/idle/I-1.png",
];
let imgCache = window.imgCache || {};

let imagePaths = [
  ...movingBackground.IMAGES_MOVING,
  ...ThrowableObject.IMAGES_BOTTLE_ONGROUND,
  ...Chicken.IMAGES_WALKING,
  ...MiniChicken.IMAGES_WALKING,
  ...PepeAssets.IMAGES_WALKING,
  ...PepeAssets.IMAGES_JUMPING,
  ...PepeAssets.IMAGES_DYING,
  ...PepeAssets.IMAGES_HURT,
  ...PepeAssets.IMAGES_SLEEPING,
  ...PepeAssets.IMAGES_IDLE,
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
  let loaderText = "LOADING ...";
  let loaderContainer = document.getElementById("loader");
  loaderContainer.innerHTML = "";
  animateLoadingText(loaderContainer, loaderText);
}

/**
 * Helper function to animate the loading text.
 * It creates a span for each character, sets its animation delay, and appends it to
 */
function animateLoadingText(loaderContainer, loaderText) {
  const chars = loaderText.split("");
  chars.forEach((char, index) => {
    animateLoadingCharacters(char, index, loaderContainer);
  });
}

/**
 * Detail function for animating each character in the loading text.
 * It creates a span element for each character, sets its text content, and applies an animation delay based on its index.
 * @param {String} char
 * @param {Number} index
 * @param {HTMLElement} loaderContainer
 */
function animateLoadingCharacters(char, index, loaderContainer) {
  const span = document.createElement("span");
  span.textContent = char;
  span.style.animationDelay = `${index * 0.2}s`;
  loaderContainer.appendChild(span);
  setTimeout(() => {
    span.style.opacity = 1;
  }, index * 1000);
}

/**
 * Preloads fast-loading images for initial app display
 * @returns {Promise} Promise that resolves when all fast-loading images are ready
 */
async function fastPreload() {
  return Promise.all(IMAGES_FASTLOAD.map(loadImageToCache));
}

/**
 * Loads a single image into the cache
 * @param {string|Object} entry - Image path or object with src property
 * @returns {Promise} Promise that resolves with the loaded image
 */
function loadImageToCache(entry) {
  const path = typeof entry === "string" ? entry : entry.src;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imgCache[path] = img;
      resolve({ path, img });
    };
    img.onerror = reject;
    img.src = path;
  });
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
 * Preloads all game images
 * @returns {Promise} Promise that resolves when all images are ready
 */
async function preloadImages() {
  return Promise.all(imagePaths.map(loadAllImages));
}

/**
 * Loads an image if it's not already cached
 * @param {string|Object} entry - Image path or object with src property
 * @returns {Promise} Promise that resolves when the image is loaded
 */
function loadAllImages(entry) {
  const path = typeof entry === "string" ? entry : entry.src;
  if (imgCache[path]) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const img = new Image();    
    img.onload = () => {
      imgCache[path] = img;
      resolve();
    };
    img.onerror = () => {
      reject(new Error(`Bild konnte nicht geladen werden: ${path}`));
    };
    img.src = path;
  });
}