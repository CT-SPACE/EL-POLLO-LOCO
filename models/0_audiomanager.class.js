class AudioManager {
    buffers = {};
    playingSources = {};
    audioContext;
    audioPlaying = {};
     pausedAt = {}; // <--- NEU: speichert die Pausenposition
    startedAt = {}; // <--- NEU: merkt sich, wann gestartet wurde
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
    if (!this.buffers[name]) return;

    // Wenn bereits läuft, nicht nochmal starten
    if (this.audioPlaying[name]) return;

    let offset = this.pausedAt[name] || 0; // <--- Resume-Position oder 0
    try {
        let source = this.audioContext.createBufferSource();
        source.buffer = this.buffers[name];
        source.loop = options.loop || false;

        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = options.volume ?? 0.6;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        source.start(0, offset); // <--- Start an Offset
        this.playingSources[name] = { source, gainNode };
        this.audioPlaying[name] = true;
        this.startedAt[name] = this.audioContext.currentTime - offset; // <--- Startzeit merken

        source.onended = () => {
            this.audioPlaying[name] = false;
            this.pausedAt[name] = 0;
            this.startedAt[name] = 0;
        };
    } catch (error) {
        console.error(`PlayAudio - Fehler beim Abspielen von "${name}":`, error);
    }
}

    controlAudio(name, options = {}) {
        let audio = this.playingSources[name];
        if (!audio) return;

        if (options.volume !== undefined) {
            audio.gainNode.gain.value = options.volume;
        }
        if (options.pause) {
            // Pausenposition berechnen
            if (this.audioPlaying[name]) {
                let elapsed = this.audioContext.currentTime - (this.startedAt[name] || 0);
                this.pausedAt[name] = elapsed;
            }
            audio.source.stop();
            delete this.playingSources[name];
            this.audioPlaying[name] = false;
        }
        if (options.resume) {
            // Resume von Pausenposition
            if (this.pausedAt[name]) {
                this.playAudio(name, options);
            }
        }
        if (options.stop) {
            // Komplett stoppen und zurücksetzen
            audio.source.stop();
            delete this.playingSources[name];
            this.audioPlaying[name] = false;
            this.pausedAt[name] = 0;
            this.startedAt[name] = 0;
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

     playEffect(name, options = {}) {
         if (this.muted) return;
        if (!this.buffers[name]) return;
        try {
            let source = this.audioContext.createBufferSource();
            source.buffer = this.buffers[name];
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = options.volume ?? 0.6;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            source.start(0);
            // Kein audioPlaying-Status, damit mehrere Effekte gleichzeitig gehen!
        } catch (error) {
            console.error(`Fehler beim Effekt-Sound "${name}":`, error);
        }
    }
}







