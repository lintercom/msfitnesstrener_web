# Zadávací dokumentace
## Webová prezentace osobního fitness trenéra

**Verze:** 1.0  
**Datum:** Leden 2026  
**Klient:** Martin Šťastný – Osobní trenér  
**Lokalita:** Vizovice, Zlínský kraj

---

## 1. ÚVOD A CÍL PROJEKTU

### 1.1 Popis projektu
Vytvoření moderní webové prezentace pro osobního fitness trenéra působícího ve Vizovicích a Zlínském kraji. Web bude sloužit jako hlavní marketingový nástroj pro získávání nových klientů a prezentaci služeb.

### 1.2 Hlavní cíle
- Profesionální prezentace osoby trenéra a jeho služeb
- Generování leadů (poptávek) od potenciálních klientů
- Edukace návštěvníků prostřednictvím blogu
- Budování důvěryhodnosti skrze galerii výsledků klientů
- Snadná správa obsahu bez nutnosti programátorských znalostí

### 1.3 Cílová skupina
- Lidé 25-55 let hledající osobního trenéra
- Aktivní sportovci (mládež 10-18 let a jejich rodiče)
- Závodníci připravující se na Spartan Race, Hyrox apod.
- Lidé s bolestmi zad hledající nápravné cvičení

---

## 2. FUNKČNÍ POŽADAVKY

### 2.1 Veřejná část webu

#### 2.1.1 Hlavní stránka (Homepage)
| Sekce | Popis |
|-------|-------|
| **Hero sekce** | Velký úvodní banner s fotografií trenéra, jménem, sloganem a CTA tlačítkem |
| **Služby** | Přehled nabízených služeb s kartami (osobní trénink, sportovní příprava, kondiční trénink, skupinové tréninky) |
| **Proces spolupráce** | Timeline/kroky jak začít spolupracovat |
| **Galerie ukázek** | Náhled nejnovějších výsledků klientů |
| **CTA sekce** | Výzva k akci s odkazem na objednávku |

#### 2.1.2 Stránka služeb
- Detailní popis každé služby
- Místa konání (lokality)
- Ceník (volitelně)
- Štítky/tagy pro filtrování (Hubnutí, Síla, Mládež, atd.)
- CTA tlačítko pro objednání

#### 2.1.3 Galerie/Portfolio
- Zobrazení výsledků klientů (před/po, průběh spolupráce)
- Lightbox/modal pro detailní zobrazení
- Metadata: doba spolupráce, dosažené výsledky, poznámky
- Propojení s relevantními službami

#### 2.1.4 Blog
- Odborné články o tréninku a výživě
- Kategorizace článků
- Doba čtení
- SEO optimalizovaný obsah
- Modal pro čtení článku bez přesměrování

#### 2.1.5 O mně
- Osobní příběh trenéra
- Kvalifikace a certifikace
- Fotografie
- Hodnoty a přístup k tréninku

#### 2.1.6 Objednávkový formulář
- Kontaktní údaje (jméno, email, telefon)
- Výběr služby
- Textové pole pro motivaci/cíle klienta
- Souhlas se zpracováním osobních údajů
- Rezervační odkazy (Calendly/Reservio integrace)
- Odesílání notifikací na email trenéra

#### 2.1.7 Právní stránky
- Ochrana osobních údajů (GDPR)
- Obchodní podmínky
- Cookie consent banner

### 2.2 Administrační rozhraní (CMS)

#### 2.2.1 Přístup
- Zabezpečený login (heslo + token)
- Automatické odhlášení po nečinnosti

#### 2.2.2 Správa obsahu
| Modul | Funkce |
|-------|--------|
| **Obecné nastavení** | Logo, název, kontaktní údaje, sociální sítě |
| **Hero sekce** | Editace textu, pozice obrázku trenéra, textový overlay |
| **Služby** | CRUD operace, pořadí, obrázky, ceníky, lokality |
| **Galerie** | Upload obrázků, popisky, propojení se službami |
| **Blog** | WYSIWYG editor, kategorie, SEO údaje |
| **FAQ** | Otázky a odpovědi |
| **Navigace** | Header a footer menu |
| **Objednávkový formulář** | Konfigurace polí, rezervační odkazy |

