// Storage Manager for meditation data persistence
class StorageManager {
  constructor() {
    this.key = 'meditation_data';
    this.data = this.load();
  }

  /**
   * Get default data structure
   * @returns {Object} Default data
   */
  getDefault() {
    return {
      version: 1,
      preferences: {
        language: 'cs',
        defaultDuration: 600, // 10 minutes
        bellSound: 'tibetan',
        backgroundSound: 'none',
        backgroundVolume: 0.3,
        notifications: false,
        keepAwake: true,
        lightMode: false
      },
      sessions: [],
      stats: {
        totalSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastSessionDate: null
      }
    };
  }

  /**
   * Load data from localStorage
   * @returns {Object} Stored data or defaults
   */
  load() {
    try {
      const stored = localStorage.getItem(this.key);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle new fields
        return this.mergeWithDefaults(parsed);
      }
      return this.getDefault();
    } catch (error) {
      console.error('Error loading data:', error);
      return this.getDefault();
    }
  }

  /**
   * Merge stored data with defaults
   * @param {Object} stored - Stored data
   * @returns {Object} Merged data
   */
  mergeWithDefaults(stored) {
    const defaults = this.getDefault();

    return {
      version: stored.version || defaults.version,
      preferences: { ...defaults.preferences, ...stored.preferences },
      sessions: stored.sessions || defaults.sessions,
      stats: { ...defaults.stats, ...stored.stats }
    };
  }

  /**
   * Save data to localStorage
   */
  save() {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving data:', error);
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        this.cleanOldSessions();
        try {
          localStorage.setItem(this.key, JSON.stringify(this.data));
        } catch (retryError) {
          console.error('Failed to save after cleanup:', retryError);
        }
      }
    }
  }

  /**
   * Add a meditation session
   * @param {number} duration - Duration in seconds
   * @param {boolean} completed - Whether session was completed
   */
  addSession(duration, completed = true) {
    const today = new Date().toISOString().split('T')[0];

    const session = {
      id: this.generateId(),
      date: today,
      timestamp: Date.now(),
      duration,
      completed,
      type: 'meditation'
    };

    this.data.sessions.push(session);

    if (completed) {
      this.updateStats(session);
    }

    this.save();
    return session;
  }

  /**
   * Update statistics based on session
   * @param {Object} session - Session data
   */
  updateStats(session) {
    const stats = this.data.stats;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = this.getYesterday();

    // Update totals
    stats.totalSessions++;
    stats.totalMinutes += Math.round(session.duration / 60);

    // Update streak
    if (!stats.lastSessionDate) {
      // First session ever
      stats.currentStreak = 1;
    } else if (stats.lastSessionDate === today) {
      // Already meditated today, streak unchanged
    } else if (stats.lastSessionDate === yesterday) {
      // Continued streak
      stats.currentStreak++;
    } else {
      // Streak broken
      stats.currentStreak = 1;
    }

    stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
    stats.lastSessionDate = today;
  }

  /**
   * Get yesterday's date in YYYY-MM-DD format
   * @returns {string} Yesterday's date
   */
  getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Get statistics
   * @returns {Object} Stats object
   */
  getStats() {
    return { ...this.data.stats };
  }

  /**
   * Get preferences
   * @returns {Object} Preferences object
   */
  getPreferences() {
    return { ...this.data.preferences };
  }

  /**
   * Set a single preference
   * @param {string} key - Preference key
   * @param {*} value - Preference value
   */
  setPreference(key, value) {
    this.data.preferences[key] = value;
    this.save();
  }

  /**
   * Set multiple preferences at once
   * @param {Object} prefs - Preferences object
   */
  setPreferences(prefs) {
    this.data.preferences = { ...this.data.preferences, ...prefs };
    this.save();
  }

  /**
   * Get sessions within date range
   * @param {number} days - Number of days back
   * @returns {Array} Sessions array
   */
  getRecentSessions(days = 7) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return this.data.sessions.filter(session => session.timestamp >= cutoff);
  }

  /**
   * Get sessions for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Array} Sessions array
   */
  getSessionsByDate(date) {
    return this.data.sessions.filter(session => session.date === date);
  }

  /**
   * Get total meditation minutes for a date range
   * @param {number} days - Number of days back
   * @returns {number} Total minutes
   */
  getTotalMinutes(days = 7) {
    const sessions = this.getRecentSessions(days);
    return sessions.reduce((total, session) => {
      return total + (session.completed ? Math.round(session.duration / 60) : 0);
    }, 0);
  }

  /**
   * Clean old sessions to free up space (keep last 90 days)
   */
  cleanOldSessions() {
    const cutoff = Date.now() - (90 * 24 * 60 * 60 * 1000);
    this.data.sessions = this.data.sessions.filter(session => session.timestamp >= cutoff);
  }

  /**
   * Get badge/level based on stats
   * @returns {Object} Badge info
   */
  getBadge() {
    const { currentStreak, totalSessions } = this.data.stats;

    if (currentStreak >= 90 || totalSessions >= 100) {
      return { icon: '🌸', key: 'bloom' };
    } else if (currentStreak >= 30 || totalSessions >= 40) {
      return { icon: '🌳', key: 'growth' };
    } else if (currentStreak >= 7 || totalSessions >= 8) {
      return { icon: '🌿', key: 'sprout' };
    } else {
      return { icon: '🌱', key: 'seed' };
    }
  }

  /**
   * Export data as JSON
   * @returns {string} JSON string
   */
  export() {
    return JSON.stringify(this.data, null, 2);
  }

  /**
   * Import data from JSON
   * @param {string} jsonString - JSON data
   * @returns {boolean} Success
   */
  import(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      this.data = this.mergeWithDefaults(imported);
      this.save();
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }

  /**
   * Reset all data
   */
  reset() {
    if (confirm('Opravdu chcete smazat všechna data? Tuto akci nelze vrátit zpět.')) {
      this.data = this.getDefault();
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Get calendar data for visualization
   * @param {number} days - Number of days
   * @returns {Array} Calendar data
   */
  getCalendarData(days = 30) {
    const calendar = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const daySessions = this.getSessionsByDate(dateStr);
      const completed = daySessions.filter(s => s.completed).length;
      const totalMinutes = daySessions.reduce((sum, s) => {
        return sum + (s.completed ? Math.round(s.duration / 60) : 0);
      }, 0);

      calendar.push({
        date: dateStr,
        sessions: completed,
        minutes: totalMinutes,
        hasActivity: completed > 0
      });
    }

    return calendar;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
