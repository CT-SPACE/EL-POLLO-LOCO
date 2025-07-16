

/**
 * Creates the Content-panel that shows all information about the game: How to play, the story of Pepe and the legal information.
 * @param {string} content 
 * @returns  Double Click provokes closing of the open Content and stopps the function.
 */
function createButtonContent(content) {
  let contentType = document.getElementById(content);
  let contentScreen = document.getElementById("buttonContent");
  if (window.innerHeight < 600){
   contentScreen = createButtonContentMobile(contentScreen) ;
  }
  if (contentScreen.classList.contains("open") && contentScreen.dataset.active === content) {
    closeContent(contentScreen);  return;
  }
  if (contentScreen.classList.contains("open")) {
    closeContent(contentScreen, () =>  openContent(content, contentType, contentScreen));
  } else {
    openContent(content, contentType, contentScreen);
  }
}

/**
 * Helper function to create the content panel for mobile devices and browser widths smaller than 600px.
 * @param {HTMLElement} contentScreen 
 * @description This function is called when the screen width is smaller than 600px. It creates a content panel for mobile devices.
 * @returns {void}
 */
function createButtonContentMobile(contentScreen) {
    contentScreen.classList.add("displayNone");
    contentScreen = document.getElementById("buttonContentMobile");
    contentScreen.innerHTML = "";
      return contentScreen;
}

/**
 * Opens the content panel and defines the behavior of the panel itself and other elements
 * @param {string} content 
 * @param {string} contentType 
 * @param {string} contentScreen 
 */
function openContent(content, contentType, contentScreen) {
  let headline = document.getElementById("stayHeadline");
  gamePausedByUser = gamePaused;
  contentOpen = true;

  togglePlay("content", true);

  resetOutClasses();
  addStylesForOpenContent(contentType, contentScreen, headline);
  setTimeout(() => {
    switchContentForOpenContent(content, contentScreen);
  }, 50);
  createOverlayDiv();
  includeCloseButton(contentScreen);
}

/**
 * The various information units are called up here
 * @param {string} content 
 * @param {HTMLElement} contentScreen 
 */
function switchContentForOpenContent(content, contentScreen) {
  contentScreen.classList.add("open");
  contentScreen.dataset.active = content;
  switch (content) {
    case "story":
      contentScreen.innerHTML += getStoryHtml();
      break;
    case "impressum":
      contentScreen.innerHTML += getImpressumHtml();
      break;
    case "howto":
      contentScreen.innerHTML += getHowToHtml();
      break;
  }
}

/**
 * Changes the style for elements on the screen like h1, the active Button and the contentscreen
 * @param {HTMLElement} contentType 
 * @param {HTMLElement} contentScreen 
 * @param {HTMLElement} headline 
 */
function addStylesForOpenContent(contentType, contentScreen, headline) {
  contentType.classList.add("Out");
  document.getElementById("subText").style.display = "none";
  contentScreen.classList.remove("displayNone", "close");
  contentScreen.offsetHeight;
  contentScreen.classList.add("open");
  if (!headline.classList.contains("headline")) {
    headline.classList.add("h1topPosition");
  }
}

/**
 * Close the content panel
 * @param {HTMLElement} contentScreen 
 * @param {() => void} callback 
 */
function closeContent(contentScreen, callback) {
  contentOpen = false;
  let headline = document.getElementById("stayHeadline");
  resetOutClasses();
  if(!gamePausedByUser){
      togglePlay("play", true);
} else {
  togglePlay("play", false);
}
contentScreenHandler(contentScreen, headline, callback) 
}

/**
 * Helper function for closeContent() to handle the closing of the content screen
 * @param {HTMLElement} contentScreen 
 * @param {HTMLElement} headline 
 * @param {() => void} callback 
 * @description This function is called when the content screen is closed. It removes the content screen and resets the styles.
 */
function contentScreenHandler(contentScreen, headline, callback) {
    contentScreen.classList.remove("open");
  contentScreen.classList.add("close");

  contentScreen.addEventListener("transitionend", function handler() {
    contentScreen.removeEventListener("transitionend", handler);
    finishClosing(contentScreen, callback);
  
  });  
  headline.classList.remove("h1topPosition");
}

/**
 * Handles the reset of all Styles and hides the contentscreen
 * @param {HTMLElement} contentScreen 
 * @param {() => void} callback 
 */
function finishClosing(contentScreen, callback) {
  document.getElementById("subText").style.display = "";
  contentScreen.innerHTML = "";
  contentScreen.dataset.active = "";
  contentScreen.classList.add("displayNone");
  removeOverlay();

  if (callback) callback();
}

