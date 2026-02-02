# 🎵 Jak Stáhnout Audio Soubory - Krok za Krokem

Preview CDN odkazy bohužel nefungují. Zde je **manuální návod** jak stáhnout kvalitní audio:

## 🚀 Rychlý Způsob - Stažení z Freesound.org

### Krok 1: Registrace na Freesound.org
1. Jdi na: https://freesound.org/
2. Klikni **Sign up** (nahoře vpravo)
3. Vyplň email a heslo
4. Potvrď email

### Krok 2: Stáhni jednotlivé soubory

#### 🌧️ **Déšť (Rain)**
1. Otevři: https://freesound.org/people/felix.blume/sounds/217506/
2. Klikni **Download** (nahoře vpravo)
3. Ulož jako: `C:\Users\tpatl\Desktop\MyMeditationApp\audio\rain.mp3`
4. Pokud je formát OGG/WAV, konvertuj na MP3 (viz níže)

**Alternativy:**
- https://freesound.org/people/InspectorJ/sounds/346700/ (Rain, Thunderstorm)
- https://freesound.org/people/RutgerMuller/sounds/51245/ (Light Rain)

#### 🌊 **Oceán (Ocean)**
1. Otevři: https://freesound.org/people/Klankbeeld/sounds/204132/
2. Klikni **Download**
3. Ulož jako: `C:\Users\tpatl\Desktop\MyMeditationApp\audio\ocean.mp3`

**Alternativy:**
- https://freesound.org/people/Luftrum/sounds/48412/ (Sea Waves)
- https://freesound.org/people/c97059890/sounds/21754/ (Ocean Beach)

#### 🌲 **Les (Forest)**
1. Otevři: https://freesound.org/people/felix.blume/sounds/256529/
2. Klikni **Download**
3. Ulož jako: `C:\Users\tpatl\Desktop\MyMeditationApp\audio\forest.mp3`

**Alternativy:**
- https://freesound.org/people/kvgarlic/sounds/156122/ (Forest Morning)
- https://freesound.org/people/soundmary/sounds/194931/ (Forest Birds)

#### 🔔 **Zvon/Mísa (Bell)**
1. Otevři: https://freesound.org/people/Corsica_S/sounds/91926/
2. Klikni **Download**
3. Ulož jako: `C:\Users\tpatl\Desktop\MyMeditationApp\audio\bell.mp3`

**Alternativy:**
- https://freesound.org/people/suburban_grilla/sounds/2166/ (Tibetan Bowl)
- https://freesound.org/people/JSTR/sounds/153796/ (Singing Bowl)

---

## 🔄 Konverze Audio (pokud je potřeba)

Pokud jsou stažené soubory ve formátu **WAV, OGG, FLAC**:

### Online konvertor (nejjednodušší):
1. Jdi na: https://cloudconvert.com/
2. Nahraj soubor
3. Vyber výstup: **MP3**
4. Nastavení:
   - **Bitrate:** 128 kbps
   - **Sample Rate:** 44100 Hz
5. Klikni **Convert**
6. Stáhni výsledný MP3

### FFmpeg (pro pokročilé):
```bash
# Instaluj FFmpeg: https://ffmpeg.org/download.html
ffmpeg -i rain.wav -b:a 128k rain.mp3
ffmpeg -i ocean.ogg -b:a 128k ocean.mp3
ffmpeg -i forest.flac -b:a 128k forest.mp3
ffmpeg -i bell.wav -b:a 128k bell.mp3
```

---

## 🎯 Alternativa: Použij Placeholdery (Dočasné Řešení)

Pokud teď nechceš stahovat, aplikace má **Web Audio API fallback** který generuje syntetické zvuky.

Aplikace bude fungovat i bez MP3 souborů, ale zvuk bude jednoduchý (tóny místo ambient zvuků).

---

## 📁 Správná Struktura Složek

Po stažení by mělo vypadat:

```
MyMeditationApp/
├── audio/
│   ├── rain.mp3       (5-10 MB)
│   ├── ocean.mp3      (5-10 MB)
│   ├── forest.mp3     (5-10 MB)
│   └── bell.mp3       (100-500 KB)
├── css/
├── js/
├── icons/
└── index.html
```

---

## ✅ Ověření

Po stažení:

1. **Spusť aplikaci:**
   ```bash
   cd C:\Users\tpatl\Desktop\MyMeditationApp
   python -m http.server 8000
   ```

2. **Otevři:** http://localhost:8000

3. **Zkus audio:**
   - Přepni na "Timer" view
   - Vyber "Déšť", "Oceán" nebo "Les"
   - Klikni "Spustit"
   - Měl by se přehrát ambient zvuk

4. **F12 Console** - zkontroluj že nejsou chyby typu:
   - ❌ `Failed to load resource: audio/rain.mp3`
   - ✅ Žádné chyby = audio funguje

---

## 🆓 Nejlepší FREE Zdroje

### Freesound.org
- ✅ Největší kolekce
- ✅ CC0 a CC-BY licence
- ✅ High quality
- ⚠️ Vyžaduje registraci

### Pixabay
- https://pixabay.com/sound-effects/search/rain/
- ✅ Bez registrace
- ✅ CC0 (volné použití)
- ⚠️ Menší výběr

### YouTube Audio Library
- https://www.youtube.com/audiolibrary
- ✅ Free download
- ✅ Různé licence
- ⚠️ Některé vyžadují atributi

### Zapsplat
- https://www.zapsplat.com/
- ✅ Free tier
- ✅ Ambient sounds
- ⚠️ Registrace potřeba

---

## 📊 Doporučené Parametry

Pro optimální balance mezi kvalitou a velikostí:

| Parametr | Hodnota |
|----------|---------|
| **Formát** | MP3 |
| **Bitrate** | 128-192 kbps |
| **Sample Rate** | 44.1 kHz |
| **Channels** | Stereo |
| **Délka** | 5-10 minut |
| **Loop** | Seamless (pokud možno) |

---

## 💡 Tipy

1. **Pro testování** stačí kratší soubory (2-3 minuty)
2. **Pro produkci** použij 10+ minut seamless loops
3. **Kontroluj licenci** - CC0 je nejbezpečnější
4. **Velikost** - pro web optimalizuj na 128kbps
5. **Formát** - MP3 má nejlepší podporu v prohlížečích

---

## 🆘 Potřebuješ pomoc?

Pokud máš problém:
1. Zkontroluj že složka `audio/` existuje
2. Zkontroluj názvy souborů (musí být přesně: `rain.mp3`, `ocean.mp3`, atd.)
3. Zkontroluj velikost (min 100 KB, ideálně 2-15 MB)
4. Zkus přehrát v media playeru (VLC) - pokud tam nefunguje, soubor je špatný
5. Zkontroluj F12 Console v prohlížeči pro chybové hlášky

---

**Vytvořeno: 2. února 2026**
