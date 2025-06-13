
function createButtonContent(content) {
    let contentType = document.getElementById(content);
    let contentScreen = document.getElementById("buttonContent");

    // Falls der gleiche Content bereits geöffnet ist, dann schließen
    if (contentScreen.classList.contains('open') && contentScreen.dataset.active === content) {
        closeContent(contentScreen);
        return;
    }

    // Falls ein anderer Content geöffnet ist, erst schließen und danach neuen öffnen
    if (contentScreen.classList.contains('open')) {
        closeContent(contentScreen, () => openContent(content, contentType, contentScreen));
    } else {
        openContent(content, contentType, contentScreen);
    }
}



function openContent(content, contentType, contentScreen) {
    let headline = document.getElementById("stayHeadline");
    gamePaused = true;
    togglePlay("content", true);

    if (getSoundStatus()) {
        audioManager.setMuted(false);
        allAmbientSounds();
    } else {
        audioManager.setMuted(true);
    }

    resetOutClasses();
    contentType.classList.add("Out");
    contentScreen.classList.remove('displayNone', 'close');
    contentScreen.offsetHeight; 
     contentScreen.classList.add('open');
    if(!headline.classList.contains('headline')){ 
           headline.style.top = "-150px";    
    };

    setTimeout(() => {
        contentScreen.classList.add('open');
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
       }, 50); 
        createOverlayDiv();
        includeCloseButton(contentScreen);
        closeOnDarkLayer();
// kleiner Timeout, damit die Transition greift
}

function closeContent(contentScreen, callback) {
    let headline = document.getElementById("stayHeadline");
    gamePaused = false;

    mutePerSoundStatus();
    resetOutClasses();
    togglePlay();
    
    // Start closing animation
    contentScreen.classList.remove('open');
    contentScreen.classList.add('close');
    
    // Listen for animation end only once
    contentScreen.addEventListener('transitionend', function handler() {
        contentScreen.removeEventListener('transitionend', handler);
        finishClosing(contentScreen, callback);
    });

    headline.style.removeProperty("top");
}

function finishClosing(contentScreen, callback) {
    contentScreen.innerHTML = '';
    contentScreen.dataset.active = '';
    contentScreen.classList.add('displayNone');
    removeOverlay();
    
    if (callback) callback();
}

function prepareAnimation(contentScreen) {
    contentScreen.classList.remove('displayNone');
    contentScreen.offsetHeight; // Force reflow
    
    requestAnimationFrame(() => {
        contentScreen.classList.remove('close');
        requestAnimationFrame(() => {
            contentScreen.classList.add('open');
        });
    });
}

function mutePerSoundStatus() {
    if (getSoundStatus()) {
        audioManager.setMuted(false);
        allAmbientSounds();
    } else {
        audioManager.setMuted(true);
    }
}

function ToggleClasses(contentScreen) {
        contentScreen.classList.add('displayNone');


        gamePaused = false;
        removeOverlay();
        
}


function removeOverlay() {
    let overlay = document.getElementById("overlayDiv");
    if (overlay) overlay.remove();
}

function resetOutClasses() {
    try{
        document.getElementById("story").classList.remove("Out");
        document.getElementById("impressum").classList.remove("Out");
        document.getElementById("howto").classList.remove("Out");
    } catch {
        return;
    }

}

function getStoryHtml() {
    return `        
    <div class="fixedContentHead">
        <h3>Story</h3>
        <hr class="contentLine">
        </div>
    <div class="content">

        <p></p>
        Pepe, el Peligroso, hat Hunger! <br>Er ist verrückt nach Hühnchen mit scharfer Soße. Sein Hunger ist so groß, dass die kleinen Hühner ihm gestohlen bleiben können. Ein Pollo asado gigante con Salsa picante muss her. 
        Er braucht etwas Großes. <p></p>Dieses Mega-Huhn, von dem er träumt, kann man aber nicht so einfach wie die kleinen Hühner durch Draufhüpfen zermatschen - außerdem will er dieses Geflügel ja auch noch essen. 
        Das Einzige, was wirkt, ist seine scharfe Soße, die leider in der mexikanischen Wüste verstreut ist.<p></p>Wichtig ist, mit der Salsa die Augen des Mega-Huhns zu treffen, dann stirbt es gewürzt und servierfertig.<br>
        Kannst du Pepe helfen?
        <p></p>
        Nebenbei findet Pepe noch jede Menge Münzen - wenn er nicht so hungrig wäre, würde er sich darüber freuen.<br>
    </div>
    `;
}

