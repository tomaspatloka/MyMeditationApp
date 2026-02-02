# ☁️ Nasazení na Cloudflare Pages - Krok za krokem

## 📋 Předpoklady

✅ GitHub repozitář vytvořen: https://github.com/tomaspatloka/MyMeditationApp
✅ Kód nahrán na GitHub (git push dokončen)

---

## 🚀 KROK 1: Vytvoření Cloudflare účtu

### 1.1 Registrace
1. Jděte na: **https://dash.cloudflare.com/sign-up**
2. Vyplňte:
   - Email: `vase@email.cz`
   - Heslo: (silné heslo)
3. Klikněte **Sign Up**
4. Otevřete email a **ověřte účet** (klikněte na link)

### 1.2 První přihlášení
1. Přihlaste se na: **https://dash.cloudflare.com/login**
2. Dostanete se na Dashboard

---

## 🔗 KROK 2: Propojení s GitHub

### 2.1 Otevřete Cloudflare Pages
1. V levém menu klikněte na **Workers & Pages**
2. Klikněte na tlačítko **Create application**
3. Vyberte záložku **Pages**
4. Klikněte **Connect to Git**

### 2.2 Připojte GitHub účet
1. Zobrazí se dialogové okno "Connect Git provider"
2. Klikněte na **GitHub** logo
3. Otevře se GitHub autorizační stránka
4. Klikněte **Authorize Cloudflare Pages**

### 2.3 Vyberte repozitář
1. Cloudflare vás přesměruje zpět
2. Pokud vidíte "Install & Authorize":
   - Klikněte **Install & Authorize**
   - Vyberte **All repositories** NEBO **Only select repositories**
   - Pokud jen vybrané: zaškrtněte `MyMeditationApp`
   - Klikněte **Install**

3. Po instalaci uvidíte seznam repozitářů
4. Najděte: **tomaspatloka/MyMeditationApp**
5. Klikněte **Begin setup**

---

## ⚙️ KROK 3: Konfigurace projektu

### 3.1 Project Setup
Na stránce "Set up build and deployments" vyplňte:

```
┌─────────────────────────────────────────────────────────┐
│ Project name:                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ mymeditationapp                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│ (nebo: meditation-app, meditace, apod.)                 │
│                                                         │
│ Production branch:                                      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ main                                     [✓]        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Build command: (optional)                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ (PRÁZDNÉ - nic nevyplňujte)                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Build output directory:                                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ /                                                   │ │
│ └─────────────────────────────────────────────────────┘ │
│ (nebo můžete nechat prázdné)                           │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Root Directory (volitelné)
- Pokud je vaše aplikace v root složce (ano v našem případě):
  - **Root directory:** `/` nebo nechte prázdné

### 3.3 Environment Variables
- Pro tuto aplikaci **NEJSOU** potřeba
- Přeskočte tuto sekci

---

## 🎯 KROK 4: Deploy!

1. Zkontrolujte nastavení:
   - ✅ Project name: vyplněno
   - ✅ Branch: main
   - ✅ Build command: prázdné
   - ✅ Output: /

2. Klikněte na velké modré tlačítko: **Save and Deploy**

3. Cloudflare začne build process:
   ```
   ⏳ Initializing build environment...
   ⏳ Cloning repository...
   ⏳ Building application...
   ✅ Deploying to Cloudflare's global network...
   ```

4. Deployment trvá **1-3 minuty**

5. Po dokončení uvidíte:
   ```
   🎉 Success! Your site is live!
   ```

---

## 🌐 KROK 5: Otestujte aplikaci

### 5.1 Najděte URL
Po úspěšném deploymentu uvidíte:
```
https://mymeditationapp.pages.dev
```
(nebo jiný název podle toho, co jste zvolili)

### 5.2 Otevřete v prohlížeči
1. Klikněte na URL nebo ji zkopírujte
2. Aplikace by měla fungovat!
3. Otestujte:
   - ✅ Timer funguje
   - ✅ Dýchání funguje
   - ✅ Statistiky se ukládají
   - ✅ CZ/EN přepínání

### 5.3 Test na mobilu
1. Otevřete URL na mobilu (Android Chrome)
2. Menu (⋮) → **Add to Home screen**
3. Aplikace se nainstaluje jako PWA

---

## 🎨 KROK 6: Vlastní doména (volitelné)

Pokud chcete vlastní doménu (např. `meditace.vase-domena.cz`):

### 6.1 V Cloudflare Pages
1. Otevřete projekt: **mymeditationapp**
2. Klikněte na záložku **Custom domains**
3. Klikněte **Set up a custom domain**
4. Zadejte: `meditace.vase-domena.cz`
5. Klikněte **Continue**

### 6.2 DNS nastavení
Cloudflare vám ukáže DNS záznamy:

```
Type:  CNAME
Name:  meditace
Value: mymeditationapp.pages.dev
TTL:   Auto
```

### 6.3 U vašeho DNS poskytovatele
1. Přihlaste se k poskytovateli domény
2. Najděte DNS management
3. Přidejte CNAME záznam:
   - **Type:** CNAME
   - **Name:** meditace (nebo @ pro root)
   - **Target/Value:** mymeditationapp.pages.dev
   - **TTL:** 3600 (nebo Auto)
4. Uložte

### 6.4 Počkejte na propagaci
- DNS propagace: **5-30 minut**
- Cloudflare vás upozorní emailem
- Poté bude fungovat: `https://meditace.vase-domena.cz`

