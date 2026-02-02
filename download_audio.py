#!/usr/bin/env python3
"""
Audio downloader pro meditační aplikaci
Stahuje CC0/CC-BY audio soubory z Freesound.org
"""

import os
import urllib.request
import sys

# Nastavení kódování pro Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Audio soubory ke stažení (preview verze - nižší kvalita, ale okamžitě dostupné)
AUDIO_FILES = {
    'rain.mp3': {
        'url': 'https://cdn.freesound.org/previews/217/217506_1015240-lq.mp3',
        'name': 'Rain Ambience',
        'author': 'felix.blume',
        'license': 'CC-BY 3.0'
    },
    'ocean.mp3': {
        'url': 'https://cdn.freesound.org/previews/204/204132_1909748-lq.mp3',
        'name': 'Ocean Waves',
        'author': 'Klankbeeld',
        'license': 'CC-BY 3.0'
    },
    'forest.mp3': {
        'url': 'https://cdn.freesound.org/previews/256/256529_4539289-lq.mp3',
        'name': 'Forest Ambience',
        'author': 'felix.blume',
        'license': 'CC-BY 3.0'
    },
    'bell.mp3': {
        'url': 'https://cdn.freesound.org/previews/91/91926_634166-lq.mp3',
        'name': 'Singing Bowl',
        'author': 'Corsica_S',
        'license': 'CC0 (Public Domain)'
    }
}

def download_file(url, filename):
    """Stáhne soubor z URL"""
    try:
        print(f"📥 Stahuji: {filename}...")
        urllib.request.urlretrieve(url, filename)
        size = os.path.getsize(filename) / 1024  # KB
        print(f"✅ Staženo: {filename} ({size:.1f} KB)")
        return True
    except Exception as e:
        print(f"❌ Chyba při stahování {filename}: {e}")
        return False

def create_credits():
    """Vytvoří CREDITS.md s atribucí"""
    credits = """# 🎵 Audio Credits

Všechny audio soubory jsou použity pod Creative Commons licencí.

## Ambient Sounds

"""
    for filename, info in AUDIO_FILES.items():
        credits += f"### {info['name']}\n"
        credits += f"- **Soubor:** `audio/{filename}`\n"
        credits += f"- **Autor:** {info['author']}\n"
        credits += f"- **Licence:** {info['license']}\n"
        credits += f"- **Zdroj:** Freesound.org\n\n"

    credits += """
## Poznámky

- Použity jsou preview verze (lower quality) pro rychlé stažení
- Pro produkci doporučujeme stáhnout full quality z Freesound.org
- Všechny soubory jsou seamless loops vhodné pro meditaci
- CC-BY vyžaduje uvedení autora (viz výše)
- CC0 je Public Domain (bez omezení)

---

**Děkujeme všem tvůrcům za jejich práci! 🙏**
"""

    with open('CREDITS.md', 'w', encoding='utf-8') as f:
        f.write(credits)
    print("📄 Vytvořen CREDITS.md")

def main():
    """Hlavní funkce"""
    print("🎵 Audio Downloader pro Meditační Aplikaci")
    print("=" * 50)

    # Vytvoř složku audio pokud neexistuje
    os.makedirs('audio', exist_ok=True)

    # Stáhni všechny soubory
    success_count = 0
    for filename, info in AUDIO_FILES.items():
        filepath = os.path.join('audio', filename)

        # Přeskoč pokud už existuje
        if os.path.exists(filepath):
            print(f"⏭️  Přeskočeno (už existuje): {filename}")
            success_count += 1
            continue

        if download_file(info['url'], filepath):
            success_count += 1

    # Vytvoř credits
    create_credits()

    print("\n" + "=" * 50)
    print(f"✨ Hotovo! Staženo {success_count}/{len(AUDIO_FILES)} souborů")
    print("\n📁 Audio soubory jsou v složce: ./audio/")
    print("📄 Atribuce v souboru: ./CREDITS.md")
    print("\n🎯 Další kroky:")
    print("   1. Otevři aplikaci přes Python server")
    print("   2. Zkus audio v Timer view")
    print("   3. Pro lepší kvalitu stáhni full verze z Freesound.org")

if __name__ == '__main__':
    main()
