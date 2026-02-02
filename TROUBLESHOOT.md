# 🔧 Řešení problémů

## ❌ Problém: Tlačítka navigace (Dýchání, Statistiky, Nastavení) nefungují

### Příčina:
Aplikace **MUSÍ** běžet na HTTP serveru, ne jako soubor otevřený přímo v prohlížeči (file://).

### ✅ Řešení:

#### Možnost 1: Použít START.bat (doporučeno pro Windows)
1. Dvakrát klikněte na **START.bat**
2. Otevře se černé okno s textem "Spoustim server..."
3. Otevřete prohlížeč a jděte na: **http://localhost:8000**

#### Možnost 2: Ruční spuštění serveru

**Python (doporučeno):**
```bash
cd C:\Users\tpatl\Desktop\MyMeditationApp
python -m http.server 8000
```

Pak otevřete: http://localhost:8000

**Node.js:**
```bash
npx serve -p 8000
```

**PHP:**
```bash
php -S localhost:8000
```

---

## ❌ Problém: CSS styly se nenačítají

### Řešení:
1. Tvrdý refresh: **Ctrl + Shift + R** nebo **Ctrl + F5**
2. Vymazat cache:
   - F12 → Application → Clear storage → Clear site data
   - Reload page

---

## ❌ Problém: JavaScript chyby v konzoli

### Diagnostika:
1. Stiskněte **F12**
2. Přejděte na záložku **Console**
3. Zkontrolujte červené chybové hlášky

### Časté chyby:

**"Failed to load resource: net::ERR_FILE_NOT_FOUND"**
- Řešení: Spusťte HTTP server (viz výše)

**"Service Worker registration failed"**
- Řešení: Service Worker nefunguje na file://. Použijte HTTP server.

**"Uncaught ReferenceError: ... is not defined"**
- Řešení: JS soubory se nenačítají. Zkontrolujte:
  - HTTP server běží
  - Tvrdý refresh (Ctrl+F5)

---

## 🧪 Test funkcí

### 1. Test navigace:
1. Otevřete aplikaci na http://localhost:8000
2. Klikněte na tlačítko **"Dýchání"**
3. Měl by se zobrazit animovaný kruh s textem "Připravte se"
4. Klikněte na **"Statistiky"**
5. Měly by se zobrazit karty s ikonami 🔥⏱️🕐🏆

### 2. Test timeru:
1. Přepněte na **"Timer"**
2. Klikněte **"Spustit"**
3. Timer by měl začít odpočítávat
4. Progress kruh by se měl pomalu krouhat

### 3. Test dechových cvičení:
1. Přepněte na **"Dýchání"**
2. Klikněte **"Začít"**
3. Modrý kruh by se měl zvětšovat a zmenšovat
4. Text by měl střídavě ukazovat "Nádech", "Zadržet", "Výdech"

### 4. Test offline režimu:
1. Načtěte aplikaci na http://localhost:8000
2. Otevřete F12 → Application → Service Workers
3. Měl by být zobrazen aktivní Service Worker
4. Vypněte internet
5. Obnovte stránku (F5)
6. Aplikace by měla fungovat

---

## 🐛 Debug checklist

- [ ] Server běží (http://localhost:8000, NE file://)
- [ ] CSS soubory se načítají (F12 → Network → styles.css status 200)
- [ ] JS soubory se načítají (F12 → Network → app.js status 200)
- [ ] Žádné chyby v Console (F12 → Console)
- [ ] Service Worker je registrovaný (F12 → Application)

---

## 📱 Test na mobilu (Android)

### Přes USB:
1. Připojte mobil k PC USB kabelem
2. Zapněte "USB ladění" na mobilu
3. V Chrome na PC: chrome://inspect
4. Najděte localhost:8000 a klikněte "Inspect"

### Přes WiFi (PC a mobil na stejné síti):
1. Zjistěte IP adresu PC:
   ```bash
   ipconfig
   # Hledejte "IPv4 Address" (např. 192.168.1.5)
   ```

2. Na mobilu otevřete:
   ```
   http://192.168.1.5:8000
   ```

---

## 💡 Rychlý test

Otevřete: **test.html** v prohlížeči
- Ukáže, které soubory se načítají správně
- Zelená ✓ = OK
- Červená ✗ = problém

---

## 🆘 Stále nefunguje?

1. **Zkontrolujte cestu:**
   ```
   ✓ http://localhost:8000/index.html
   ✗ file:///C:/Users/tpatl/Desktop/MyMeditationApp/index.html
   ```

2. **Restartujte server:**
   - Zastavte (Ctrl+C v terminálu)
   - Spusťte znovu: `python -m http.server 8000`

3. **Vyčistěte vše:**
   - F12 → Application → Clear storage → Clear site data
   - Zavřete prohlížeč úplně
   - Otevřete znovu

4. **Zkuste jiný prohlížeč:**
   - Chrome (doporučeno)
   - Edge
   - Firefox

---

## 📧 Reportování chyb

Pokud problém přetrvává, pošlete screenshot:
1. F12 → Console (červené chyby)
2. F12 → Network (soubory se stavem 404 nebo failed)
3. URL adresa v prohlížeči
