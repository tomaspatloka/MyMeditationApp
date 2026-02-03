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
      window.showNotification = this.showInAppNotification.bind(this);
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

      // Setup global error handler
      this.setupGlobalErrorHandler();

      console.log('[App] Initialization complete');
    } catch (error) {
      console.error('[App] Initialization error:', error);
      this.showInAppNotification(
        'Chyba inicializace',
        'Aplikace se nepodařilo správně načíst. Zkuste obnovit stránku.',
        'error'
      );
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

    // Initialize SVG progress ring
    const progressRing = document.querySelector('.progress-ring-fill');
    if (progressRing) {
      const radius = 95;
      const circumference = 2 * Math.PI * radius;
      progressRing.style.strokeDasharray = circumference;
      progressRing.style.strokeDashoffset = circumference;
    }
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

    // Apply theme
    const lightMode = prefs.lightMode || false;
    document.getElementById('settingsTheme').checked = lightMode;
    if (lightMode) {
      document.body.classList.add('light-mode');
    }

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

    document.getElementById('settingsTheme').addEventListener('change', (e) => {
      this.toggleTheme(e.target.checked);
    });

    // Background sound controls
    document.querySelectorAll('input[name="bgSound"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.changeBgSound(e.target.value);
        }
      });
    });

    // Volume control
    const volumeSlider = document.getElementById('bgVolume');
    const volumeValue = document.getElementById('volumeValue');

    volumeSlider.addEventListener('input', (e) => {
      const volume = e.target.value;
      volumeValue.textContent = `${volume}%`;

      // Update volume if audio is playing
      if (this.audio.isPlaying('background')) {
        this.audio.setVolume('background', volume / 100);
      }

      this.storage.setPreference('backgroundVolume', volume / 100);
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
   * Toggle between light and dark theme
   */
  toggleTheme(enabled) {
    document.body.classList.add('theme-switching');

    if (enabled) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }

    const themeColor = enabled ? '#fdfbff' : '#16213e';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);

    this.storage.setPreference('lightMode', enabled);

    setTimeout(() => {
      document.body.classList.remove('theme-switching');
    }, 300);
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

    // Load and play audio file
    console.log(`[App] Background sound: ${soundName}`);

    const volume = document.getElementById('bgVolume').value / 100;

    // Map sound names to audio files
    const audioFiles = {
      'meditation': './audio/meditation.mp3',
      'rain': './audio/rain.mp3',
      'ocean': './audio/ocean.mp3',
      'forest': './audio/forest.mp3'
    };

    const audioFile = audioFiles[soundName];
    if (audioFile) {
      try {
        await this.audio.loadTrack('background', audioFile);
        this.audio.playTrack('background', { loop: true, volume: volume, fadeIn: 2 });

        // Save preferences on success
        this.storage.setPreference('backgroundSound', soundName);
        this.storage.setPreference('backgroundVolume', volume);
      } catch (error) {
        console.error(`[App] Error loading ${soundName}:`, error);

        // Show user-friendly error message
        this.showInAppNotification(
          'Nepodařilo se přehrát audio',
          `Soubor ${soundName}.mp3 není dostupný. Zkuste jiný zvuk.`,
          'warning'
        );

        // Reset selection to "none"
        document.querySelector('input[name="bgSound"][value="none"]').checked = true;
      }
    }
  }

  /**
   * Show in-app notification
   */
  showInAppNotification(title, message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.in-app-notification').forEach(n => n.remove());

    const notificationEl = document.createElement('div');
    notificationEl.className = `in-app-notification ${type}`;

    const icons = {
      success: 'check_circle',
      warning: 'warning',
      error: 'error',
      info: 'info'
    };

    notificationEl.innerHTML = `
      <span class="material-symbols-outlined">${icons[type] || 'info'}</span>
      <div>
        <strong>${title}</strong>
        ${message ? `<p>${message}</p>` : ''}
      </div>
    `;

    document.body.appendChild(notificationEl);

    // Add CSS class for animation
    setTimeout(() => notificationEl.classList.add('show'), 10);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notificationEl.classList.remove('show');
      setTimeout(() => notificationEl.remove(), 300);
    }, 5000);

    // Click to dismiss
    notificationEl.addEventListener('click', () => {
      notificationEl.classList.remove('show');
      setTimeout(() => notificationEl.remove(), 300);
    });
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

    const previousStats = JSON.parse(localStorage.getItem('previousStats') || '{}');

    // Update stat values with animation
    this.updateStatValue('statStreak', stats.currentStreak);
    this.updateStatValue('statSessions', stats.totalSessions);
    this.updateStatValue('statMinutes', stats.totalMinutes);
    this.updateStatValue('statLongest', stats.longestStreak);

    // Update trends
    this.updateStatTrend('statStreakTrend', stats.currentStreak, previousStats.currentStreak);
    this.updateStatTrend('statSessionsTrend', stats.totalSessions, previousStats.totalSessions);
    this.updateStatTrend('statMinutesTrend', stats.totalMinutes, previousStats.totalMinutes);
    this.updateStatTrend('statLongestTrend', stats.longestStreak, previousStats.longestStreak);

    localStorage.setItem('previousStats', JSON.stringify({
      currentStreak: stats.currentStreak,
      totalSessions: stats.totalSessions,
      totalMinutes: stats.totalMinutes,
      longestStreak: stats.longestStreak
    }));

    document.getElementById('badgeIcon').textContent = badge.icon;
    document.getElementById('badgeName').textContent = badge.name;
    document.getElementById('badgeDesc').textContent = badge.desc;

    // Render visualizations
    this.renderWeeklyChart();
    this.renderCalendarHeatmap();
  }

  /**
   * Update stat value with animation
   */
  updateStatValue(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.classList.add('updating');
    element.textContent = newValue;

    setTimeout(() => element.classList.remove('updating'), 500);
  }

  /**
   * Update stat trend indicator
   */
  updateStatTrend(elementId, newValue, oldValue) {
    const element = document.getElementById(elementId);
    if (!element || oldValue === undefined) {
      if (element) element.innerHTML = '';
      return;
    }

    const diff = newValue - oldValue;

    if (diff > 0) {
      element.className = 'stat-trend up';
      element.innerHTML = `↑ +${diff}`;
    } else if (diff < 0) {
      element.className = 'stat-trend down';
      element.innerHTML = `↓ ${diff}`;
    } else {
      element.className = 'stat-trend neutral';
      element.innerHTML = '—';
    }
  }

  /**
   * Get weekly data for chart
   */
  getWeeklyData() {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const sessions = this.storage.data.sessions.filter(s =>
        s.date === dateStr && s.completed
      );

      const totalMinutes = sessions.reduce((sum, s) =>
        sum + Math.round(s.duration / 60), 0
      );

      const dayName = date.toLocaleDateString(this.i18n.getLocale(), { weekday: 'short' });

      days.push({
        date: dateStr,
        label: dayName,
        minutes: totalMinutes,
        sessions: sessions.length
      });
    }

    return days;
  }

  /**
   * Render weekly progress bar chart using SVG
   */
  renderWeeklyChart() {
    const container = document.getElementById('weeklyChart');
    if (!container) return;

    const weekData = this.getWeeklyData();
    const today = new Date().toISOString().split('T')[0];

    // Ensure minimum width to prevent negative values
    const containerWidth = container.parentElement.clientWidth;
    const width = Math.max(containerWidth - 16, 200);
    const height = 200;
    const padding = { top: 20, right: 10, bottom: 30, left: 30 };
    const chartWidth = Math.max(width - padding.left - padding.right, 100);
    const chartHeight = Math.max(height - padding.top - padding.bottom, 100);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    const maxMinutes = Math.max(...weekData.map(d => d.minutes), 10);

    // Grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', padding.left);
      line.setAttribute('y1', y);
      line.setAttribute('x2', width - padding.right);
      line.setAttribute('y2', y);
      line.setAttribute('class', 'chart-grid');
      svg.appendChild(line);
    }

    // Bars - ensure positive values
    const barWidth = Math.max(chartWidth / weekData.length, 10);
    const barGap = Math.min(barWidth * 0.2, 2);
    const actualBarWidth = Math.max(barWidth - barGap, 5);

    weekData.forEach((day, index) => {
      const barHeight = (day.minutes / maxMinutes) * chartHeight;
      const x = padding.left + (index * barWidth) + (barGap / 2);
      const y = height - padding.bottom - barHeight;

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', actualBarWidth);
      rect.setAttribute('height', barHeight);
      rect.setAttribute('class', 'chart-bar');
      rect.setAttribute('rx', '4');

      if (day.date === today) {
        rect.classList.add('today');
      }

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${day.label}: ${day.minutes} min`;
      rect.appendChild(title);
      svg.appendChild(rect);

      // Value label
      if (day.minutes > 0) {
        const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        valueLabel.setAttribute('x', x + actualBarWidth / 2);
        valueLabel.setAttribute('y', y - 4);
        valueLabel.setAttribute('text-anchor', 'middle');
        valueLabel.setAttribute('class', 'chart-value');
        valueLabel.textContent = day.minutes;
        svg.appendChild(valueLabel);
      }

      // Day label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', x + actualBarWidth / 2);
      label.setAttribute('y', height - 10);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('class', 'chart-label');
      label.textContent = day.label;
      svg.appendChild(label);
    });

    container.innerHTML = '';
    container.appendChild(svg);
  }

  /**
   * Render 30-day calendar heatmap
   */
  renderCalendarHeatmap() {
    const container = document.getElementById('calendarHeatmap');
    if (!container) return;

    const calendarData = this.storage.getCalendarData(30);
    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = '';

    calendarData.forEach(day => {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';

      // Calculate intensity level (0-4)
      let level = 0;
      if (day.minutes === 0) level = 0;
      else if (day.minutes <= 10) level = 1;
      else if (day.minutes <= 20) level = 2;
      else if (day.minutes <= 30) level = 3;
      else level = 4;

      dayEl.classList.add(`level-${level}`);

      if (day.date === today) {
        dayEl.classList.add('today');
      }

      // Tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'calendar-tooltip';
      const date = new Date(day.date);
      const dateStr = date.toLocaleDateString(this.i18n.getLocale(), { month: 'short', day: 'numeric' });
      tooltip.textContent = day.minutes === 0
        ? `${dateStr}: Bez aktivity`
        : `${dateStr}: ${day.minutes} min (${day.sessions} sezení)`;

      dayEl.appendChild(tooltip);
      container.appendChild(dayEl);
    });
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

  /**
   * Setup global error handler
   */
  setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      console.error('[Global Error]', event.error);

      // Filter out common non-critical errors
      const ignoredErrors = ['ResizeObserver', 'Non-Error promise rejection'];
      const shouldIgnore = ignoredErrors.some(err =>
        event.error && event.error.message && event.error.message.includes(err)
      );

      if (!shouldIgnore && event.error && event.error.message) {
        this.showInAppNotification(
          'Došlo k chybě',
          'Aplikace narazila na problém. Zkuste obnovit stránku.',
          'error'
        );
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('[Unhandled Promise Rejection]', event.reason);

      if (event.reason && event.reason.message) {
        this.showInAppNotification(
          'Chyba při zpracování',
          'Některá operace selhala. Zkuste to znovu.',
          'warning'
        );
      }
    });
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
