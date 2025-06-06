

// function createButtonContent(content) {
//     let contentType = document.getElementById(content);
//     let contentScreen = document.getElementById("buttonContent");

//     if (contentScreen.classList.contains('open') && contentScreen.dataset.active === content) {
//         closeContent(contentScreen);
//         return;
//     }

//     if (contentScreen.classList.contains('open')) {
//         closeContent(contentScreen, () => openContent(content, contentType, contentScreen));
//     } else {
//         openContent(content, contentType, contentScreen);
//     }
// }

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
    contentScreen.classList.remove('hidden', 'close');
     headline.style.top = "-150px";    

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
       }, 200); 
        createOverlayDiv();
        includeCloseButton(contentScreen);
        closeOnDarkLayer();
// kleiner Timeout, damit die Transition greift
}

function closeContent(contentScreen, callback) {
    console.log("closeContent wurde aufgerufen!", contentScreen);
    let headline = document.getElementById("stayHeadline");
    gamePaused = false;

    if (getSoundStatus()) {
        audioManager.setMuted(false);
        allAmbientSounds();
    } else {
        audioManager.setMuted(true);
    }

    resetOutClasses();
    togglePlay();
    contentScreen.classList.remove('open');
    contentScreen.classList.add('close');

    contentScreen.addEventListener('transitionend', function handler() {
        contentScreen.classList.add('hidden');
        contentScreen.classList.remove('close');
        contentScreen.innerHTML = '';
        contentScreen.dataset.active = '';
        gamePaused = false;
        removeOverlay();
        contentScreen.removeEventListener('transitionend', handler);

        // Falls eine Callback-Funktion übergeben wurde, rufe sie auf!
        if (callback) callback();
    });

    headline.style.removeProperty("top");
}


function ToggleClasses(contentType, contentScreen) {
    resetOutClasses();
     contentType.classList.add("Out");
     contentScreen.classList.toggle('open');
     contentScreen.classList.toggle('close');
     if(contentScreen.classList.contains('close')){
    // let darkLayer = document.getElementById("overlayDiv"); 
     closeContent(contentScreen);
    }
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

// function createOverlayDiv() {
//     let overlayScreen = document.getElementById("overflowHidden");
//         let existing = document.getElementById("overlayDiv");
//     if (existing) {
//         existing.remove();
//     }
//     const darkLayer = document.createElement('div');
//     darkLayer.id = 'overlayDiv';
//     darkLayer.className = 'darkLayer';
//     overlayScreen.appendChild(darkLayer);

//     return darkLayer;
// }

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

// function includeCloseButton(contentScreen) {
//     let closeButton = document.createElement('div');
//     closeButton.id = 'closeButton';
//     contentScreen.appendChild(closeButton);
//     closeButton.setAttribute("onclick", "closeContent()");
// }

function includeCloseButton(contentScreen) {
      let closeButton = document.createElement('div');
    closeButton.id = 'closeButton';
    contentScreen.appendChild(closeButton);

  setTimeout(() => {
    let closeButton = document.getElementById("closeButton");
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            console.log("Schließen-Button wurde geklickt!");
            closeContent(document.getElementById("buttonContent"));
        });
    } else {
        console.error("Schließen-Button existiert nicht!");
    }
}, 500);
}




