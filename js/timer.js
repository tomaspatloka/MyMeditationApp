// Meditation Timer Module
class MeditationTimer {
  constructor() {
    this.duration = 0;
    this.remaining = 0;
    this.startTime = 0;
    this.pausedTime = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.rafId = null;
    this.onTick = null;
    this.onComplete = null;
    this.wakeLock = null;
  }

  /**
   * Start the timer
   * @param {number} durationSeconds - Duration in seconds
   */
  start(durationSeconds) {
    this.duration = durationSeconds * 1000;
    this.remaining = this.duration;
    this.startTime = performance.now();
    this.isRunning = true;
    this.isPaused = false;
    this.tick();
    this.requestWakeLock();
  }

  /**
   * Main timer loop using requestAnimationFrame
   */
  tick() {
    if (!this.isRunning) return;

    const now = performance.now();
    const elapsed = now - this.startTime;
    this.remaining = Math.max(0, this.duration - elapsed);

    if (this.onTick) {
      const progress = 1 - (this.remaining / this.duration);
      this.onTick(this.formatTime(this.remaining), progress);
    }

    if (this.remaining <= 0) {
      this.complete();
      return;
    }

    this.rafId = requestAnimationFrame(() => this.tick());
  }

  /**
   * Pause the timer
   */
  pause() {
    if (!this.isRunning || this.isPaused) return;

    this.isRunning = false;
    this.isPaused = true;
    this.pausedTime = this.remaining;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.releaseWakeLock();
  }

  /**
   * Resume the timer from pause
   */
  resume() {
    if (!this.isPaused) return;

    this.duration = this.pausedTime;
    this.startTime = performance.now();
    this.isRunning = true;
    this.isPaused = false;
    this.tick();
    this.requestWakeLock();
  }

  /**
   * Stop the timer completely
   */
  stop() {
    this.isRunning = false;
    this.isPaused = false;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.remaining = 0;
    this.releaseWakeLock();
  }

  /**
   * Format milliseconds to MM:SS
   * @param {number} ms - Time in milliseconds
   * @returns {string} Formatted time string
   */
  formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Timer completion handler
   */
  complete() {
    this.isRunning = false;
    this.isPaused = false;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.onComplete) {
      this.onComplete();
    }

    this.releaseWakeLock();
    this.showNotification();
    this.playCompletionSound();
  }

  /**
   * Show notification when meditation is complete
   */
  showNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Meditace dokončena', {
          body: 'Vaše meditační sezení skončilo. Skvělá práce!',
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-72.png',
          tag: 'meditation-complete',
          requireInteraction: false,
          silent: false
        });
      } catch (error) {
        console.log('Notification error:', error);
      }
    }
  }

  /**
   * Play completion sound (bell/gong)
   */
  playCompletionSound() {
    // This will be handled by the audio module
    if (window.meditationAudio) {
      window.meditationAudio.playBell();
    }
  }

  /**
   * Request wake lock to keep screen on during meditation
   */
  async requestWakeLock() {
    if (!('wakeLock' in navigator)) {
      console.log('Wake Lock API not supported');
      return;
    }

    // Check if user wants to keep screen awake
    const keepAwake = localStorage.getItem('keepAwake');
    if (keepAwake === 'false') return;

    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock active');

      this.wakeLock.addEventListener('release', () => {
        console.log('Wake Lock released');
      });
    } catch (err) {
      console.log('Wake Lock error:', err);
    }
  }

  /**
   * Release wake lock
   */
  async releaseWakeLock() {
    if (this.wakeLock) {
      try {
        await this.wakeLock.release();
        this.wakeLock = null;
      } catch (err) {
        console.log('Wake Lock release error:', err);
      }
    }
  }

  /**
   * Get current state
   */
  getState() {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      remaining: this.remaining,
      duration: this.duration
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MeditationTimer;
}
