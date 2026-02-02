# 🔧 Nastavení přístupu GitHub → Cloudflare

## ❌ Problém: Cloudflare nevidí váš repozitář

Toto je běžný problém - Cloudflare nemá povolení k vašemu GitHub repozitáři.

---

## ✅ ŘEŠENÍ - 3 MOŽNOSTI

### 🎯 MOŽNOST 1: Povolit přístup na GitHubu (DOPORUČENO)

#### Krok 1: Jděte na GitHub Settings
1. Otevřete: **https://github.com/settings/installations**
2. Najděte **"Cloudflare Pages"** v seznamu aplikací
3. Klikněte na **"Configure"**

#### Krok 2: Upravte přístup k repozitářům
Na stránce konfigurace uvidíte:

```
Repository access
○ All repositories
● Only select repositories

  Select repositories ▼
  [x] MyMeditationApp
```

**DVĚ MOŽNOSTI:**

**A) Povolit všechny repozitáře:**
- Zaškrtněte: **"All repositories"**
- Cloudflare uvidí všechny vaše repozitáře

**B) Povolit jen tento projekt:**
- Zaškrtněte: **"Only select repositories"**
- Klikněte na dropdown: **"Select repositories"**
- Najděte a zaškrtněte: **"MyMeditationApp"**

#### Krok 3: Uložte
1. Scroll dolů
2. Klikněte zelené tlačítko: **"Save"**

#### Krok 4: Vraťte se na Cloudflare
1. Otevřte: **https://dash.cloudflare.com/**
2. Workers & Pages → Create application → Pages
3. Connect to Git
4. Nyní byste měli vidět **MyMeditationApp** v seznamu!

---

### 🎯 MOŽNOST 2: Re-authorize na Cloudflare

Pokud Možnost 1 nefunguje:

#### Krok 1: Odpojte GitHub od Cloudflare
1. Jděte na: **https://dash.cloudflare.com/**
2. Workers & Pages → Create application → Pages
3. Pokud vidíte "Connected to GitHub", klikněte na **"Disconnect"**

#### Krok 2: Znovu připojte
1. Klikněte **"Connect to Git"**
2. Vyberte **GitHub**
3. **"Authorize Cloudflare Pages"**
4. Tentokrát vyberte: **"All repositories"** nebo zaškrtněte **MyMeditationApp**
5. **"Install"**

---

### 🎯 MOŽNOST 3: Zkontrolujte viditelnost repozitáře

Možná je repozitář nastavený jako privátní.

#### Krok 1: Zkontrolujte na GitHubu
1. Otevřte: **https://github.com/tomaspatloka/MyMeditationApp**
2. Zkontrolujte, jestli nevidíte badge: **🔒 Private**

#### Krok 2: Změňte na Public (pokud je Private)
1. Na stránce repozitáře: **Settings** (nahoře vpravo)
2. Scroll úplně dolů na sekci **"Danger Zone"**
3. Najděte: **"Change repository visibility"**
4. Klikněte **"Change visibility"**
5. Vyberte: **"Make public"**
6. Potvrďte zadáním názvu repozitáře: `tomaspatloka/MyMeditationApp`
7. Klikněte **"I understand, change repository visibility"**

**Poznámka:** Cloudflare Pages funguje i s private repozitáři, ale musíte mít správná oprávnění.

---

## 📋 KROK ZA KROKEM - NEJJEDNODUŠŠÍ ZPŮSOB

### 1️⃣ GitHub Settings
```
https://github.com/settings/installations
→ Cloudflare Pages
→ Configure
→ Repository access
→ Only select repositories
→ Select repositories ▼
→ Zaškrtnout: MyMeditationApp
→ Save
```

### 2️⃣ Cloudflare Dashboard
```
https://dash.cloudflare.com/
→ Workers & Pages
→ Create application
→ Pages
→ Connect to Git
→ Teď už byste měli vidět: tomaspatloka/MyMeditationApp
→ Begin setup
```

---

## 🔍 Diagnostika - Jak zkontrolovat přístup

### Kontrola 1: GitHub Installed Apps
```bash
URL: https://github.com/settings/installations

Měli byste vidět:
✓ Cloudflare Pages [Configure]
  - Installed on: tomaspatloka
  - Access: X repositories (nebo All repositories)
```

### Kontrola 2: Specific Repository Access
```bash
URL: https://github.com/tomaspatloka/MyMeditationApp/settings/installations

Měli byste vidět:
✓ Cloudflare Pages - Read & Write access
```