function getImpressumHtml() {
    return `
     <div class="fixedContentHead">
        <h3>Impressum</h3>
        <hr class="contentLine">
        </div>
    <div class="content">

        <p>Angaben gemäß § 5 TMG</p>
        Dieses Spiel entstand im Rahmen des Kurses "Web-Entwicklung" an der <br>
        <bold>Developer Akademie GmbH</bold><br>
        Tassiloplatz 25,<br>
        81541 München<br>
        <p>
        E-Mail an: <a href="mailto:Christina@troitzsch.de">Christina Troitzsch</a>
        </p>
    </div>
    `;
}

function getHowToHtml() {
    return /*html*/ ` 
    
    <div class="fixedContentHead">
        <h3>How to Play</h3>
        <hr class="contentLine">
        </div>
    <div class="content">

        <div class="table">
<div class="row "><div class="cell rightAlign">SPACEBAR or&nbsp;<img src="./img/buttons/button-up_white.svg" alt="Spacebar or Key Up Arrow" class="key"></div><div class="cell">Pepe jumps</div></div>
<div class="row"><div class="cell rightAlign"><img src="../img/buttons/button-right_white.svg" alt="Key Right Arrow" class="key"></div><div class="cell">Pepe runs right</div></div>
<div class="row"><div class="cell rightAlign"><img src="../img/buttons/button-left_white.svg" alt="Key Left Arrow" class="key"></div><div class="cell">Pepe runs left</div></div>
<div class="row"><div class="cell rightAlign"><img src="../img/buttons/button-D_white.svg" alt="Key D" class="key"></div><div class="cell">Pepe throws bottle</div></div>
        </div>
    </div>
    `;
}

function createOverlayDiv() {
    let overlayScreen = document.getElementById("overflowHidden");
    let existing = document.getElementById("overlayDiv");
    if (existing) {
        existing.remove();
    }
    const darkLayer = document.createElement('div');
    darkLayer.id = 'overlayDiv';
    darkLayer.className = 'darkLayer';
    overlayScreen.appendChild(darkLayer);
    return darkLayer;
}


function closeOnDarkLayer() {
    let darkLayer = document.getElementById("overlayDiv"); 
    let contentScreen = document.getElementById("buttonContent");
    darkLayer.addEventListener("click", function () {
         closeContent(contentScreen)
    });
}


function includeCloseButton(contentScreen) {
      let closeButton = document.createElement('div');
    closeButton.id = 'closeButton';
    contentScreen.appendChild(closeButton);

  setTimeout(() => {
    let closeButton = document.getElementById("closeButton");

        closeButton.addEventListener("click", () => {
            // console.log("Schließen-Button wurde geklickt!");
            closeContent(document.getElementById("buttonContent"));
        });
}, 500);
}

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

function prepareGameOverScreen(gameOverScreen) {

    let stayHeadline = document.getElementById("stayHeadline");
    stayHeadline.classList.remove('headline');
    gameOverScreen.classList.add('backdrop');
    gameOverScreen.classList.add('pepeGrab');
      gameOverScreen.classList.remove('displayNone');

    let canvas = document.getElementById('canvas');
      canvas.classList.add('displayNone');
}

function handleWinningEndboss(gameOverScreen) {
    
     audioManager.playAudio("pepe_loses", { play: true, volume: 0.2 });
    let pepeGrave = document.createElement("div");
          pepeGrave.id = "grave";
            pepeGrave.className = "pepeGrave";
    gameOverScreen.innerHTML = ''; 
includeReplayButton(gameOverScreen);

         gameOverScreen.appendChild(pepeGrave);
         let graveIMG = document.getElementById("grave");
         graveIMG.innerHTML = `<img src="./img/pepe_grab.svg" alt="Pepe's Grave">`;
}

function handleWinningPepe(gameOverScreen) {
      audioManager.playAudio("winning_whoppi", { play: true, volume: 0.2 });
        gameOverScreen.innerHTML += `<h3>YOU WON!</h3> ¡Que Aproveches! `;
                let rueda = createElement('div');
        rueda.classList.add('winning-BG');
       setTimeout(() => {
         rueda.classList.add('big');
       },1000);
}


function includeReplayButton(gameOverScreen) {
    
                  gameOverScreen.innerHTML += `<div class="gameOverText"><h3>¡Game Over!</h3>Oh no, Pepe perdió contra <br> este oponente devastador!</div>
                 <div id="retry" class="replayButton"></div>`;
     
    let replay = document.getElementById("retry");

    
    replay.onclick = function (){

       location.reload(); // Reload the page to restart the game
    }
    
}