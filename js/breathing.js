// Breathing Exercise Module
class BreathingExercise {
  constructor() {
    this.patterns = {
      box: {
        name: 'Box Breathing (4-4-4-4)',
        description: 'Technika používaná Navy SEALs pro zvládání stresu. Rovnoměrné dýchání s pauzami.',
        inhale: 4,
        hold: 4,
        exhale: 4,
        holdOut: 4
      },
      '478': {
        name: 'Relaxační dech (4-7-8)',
        description: 'Přirozený uklidňující prostředek od Dr. Weila. Perfektní před spaním.',
        inhale: 4,
        hold: 7,
        exhale: 8,
        holdOut: 0
      },
      simple: {
        name: 'Jednoduché dýchání (5.5-5.5)',
        description: 'Optimální frekvence dýchání pro maximální relaxaci a koherenční dýchání.',
        inhale: 5.5,
        hold: 0,
        exhale: 5.5,
        holdOut: 0
      },
      bhramari: {
        name: 'Bhramari (Včelí dech)',
        description: 'Bzučení při výdechu uklidňuje mysl a nervový systém. Vhodné i pro děti.',
        inhale: 4,
        hold: 0,
        exhale: 6,
        holdOut: 0,
        special: 'bhramari'
      }
    };

    this.circle = null;
    this.text = null;
    this.timer = null;
    this.isRunning = false;
    this.currentPhase = null;
    this.phaseTimeout = null;
  }

  /**
   * Initialize the breathing exercise with DOM elements
   */
  init(circleEl, textEl, timerEl) {
    this.circle = circleEl;
    this.text = textEl;
    this.timer = timerEl;
  }

  /**
   * Start breathing exercise with specified pattern
   * @param {string} patternName - Name of the breathing pattern
   */
  async start(patternName) {
    const pattern = this.patterns[patternName];
    if (!pattern) {
      console.error('Unknown pattern:', patternName);
      return;
    }

    this.isRunning = true;
    this.currentPattern = pattern;

    // Main breathing loop
    while (this.isRunning) {
      // Inhale phase
      await this.phase('inhale', pattern.inhale, pattern.special);
      if (!this.isRunning) break;

      // Hold phase (if exists)
      if (pattern.hold > 0) {
        await this.phase('hold', pattern.hold);
        if (!this.isRunning) break;
      }

      // Exhale phase
      await this.phase('exhale', pattern.exhale, pattern.special);
      if (!this.isRunning) break;

      // Hold out phase (if exists)
      if (pattern.holdOut > 0) {
        await this.phase('hold-out', pattern.holdOut);
        if (!this.isRunning) break;
      }
    }
  }

  /**
   * Execute a single breathing phase
   * @param {string} phaseName - Phase name (inhale, hold, exhale, hold-out)
   * @param {number} duration - Duration in seconds
   * @param {string} special - Special effect (like bhramari)
   */
  phase(phaseName, duration, special = null) {
    return new Promise((resolve) => {
      if (!this.isRunning) {
        resolve();
        return;
      }

      // Update text based on phase
      const phaseTexts = {
        inhale: window.i18n ? window.i18n.t('breathing.inhale') : 'Nádech',
        hold: window.i18n ? window.i18n.t('breathing.hold') : 'Zadržet',
        exhale: window.i18n ? window.i18n.t('breathing.exhale') : 'Výdech',
        'hold-out': window.i18n ? window.i18n.t('breathing.hold') : 'Zadržet'
      };

      this.text.textContent = phaseTexts[phaseName];

      // Apply CSS class for animation
      this.circle.className = `breathing-circle ${phaseName}`;
      if (special === 'bhramari' && phaseName === 'exhale') {
        this.circle.classList.add('bhramari');
      }

      // Set transition duration
      this.circle.style.transitionDuration = `${duration}s`;

      // Countdown timer
      let remaining = Math.ceil(duration);
      this.timer.textContent = remaining;

      const countdown = setInterval(() => {
        if (!this.isRunning) {
          clearInterval(countdown);
          resolve();
          return;
        }

        remaining--;
        this.timer.textContent = remaining > 0 ? remaining : '';

        if (remaining <= 0) {
          clearInterval(countdown);
        }
      }, 1000);

      // Resolve when phase is complete
      this.phaseTimeout = setTimeout(() => {
        clearInterval(countdown);
        resolve();
      }, duration * 1000);
    });
  }

  /**
   * Stop the breathing exercise
   */
  stop() {
    this.isRunning = false;

    if (this.phaseTimeout) {
      clearTimeout(this.phaseTimeout);
      this.phaseTimeout = null;
    }

    // Reset to initial state
    if (this.circle) {
      this.circle.className = 'breathing-circle';
      this.circle.style.transitionDuration = '';
    }

    if (this.text) {
      this.text.textContent = window.i18n ? window.i18n.t('breathing.prepare') : 'Připravte se';
    }

    if (this.timer) {
      this.timer.textContent = '';
    }
  }

  /**
   * Get pattern information
   * @param {string} patternName - Name of pattern
   * @returns {Object} Pattern details
   */
  getPatternInfo(patternName) {
    return this.patterns[patternName] || null;
  }

  /**
   * Get all available patterns
   * @returns {Object} All patterns
   */
  getAllPatterns() {
    return this.patterns;
  }

  /**
   * Calculate total cycle duration
   * @param {string} patternName - Name of pattern
   * @returns {number} Total duration in seconds
   */
  getCycleDuration(patternName) {
    const pattern = this.patterns[patternName];
    if (!pattern) return 0;

    return pattern.inhale + pattern.hold + pattern.exhale + pattern.holdOut;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BreathingExercise;
}