---

## 🔄 KROK 7: Automatické deploymenty

### Jak to funguje:
1. Uděláte změnu v kódu
2. Git commit + push:
   ```bash
   git add .
   git commit -m "Update: přidána nová funkce"
   git push
   ```
3. **Cloudflare automaticky detekuje změnu**
4. **Automaticky spustí nový build**
5. **Nasadí novou verzi** (2-3 minuty)

### Sledování deploymentů:
1. Jděte na Cloudflare Dashboard
2. Workers & Pages → mymeditationapp
3. Záložka **Deployments**
4. Uvidíte historii všech deploymentů

---

## 📊 KROK 8: Monitoring & Analytics

### 8.1 Web Analytics (zdarma)
1. V projektu klikněte na **Analytics**
2. Klikněte **Enable Web Analytics**
3. Zkopírujte script tag
4. Přidejte do `index.html` před `</head>`:
   ```html
   <script defer src='https://static.cloudflare.com/beacon.min.js'
           data-cf-beacon='{"token": "VÁŠ-TOKEN"}'></script>
   ```
5. Commit + push
6. Analytics aktivní! (bez cookies, privacy-friendly)

### 8.2 Co můžete sledovat:
- 📈 Počet návštěvníků
- 🌍 Země původu
- 📱 Zařízení (desktop/mobile)
- 🔗 Zdroje návštěvnosti
- ⚡ Performance metriky

---

## 🛠️ KROK 9: Pokročilé nastavení (volitelné)

### 9.1 Build konfigurace
V projektu → **Settings** → **Builds & deployments**:

- **Branch deployments:** main (production)
- **Preview deployments:** Všechny branches (automatický náhled)
- **Environment variables:** Zatím žádné

### 9.2 Funkce které máte k dispozici:
- ✅ Neomezený bandwidth
- ✅ Automatické HTTPS
- ✅ Global CDN (300+ locations)
- ✅ Branch previews
- ✅ Rollback na předchozí verze
- ✅ Custom headers (_headers soubor)
- ✅ Redirects

---

## ❓ Časté problémy

### Problém: "Repository not found"
**Řešení:**
1. Jděte na GitHub
2. Settings → Applications → Cloudflare Pages
3. Zkontrolujte přístup k repozitářům
4. Grant access pokud chybí

### Problém: "Build failed"
**Řešení:**
- Není potřeba build pro tuto aplikaci
- Ujistěte se, že Build command je **PRÁZDNÝ**
- Output directory: `/`

### Problém: "404 Not Found po deploymentu"
**Řešení:**
1. Zkontrolujte Output directory: `/`
2. Zkontrolujte, že `index.html` je v root složce
3. Force re-deploy: Deployments → ⋮ → Retry deployment

### Problém: "Custom domain not working"
**Řešení:**
1. Počkejte 30 minut na DNS propagaci
2. Zkontrolujte DNS záznamy u poskytovatele
3. Použijte `nslookup meditace.vase-domena.cz`

---

## 📱 Test Checklist

Po deploymentu otestujte:

### Desktop:
- [ ] Aplikace se načte
- [ ] Timer funguje
- [ ] Dýchání funguje
- [ ] Statistiky se ukládají
- [ ] CZ/EN přepínání
- [ ] F12 → Console (žádné chyby)
- [ ] F12 → Application → Service Worker (aktivní)

### Mobile (Android):
- [ ] Aplikace se načte
- [ ] Touch ovládání funguje
- [ ] Add to Home Screen
- [ ] Otevřít z home screen
- [ ] Offline režim (airplane mode)
- [ ] Notifikace po dokončení timeru

### Lighthouse Audit:
- [ ] Performance: >90
- [ ] PWA: 100
- [ ] Accessibility: >90
- [ ] Best Practices: >90

---

## 🎉 HOTOVO!

Vaše aplikace je nyní živá na:

```
🌐 https://mymeditationapp.pages.dev
```

**Co máte:**
- ✅ Automatické deploymenty z GitHub
- ✅ HTTPS zdarma (automatický SSL)
- ✅ Global CDN (rychlé načítání odkudkoliv)
- ✅ Neomezený bandwidth
- ✅ Preview deployments pro každou branch
- ✅ Rollback na předchozí verze jedním klikem

**Náklady:** 💰 **$0/měsíc** (Cloudflare Pages je zdarma!)

---

## 📚 Užitečné odkazy

- **Cloudflare Dashboard:** https://dash.cloudflare.com/
- **Pages dokumentace:** https://developers.cloudflare.com/pages/
- **GitHub repozitář:** https://github.com/tomaspatloka/MyMeditationApp
- **Status page:** https://www.cloudflarestatus.com/

---

## 💡 Tipy

1. **Branch preview:**
   - Vytvořte novou branch: `git checkout -b nova-funkce`
   - Push: `git push origin nova-funkce`
   - Cloudflare vytvoří preview URL automaticky!

2. **Rollback:**
   - Deployments → najděte předchozí verzi
   - Klikněte ⋮ → Rollback to this deployment

3. **Custom 404:**
   - Vytvořte `404.html` v root složce
   - Cloudflare ji automaticky použije

4. **Cache purge:**
   - Settings → Caching → Purge Cache
   - Vyčistí CDN cache (když potřebujete okamžitou aktualizaci)

---

**Úspěšné nasazení! 🚀**

*Pro podporu: https://community.cloudflare.com/*
