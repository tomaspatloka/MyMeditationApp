// Main Application Logic
class MeditationApp {
  constructor() {
    this.storage = null;
    this.i18n = null;
    this.timer = null;
    this.breathing = null;
    this.audio = null;

    this.currentView = 'timer';
    this.currentDuration = 600; // 10 minutes default

    this.version = '1.0.0';
    this.swRegistration = null;
    this.hasUpdate = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    console.log('[App] Initializing...');

    try {
      // Initialize modules
      this.storage = new StorageManager();
      this.i18n = new I18n();
      this.timer = new MeditationTimer();
      this.breathing = new BreathingExercise();
      this.audio = new MeditationAudio();

      // Make i18n globally available
      window.i18n = this.i18n;
      window.meditationAudio = this.audio;

      // Initialize i18n
      await this.i18n.init();

      // Register Service Worker
      await this.registerServiceWorker();

      // Initialize UI
      this.initUI();

      // Load preferences
      this.loadPreferences();

      // Setup event listeners
      this.setupEventListeners();

      // Update stats display
      this.updateStatsView();

      // Request notification permission if enabled
      this.checkNotificationPermission();

      // Display version
      this.displayVersion();

      console.log('[App] Initialization complete');
    } catch (error) {
      console.error('[App] Initialization error:', error);
    }
  }

