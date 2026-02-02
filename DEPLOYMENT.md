# Deployment Guide - Meditační PWA

## Rychlý start (lokální testování)

### 1. Vygenerovat ikony
Otevřete v prohlížeči: `icons/generate-placeholder-icons.html`
- Stáhnou se automaticky všechny potřebné ikony
- Umístěte je do složky `icons/`

### 2. Spustit lokální server

**Python 3:**
```bash
python -m http.server 8000
```

**Node.js (npx):**
```bash
npx serve -p 8000
```

**PHP:**
```bash
php -S localhost:8000
```

**VS Code:**
- Nainstalujte "Live Server" extension
- Pravý klik na `index.html` → "Open with Live Server"

### 3. Otevřít aplikaci
```
http://localhost:8000
```

### 4. Testovat PWA funkce
1. Otevřít Chrome DevTools (F12)
2. Application tab → Service Workers (měl by být registrovaný)
3. Application tab → Manifest (zkontrolovat správnost)
4. Lighthouse audit → spustit PWA test

---

## Deployment na Cloudflare Pages

### Příprava

1. **Vytvořit GitHub účet** (pokud ještě nemáte)
   - https://github.com/signup

2. **Nainstalovat Git** (pokud ještě nemáte)
   - Windows: https://git-scm.com/download/win
   - Mac: `brew install git`
   - Linux: `apt-get install git`

### Krok 1: Push do GitHub

```bash
# V terminálu v složce projektu
git init
git add .
git commit -m "Initial commit: Meditation PWA"

# Vytvořte nový repozitář na https://github.com/new
# Poté:
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/meditation-app.git
git push -u origin main
```

### Krok 2: Propojit s Cloudflare Pages

1. **Vytvořit Cloudflare účet**
   - https://dash.cloudflare.com/sign-up
   - Email verifikace

2. **Připojit GitHub**
   - Dashboard → Pages → "Create a project"
   - "Connect to Git" → Vyberte GitHub
   - Autorizujte Cloudflare Pages
   - Vyberte váš repozitář

3. **Nastavení buildu**
   ```
   Project name: meditation-app
   Production branch: main
   Build command: (leave empty)
   Build output directory: /
   ```

4. **Save and Deploy**
   - Deploy proběhne automaticky (2-3 minuty)
   - URL: `https://meditation-app.pages.dev`

### Krok 3: Vlastní doména (volitelné)

1. **V Cloudflare Pages:**
   - Váš projekt → Custom domains → "Set up a custom domain"

2. **Přidat doménu:**
   - Zadejte: `meditace.vase-domena.cz`
   - Cloudflare vám ukáže DNS záznamy

3. **U vašeho DNS poskytovatele:**
   - Přidejte CNAME záznam:
     ```
     Type: CNAME
     Name: meditace (nebo @)
     Value: meditation-app.pages.dev
     ```

4. **Počkat na propagaci** (5-30 minut)

---

## Deployment na Vercel (alternativa)

### Rychlé kroky:

1. **Push do GitHub** (viz výše)

2. **Vercel deployment:**
   ```bash
   npx vercel
   ```
   - Login pomocí GitHub
   - Odpovězte na otázky (většinou stačí Enter)
   - Deploy hotový za 1 minutu!

3. **Custom domain:**
   ```bash
   npx vercel domains add meditace.vase-domena.cz
   ```

---

## Deployment na Netlify (alternativa)

### Metoda 1: Drag & Drop
1. Otevřete https://app.netlify.com/drop
2. Přetáhněte celou složku projektu
3. Hotovo! URL: `https://random-name.netlify.app`

### Metoda 2: GitHub
1. https://app.netlify.com/start
2. Connect to GitHub
3. Vyberte repozitář
4. Build settings:
   ```
   Build command: (empty)
   Publish directory: .
   ```
5. Deploy

---

## Post-deployment checklist

### ✅ Testování

- [ ] Aplikace se načte správně
- [ ] Service Worker je registrovaný
- [ ] Timer funguje
- [ ] Dechová cvičení fungují
- [ ] Statistiky se ukládají
- [ ] Přepínání jazyků funguje
- [ ] Offline režim funguje (zapnout Airplane mode)
- [ ] "Add to Home Screen" je dostupné na mobilu

### ✅ PWA Audit (Lighthouse)

```
Performance: > 90
Accessibility: > 90
Best Practices: > 90
SEO: > 80
PWA: 100 ✓
```

### ✅ Mobile testing

**Android Chrome:**
- Menu → Add to Home Screen
- Otevřít aplikaci z home screen
- Testovat offline režim

**iOS Safari:**
- Share → Add to Home Screen
- Otevřít aplikaci
- Testovat základní funkce

---

## Continuous Deployment

Po nastavení vše funguje automaticky:

```bash
# Udělat změny v kódu
git add .
git commit -m "Update: přidána nová funkce"
git push

# Cloudflare/Vercel/Netlify automaticky:
# 1. Detekují změnu
# 2. Spustí nový build
# 3. Nasadí na produkci (2-3 min)
```

---

## Monitoring a Analytics (volitelné)

### Google Analytics 4

Do `index.html` před `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Cloudflare Web Analytics (zdarma, privacy-friendly)

1. Dashboard → Analytics → Web Analytics
2. Add site → Zkopírovat script tag
3. Vložit do `index.html`

---

## Troubleshooting

### Service Worker se nenahrává
```javascript
// V prohlížeči konzoli:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(r => r.unregister());
});
location.reload();
```

### Ikony se nezobrazují
- Zkontrolovat, že jsou v `/icons/` složce
- Zkontrolovat manifest.json cesty
- Hard refresh (Ctrl+F5)

### Offline režim nefunguje
- Zkontrolovat Service Worker v DevTools
- Zkontrolovat Network tab → filter "Service Worker"
- Vymazat cache a reload

### PWA se nedá nainstalovat
- Musí běžet na HTTPS (nebo localhost)
- manifest.json musí být správný
- Service Worker musí být registrovaný
- Ikony musí existovat

---

## Náklady

| Služba | Free Tier | Platba |
|--------|-----------|--------|
| **Cloudflare Pages** | ∞ requests, ∞ bandwidth | $0/měsíc |
| **Vercel** | 100 GB bandwidth/měsíc | $0-20/měsíc |
| **Netlify** | 100 GB bandwidth/měsíc | $0-19/měsíc |
| **GitHub** | Neomezené public repos | $0/měsíc |

**Doporučení:** Cloudflare Pages (neomezený free tier)

---

## Podpora

Pokud narazíte na problém:

1. Zkontrolujte browser konzoli (F12)
2. Zkontrolujte Network tab v DevTools
3. Zkontrolujte Application → Service Workers
4. Vymažte cache a zkuste znovu

Pro další pomoc vytvořte issue na GitHub repozitáři.

---

**Úspěšný deployment! 🎉**

Vaše meditační aplikace je nyní živá a přístupná odkudkoliv na světě!
