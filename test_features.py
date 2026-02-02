#!/usr/bin/env python3
"""
Kontrola funkcí meditační aplikace
Testuje všechny implementované features
"""

import os
import sys
import json

# Nastavení kódování pro Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def check_file_exists(path):
    """Zkontroluje existenci souboru"""
    return os.path.exists(path)

def read_file(path):
    """Přečte obsah souboru"""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except:
        return None

def check_in_file(path, search_strings):
    """Zkontroluje zda soubor obsahuje hledané řetězce"""
    content = read_file(path)
    if not content:
        return False
    return all(s in content for s in search_strings)

class FeatureChecker:
    def __init__(self):
        self.results = {
            'passed': [],
            'failed': [],
            'warnings': []
        }

    def test(self, name, condition, warning=False):
        """Zaznamenání testu"""
        if condition:
            self.results['passed'].append(name)
            print(f"✅ {name}")
            return True
        else:
            if warning:
                self.results['warnings'].append(name)
                print(f"⚠️  {name}")
            else:
                self.results['failed'].append(name)
                print(f"❌ {name}")
            return False

    def print_summary(self):
        """Výpis souhrnu"""
        total = len(self.results['passed']) + len(self.results['failed']) + len(self.results['warnings'])
        passed = len(self.results['passed'])
        failed = len(self.results['failed'])
        warnings = len(self.results['warnings'])

        print("\n" + "="*60)
        print("📊 SOUHRN TESTŮ")
        print("="*60)
        print(f"✅ Úspěšné: {passed}/{total} ({passed/total*100:.1f}%)")
        print(f"❌ Neúspěšné: {failed}/{total}")
        print(f"⚠️  Varování: {warnings}/{total}")

        if failed > 0:
            print("\n❌ Selhané testy:")
            for test in self.results['failed']:
                print(f"   • {test}")

        if warnings > 0:
            print("\n⚠️  Varování:")
            for test in self.results['warnings']:
                print(f"   • {test}")

        print("\n" + "="*60)

        # Skóre
        score = (passed / total * 100) if total > 0 else 0
        if score >= 90:
            print("🏆 VÝBORNÉ! Aplikace je připravena k nasazení")
        elif score >= 75:
            print("👍 DOBRÉ! Několik drobností k doplnění")
        elif score >= 50:
            print("⚠️  POTŘEBUJE PRÁCI - více funkcí nefunguje")
        else:
            print("❌ KRITICKÉ - většina funkcí nefunguje")

