// 

function buttonContent(content) {
    removeOverlay();
    let contentType = document.getElementById(content);
    let contentScreen = document.getElementById("buttonContent");
    contentScreen.classList.add("buttonContent");
    contentScreen.classList.remove("hidden");
    
    resetOutClasses();

    switch (content) {
        case "story":
            contentType.classList.add("Out");
            contentType.classList.add("contentTransition")
            contentScreen.innerHTML = getStoryHtml();
            break;
        case "impressum":
            contentType.classList.add("Out");
            contentScreen.innerHTML = getImpressumHtml();
            break;
        case "howto":
            contentType.classList.add("Out");
            contentScreen.innerHTML = getHowToHtml();
            break;
    };
    createOverlayDiv();
    includeCloseButton(contentScreen);
    closeOnDarkLayer();
       
}

function removeOverlay() {
    let overlay = document.getElementById("overlayDiv");
    if (overlay) overlay.remove();
}

function resetOutClasses() {
    document.getElementById("story").classList.remove("Out");
    document.getElementById("impressum").classList.remove("Out");
    document.getElementById("howto").classList.remove("Out");
}

function getStoryHtml() {
    return `
    <div class="content">
        <h3>Story</h3>
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
    <div class="content">
        <h3>Impressum</h3>
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
    <div class="content">
        <h3>How to Play</h3>
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
    let playScreen = document.getElementById("playScreen");
    const darkLayer = document.createElement('div');
    darkLayer.id = 'overlayDiv';
    darkLayer.style.position = 'absolute';
    darkLayer.style.top = '0';
    darkLayer.style.left = '0';
    darkLayer.style.width = '100%';
    darkLayer.style.height = '100%';
    darkLayer.style.background = 'rgba(0,0,0,0.5)';
    darkLayer.style.zIndex = '11';
    playScreen.appendChild(darkLayer);

    return darkLayer;
}

function closeOnDarkLayer() {
    let darkLayer = document.getElementById("overlayDiv"); 
    let contentScreen = document.getElementById("buttonContent");
    darkLayer.addEventListener("click", function () {
         toClose(contentScreen, darkLayer)
    });
}

function includeCloseButton(contentScreen) {
     let darkLayer = document.getElementById("overlayDiv"); 
    let closeButton = document.createElement('div');
    closeButton.id = 'closeButton';
    contentScreen.appendChild(closeButton);
        darkLayer.addEventListener("click", function () {
        toClose(contentScreen, darkLayer);
        });
        closeButton.addEventListener("click", function () {
        toClose(contentScreen, darkLayer)
        });


}

function toClose(contentScreen, darkLayer) {
            contentScreen.classList.remove("buttonContent");
        contentScreen.classList.add("hidden");
         resetOutClasses();
        darkLayer.remove();

}