/**
 * Handles the animation movement of the content panel by closing and opening it
 * @param {HTMLElement} contentScreen 
 * @description This function is called when the content screen is opened. It adds the "open" class to the content screen and removes the "close" class.
 */
function prepareAnimation(contentScreen) {
  contentScreen.classList.remove("displayNone");
  contentScreen.offsetHeight;
  requestAnimationFrame(() => {
    contentScreen.classList.remove("close");
    requestAnimationFrame(() => {
      contentScreen.classList.add("open");
    });
  });
}

/**
 * The Overlay of the content panel will be removed from the contentScreen
 */
function removeOverlay() {
  let overlay = document.getElementById("overlayDiv");
  if (overlay) overlay.remove();
}


/**
 * Resets all Content Buttons
 * @returns only in Case the try-part fails
 */
function resetOutClasses() {
  try {
    document.getElementById("story").classList.remove("Out");
    document.getElementById("impressum").classList.remove("Out");
    document.getElementById("howto").classList.remove("Out");
  } catch {
    return;
  }
}

/**
 * Returns the Content for "Story" on the contentscreen
 * @returns HTML construction of "story"
 */
function getStoryHtml() {
  return /*html*/ `   
  <div id="contentContainer">
    <div class="fixedContentHead">
      <h3>Story</h3>
      <hr class="contentLine">
    </div>
    <div class="content">
      <p></p>
      Pepe, el Peligroso, hat Hunger! <br>Er ist verrückt nach Hühnchen mit scharfer Soße. Sein Hunger ist so groß, dass
      die kleinen Hühner ihm gestohlen bleiben können. Ein Pollo asado gigante con Salsa picante muss her.
      Er braucht etwas Großes. <p></p>Dieses Mega-Huhn, von dem er träumt, kann man aber nicht so einfach wie die
      kleinen Hühner durch Draufhüpfen zermatschen - außerdem will er dieses Geflügel ja auch noch essen.
      Das Einzige, was wirkt, ist seine scharfe Soße, die leider in der mexikanischen Wüste verstreut ist.<p></p>Wichtig
      ist, mit der Salsa die Augen des Mega-Huhns zu treffen, dann stirbt es gewürzt und servierfertig.<br>
      Kannst du Pepe helfen?
      <p></p>
      Nebenbei findet Pepe noch jede Menge Münzen - wenn er nicht so hungrig wäre, würde er sich darüber freuen.<br>
    </div>
  </div>
    `;
}

/**
 * Returns the Content for the legal notes panel
 * @returns 
 */
function getImpressumHtml() {
  return /*html*/ `
    <div id="contentContainer">
      <div class="fixedContentHead">
        <h3>Impressum</h3>
        <hr class="contentLine">
      </div>
      <div class="content">
        <p>Angaben gemäß § 5 TMG</p>
        Dieses Spiel entstand im Rahmen des Kurses "Web-Developer" an der <br>
        <bold>Developer Akademie GmbH</bold><br>
        Tassiloplatz 25,<br>
        81541 München<br>
        <p>
          E-Mail an: <a href="mailto:Christina@troitzsch.de">Christina Troitzsch</a>
        </p>
      </div>
    </div>
    `;
}

/**
 * Returns the HTML for the HowToPlay-Sheet.
 * @returns 
 */
