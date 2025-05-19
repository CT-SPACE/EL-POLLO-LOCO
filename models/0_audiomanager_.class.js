class AudioManager {
    buffers = {};
    playingSources = {};
    audioContext;
    audioPlaying = {};
    muted = false;


    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = {};
        this.playingSources = {};

    }

    async loadAudio(name, url) {
        try{
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Fehler beim Laden der Datei: ${url} (Status: ${response.status})`);
        }
        let arrayBuffer = await response.arrayBuffer();
        this.buffers[name] = await this.audioContext.decodeAudioData(arrayBuffer);
        // console.log(`Audio "${name}" erfolgreich geladen.`);
        // console.log(`Audio "${name}"- ${JSON.stringify(this.buffers)} erfolgreich geladen.`);
        } catch (error) {
            console.log(`LA - Fehler beim Laden oder Dekodieren von "${name}":`, error);
        }

    }


    setMuted(mute) {
        this.muted = mute;
        // Stoppe alle laufenden Sounds, wenn gemutet wird
        if (mute) {
            Object.keys(this.playingSources).forEach(name => {
                this.controlAudio(name, { pause: true });
            });
        }
    }


  playAudio(name, options = {}) {
      if (this.muted) return;
        if (!this.buffers[name]) {
            console.error(`PA-buffers - Audio "${name}"/ ${JSON.stringify(options)} wurde nicht geladen.`);
            return;
        }
         if (this.audioPlaying[name]) {   
            return;
        }
    
        try {
            let source = this.audioContext.createBufferSource();
            source.buffer = this.buffers[name];
            source.loop = options.loop || false;
    
            // Lautstärke-Knoten erstellen & setzen
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = options.volume ?? 0.6;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
    
            source.start(0);
            this.playingSources[name] = { source, gainNode };
            this.audioPlaying[name] = true;

            source.onended = () => {
                this.audioPlaying[name] = false; // Setzt Status nach Beenden zurück
            };
    
            // console.log(`PA - Audio "${name}"- ${JSON.stringify(options)} wird abgespielt.`);
        } catch (error) {
            console.error(`PlayAudio - Fehler beim Abspielen von "${name}":`, error);
        }
    }
    // playAudio(name, options = {}) {
    //     if (!this.buffers[name]) {
    //         console.error(`PA-buffers - Audio "${name}"/ ${JSON.stringify(options)} wurde nicht geladen.`);
    //         return;
    //     }
    //     try {
    //     let source = this.audioContext.createBufferSource();
    //     source.buffer = this.buffers[name];
    //     source.loop = options.loop || false;

    //     // Lautstärke-Knoten erstellen & setzen
    //     const gainNode = this.audioContext.createGain();
    //     gainNode.gain.value = options.volume ?? 0.6; // Standardwert 1
    //     source.connect(gainNode);
    //     gainNode.connect(this.audioContext.destination);

    //     source.start(0);
    //     this.playingSources[name] = { source, gainNode };
    //     console.log(` PA - Audio "${name}"- ${JSON.stringify(options)} wird abgespielt.`);
    // } catch (error) {
    //     console.error(`PlayAudio - Fehler beim Abspielen von "${name}":`, error);
    // }
    // }

    controlAudio(name, options = {}) {
        let audio = this.playingSources[name];
        if (!audio) return;

        if (options.volume !== undefined) {
            audio.gainNode.gain.value = options.volume;
        }
        if (options.pause) {
            audio.source.stop();
            delete this.playingSources[name];
            this.audioPlaying[name] = false;
        }
    }

    activateAudioContext() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                // console.log('AudioContext wurde aktiviert.');
            }).catch((error) => {
                console.error('Fehler beim Aktivieren des AudioContext:', error);
            });
        }
    }
}







//     constructor() {
//         this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
//         this.buffers = {}; // Speicher für geladene Audio-Dateien
//     }

//     async loadAudio(name, url) {
//         const response = await fetch(url);
//         const arrayBuffer = await response.arrayBuffer();
//         this.buffers[name] = await this.audioContext.decodeAudioData(arrayBuffer);
//     }

//     playAudio(name) {
//         if (!this.buffers[name]) {
//             console.error(`Audio "${name}" wurde nicht geladen.`);
//             return;
//         }

//         const source = this.audioContext.createBufferSource();
//         source.buffer = this.buffers[name];
//         source.connect(this.audioContext.destination);
//         source.start(0);
//     }
// }

// // Nutzung
// const audioManager = new AudioManager();
// audioManager.loadAudio('jump', 'jump.mp3');
// audioManager.loadAudio('hit', 'hit.mp3');

// // Später in verschiedenen Klassen:
// audioManager.playAudio('jump');
// audioManager.playAudio('hit');
