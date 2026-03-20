// Meditation Audio Management Module
class MeditationAudio {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.tracks = {};
    this.isUnlocked = false;
    this.bellSound = null;
  }

  /**
   * Initialize and unlock audio context (required for iOS Safari)
   */
  async unlock() {
    if (this.isUnlocked) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();

      // Resume context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Play silent buffer to unlock audio on iOS
      const buffer = this.audioContext.createBuffer(1, 1, 22050);
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start(0);

      // Create master gain node
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);

      this.isUnlocked = true;
      console.log('Audio context unlocked');
    } catch (error) {
      console.error('Audio unlock error:', error);
      // Fallback to HTML5 Audio
      this.useFallback = true;
    }
  }

  /**
   * Load an audio track
   * @param {string} name - Track identifier
   * @param {string} url - URL to audio file
   */
  async loadTrack(name, url) {
    if (!this.isUnlocked) {
      await this.unlock();
    }

    if (this.useFallback) {
      // Use HTML5 Audio as fallback
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.tracks[name] = {
        type: 'html5',
        audio: audio,
        volume: 0.5
      };
      return;
    }

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.tracks[name] = {
        type: 'webaudio',
        buffer: audioBuffer,
        source: null,
        gainNode: null,
        volume: 0.5
      };

      console.log(`[Audio] Successfully loaded track: ${name}`);
    } catch (error) {
      console.error(`[Audio] Error loading track ${name}:`, error);

      // Show user-friendly error notification
      if (window.showNotification) {
        window.showNotification('Nepodařilo se načíst audio soubor', 'warning');
      }

      throw error; // Re-throw for caller to handle
    }
  }

  /**
   * Play a track
   * @param {string} name - Track identifier
   * @param {Object} options - Playback options
   */
  playTrack(name, options = {}) {
    const { loop = true, volume = 0.5, fadeIn = 0 } = options;
    const track = this.tracks[name];

    if (!track) {
      console.warn(`Track ${name} not found`);
      return;
    }

    // HTML5 Audio fallback
    if (track.type === 'html5') {
      track.audio.loop = loop;
      track.audio.volume = fadeIn > 0 ? 0 : volume;
      track.volume = volume;

      track.audio.play().catch(err => {
        console.error('Playback error:', err);
      });

      if (fadeIn > 0) {
        this.fadeInHTML5(track.audio, volume, fadeIn);
      }
      return;
    }

    // Web Audio API
    if (!this.audioContext) return;

    // Stop existing source if playing
    if (track.source) {
      try {
        track.source.stop();
      } catch (e) {
        // Ignore if already stopped
      }
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = track.buffer;
    source.loop = loop;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = fadeIn > 0 ? 0 : volume;

    source.connect(gainNode);
    gainNode.connect(this.masterGain);
    source.start(0);

    track.source = source;
    track.gainNode = gainNode;
    track.volume = volume;

    if (fadeIn > 0) {
      this.fadeIn(name, fadeIn);
    }
  }

  /**
   * Stop a track
   * @param {string} name - Track identifier
   * @param {number} fadeOut - Fade out duration in seconds
   */
  stopTrack(name, fadeOut = 0) {
    const track = this.tracks[name];
    if (!track) return;

    if (track.type === 'html5') {
      if (fadeOut > 0) {
        this.fadeOutHTML5(track.audio, fadeOut);
      } else {
        track.audio.pause();
        track.audio.currentTime = 0;
      }
      return;
    }

    if (fadeOut > 0) {
      this.fadeOut(name, fadeOut);
    } else {
      if (track.source) {
        try {
          track.source.stop();
        } catch (e) {
          // Ignore
        }
        track.source = null;
      }
    }
  }

  /**
   * Fade in a track
   * @param {string} name - Track identifier
   * @param {number} duration - Fade duration in seconds
   */
  fadeIn(name, duration = 2) {
    const track = this.tracks[name];
    if (!track || !track.gainNode) return;

    const now = this.audioContext.currentTime;
    track.gainNode.gain.setValueAtTime(0, now);
    track.gainNode.gain.linearRampToValueAtTime(track.volume, now + duration);
  }

  /**
   * Fade out a track
   * @param {string} name - Track identifier
   * @param {number} duration - Fade duration in seconds
   */
  fadeOut(name, duration = 2) {
    const track = this.tracks[name];
    if (!track || !track.gainNode) return;

    const now = this.audioContext.currentTime;
    track.gainNode.gain.setValueAtTime(track.gainNode.gain.value, now);
    track.gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    setTimeout(() => this.stopTrack(name), duration * 1000);
  }

  /**
   * Fade in HTML5 audio
   */
  fadeInHTML5(audio, targetVolume, duration) {
    const steps = 20;
    const stepTime = (duration * 1000) / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, targetVolume);

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);
  }

  /**
   * Fade out HTML5 audio
   */
  fadeOutHTML5(audio, duration) {
    const steps = 20;
    const stepTime = (duration * 1000) / steps;
    const startVolume = audio.volume;
    const volumeStep = startVolume / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(startVolume - (volumeStep * currentStep), 0);

      if (currentStep >= steps) {
        clearInterval(interval);
        audio.pause();
        audio.currentTime = 0;
      }
    }, stepTime);
  }

  /**
   * Set volume for a track
   * @param {string} name - Track identifier
   * @param {number} value - Volume (0-1)
   */
  setVolume(name, value) {
    const track = this.tracks[name];
    if (!track) return;

    track.volume = value;

    if (track.type === 'html5') {
      track.audio.volume = value;
    } else if (track.gainNode) {
      track.gainNode.gain.setValueAtTime(value, this.audioContext.currentTime);
    }
  }

  /**
   * Play bell/gong sound for meditation end
   */
  async playBell() {
    const bellType = localStorage.getItem('bellSound') || 'tibetan';

    if (bellType === 'none') return;

    if (!this.audioContext) {
      await this.unlock();
    }

    // Play actual bell.mp3 file when bellSound = 'bell'
    if (bellType === 'bell') {
      try {
        await this.loadTrack('bell-file', './audio/bell.mp3');
        this.playTrack('bell-file', { loop: false, volume: 0.7, fadeIn: 0 });
        return;
      } catch (e) {
        console.log('[Audio] bell.mp3 not available, falling back to synthesized tone');
        // fall through to synthesized tone below
      }
    }

    if (this.useFallback) {
      if (!this.audioContext) {
        console.log('Bell sound not available: no audio context');
        return;
      }
      try {
        const beep = this.audioContext.createOscillator();
        const beepGain = this.audioContext.createGain();
        beep.connect(beepGain);
        beepGain.connect(this.audioContext.destination);
        beep.frequency.value = 528;
        beepGain.gain.value = 0.3;
        beep.start();
        beep.stop(this.audioContext.currentTime + 0.2);
      } catch (e) {
        console.log('Bell sound not available');
      }
      return;
    }

    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = 528;

      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 3);

      oscillator.start(now);
      oscillator.stop(now + 3);
    } catch (error) {
      console.error('Bell sound error:', error);
    }
  }

  /**
   * Check if a track is currently playing
   * @param {string} name - Track identifier
   * @returns {boolean}
   */
  isPlaying(name) {
    const track = this.tracks[name];
    if (!track) return false;

    if (track.type === 'html5') {
      return !track.audio.paused;
    }

    return track.source !== null;
  }

  /**
   * Stop all tracks
   */
  stopAll(fadeOut = 0) {
    Object.keys(this.tracks).forEach(name => {
      this.stopTrack(name, fadeOut);
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MeditationAudio;
}
