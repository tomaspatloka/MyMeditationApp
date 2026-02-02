# ⚡ Rychlý start

## 1️⃣ Vygenerovat ikony

### Možnost A: Python (doporučeno)
```bash
pip install pillow
python generate_icons.py
```

### Možnost B: HTML generátor
1. Otevřít v prohlížeči: `icons/generate-placeholder-icons.html`
2. Stáhnout ikony (automaticky)
3. Přesunout do složky `icons/`

### Možnost C: Online nástroj
1. Navštivte: https://realfavicongenerator.net/
2. Nahrajte: `icons/icon.svg`
3. Stáhněte PNG ikony
4. Zkopírujte do složky `icons/`

---

## 2️⃣ Spustit lokálně

### Python
```bash
python -m http.server 8000
```

### Node.js
```bash
npx serve -p 8000
```

### VS Code
- Nainstalovat "Live Server" extension
- Pravý klik na `index.html` → "Open with Live Server"

---

## 3️⃣ Otevřít aplikaci

```
http://localhost:8000
```

---

## 4️⃣ Testovat

- ✅ Timer funguje
- ✅ Dechová cvičení fungují
- ✅ Statistiky se ukládají
- ✅ Přepínání CZ/EN funguje

---

## 5️⃣ Deploy (volitelné)

### Cloudflare Pages (doporučeno)
```bash
# Push do GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR-GITHUB-URL
git push -u origin main

# Poté na https://dash.cloudflare.com/
# Pages → Create project → Connect GitHub
```

### Nebo Vercel
```bash
npx vercel
```

---

## ❓ Problémy?

### Service Worker nefunguje
```javascript
// V konzoli:
navigator.serviceWorker.getRegistrations().then(r =>
  r.forEach(reg => reg.unregister())
);
```

### Ikony chybí
```bash
python generate_icons.py
```

### Port 8000 obsazený
```bash
python -m http.server 8080  # jiný port
```

---

## 📚 Další dokumentace

- **README.md** - Kompletní dokumentace
- **DEPLOYMENT.md** - Detailní deployment guide
- **icons/README.md** - Info o ikonách

---

## 🎯 To je vše!

Aplikace je připravená k použití. Enjoy! 🧘‍♂️