#### 2.2.3 Nastavení vzhledu
- Barevné schéma (background, text, akcenty)
- Fonty (nadpisy, běžný text)
- Zaoblení rohů, stíny
- Pozice loga
- Layout (šířka obsahu)
- Dekorativní obrázky na pozadí sekcí

#### 2.2.4 SEO nastavení
- Title a description pro každou stránku
- Keywords
- Open Graph metadata
- Generování sitemap.xml
- robots.txt

#### 2.2.5 Integrace
- EmailJS konfigurace (odesílání formulářů)
- Vlastní skripty (analytics, tracking)
- Cookie consent nastavení

#### 2.2.6 Zálohy a export
- Export kompletních dat (JSON)
- Export brand kitu (logo v SVG)
- Export sitemap
- ZIP archiv kompletní zálohy

### 2.3 Technické funkce

#### 2.3.1 Automatické ukládání
- Změny z administrace se automaticky synchronizují na server
- Fallback na localStorage pro offline práci
- Validace tokenu při ukládání

#### 2.3.2 Responzivní design
- Plná podpora mobilních zařízení
- Optimalizované obrázky
- Touch-friendly navigace

#### 2.3.3 Rychlost načítání
- Lazy loading obrázků
- Komprese obrázků při uploadu
- Minimalizace CSS/JS

---

## 3. NEFUNKČNÍ POŽADAVKY

### 3.1 Design a UX
- Moderní, tmavé téma (dark mode)
- Premium vzhled odpovídající fitness branži
- Plynulé animace a přechody
- Intuitivní navigace
- Konzistentní vizuální jazyk

### 3.2 Technické požadavky
| Parametr | Požadavek |
|----------|-----------|
| **Hosting** | Sdílený webhosting s PHP podporou |
| **SSL** | HTTPS povinné |
| **Prohlížeče** | Chrome, Firefox, Safari, Edge (poslední 2 verze) |
| **Mobilní zařízení** | iOS 14+, Android 10+ |
| **Rozlišení** | 320px – 2560px |

### 3.3 SEO požadavky
- Validní HTML5 struktura
- Správné heading hierarchy (H1-H6)
- Alt texty u obrázků
- Rychlost načítání < 3s
- Core Web Vitals v zelené zóně

### 3.4 Bezpečnost
- Sanitizace vstupů
- CORS ochrana API endpointů
- Token autentizace pro admin
- HTTPS only

---

## 4. STRUKTURA WEBU (SITEMAP)

```
/                           → Hlavní stránka
├── /#sluzby               → Sekce služeb (kotva)
├── /galerie               → Portfolio/Výsledky klientů
├── /blog                  → Odborné články
├── /o-mne                 → O trenérovi
├── /objednat              → Objednávkový formulář
├── /ochrana-soukromi      → GDPR
├── /obchodni-podminky     → Podmínky
├── /admin                 → Přihlášení do administrace
└── /admin/dashboard       → Administrační rozhraní
```

---

## 5. DATOVÝ MODEL

### 5.1 Služba (Service)
```
- id: string
- title: string
- subheading: string (volitelně, např. věková kategorie)
- description: string (markdown)
- materials: string[] (štítky)
- processSteps: string[]
- imageUrl: string
- locations: string[]
- prices: { label, price }[]
- order: number
```

### 5.2 Položka galerie (GalleryItem)
```
- id: string
- title: string
- description: string
- imageUrls: string[]
- material: string (typ transformace)
- printTime: string (doba spolupráce)
- consumption: string (výsledek, např. "-12kg")
- note: string
- tags: string[]
- serviceIds: string[] (propojení se službami)
```

### 5.3 Článek blogu (BlogPost)
```
- id: string
- title: string
- excerpt: string
- content: string (markdown/HTML)
- date: string
- category: string
- imageUrl: string
- readTime: string
```

### 5.4 Obecná nastavení (GeneralSettings)
```
- companyName: string
- logo: string (URL/base64)
- logoScale: number
- slogan: string
- heroHeadlinePart1-3: string
- heroText: string
- contactEmail: string
- contactPhone: string
- address: string
- copyright: string
- socials: { facebook, instagram }
```

---

## 6. API ENDPOINTY

| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/api/save-content.php` | POST | Uložení kompletních dat webu |
| `/api/send-email.php` | POST | Odeslání kontaktního formuláře |
| `/website_content.json` | GET | Načtení aktuálních dat webu |

---

## 7. TECHNOLOGIE

### 7.1 Frontend
- **Framework:** React 18+ s TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **State management:** Context API

### 7.2 Backend
- **Server:** Apache s PHP 8+
- **Databáze:** JSON soubory (bez SQL)
- **Email:** EmailJS (třetí strana)

### 7.3 Deployment
- Build: `npm run build`
- Output: statické soubory v `/dist`
- PHP endpointy v `/api`

---

## 8. FÁZE REALIZACE

### Fáze 1: Příprava (1 týden)
- [ ] Analýza konkurence
- [ ] Wireframes klíčových stránek
- [ ] Výběr barevného schématu a fontů
- [ ] Příprava obsahu (texty, fotografie)

### Fáze 2: Design (1-2 týdny)
- [ ] UI design v návrhovém nástroji
- [ ] Mobilní verze
- [ ] Schválení klientem

### Fáze 3: Vývoj (3-4 týdny)
- [ ] Setup projektu (React, Tailwind, TypeScript)
- [ ] Komponenty UI
- [ ] Veřejné stránky
- [ ] Administrační rozhraní
- [ ] API endpointy
- [ ] Integrace EmailJS

### Fáze 4: Testování (1 týden)
- [ ] Responzivita na různých zařízeních
- [ ] Funkčnost formulářů
- [ ] SEO audit
- [ ] Rychlost načítání
- [ ] Cross-browser testování

### Fáze 5: Nasazení (2-3 dny)
- [ ] Konfigurace hostingu
- [ ] SSL certifikát
- [ ] DNS nastavení
- [ ] Migrace dat
- [ ] Finální kontrola

### Fáze 6: Předání (1 den)
- [ ] Školení klienta na práci s CMS
- [ ] Dokumentace
- [ ] Předání přístupových údajů

---

## 9. CO MUSÍ PŘEDCHÁZET PROGRAMOVÁNÍ

### 9.1 Od klienta potřebujeme:
1. **Branding**
   - Logo ve vektorovém formátu (SVG/AI)
   - Barevná paleta (pokud existuje)
   - Preferovaný styl (reference webů, které se líbí)

2. **Texty a obsah**
   - Úvodní text/slogan
   - Popis všech služeb
   - Ceníky
   - O mně/příběh
   - FAQ odpovědi
   - Právní texty (GDPR, podmínky)

3. **Fotografie**
   - Profesionální fotografie trenéra (min. 3-5)
   - Fotky z tréninků
   - Fotky klientů (před/po) se souhlasem
   - Fotky fitness centra/lokality

4. **Kontaktní údaje**
   - Email, telefon
   - Adresa/lokality působení
   - Sociální sítě

5. **Technické přístupy**
   - Přístup k hostingu (FTP/cPanel)
   - Přístup k doméně (DNS)
   - EmailJS účet (nebo vytvoříme)

### 9.2 Designová rozhodnutí:
1. Barevné schéma (tmavé/světlé, primární barvy)
2. Typografie (fonty pro nadpisy a text)
3. Styl fotografií (filtry, ořez)
4. Struktura navigace
5. CTA texty (výzvy k akci)

### 9.3 Business rozhodnutí:
1. Ceníková strategie (zobrazovat/skrýt ceny)
2. Způsob rezervací (formulář/Calendly/telefon)
3. Sledování konverzí (GA4, Meta Pixel?)
4. Newsletter integrace (ano/ne)
5. Chatbot/live chat (ano/ne)

---

## 10. AKCEPTAČNÍ KRITÉRIA

Web bude považován za dokončený, pokud:

- [ ] Všechny stránky jsou funkční a responzivní
- [ ] Administrace umožňuje editaci všech obsahových sekcí
- [ ] Formulář správně odesílá emaily
- [ ] SEO metadata jsou správně vyplněna
- [ ] Web načítá do 3 sekund na 4G připojení
- [ ] Funguje ve všech moderních prohlížečích
- [ ] Cookie consent je implementován dle GDPR
- [ ] Klient je proškolen na práci s CMS

---

## 11. KONTAKTY

**Klient:**  
Martin Šťastný  
Email: info@martinstastny.cz  
Web: martin-stastny.cz

**Realizace:**  
[Doplnit kontakt na vývojáře/agenturu]

---

*Tento dokument slouží jako podklad pro realizaci webové prezentace. Jakékoliv změny oproti této specifikaci vyžadují písemný souhlas obou stran.*