def main():
    print("🧘 KONTROLA FUNKCÍ MEDITAČNÍ APLIKACE")
    print("="*60)

    checker = FeatureChecker()

    # === CORE FILES ===
    print("\n📁 ZÁKLADNÍ SOUBORY:")
    checker.test("index.html existuje", check_file_exists('index.html'))
    checker.test("manifest.json existuje", check_file_exists('manifest.json'))
    checker.test("sw.js (Service Worker) existuje", check_file_exists('sw.js'))
    checker.test("version.json existuje", check_file_exists('version.json'))

    # === CSS FILES ===
    print("\n🎨 CSS SOUBORY:")
    checker.test("css/styles.css existuje", check_file_exists('css/styles.css'))
    checker.test("css/timer.css existuje", check_file_exists('css/timer.css'))
    checker.test("css/breathing.css existuje", check_file_exists('css/breathing.css'))

    # === JAVASCRIPT FILES ===
    print("\n📜 JAVASCRIPT MODULY:")
    checker.test("js/app.js existuje", check_file_exists('js/app.js'))
    checker.test("js/timer.js existuje", check_file_exists('js/timer.js'))
    checker.test("js/audio.js existuje", check_file_exists('js/audio.js'))
    checker.test("js/breathing.js existuje", check_file_exists('js/breathing.js'))
    checker.test("js/storage.js existuje", check_file_exists('js/storage.js'))
    checker.test("js/i18n.js existuje", check_file_exists('js/i18n.js'))

    # === LOCALES ===
    print("\n🌍 LOKALIZACE:")
    checker.test("locales/cs.json existuje", check_file_exists('locales/cs.json'))
    checker.test("locales/en.json existuje", check_file_exists('locales/en.json'))

    # === ICONS ===
    print("\n🎯 IKONY:")
    checker.test("icons/icon-72.png existuje", check_file_exists('icons/icon-72.png'), warning=True)
    checker.test("icons/icon-192.png existuje", check_file_exists('icons/icon-192.png'), warning=True)

    # === AUDIO FILES ===
    print("\n🎵 AUDIO SOUBORY:")
    checker.test("audio/rain.mp3 existuje", check_file_exists('audio/rain.mp3'), warning=True)
    checker.test("audio/ocean.mp3 existuje", check_file_exists('audio/ocean.mp3'), warning=True)
    checker.test("audio/forest.mp3 existuje", check_file_exists('audio/forest.mp3'), warning=True)
    checker.test("audio/bell.mp3 existuje", check_file_exists('audio/bell.mp3'), warning=True)

    # === HTML FEATURES ===
    print("\n📄 HTML FUNKCE:")
    checker.test("Material Design 3 struktura", check_in_file('index.html', ['app-container', 'app-bar', 'tabs-container']))
    checker.test("Google Material Symbols", check_in_file('index.html', ['material-symbols-outlined', 'fonts.googleapis.com']))
    checker.test("Bottom Navigation", check_in_file('index.html', ['tabs-bottom', 'data-view="timer"', 'data-view="settings"']))
    checker.test("Timer view", check_in_file('index.html', ['view-timer', 'timer-circle', 'progress-ring']))
    checker.test("Breathing view", check_in_file('index.html', ['view-breathing', 'breathing-circle']))
    checker.test("Stats view", check_in_file('index.html', ['view-stats', 'stat-card']))
    checker.test("Settings view", check_in_file('index.html', ['view-settings', 'settings-container']))
    checker.test("Version badge", check_in_file('index.html', ['app-version-badge', 'appVersion']))
    checker.test("Update controls", check_in_file('index.html', ['checkUpdateBtn', 'forceUpdateBtn', 'updateStatus']))

    # === CSS FEATURES ===
    print("\n🎨 CSS FUNKCE:")
    checker.test("MD3 Dark Theme", check_in_file('css/styles.css', ['--md-sys-color-primary: #667eea', '--md-sys-color-background: #1a1a2e']))
    checker.test("Light Mode support", check_in_file('css/styles.css', ['body.light-mode']))
    checker.test("Bottom tabs styling", check_in_file('css/styles.css', ['.tabs-bottom', 'position: fixed', 'bottom: 0']))
    checker.test("Update status styling", check_in_file('css/styles.css', ['.update-status', '.update-status.success', '.update-status.warning']))
    checker.test("Timer center alignment", check_in_file('css/timer.css', ['transform: translate(-50%, -50%)', 'margin: 0 auto']))

    # === JAVASCRIPT FEATURES ===
    print("\n⚙️ JAVASCRIPT FUNKCE:")
    checker.test("Verzování v app.js", check_in_file('js/app.js', ['this.version = ', 'displayVersion()']))
    checker.test("Service Worker registrace", check_in_file('js/app.js', ['registerServiceWorker', 'this.swRegistration']))
    checker.test("Update detection", check_in_file('js/app.js', ['this.hasUpdate', 'showUpdateNotification']))
    checker.test("Force update funkce", check_in_file('js/app.js', ['forceUpdate()', 'SKIP_WAITING']))
    checker.test("Check updates funkce", check_in_file('js/app.js', ['checkForUpdates()', 'swRegistration.update']))
    checker.test("Navigation handling", check_in_file('js/app.js', ['switchView', 'openSettings', 'closeSettings']))
    checker.test("Timer funkce", check_in_file('js/timer.js', ['MeditationTimer', 'start', 'pause', 'resume']))
    checker.test("Audio manager", check_in_file('js/audio.js', ['MeditationAudio', 'Web Audio']))
    checker.test("Breathing exercises", check_in_file('js/breathing.js', ['BreathingExercise', 'box', '478']))
    checker.test("Storage manager", check_in_file('js/storage.js', ['StorageManager', 'localStorage']))
    checker.test("i18n support", check_in_file('js/i18n.js', ['I18n', 'setLocale']))

    # === SERVICE WORKER ===
    print("\n🔧 SERVICE WORKER:")
    checker.test("SW version constant", check_in_file('sw.js', ['const VERSION =']))
    checker.test("SW cache name", check_in_file('sw.js', ['meditation-v']))
    checker.test("SW SKIP_WAITING handler", check_in_file('sw.js', ['SKIP_WAITING', 'self.skipWaiting']))
    checker.test("SW precache assets", check_in_file('sw.js', ['PRECACHE_ASSETS', 'version.json']))

    # === VERSION.JSON ===
    print("\n📋 VERSION INFO:")
    if check_file_exists('version.json'):
        try:
            with open('version.json', 'r', encoding='utf-8') as f:
                version_data = json.load(f)
            checker.test("version.json má version", 'version' in version_data)
            checker.test("version.json má buildDate", 'buildDate' in version_data)
            checker.test("version.json má changelog", 'changelog' in version_data)
        except:
            checker.test("version.json je validní JSON", False)

    # === MANIFEST ===
    print("\n📱 PWA MANIFEST:")
    if check_file_exists('manifest.json'):
        try:
            with open('manifest.json', 'r', encoding='utf-8') as f:
                manifest = json.load(f)
            checker.test("manifest má name", 'name' in manifest)
            checker.test("manifest má icons", 'icons' in manifest)
            checker.test("manifest má start_url", 'start_url' in manifest)
            checker.test("manifest má display", 'display' in manifest)
        except:
            checker.test("manifest.json je validní JSON", False)

    # === LOCALIZATION ===
    print("\n🌐 LOKALIZACE:")
    if check_file_exists('locales/cs.json'):
        try:
            with open('locales/cs.json', 'r', encoding='utf-8') as f:
                cs = json.load(f)
            checker.test("CZ má settings translations", 'settings' in cs)
            checker.test("CZ má checkUpdate/forceUpdate", 'checkUpdate' in cs.get('settings', {}))
        except:
            checker.test("cs.json je validní JSON", False)

    # Print summary
    checker.print_summary()

    # === DOPORUČENÍ ===
    print("\n💡 DOPORUČENÍ PRO VYLEPŠENÍ:")
    print("="*60)

    recommendations = []

    # Audio soubory
    if not all([
        check_file_exists('audio/rain.mp3'),
        check_file_exists('audio/ocean.mp3'),
        check_file_exists('audio/forest.mp3')
    ]):
        recommendations.append({
            'priority': '🔴 VYSOKÁ',
            'title': 'Stáhnout audio soubory',
            'description': 'Aplikace nemá ambient zvuky. Viz AUDIO_NAVOD.md',
            'files': ['audio/rain.mp3', 'audio/ocean.mp3', 'audio/forest.mp3', 'audio/bell.mp3']
        })

    # Ikony
    if not check_file_exists('icons/icon-512.png'):
        recommendations.append({
            'priority': '🟡 STŘEDNÍ',
            'title': 'Přidat větší ikony',
            'description': 'Pro PWA doporučujeme ikonu 512x512',
            'files': ['icons/icon-512.png']
        })

    # Favicon
    if not check_file_exists('favicon.ico'):
        recommendations.append({
            'priority': '🟡 STŘEDNÍ',
            'title': 'Přidat favicon.ico',
            'description': 'Pro lepší zobrazení v browseru',
            'files': ['favicon.ico']
        })

    # Dokumentace
    recommendations.append({
        'priority': '🟢 NÍZKÁ',
        'title': 'README aktualizace',
        'description': 'Aktualizovat README s novými features (bottom nav, versioning, force update)',
        'files': ['README.md']
    })

    # Testy
    recommendations.append({
        'priority': '🟡 STŘEDNÍ',
        'title': 'End-to-end testy',
        'description': 'Přidat automatické testy UI (Playwright/Cypress)',
        'files': ['tests/']
    })

    # Analytics
    recommendations.append({
        'priority': '🟢 NÍZKÁ',
        'title': 'Analytics integrace',
        'description': 'Sledování použití (Google Analytics, Plausible, nebo simple vlastní)',
        'files': ['js/analytics.js']
    })

    # Dark/Light toggle
    recommendations.append({
        'priority': '🟡 STŘEDNÍ',
        'title': 'Dark/Light mode přepínač',
        'description': 'Tlačítko pro přepínání mezi dark a light režimem',
        'files': ['js/theme.js']
    })

    # Export dat
    recommendations.append({
        'priority': '🟢 NÍZKÁ',
        'title': 'Export/Import dat',
        'description': 'Možnost exportovat statistiky a importovat ze zálohy',
        'files': ['js/export.js']
    })

    # Lepší audio fallback
    recommendations.append({
        'priority': '🟡 STŘEDNÍ',
        'title': 'Generované ambient zvuky',
        'description': 'Web Audio API generované zvuky jako fallback (pink noise pro déšť, apod.)',
        'files': ['js/audio-generator.js']
    })

    # Haptic feedback
    recommendations.append({
        'priority': '🟢 NÍZKÁ',
        'title': 'Haptic feedback',
        'description': 'Vibrace při dokončení meditace (Navigator.vibrate)',
        'files': ['js/haptics.js']
    })

    # Print recommendations
    for i, rec in enumerate(recommendations, 1):
        print(f"\n{i}. {rec['priority']} - {rec['title']}")
        print(f"   📝 {rec['description']}")
        print(f"   📁 Soubory: {', '.join(rec['files'])}")

    print("\n" + "="*60)
    print("✨ KONEC KONTROLY")
    print("="*60)

if __name__ == '__main__':
    main()
