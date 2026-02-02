# Meditační PWA Aplikace

Moderní Progressive Web App (PWA) pro meditaci, dechová cvičení a mindfulness praxi. Aplikace je optimalizovaná pro mobilní zařízení (Android/iOS) a funguje offline.

## Funkce

### ✨ Hlavní funkce
- **Meditační Timer** - nastavitelná délka (5-30 minut)
- **Dechová cvičení** - 4 techniky s animovaným průvodcem
  - Box Breathing (4-4-4-4)
  - Relaxační dech (4-7-8)
  - Jednoduché dýchání (5.5-5.5)
  - Bhramari (včelí dech)
- **Statistiky** - sledování pokroku, streak systém, badge odznaky
- **Dark Mode** - příjemné tmavé téma pro večerní praxi
- **Offline funkcionalita** - plná funkčnost bez internetu

### 🎯 Pokročilé funkce
- Progressive Web App (instalovatelná jako nativní aplikace)
- Service Worker pro offline režim
- Wake Lock API - udržení displeje aktivního během meditace
- Notifikace při dokončení sezení
- Vícejazyčnost (Čeština/English)
- LocalStorage pro ukládání pokroku
- Responzivní design optimalizovaný pro Android

## Technologie

- **HTML5** - sémantická struktura
- **CSS3** - moderní styly, animace, gradients
- **Vanilla JavaScript** - žádné závislosti, maximální rychlost
- **Service Worker** - offline-first strategie
- **Web Audio API** - pro zvuky a audio management
- **Wake Lock API** - udržení displeje aktivního
- **Notification API** - upozornění po dokončení

## Instalace a spuštění

### Lokální vývoj

```bash
# Naklonovat nebo stáhnout projekt
cd MyMeditationApp

# Spustit lokální server (například pomocí Python)
python -m http.server 8000
# nebo pomocí Node.js
npx serve

# Otevřít v prohlížeči
http://localhost:8000
```

### Požadavky
- Moderní webový prohlížeč (Chrome 90+, Firefox 88+, Safari 14+)
- Pro PWA funkce: HTTPS nebo localhost
- Pro notifikace: povolení notifikací v prohlížeči

## Deployment na Cloudflare Pages

### Krok 1: Vytvoření GitHub repozitáře

```bash
git init
git add .
git commit -m "Initial commit: Meditation PWA"
git branch -M main
git remote add origin <vaše-github-repo-url>
git push -u origin main
```

### Krok 2: Deploy na Cloudflare Pages

