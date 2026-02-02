# 🎵 Audio Soubory - Zdroje a Instalace

## 📋 Potřebné Audio Soubory

Aplikace potřebuje následující ambient zvuky pro meditaci:

### 1. **Déšť (Rain)**
- **Soubor:** `audio/rain.mp3`
- **Doporučená délka:** 5-10 minut (loop)
- **Zdroje:**
  - Freesound.org: https://freesound.org/search/?q=rain+ambience&f=duration%3A%5B300+TO+*%5D
  - Doporučený: https://freesound.org/people/InspectorJ/sounds/346700/ (Rain, Moderate, Thunderstorm)
  - CC0 Alternative: https://freesound.org/people/felix.blume/sounds/217506/ (Rain - 5 min loop)

### 2. **Oceán (Ocean/Waves)**
- **Soubor:** `audio/ocean.mp3`
- **Doporučená délka:** 5-10 minut (loop)
- **Zdroje:**
  - Freesound.org: https://freesound.org/search/?q=ocean+waves&f=duration%3A%5B300+TO+*%5D
  - Doporučený: https://freesound.org/people/Luftrum/sounds/48412/ (Sea Waves)
  - CC0 Alternative: https://freesound.org/people/Klankbeeld/sounds/204132/ (Ocean Waves - 10 min)

### 3. **Les (Forest/Nature)**
- **Soubor:** `audio/forest.mp3`
- **Doporučená délka:** 5-10 minut (loop)
- **Zdroje:**
  - Freesound.org: https://freesound.org/search/?q=forest+birds&f=duration%3A%5B300+TO+*%5D
  - Doporučený: https://freesound.org/people/kvgarlic/sounds/156122/ (Forest Morning)
  - CC0 Alternative: https://freesound.org/people/felix.blume/sounds/256529/ (Forest ambience)

### 4. **Tibetská mísa (Bell)**
- **Soubor:** `audio/bell.mp3`
- **Doporučená délka:** 5-10 sekund
- **Zdroje:**
  - Freesound.org: https://freesound.org/search/?q=tibetan+bowl
  - Doporučený: https://freesound.org/people/suburban_grilla/sounds/2166/ (Tibetan Bowl)
  - CC0 Alternative: https://freesound.org/people/Corsica_S/sounds/91926/ (Singing Bowl)

---

## 🚀 Rychlá Instalace

### Krok 1: Vytvoř složky
```bash
cd C:\Users\tpatl\Desktop\MyMeditationApp
mkdir audio
mkdir audio\ambient
mkdir audio\bells
```

### Krok 2: Stáhni audio soubory
Navštiv výše uvedené odkazy a stáhni soubory. Doporučuji CC0 (Public Domain) verze.

### Krok 3: Konvertuj na MP3 (pokud je třeba)
Pokud jsou soubory ve formátu WAV, OGG, nebo FLAC:
- Použij online konvertor: https://cloudconvert.com/
- Nebo FFmpeg: `ffmpeg -i input.wav -b:a 128k output.mp3`

### Krok 4: Přejmenuj a umísti
```
audio/
  ├── rain.mp3
  ├── ocean.mp3
  ├── forest.mp3
  └── bell.mp3
```

---

## 🎯 Alternativa: Použij CDN

Pokud nechceš stahovat, můžeš použít online zdroje (vyžaduje internet):

### Exemple CDN odkazy:
```javascript
// V audio.js nahraď:
const sounds = {
  rain: 'https://cdn.freesound.org/previews/217/217506_1015240-lq.mp3',
  ocean: 'https://cdn.freesound.org/previews/204/204132_1909748-lq.mp3',
  forest: 'https://cdn.freesound.org/previews/256/256529_4539289-lq.mp3',
  bell: 'https://cdn.freesound.org/previews/91/91926_634166-lq.mp3'
};
```

**Poznámka:** CDN preview linky jsou nižší kvality a kratší. Pro produkci stáhni full quality.

---

## 📝 Licence & Atribuce

Všechny doporučené soubory z Freesound.org jsou pod **Creative Commons** licencí.

### CC0 (Public Domain):
- Není potřeba atribuce
- Volně použitelné komerčně i nekomerčně

### CC-BY (Attribution):
- Vyžaduje uvedení autora
- Přidej do `CREDITS.md`:
  ```
  Rain Sound by felix.blume (CC-BY 3.0)
  Ocean Waves by Klankbeeld (CC-BY 3.0)
  ```

---

## 🔊 Technické parametry

**Doporučené nastavení:**
- **Formát:** MP3
- **Bitrate:** 128-192 kbps (balance mezi kvalitou a velikostí)
- **Sample rate:** 44.1 kHz
- **Kanály:** Stereo
- **Délka:** 5-10 minut (seamless loop pokud možno)

---

## ✅ Checklist

Po stažení a nastavení:

- [ ] Složka `audio/` existuje
- [ ] `rain.mp3` (cca 5-15 MB)
- [ ] `ocean.mp3` (cca 5-15 MB)
- [ ] `forest.mp3` (cca 5-15 MB)
- [ ] `bell.mp3` (cca 100-500 KB)
- [ ] Otestovat v aplikaci přes `http://localhost:8000`
- [ ] Ověřit že zvuky fungují
- [ ] Zkontrolovat hlasitost (30-50% default)

---

## 🆘 Potřebuješ pomoc?

Pokud máš problém se stahováním nebo konverzí, můžu:
1. Vytvořit script pro automatické stažení
2. Poskytnout přímé odkazy
3. Nastavit Web Audio API generované zvuky (fallback)

---

**Vytvořeno: 2. února 2026**