### Kontrola 3: Repository Visibility
```bash
URL: https://github.com/tomaspatloka/MyMeditationApp

Zkontrolujte:
- Public ✅ (viditelné pro všechny)
- Private 🔒 (viditelné jen pro vás + autorizované apps)
```

---

## ❓ Časté problémy a řešení

### Problém: "No repositories found"
**Příčina:** Cloudflare nemá přístup k žádnému repozitáři
**Řešení:**
1. GitHub → Settings → Installations
2. Cloudflare Pages → Configure
3. All repositories NEBO Select repositories → MyMeditationApp
4. Save

### Problém: "Repository not found" při setup
**Příčina:** Repozitář byl smazán nebo přejmenován
**Řešení:**
1. Zkontrolujte, že repozitář existuje
2. URL: https://github.com/tomaspatloka/MyMeditationApp
3. Pokud ne, vytvořte znovu

### Problém: "Permission denied"
**Příčina:** Cloudflare nemá write access
**Řešení:**
1. GitHub → MyMeditationApp → Settings → Integrations
2. Cloudflare Pages → Configure
3. Permissions: Read & Write ✅

---

## 🎯 VIDEO NÁVOD (Textová verze)

### Scénář A: První instalace Cloudflare Pages

```
1. GitHub.com → Sign in
2. Cloudflare → dash.cloudflare.com → Sign in
3. Cloudflare → Workers & Pages → Create
4. Pages → Connect to Git
5. GitHub → Authorize Cloudflare Pages
6. Install & Authorize
7. Repository access:
   ● Only select repositories
   ▼ Select repositories
   [x] MyMeditationApp
8. Install
9. Cloudflare → Vybrat: tomaspatloka/MyMeditationApp
10. Begin setup
```

### Scénář B: Cloudflare už je nainstalován

```
1. GitHub.com → Settings → Installations
2. Cloudflare Pages → Configure
3. Repository access:
   Změnit na: Only select repositories
4. Select repositories ▼
5. [x] MyMeditationApp
6. Save
7. Cloudflare → Refresh stránku
8. Teď byste měli vidět MyMeditationApp
```

---

## 🔐 Bezpečnostní poznámky

### Co Cloudflare Pages může dělat:

✅ **Může:**
- Číst obsah repozitáře
- Detekovat nové commity
- Stahovat kód pro build
- Vytvářet deployment status checks

❌ **Nemůže:**
- Měnit váš kód
- Mazat repozitáře
- Přidávat/odebírat collaboratory
- Měnit nastavení repozitáře

### Oprávnění:
- **Read access:** Pro čtení kódu
- **Write access:** Pro deployment status (nepovinné)

---

## ✅ Checklist - Ověření správného nastavení

Po provedení nastavení zkontrolujte:

- [ ] GitHub → Settings → Installations → Cloudflare Pages je nainstalován
- [ ] Repository access: MyMeditationApp je zaškrtnutý
- [ ] Cloudflare → Connect to Git → MyMeditationApp je viditelný
- [ ] Můžete kliknout na "Begin setup"

Pokud všechny body ✅, můžete pokračovat s deploymentem!

---

## 🆘 Stále nefunguje?

### Krok 1: Kompletní reset
```
1. GitHub → Settings → Installations
2. Cloudflare Pages → Configure
3. Scroll dolů → Uninstall
4. Confirm
5. Cloudflare → Workers & Pages → Create → Pages
6. Connect to Git → GitHub
7. Authorize (znovu)
8. Install & Authorize
9. Vybrat: All repositories (nebo MyMeditationApp)
10. Install
```

### Krok 2: Kontaktujte support
- Cloudflare Community: https://community.cloudflare.com/
- GitHub Support: https://support.github.com/

---

## 📸 Co byste měli vidět

### Na GitHubu (Settings → Installations):
```
Installed GitHub Apps

Cloudflare Pages                          [Configure]
Installed [X] days ago
Repository access: [X] repositories
```

### Na Cloudflare (Connect to Git):
```
Select a repository

tomaspatloka/MyMeditationApp              [Begin setup]
Last updated: X hours ago
Branch: main
```

---

## 🎉 Po úspěšném nastavení

Až bude vše fungovat:

1. ✅ Cloudflare vidí MyMeditationApp
2. ✅ Můžete kliknout "Begin setup"
3. ✅ Postupujte podle RYCHLY_DEPLOYMENT.txt
4. ✅ Za 5 minut bude aplikace živá!

---

**Tento návod by měl vyřešit 99% problémů s přístupem! 🚀**

*Pokud máte jakékoliv problémy, vytvořte issue na GitHubu nebo mi dejte vědět.*