  /**
   * Register Service Worker for PWA
   */
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js');
        this.swRegistration = registration;
        console.log('[App] Service Worker registered:', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[App] New version available');
              this.hasUpdate = true;
              this.showUpdateNotification();
            }
          });
        });

        // Check for waiting service worker
        if (registration.waiting) {
          this.hasUpdate = true;
          this.showUpdateNotification();
        }
      } catch (error) {
        console.error('[App] Service Worker registration failed:', error);
      }
    }
  }

  /**
   * Initialize UI components
   */
  initUI() {
    // Initialize breathing exercise with DOM elements
    this.breathing.init(
      document.getElementById('breathingCircle'),
      document.getElementById('breathingText'),
      document.getElementById('breathingTimer')
    );

    // Set initial breathing pattern info
    this.updateBreathingInfo();
  }

  /**
   * Load user preferences
   */
  loadPreferences() {
    const prefs = this.storage.getPreferences();

    // Apply language
    if (prefs.language !== this.i18n.getLocale()) {
      this.i18n.setLocale(prefs.language);
    }

    // Apply default duration
    this.currentDuration = prefs.defaultDuration;
    this.updateTimerDisplay(this.currentDuration);

    // Apply settings
    document.getElementById('settingsLang').value = prefs.language;
    document.getElementById('settingsBell').value = prefs.bellSound;
    document.getElementById('settingsKeepAwake').checked = prefs.keepAwake;

    // Store in localStorage for easy access
    localStorage.setItem('keepAwake', prefs.keepAwake);
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Navigation - Tab buttons
    document.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.switchView(view);
      });
    });

    // Close settings button (pokud existuje v overlay verzi)
    const closeSettingsBtn = document.getElementById('closeSettings');
    if (closeSettingsBtn) {
      closeSettingsBtn.addEventListener('click', () => {
        this.closeSettings();
      });
    }

    // Check for updates button
    const checkUpdateBtn = document.getElementById('checkUpdateBtn');
    if (checkUpdateBtn) {
      checkUpdateBtn.addEventListener('click', () => {
        this.checkForUpdates();
      });
    }

    // Force update button
    const forceUpdateBtn = document.getElementById('forceUpdateBtn');
    if (forceUpdateBtn) {
      forceUpdateBtn.addEventListener('click', () => {
        this.forceUpdate();
      });
    }

    // Timer duration buttons
    document.querySelectorAll('.duration-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentDuration = parseInt(e.target.dataset.duration);
        this.updateTimerDisplay(this.currentDuration);
      });
    });

    // Timer controls
    document.getElementById('timerStart').addEventListener('click', () => this.startTimer());
    document.getElementById('timerPause').addEventListener('click', () => this.pauseTimer());
    document.getElementById('timerResume').addEventListener('click', () => this.resumeTimer());
    document.getElementById('timerStop').addEventListener('click', () => this.stopTimer());

    // Audio controls
    document.querySelectorAll('input[name="bgSound"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.changeBgSound(e.target.value);
      });
    });

    document.getElementById('bgVolume').addEventListener('input', (e) => {
      const volume = e.target.value / 100;
      document.getElementById('volumeValue').textContent = `${e.target.value}%`;
      if (this.audio.isPlaying('background')) {
        this.audio.setVolume('background', volume);
      }
    });

    // Breathing controls
    document.getElementById('breathingPattern').addEventListener('change', () => {
      this.updateBreathingInfo();
    });

    document.getElementById('breathingStart').addEventListener('click', () => this.startBreathing());
    document.getElementById('breathingStop').addEventListener('click', () => this.stopBreathing());

    // Settings
    document.getElementById('settingsLang').addEventListener('change', (e) => {
      this.i18n.setLocale(e.target.value);
      this.storage.setPreference('language', e.target.value);
    });

    document.getElementById('settingsBell').addEventListener('change', (e) => {
      this.storage.setPreference('bellSound', e.target.value);
      localStorage.setItem('bellSound', e.target.value);
    });

    document.getElementById('settingsNotifications').addEventListener('change', (e) => {
      if (e.target.checked) {
        this.requestNotificationPermission();
      }
      this.storage.setPreference('notifications', e.target.checked);
    });

    document.getElementById('settingsKeepAwake').addEventListener('change', (e) => {
      this.storage.setPreference('keepAwake', e.target.checked);
      localStorage.setItem('keepAwake', e.target.checked);
    });

    // Timer callbacks
    this.timer.onTick = (time, progress) => {
      this.updateTimerProgress(time, progress);
    };

    this.timer.onComplete = () => {
      this.onTimerComplete();
    };

    // Unlock audio on first user interaction
    document.addEventListener('click', () => {
      this.audio.unlock();
    }, { once: true });
  }

  /**
   * Switch between views
   */
  switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });

    // Show selected view
    document.getElementById(`view-${viewName}`).classList.add('active');

    // Update tab buttons
    document.querySelectorAll('.tab').forEach(btn => {
      btn.classList.remove('active');
    });
    const activeTab = document.querySelector(`.tab[data-view="${viewName}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
    }

    this.currentView = viewName;

    // Update stats when switching to stats view
    if (viewName === 'stats') {
      this.updateStatsView();
    }
  }

  /**
   * Start meditation timer
   */
  async startTimer() {
    await this.audio.unlock();

    // Start timer
    this.timer.start(this.currentDuration);

    // Update UI
    document.getElementById('timerStart').classList.add('hidden');
    document.getElementById('timerPause').classList.remove('hidden');
    document.getElementById('timerStop').classList.remove('hidden');
    document.querySelector('.timer-circle').classList.add('running');

    // Start background sound if selected
    const bgSound = document.querySelector('input[name="bgSound"]:checked').value;
    if (bgSound !== 'none') {
      this.changeBgSound(bgSound);
    }
  }

  /**
   * Pause meditation timer
   */
  pauseTimer() {
    this.timer.pause();

    document.getElementById('timerPause').classList.add('hidden');
    document.getElementById('timerResume').classList.remove('hidden');

    // Pause background sound
    this.audio.stopAll(1);
  }

  /**
   * Resume meditation timer
   */
  resumeTimer() {
    this.timer.resume();

    document.getElementById('timerPause').classList.remove('hidden');
    document.getElementById('timerResume').classList.add('hidden');

    // Resume background sound
    const bgSound = document.querySelector('input[name="bgSound"]:checked').value;
    if (bgSound !== 'none') {
      this.changeBgSound(bgSound);
    }
  }

  /**
   * Stop meditation timer
   */
  stopTimer() {
    this.timer.stop();

    // Save partial session
    this.storage.addSession(this.currentDuration, false);

    // Reset UI
    this.resetTimerUI();

    // Stop all sounds
    this.audio.stopAll(2);
  }

  /**
   * Timer completion handler
   */
  onTimerComplete() {
    // Save completed session
    this.storage.addSession(this.currentDuration, true);

    // Reset UI
    this.resetTimerUI();

    // Stop background sound with fade
    this.audio.stopAll(3);

    // Update stats
    this.updateStatsView();
  }

  /**
   * Reset timer UI
   */
  resetTimerUI() {
    document.getElementById('timerStart').classList.remove('hidden');
    document.getElementById('timerPause').classList.add('hidden');
    document.getElementById('timerResume').classList.add('hidden');
    document.getElementById('timerStop').classList.add('hidden');
    document.querySelector('.timer-circle').classList.remove('running');

    this.updateTimerDisplay(this.currentDuration);
    this.updateTimerProgress(this.timer.formatTime(this.currentDuration * 1000), 0);
  }

  /**
   * Update timer display
   */
  updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('timerDisplay').textContent =
      `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Update timer progress
   */
  updateTimerProgress(time, progress) {
    document.getElementById('timerDisplay').textContent = time;

    // Update progress ring (radius 95 for 220px circle)
    const circle = document.querySelector('.progress-ring-fill');
    const radius = 95;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - progress);
    circle.style.strokeDashoffset = offset;
  }

  /**
   * Change background sound
   */
  async changeBgSound(soundName) {
    await this.audio.unlock();

    // Stop current sound
    if (this.audio.isPlaying('background')) {
      this.audio.stopTrack('background', 1);
    }

    if (soundName === 'none') return;

    // For MVP, we'll generate ambient sounds with Web Audio
    // In production, you would load actual audio files here
    console.log(`[App] Background sound: ${soundName}`);

    const volume = document.getElementById('bgVolume').value / 100;
    this.storage.setPreference('backgroundSound', soundName);
    this.storage.setPreference('backgroundVolume', volume);
  }

  /**
   * Start breathing exercise
   */
  async startBreathing() {
    const pattern = document.getElementById('breathingPattern').value;

    document.getElementById('breathingStart').classList.add('hidden');
    document.getElementById('breathingStop').classList.remove('hidden');

    await this.breathing.start(pattern);
  }

  /**
   * Stop breathing exercise
   */
  stopBreathing() {
    this.breathing.stop();

    document.getElementById('breathingStart').classList.remove('hidden');
    document.getElementById('breathingStop').classList.add('hidden');
  }

  /**
   * Update breathing pattern info
   */
  updateBreathingInfo() {
    const pattern = document.getElementById('breathingPattern').value;
    const info = this.breathing.getPatternInfo(pattern);

    if (info) {
      document.getElementById('breathingDescription').textContent = info.description;
    }
  }

  /**
   * Update statistics view
   */
  updateStatsView() {
    const stats = this.storage.getStats();
    const badge = this.storage.getBadge();

    document.getElementById('statStreak').textContent = stats.currentStreak;
    document.getElementById('statSessions').textContent = stats.totalSessions;
    document.getElementById('statMinutes').textContent = stats.totalMinutes;
    document.getElementById('statLongest').textContent = stats.longestStreak;

    document.getElementById('badgeIcon').textContent = badge.icon;
    document.getElementById('badgeName').textContent = badge.name;
    document.getElementById('badgeDesc').textContent = badge.desc;
  }

  /**
   * Check and request notification permission
   */
  checkNotificationPermission() {
    if ('Notification' in window) {
      const prefs = this.storage.getPreferences();
      document.getElementById('settingsNotifications').checked =
        Notification.permission === 'granted' && prefs.notifications;
    } else {
      document.getElementById('settingsNotifications').disabled = true;
    }
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('[App] Notification permission granted');
      }
    }
  }

  /**
   * Display version in UI
   */
  displayVersion() {
    const versionElements = document.querySelectorAll('#appVersion, #settingsVersion');
    versionElements.forEach(el => {
      if (el) el.textContent = `v${this.version}`;
    });
  }

  /**
   * Show update notification
   */
  showUpdateNotification() {
    const updateStatus = document.getElementById('updateStatus');
    const updateMessage = document.getElementById('updateMessage');
    const forceUpdateBtn = document.getElementById('forceUpdateBtn');

    if (updateStatus && updateMessage && forceUpdateBtn) {
      updateStatus.classList.remove('hidden');
      updateStatus.classList.add('warning');
      updateMessage.textContent = 'Je dostupná nová verze aplikace!';
      forceUpdateBtn.classList.remove('hidden');
    }
  }

  /**
   * Check for updates manually
   */
  async checkForUpdates() {
    const updateStatus = document.getElementById('updateStatus');
    const updateMessage = document.getElementById('updateMessage');
    const forceUpdateBtn = document.getElementById('forceUpdateBtn');

    // Show checking status
    updateStatus.classList.remove('hidden');
    updateStatus.classList.remove('success', 'warning');
    updateMessage.textContent = 'Kontroluji aktualizace...';

    try {
      if (this.swRegistration) {
        await this.swRegistration.update();

        // Wait a bit to check if update was found
        setTimeout(() => {
          if (this.hasUpdate) {
            updateStatus.classList.add('warning');
            updateMessage.textContent = 'Je dostupná nová verze!';
            forceUpdateBtn.classList.remove('hidden');
          } else {
            updateStatus.classList.add('success');
            updateMessage.textContent = 'Máte nejnovější verzi aplikace';
            forceUpdateBtn.classList.add('hidden');
          }
        }, 1000);
      } else {
        updateStatus.classList.add('success');
        updateMessage.textContent = 'Service Worker není dostupný';
      }
    } catch (error) {
      console.error('[App] Update check failed:', error);
      updateStatus.classList.remove('success', 'warning');
      updateMessage.textContent = 'Chyba při kontrole aktualizací';
    }
  }

  /**
   * Force update application
   */
  forceUpdate() {
    if (this.swRegistration && this.swRegistration.waiting) {
      // Send message to waiting service worker to skip waiting
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Reload page when new service worker takes control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    } else {
      // Just reload if no waiting worker
      window.location.reload();
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new MeditationApp();
    app.init();
  });
} else {
  const app = new MeditationApp();
  app.init();
}
