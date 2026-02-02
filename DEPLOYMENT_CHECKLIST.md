# ✅ Deployment Checklist

## 📋 Před deploymentem

- [x] ✅ Git repozitář vytvořen
- [x] ✅ Kód pushnutý na GitHub
- [x] ✅ README.md vytvořen
- [x] ✅ Všechny soubory commited
- [ ] 🔲 Cloudflare účet vytvořen
- [ ] 🔲 GitHub propojený s Cloudflare

---

## 🚀 Deployment kroky

### 1. Cloudflare Setup
- [ ] 🔲 Přihlášení na dash.cloudflare.com
- [ ] 🔲 Workers & Pages → Create application
- [ ] 🔲 Pages → Connect to Git

### 2. GitHub Connection
- [ ] 🔲 Authorize Cloudflare Pages na GitHub
- [ ] 🔲 Install & Authorize
- [ ] 🔲 Vybrat MyMeditationApp repozitář

### 3. Project Configuration
- [ ] 🔲 Project name: `mymeditationapp`
- [ ] 🔲 Production branch: `main`
- [ ] 🔲 Build command: **PRÁZDNÉ**
- [ ] 🔲 Build output: `/`

### 4. Deploy
- [ ] 🔲 Save and Deploy
- [ ] 🔲 Počkat 2-3 minuty
- [ ] 🔲 Zkopírovat URL (např. mymeditationapp.pages.dev)

---

## 🧪 Po deploymentu - Testing

### Desktop Test
- [ ] 🔲 Otevřít URL v prohlížeči
- [ ] 🔲 Aplikace se načte
- [ ] 🔲 Timer funguje (spustit/pozastavit)
- [ ] 🔲 Dýchání funguje
- [ ] 🔲 Statistiky se ukládají
- [ ] 🔲 CZ/EN přepínání funguje
- [ ] 🔲 F12 Console - žádné chyby
- [ ] 🔲 Service Worker je aktivní

### Mobile Test (Android)
- [ ] 🔲 Otevřít URL na mobilu
- [ ] 🔲 Touch ovládání funguje
- [ ] 🔲 Menu → Add to Home Screen
- [ ] 🔲 Otevřít z home screen
- [ ] 🔲 Funguje jako standalone app
- [ ] 🔲 Test offline režimu (airplane mode)

### Lighthouse Audit
- [ ] 🔲 F12 → Lighthouse → Generate report
- [ ] 🔲 Performance: ≥90
- [ ] 🔲 PWA: 100
- [ ] 🔲 Accessibility: ≥90
- [ ] 🔲 Best Practices: ≥90
- [ ] 🔲 SEO: ≥80

---

## 🎨 GitHub Metadata (doporučeno)

- [ ] 🔲 Přidat Description na GitHubu
- [ ] 🔲 Přidat Topics/Tags
- [ ] 🔲 Nastavit Website URL
- [ ] 🔲 Aktualizovat README s live URL

### GitHub Description:
```
🧘‍♂️ Meditační PWA aplikace - Timer, dechová cvičení, offline režim
```

### GitHub Topics:
```
pwa, meditation, breathing-exercises, web-audio, service-worker,
offline-first, vanilla-javascript, mindfulness, wellness, czech
```

### Website:
```
https://mymeditationapp.pages.dev
```

---

## 📊 Volitelné vylepšení

### Analytics
- [ ] 🔲 Cloudflare Web Analytics aktivovat
- [ ] 🔲 Přidat analytics script do index.html
- [ ] 🔲 Commit + push

### Vlastní doména
- [ ] 🔲 Custom domains → Set up a custom domain
- [ ] 🔲 Přidat CNAME u DNS poskytovatele
- [ ] 🔲 Počkat na DNS propagaci (5-30 min)
- [ ] 🔲 Test na vlastní doméně

### Monitoring
- [ ] 🔲 Nastavit uptime monitoring
- [ ] 🔲 Přidat do bookmarks
- [ ] 🔲 Share na sociálních sítích

---

## 🔄 Automatické deploymenty

### Ověření automatických deploymentů:
1. [ ] 🔲 Udělat změnu v kódu
2. [ ] 🔲 Git commit + push
3. [ ] 🔲 Cloudflare → Deployments → Ověřit nový build
4. [ ] 🔲 Počkat 2-3 minuty
5. [ ] 🔲 Refresh stránky a ověřit změnu

---

## 📱 Finální checklist

### Production Ready:
- [ ] 🔲 Aplikace je živá a dostupná
- [ ] 🔲 HTTPS funguje
- [ ] 🔲 PWA je instalovatelná
- [ ] 🔲 Offline režim funguje
- [ ] 🔲 Žádné critical errors v Console
- [ ] 🔲 Mobile friendly
- [ ] 🔲 Rychlé načítání (<3s)

### Dokumentace:
- [ ] 🔲 README je aktuální
- [ ] 🔲 Live URL přidáno do README
- [ ] 🔲 Screenshots přidány (volitelné)
- [ ] 🔲 License soubor (volitelné)

### Marketing (volitelné):
- [ ] 🔲 Tweet o projektu
- [ ] 🔲 Post na Redditu
- [ ] 🔲 Share na LinkedInu
- [ ] 🔲 Product Hunt (pokud má smysl)

---

## 🎉 Hotovo!

Pokud jsou všechny body zaškrtnuté:

✅ **Aplikace je úspěšně nasazena!**
✅ **Živá na internetu!**
✅ **Dostupná odkudkoliv!**

---

## 📝 Poznámky

**URL aplikace:**
```
https://mymeditationapp.pages.dev
```

**GitHub repo:**
```
https://github.com/tomaspatloka/MyMeditationApp
```

**Datum nasazení:**
```
_________________
```

**Lighthouse skóre:**
```
Performance:    ___/100
PWA:           ___/100
Accessibility: ___/100
Best Practices: ___/100
SEO:           ___/100
```

---

**🎯 Další kroky:** Viz [STATUS.md](STATUS.md) pro roadmap v2.0

*Checklist vytvořen: 2. února 2026*
