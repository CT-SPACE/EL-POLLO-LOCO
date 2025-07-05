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
/**
 * Loads all Audio-Files 
 * @param {string} name 
 * @param {string} url 
 * @returns 
 */
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

  /**
   * Sets all running Audios down to mute
   * @param {boolean} mute 
   */
  setMuted(mute) {
    this.muted = mute;
    if (mute) {
      Object.keys(this.playingSources).forEach((name) => {
        this.controlAudio(name, { pause: true });
      });
    }
  }

/**
 * Starts the needed audio 
 * @param {string} name 
 * @param {Objects} options 
 * @returns 
 */
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

  /**
   * Returns, if all sounds are muted - excepting the GameOver-Sounds
   * @param {string} name 
   * @returns 
   */
  shouldNotPlay(name) {
    return this.muted && name !== "pepe_loses" && name !== "pepe_wins";
  }

  /**
   * Helper function for playAudio()
   * @param {string} name 
   * @param {Object} options 
   * @returns 
   */
  createSource(name, options) {
    const source = this.audioContext.createBufferSource();
    source.buffer = this.buffers[name];
    source.loop = options.loop || false;
    return source;
  }

  /**
   * Helper function for playAudio() to manage the volume
   * @param {number} volume 
   * @returns 
   */
  createGainNode(volume) {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume ?? 0.6;
    return gainNode;
  }


/**
 * Helper function for playAudio() to reset active audios.
 * @param {string} name 
 */
  resetAudioState(name) {
    this.audioPlaying[name] = false;
    this.pausedAt[name] = 0;
    this.startedAt[name] = 0;
  }


  /**
   * Function to change settings of playing audios e
   * @param {string} name 
   * @param {Object} options 
   * @returns 
   */
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

  /**
   * Helper function for controlAudio() to manage volume
   * @param {string} audio 
   * @param {number} volume 
   */
  setAudioVolume(audio, volume) {
    audio.gainNode.gain.value = volume;
  }

  /**
   * Helper function for controlAudio to manage pause
   * @param {string} name 
   * @param {string} audio 
   */
  pauseAudio(name, audio) {
    if (this.audioPlaying[name]) {
      let elapsed = this.audioContext.currentTime - (this.startedAt[name] || 0);
      this.pausedAt[name] = elapsed;
    }
    audio.source.stop();
    delete this.playingSources[name];
    this.audioPlaying[name] = false;
  }

  /**
   * Helper function for controlAudio to start playing the audio again
   * @param {string} name 
   * @param {Object} options 
   */
  resumeAudio(name, options) {
    if (this.pausedAt[name]) {
      this.playAudio(name, options);
    }
  }

  /**
   * Helper function for controlAudio to stop the audio
   * @param {*} name 
   * @param {*} audio 
   */
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

/**
 * For Short Sounds to start
 * @param {string} name 
 * @param {Object} options 
 * @returns 
 */
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
