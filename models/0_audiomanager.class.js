class AudioManager {
  buffers = {};
  playingSources = {};
  audioContext;
  audioPlaying = {};
  pausedAt = {};
  startedAt = {};
  muted = false;

  constructor() {
    this.audioContext = new (window.AudioContext ||  window.webkitAudioContext)();
    this.buffers = {};
    this.playingSources = {};
  }

  async loadAudio(name, url) {
    try {
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Fehler beim Laden der Datei: ${url} (Status: ${response.status})`
        );
      }
      let arrayBuffer = await response.arrayBuffer();
      this.buffers[name] = await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      return;
    }
  }

  setMuted(mute) {
    this.muted = mute;
    if (mute) {
      Object.keys(this.playingSources).forEach((name) => {
        this.controlAudio(name, { pause: true });
      });
    }
  }


  playAudio(name, options = {}) {
    if (this.shouldNotPlay(name)) return;
    if (!this.buffers[name] || this.audioPlaying[name]) return;

    try {
      const offset = this.pausedAt[name] || 0;
      const source = this.createSource(name, options);
      const gainNode = this.createGainNode(options.volume);

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start(0, offset);
      this.playingSources[name] = { source, gainNode };
      this.audioPlaying[name] = true;
      this.startedAt[name] = this.audioContext.currentTime - offset;

      source.onended = () => this.resetAudioState(name);
    } catch (error) {
    }
  }

  shouldNotPlay(name) {
    return this.muted && name !== "pepe_loses" && name !== "pepe_wins";
  }

  createSource(name, options) {
    const source = this.audioContext.createBufferSource();
    source.buffer = this.buffers[name];
    source.loop = options.loop || false;
    return source;
  }

  createGainNode(volume) {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume ?? 0.6;
    return gainNode;
  }

  resetAudioState(name) {
    this.audioPlaying[name] = false;
    this.pausedAt[name] = 0;
    this.startedAt[name] = 0;
  }


  controlAudio(name, options = {}) {
    let audio = this.playingSources[name];
    if (!audio) return;

    if (options.volume !== undefined) {
      this.setAudioVolume(audio, options.volume);
    }
    if (options.pause) {
      this.pauseAudio(name, audio);
    }
    if (options.resume) {
      this.resumeAudio(name, options);
    }
    if (options.stop) {
      this.stopAudio(name, audio);
    }
  }

  setAudioVolume(audio, volume) {
    audio.gainNode.gain.value = volume;
  }

  pauseAudio(name, audio) {
    if (this.audioPlaying[name]) {
      let elapsed = this.audioContext.currentTime - (this.startedAt[name] || 0);
      this.pausedAt[name] = elapsed;
    }
    audio.source.stop();
    delete this.playingSources[name];
    this.audioPlaying[name] = false;
  }

  resumeAudio(name, options) {
    if (this.pausedAt[name]) {
      this.playAudio(name, options);
    }
  }

  stopAudio(name, audio) {
    audio.source.stop();
    delete this.playingSources[name];
    this.audioPlaying[name] = false;
    this.pausedAt[name] = 0;
    this.startedAt[name];
  }

  activateAudioContext() {
    if (this.audioContext.state === "suspended") {
      this.audioContext
        .resume()
        .then(() => {})
        .catch(() => {
          return;
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
    } catch (error) {
      console.error(`Fehler beim Effekt-Sound "${name}":`, error);
    }
  }
}
