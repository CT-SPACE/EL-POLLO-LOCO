

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
          imgCache[path] = IMG;         // Cache speichern
          resolve({ path, IMG });       // Promise auflösen
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
          console.error(`Fehler beim Laden des Bildes: ${path}`);
          reject(new Error(`Bild konnte nicht geladen werden: ${path}`));
        };}); }));
}