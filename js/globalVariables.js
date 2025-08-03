/**
 * Declaration of global variables and constants
 * This file is responsible for initializing the game, loading assets, and managing the game state.
 */
let canvas,
  world,
  Level01,
  pepe_ambient,
  chicken_run,
  throwKeyDownTime,
  throwKeyUpTime,
  throwDuration,
  contentOpen,
  startScreen,
  newWidth,
  newHeight,
  deathCandidate,
  finalScore,
  savedHighscore;

let audioPlaying = {};
let allIntervals = [];
let keyboardEnabled = true;
let EndBossClose = false;
let EndBossVisible = false;
let gamePaused = true;
let gamePausedByUser = false;
let imgCache = {};
let letters = Array.from(document.querySelectorAll("#loader span"));
let aspectRatio = 800 / 480;
let touchSetupDone = false;