1. Přihlaste se na [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigujte na **Pages** → **Create a project**
3. Připojte svůj GitHub repozitář
4. Nastavení buildu:
   - **Build command:** (prázdné)
   - **Build output directory:** `/` nebo `.`
5. Klikněte na **Save and Deploy**

Aplikace bude dostupná na: `https://vase-aplikace.pages.dev`

### Krok 3: Vlastní doména (volitelné)

1. Pages → Custom domains → Add
2. Přidejte svou doménu
3. Nastavte CNAME záznam u svého DNS poskytovatele

## Přidání ikon

Před deploymentem je potřeba vytvořit ikony. Postupujte podle instrukcí v `icons/README.md`:

```bash
# Možnost 1: Online nástroj
# Navštivte https://realfavicongenerator.net/

# Možnost 2: ImageMagick
magick convert icons/icon.svg -resize 72x72 icons/icon-72.png
magick convert icons/icon.svg -resize 128x128 icons/icon-128.png
magick convert icons/icon.svg -resize 192x192 icons/icon-192.png
magick convert icons/icon.svg -resize 512x512 icons/icon-512.png
magick convert icons/icon.svg -resize 410x410 -gravity center -extent 512x512 icons/icon-maskable.png
```

## Struktura projektu

```
meditation-pwa/
├── index.html              # Hlavní HTML soubor
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── _headers                # Cloudflare headers
├── README.md              # Tento soubor
├── css/
│   ├── styles.css         # Hlavní styly
│   ├── timer.css          # Timer komponenta
│   └── breathing.css      # Dechová cvičení
├── js/
│   ├── app.js             # Hlavní aplikační logika
│   ├── timer.js           # Timer modul
│   ├── audio.js           # Audio management
│   ├── breathing.js       # Dechová cvičení
│   ├── storage.js         # LocalStorage wrapper
│   └── i18n.js            # Lokalizace CZ/EN
├── icons/
│   ├── icon.svg           # Zdrojová SVG ikona
│   ├── icon-72.png        # 72x72px
│   ├── icon-128.png       # 128x128px
│   ├── icon-192.png       # 192x192px
│   ├── icon-512.png       # 512x512px
│   └── icon-maskable.png  # 512x512px maskable
├── locales/
│   ├── cs.json            # České překlady
│   └── en.json            # Anglické překlady
└── audio/                 # Složka pro audio soubory (volitelné)
```

## Přidání audio souborů (volitelné)

Pro plnou funkcionalitu můžete přidat meditační zvuky:

### Doporučené zdroje (CC0 licence):
- **Freesound.org** - tibetské mísy, zvonky
- **BigSoundBank** - přírodní zvuky
- **Internet Archive** - déšť, les, oceán
- **Pixabay** - meditační hudba

### Struktura audio složky:
```
audio/
├── bells/          # Zvonky, tibetské mísy
├── ambient/        # Ambient hudba
├── nature/         # Přírodní zvuky (déšť, oceán, les)
└── binaural/       # Binaurální beaty
```

## Testování PWA

### Desktop (Chrome/Edge)
1. Otevřete DevTools (F12)
2. Záložka **Application**
3. Zkontrolujte:
   - Manifest
   - Service Worker
   - Storage

### Android
1. Otevřete aplikaci v Chrome
2. Menu → **Add to Home Screen**
3. Aplikace se nainstaluje jako nativní

### Lighthouse Audit
```bash
# Chrome DevTools → Lighthouse
# Spusťte audit pro:
- Performance
- PWA
- Accessibility
```

## Vývoj a rozšíření

### Přidání nové dechové techniky

V `js/breathing.js`:

```javascript
this.patterns = {
  // ... existující techniky
  myTechnique: {
    name: 'Název techniky',
    description: 'Popis techniky',
    inhale: 4,
    hold: 0,
    exhale: 6,
    holdOut: 0
  }
};
```

### Přidání nového jazyka

1. Vytvořte `locales/xx.json` s překlady
2. V `js/i18n.js` přidejte jazyk do `getAvailableLocales()`
3. Aktualizujte `<select>` v nastavení

### Přidání statistik

V `js/storage.js` upravte `getStats()` a `updateStats()`:

```javascript
stats: {
  totalSessions: 0,
  totalMinutes: 0,
  currentStreak: 0,
  longestStreak: 0,
  // Přidejte vlastní statistiku
  customStat: 0
}
```

## Optimalizace pro Android

Aplikace je optimalizovaná pro Android:

- ✅ Portrait orientace
- ✅ Status bar integrace
- ✅ Safe area (notch support)
- ✅ Touch-optimalizované ovládání
- ✅ Haptic feedback (vibrace)
- ✅ Full screen režim
- ✅ Offline first

## Bezpečnost

- X-Frame-Options: DENY
- Content Security Policy
- HTTPS required (kromě localhost)
- Bez externích závislostí

## Prohlížeč kompatibilita

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Service Worker | ✅ 90+ | ✅ 88+ | ✅ 14+ | ✅ 90+ |
| Wake Lock | ✅ 84+ | ❌ | ❌ | ✅ 84+ |
| Web Audio | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ⚠️ | ✅ |

## Licence

MIT License - volně použitelné pro osobní i komerční účely.

## Podpora

Pro reportování chyb nebo návrhy na vylepšení vytvořte issue v GitHub repozitáři.

## Další kroky

### MVP rozšíření:
- [ ] Přidat více audio souborů
- [ ] Implementovat vlastní mixování zvuků
- [ ] Přidat vedené meditace
- [ ] Vytvořit kurzy pro začátečníky
- [ ] Přidat binaurální beaty
- [ ] Export/import dat
- [ ] Kalendář praxe
- [ ] Dark/Light theme přepínač

### Pokročilé:
- [ ] Backend pro synchronizaci dat
- [ ] Social features (sdílení pokroku)
- [ ] Gamifikace (achievementy)
- [ ] AI asistent pro personalizaci
- [ ] Integrace s fitness trackery

---

**Vytvořeno podle výzkumného manuálu pro meditační PWA aplikaci**

Aplikace je postavená na principech:
- 🌱 Jednoduchosti
- 🎯 Uživatelské přívětivosti
- ⚡ Výkonu
- 🔒 Bezpečnosti
- 📱 Mobile-first designu
