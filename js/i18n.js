// Internationalization Module
class I18n {
  constructor() {
    this.translations = {};
    this.currentLocale = this.detectLocale();
    this.fallbackLocale = 'en';
  }

  /**
   * Detect user's preferred locale
   * @returns {string} Locale code
   */
  detectLocale() {
    // Check localStorage first
    const stored = localStorage.getItem('language');
    if (stored && ['cs', 'en'].includes(stored)) {
      return stored;
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (['cs', 'en'].includes(browserLang)) {
      return browserLang;
    }

    // Default to Czech
    return 'cs';
  }

  /**
   * Initialize i18n system
   */
  async init() {
    try {
      // Load fallback locale (English)
      await this.loadLocale(this.fallbackLocale);

      // Load current locale if different
      if (this.currentLocale !== this.fallbackLocale) {
        await this.loadLocale(this.currentLocale);
      }

      // Update DOM with translations
      this.updateDOM();

      console.log(`[i18n] Initialized with locale: ${this.currentLocale}`);
    } catch (error) {
      console.error('[i18n] Initialization error:', error);
    }
  }

  /**
   * Load translations for a locale
   * @param {string} locale - Locale code
   */
  async loadLocale(locale) {
    try {
      const response = await fetch(`./locales/${locale}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load locale: ${locale}`);
      }

      this.translations[locale] = await response.json();
      console.log(`[i18n] Loaded locale: ${locale}`);
    } catch (error) {
      console.error(`[i18n] Error loading locale ${locale}:`, error);

      // Use embedded fallback for offline
      if (locale === 'en') {
        this.translations['en'] = this.getEmbeddedFallback();
      }
    }
  }

  /**
   * Get embedded fallback translations
   * @returns {Object} Fallback translations
   */
  getEmbeddedFallback() {
    return {
      app: {
        title: 'Meditation App',
        tagline: 'Find your inner peace'
      },
      nav: {
        timer: 'Timer',
        breathing: 'Breathing',
        stats: 'Stats',
        settings: 'Settings'
      },
      timer: {
        start: 'Start',
        pause: 'Pause',
        resume: 'Resume',
        stop: 'Stop'
      },
      breathing: {
        inhale: 'Breathe In',
        exhale: 'Breathe Out',
        hold: 'Hold',
        prepare: 'Get Ready'
      }
    };
  }

  /**
   * Get translation for a key
   * @param {string} key - Translation key (e.g., 'app.title')
   * @param {Object} params - Optional parameters for interpolation
   * @returns {string} Translated string
   */
  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations[this.currentLocale];

    // Try current locale
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    // Fallback to English if not found
    if (value === undefined) {
      value = this.translations[this.fallbackLocale];
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
    }

    // Return key if translation not found
    if (value === undefined) {
      console.warn(`[i18n] Translation not found: ${key}`);
      return key;
    }

    // Interpolate parameters
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return this.interpolate(value, params);
    }

    return value;
  }

  /**
   * Interpolate parameters into string
   * @param {string} str - String with placeholders
   * @param {Object} params - Parameters
   * @returns {string} Interpolated string
   */
  interpolate(str, params) {
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * Change locale
   * @param {string} locale - New locale code
   */
  async setLocale(locale) {
    if (!['cs', 'en'].includes(locale)) {
      console.error(`[i18n] Invalid locale: ${locale}`);
      return;
    }

    // Load locale if not already loaded
    if (!this.translations[locale]) {
      await this.loadLocale(locale);
    }

    this.currentLocale = locale;
    localStorage.setItem('language', locale);
    document.documentElement.lang = locale;

    // Update all translations in DOM
    this.updateDOM();

    // Trigger custom event for components to react
    window.dispatchEvent(new CustomEvent('localechange', {
      detail: { locale }
    }));

    console.log(`[i18n] Locale changed to: ${locale}`);
  }

  /**
   * Update all elements with data-i18n attribute
   */
  updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);

      if (translation) {
        // Update text content
        if (el.tagName === 'INPUT' && el.type === 'button') {
          el.value = translation;
        } else if (el.tagName === 'INPUT' && el.placeholder !== undefined) {
          el.placeholder = translation;
        } else {
          el.textContent = translation;
        }
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLocale;
  }

  /**
   * Get current locale
   * @returns {string} Current locale code
   */
  getLocale() {
    return this.currentLocale;
  }

  /**
   * Get available locales
   * @returns {Array} Array of locale codes
   */
  getAvailableLocales() {
    return ['cs', 'en'];
  }

  /**
   * Format number according to locale
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(num) {
    return new Intl.NumberFormat(this.currentLocale).format(num);
  }

  /**
   * Format date according to locale
   * @param {Date} date - Date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date
   */
  formatDate(date, options = {}) {
    return new Intl.DateTimeFormat(this.currentLocale, options).format(date);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18n;
}