function getHowToHtml() {
  return /*html*/ ` 
    <div id="contentContainer">

      <div class="fixedContentHead">
        <h3>How to Play</h3>
        <hr class="contentLine">
      </div>
      <div class="content">
        <div class="table">
          <div class="row ">
            <div class="cell rightAlign">SPACEBAR or&nbsp;<img src="./img/buttons/button-up_white.svg"
                alt="Spacebar or Key Up Arrow" class="key"></div>
            <div class="cell">Pepe jumps</div>
          </div>
          <div class="row">
            <div class="cell rightAlign"><img src="./img/buttons/button-right_white.svg" alt="Key Right Arrow"
                class="key"></div>
            <div class="cell">Pepe runs right</div>
          </div>
          <div class="row">
            <div class="cell rightAlign"><img src="./img/buttons/button-left_white.svg" alt="Key Left Arrow"
                class="key"></div>
            <div class="cell">Pepe runs left</div>
          </div>
          <div class="row">
            <div class="cell rightAlign"><img src="./img/buttons/button-D_white.svg" alt="Key D" class="key"></div>
            <div class="cell">Pepe throws bottle<br>
              <small style="line-height:1">Long button press for<br>long throw range</small></div>
          </div>
        </div>
        <div class="table">
          <div class="row ">
            <div class="cell rightAlign"><img src="./img/icon_minichicken.svg" alt="Mini-Chicken" class="key"></div>
            <div class="cell">A collision reduces Pepe's health score by 1% per second. These chickens cannot be killed.
              But you can jump on them without taking damage. They turn back at the edge of the playing field.</div>
          </div>
          <div class="row">
            <div class="cell rightAlign"><img src="./img/icon_chicken.svg" alt="Chicken Enemies" class="key"></div>
            <div class="cell">Reduces Pepe's health score by 10% per second. You can jump on them to kill them. They
              only run in one direction.</div>
          </div>
          <div class="row">
            <div class="cell rightAlign"><img src="./img/icon_endboss.svg" alt="Endboss Chicken Mum" class="key"></div>
            <div class="cell">A collision with the Endboss reduces Pepe's health by 30% per second. You must throw 10
              bottles to kill him. This enemy only runs in one direction. But he gets angry if you throw bottles at
              him.<br>Take Care and Good Luck!</div>
          </div>
          <div class="row">
            <div class="cell rightAlign"><img src="./img/icon_coin.svg" alt="Coin" class="key"></div>
            <div class="cell">Collectable Item</div>
          </div>
          <div class="row">
            <div class="cell rightAlign"><img src="./img/6_salsa_bottle/1_salsa_bottle_on_ground.png" alt="Salsa"
                class="key"></div>
            <div class="cell">Collectable and needed for the fight against the Endboss. It does not work against other
              chickens.</div>
          </div>
        </div>
      </div>
    </div>
    `;
}

/**
 * Creates the elements for the Overlay and returns "darkLayer"
 * @returns 
 */
function createOverlayDiv() {
  let overlayScreen = document.getElementById("overflowHidden");
  let existing = document.getElementById("overlayDiv");
  if (existing) {
    existing.remove();
  }
  const darkLayer = document.createElement("div");
  darkLayer.id = "overlayDiv";
  darkLayer.className = "darkLayer";
  overlayScreen.appendChild(darkLayer);
  return darkLayer;
}

/**
 * Includes the close-Button to the information panel on the contentscreen
 * @param {HTMLElement} contentScreen 
 */
function includeCloseButton(contentScreen) {
  let closeButton = document.createElement("div");
  closeButton.id = "closeButton";
  contentScreen.appendChild(closeButton);

  setTimeout(() => {
    let closeButton = document.getElementById("closeButton");

closeButton.addEventListener("click", () => {
  closeContent(document.getElementById("closeButton")?.closest("#buttonContent, #buttonContentMobile"));
});

  }, 500);
}

/**
 * Makes the GameOverScreen visible and returns which Screen will be shown - Winning Pepe or Winning Endboss 
 * @param {string} somebodyIsDead 
 * @returns 
 */
function showGameOverScreen(somebodyIsDead) {
  let gameOverScreen = document.getElementById("gameOverScreen");
  prepareGameOverScreen(gameOverScreen);
  document.querySelectorAll(".control, .button").forEach((element) => {
    element.classList.add("visibilityHidden");
  });

  if (somebodyIsDead === "Pepe") {
    handleWinningEndboss(gameOverScreen);
  } else if (somebodyIsDead === "Endboss") {
    handleWinningPepe(gameOverScreen);
  } else return;
}

/**
 * Handles the Classes for other Elements on the Screen during GameOver-Session
 * @param {HTMLElement} gameOverScreen 
 */
function prepareGameOverScreen(gameOverScreen) {
  let stayHeadline = document.getElementById("stayHeadline");
  stayHeadline.classList.remove("headline");
  gameOverScreen.classList.remove("displayNone");
  gameOverScreen.classList.add("winningGameOverBG");
  document.getElementById("playControl").style.display = "none";
  let playScreen = document.getElementById("playScreen")
  playScreen.style.border = "unset";
  playScreen.style.boxShadow = "unset";
  let canvas = document.getElementById("canvas");
  canvas.classList.add("displayNone");
}

/**
 * Adds the ReplayButton to the GameOverScreen
 * @param {HTMLElement} gameOverScreen 
 * @param {boolean} status 
 */
function includeReplayButton(gameOverScreen, status) {
  let replayPosition = document.createElement("div");
  replayPosition.id = "retryPosition";
  localStorage.setItem("autostart", "1");
  let replay = document.createElement("div");
  replay.id = "retry";
  replay.classList.add("replayButton", status === "lose" ? "lose" : "win");
  replay.addEventListener("click", () => {
    reStart();
  });
  replayPosition.appendChild(replay);   
  gameOverScreen.appendChild(replayPosition);
}
