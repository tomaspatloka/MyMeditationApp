# Ikony pro PWA

Pro správnou funkčnost PWA aplikace je potřeba vytvořit ikony v následujících velikostech:

## Požadované velikosti:
- **icon-72.png** (72x72px)
- **icon-128.png** (128x128px)
- **icon-192.png** (192x192px)
- **icon-512.png** (512x512px)
- **icon-maskable.png** (512x512px s paddingem)

## Jak vytvořit ikony:

### Možnost 1: Online nástroj
1. Otevřete https://realfavicongenerator.net/
2. Nahrajte `icon.svg` soubor
3. Stáhněte vygenerované ikony
4. Zkopírujte PNG soubory do této složky

### Možnost 2: ImageMagick (příkazová řádka)
```bash
# Instalace ImageMagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: apt-get install imagemagick

# Generování ikon
magick convert icon.svg -resize 72x72 icon-72.png
magick convert icon.svg -resize 128x128 icon-128.png
magick convert icon.svg -resize 192x192 icon-192.png
magick convert icon.svg -resize 512x512 icon-512.png

# Maskable ikona (s paddingem)
magick convert icon.svg -resize 410x410 -gravity center -extent 512x512 icon-maskable.png
```

### Možnost 3: Online SVG to PNG converter
1. Otevřete https://svgtopng.com/
2. Nahrajte `icon.svg`
3. Nastavte požadované velikosti
4. Stáhněte PNG soubory

## Pro rychlé testování:
Můžete použít placeholderikony z https://via.placeholder.com/ nebo vytvořit jednoduché barevné čtverce.
