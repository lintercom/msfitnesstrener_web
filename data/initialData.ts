
import { SiteData, SectionDecoration } from '../types';

const defaultDecoration: SectionDecoration = {
  enabled: false,
  imageUrl: '',
  originX: 'right',
  originY: 'top',
  offsetX: 0,
  offsetY: 0,
  scale: 40,
  opacity: 50,
  rotation: 0
};

export const initialData: SiteData = {
  general: {
    companyName: "Martin Šťastný",
    logo: "/msfitnesstrener_web/images/logo.png",
    logoScale: 100,
    heroImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80",
    favicon: "/favicon.ico",
    slogan: "OSOBNÍ TRENÉR",
    heroHeadlinePart1: "MARTIN",
    heroHeadlinePart2: "",
    heroHeadlinePart3Accent: "ŠŤASTNÝ",
    heroText: "Překonej své limity s profesionálním vedením. Individuální přístup, tréninkové plány na míru a podpora na cestě za tvým lepším já.",
    servicesHighlightText: "Specializuji se na komplexní rozvoj síly, kondice a mobility.",
    contactEmail: "info@martinstastny.cz",
    contactPhone: "+420 123 456 789",
    address: "Vizovice, Zlínský kraj",
    copyright: "© 2026 Martin Šťastný. Všechna práva vyhrazena.",
    socials: {
      facebook: 'https://www.facebook.com/profile.php?id=61578971855848&sk=about',
      instagram: 'https://www.instagram.com/martin_stastny_fitness_coach?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
    },
  },
  pageHeroes: {
    services: {
      titlePart1: 'Fitness',
      titlePart2Accent: 'Služby',
      description: 'MOJE SLUŽBY'
    },
    gallery: {
      titlePart1: 'Proces',
      titlePart2Accent: 'Tréninků',
      description: 'PRÁCE S KLIENTY'
    },
    blog: {
      titlePart1: 'Zkušenosti a',
      titlePart2Accent: 'Přístup',
      description: 'ODBORNÉ ČLÁNKY'
    },
    order: {
      titlePart1: 'Začít',
      titlePart2Accent: 'Spolupráci',
      description: 'Vstupní formulář a rezervace termínu tréninků'
    },
    aboutMe: {
      titlePart1: 'Kdo je',
      titlePart2Accent: 'Martin?',
      description: 'MOJE CESTA'
    }
  },
  homeDecorations: {
    hero: { ...defaultDecoration, enabled: true },
    services: { ...defaultDecoration },
    process: { ...defaultDecoration },
    gallery: { ...defaultDecoration },
  },
  navigation: {
    headerNavLinks: [
      { id: 'nav1', name: 'Domů', path: '/' },
      { id: 'nav2', name: 'Služby', path: '/#sluzby' },
      { id: 'nav3', name: 'Tréninky', path: '/galerie' },
      { id: 'nav4', name: 'Blog', path: '/blog' },
      { id: 'nav5', name: 'O mně', path: '/o-mne' },
    ],
    footerNavLinks: [
      { id: 'fnav1', name: 'Domů', path: '/' },
      { id: 'fnav2', name: 'Služby', path: '/#sluzby' },
      { id: 'fnav3', name: 'Tréninky', path: '/galerie' },
      { id: 'fnav4', name: 'Blog', path: '/blog' },
      { id: 'fnav5', name: 'O mně', path: '/o-mne' },
      { id: 'fnav6', name: 'Spolupráce', path: '/objednat' },
    ]
  },
  services: [
    {
      id: 's-osobni-trenink',
      title: 'Osobní trénink',
      description: 'Individuální osobní trénink ve Vizovicích a Zlíně, zaměřený na hubnutí, zpevnění postavy a nárůst svalové hmoty.\nTréninky probíhají v soukromém fitku v blízkosti Vizovic nebo v moderním Dynamic Fitness ve Zlíně a vždy se přizpůsobují tvému cíli, kondici a časovým možnostem.\n\nSpolečně nastavíme dlouhodobě udržitelný plán, který dává smysl a přináší výsledky – bez zbytečných extrémů a univerzálních tréninků.\n\n✔ individuální přístup\n✔ jasný plán a progres\n✔ vhodné i pro začátečníky',
      materials: ['Hubnutí', 'Síla', 'Postava'],
      processSteps: ['Vstupní konzultace', 'Diagnostika', 'Tréninkový plán', 'Pravidelný progres'],
      order: 1,
      fields: [],
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    },
    {
      id: 's-sportovni-priprava',
      title: 'Sportovní příprava',
      subheading: '10–18 let',
      description: 'Sportovní trénink pro děti a mládež, určený pro aktivní sportovce, kteří se chtějí zlepšit ve výkonu, rychlosti a síle.\nTrénink slouží jako ideální doplněk ke klubovým sportům, jako je fotbal, hokej, atletika a další.\n\nZaměřujeme se na plyometrii, práci s medicinbaly, rozvoj stability, dynamiky a výbušnosti, vždy s ohledem na věk a zdravý vývoj pohybového aparátu.\n\n✔ rozvoj sportovního výkonu\n✔ bezpečný a systematický přístup\n✔ vhodné pro různé sporty',
      materials: ['Mládež', 'Výkon', 'Dynamika'],
      processSteps: ['Analýba pohybu', 'Specifická příprava', 'Testování výkonu'],
      order: 2,
      fields: [],
      imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1470&auto=format&fit=crop',
    },
    {
      id: 's-zavodni-priprava',
      title: 'Kondiční trénink',
      description: 'Kondiční a silová příprava pro sportovce, kteří se chystají na Spartan Race, Hyrox nebo kompletní běžecké závody.\nPomohu ti nastavit strukturovranný tréninkový plán, který odpovídá konkrétním nárokům závodu.\n\nDůraz klademe na vytrvalost, sílu, regeneraci a závodní specifika, aby ses postavil na start připravený a s jistotou.\n\n✔ cílená příprava na závody\n✔ systematický trénink\n✔ minimalizace rizika zranění',
      materials: ['Spartan', 'Hyrox', 'Kondice'],
      processSteps: ['Závodní strategie', 'Periodizace', 'Simulace závodu'],
      order: 3,
      fields: [],
      imageUrl: 'https://images.unsplash.com/photo-1524646349956-1590eacfa324?q=80&w=1470&auto=format&fit=crop',
    },
    {
      id: 's-skupinovy-trenink',
      title: 'Skupinový trénink',
      subheading: 'Kettlebell Total Steel',
      description: 'Intenzivní skupinový silový trénink (vedená lekce) zaměřený na práci s kettlebilly, funkční sílu a silovou vytrvalost.\nTréninky probíhají pod odborným vedením, kde se naučíte správnou techniku a posunete své limity.\n\nSkupinová forma přináší motivaci, energii a tempo, které tě donutí posunout se dál, než bys šel sám.\n\n✔ vedená lekce s kettlebilly\n✔ vysoký energetický výdej\n✔ motivace skupiny',
      materials: ['Energie', 'Kettlebell', 'Motivace'],
      processSteps: ['Technika', 'Hlavní blok', 'Finisher'],
      order: 4,
      fields: [],
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop',
    },
    {
      id: 's-kruhovy-trenink',
      title: 'Kruhový trénink',
      subheading: '10–18 let',
      description: 'Kruhový trénink určený pro sportující mládež, zaměřený na rozvoj celkové kondice, síly a koordinace.\nTrénink kombinuje plyometrii, medicinbaly, silová a kondiční cvičení v jednom strukturovaném bloku.\n\nIdeální jako doplněk ke klubovému tréninku, podpora sportovního růstu a prevence zranění.\n\n✔ komplexní rozvoj kondice\n✔ vhodné pro mladé sportovce\n✔ důraz na správnou techniku',
      materials: ['Koordinace', 'Kruhová forma', 'Pohyb'],
      processSteps: ['Warm-up', 'Okruhy', 'Zklidnění'],
      order: 5,
      fields: [],
      imageUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=1474&auto=format&fit=crop',
    },
  ],
  gallery: [
    {
      id: 'g1',
      title: 'Redukce: Jan M.',
      description: 'Změna kompozice těla zaměřená na úbytek viscerálního tuku při zachování maximální síly v základních cvicích.',
      imageUrls: [
        'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1470&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop'
      ],
      material: 'Body Recomp',
      printTime: '16 týdnů',
      consumption: '-12.5 kg',
      note: 'Dosaženo bez drastických diet.',
      tags: ['hubnutí', 'síla', 'pokrok'],
      serviceIds: ['s-osobni-trenink'],
    },
    {
      id: 'g2',
      title: 'Objem: Petr S.',
      description: 'Cílený nárůst svalové hmoty s důrazem na symetrii a techniku.',
      imageUrls: [
        'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?q=80&w=1470&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop'
      ],
      material: 'Hypertrofie',
      printTime: '24 týdnů',
      consumption: '+8 kg svalů',
      note: 'Zaměřeno na silový trojboj.',
      tags: ['objem', 'síla', 'atletika'],
      serviceIds: ['s-osobni-trenink'],
    }
  ],
  blog: [
    {
      id: 'b1',
      title: 'Proč kardio před silovým tréninkem ničí tvé zisky?',
      excerpt: 'Věda mluví jasně. Pokud je tvým cílem síla a hypertofie, pořadí aktivit hraje klíčovou roli.',
      content: `Tréninková strategie je často předmětem diskuzí, ale biomechanika a endokrinologie nám dávají jasné odpověmi. Když se podíváme na mechanismus mTOR a AMP-kinázu, zjistíme, že tyto dvě dráhy jdou často proti sobě.
        
        Silový trénink primárily stimuluje syntézu bílkovin skrze dráhu mTOR. Naproti tomu vytrvalostní aktivita (kardio) zvyšuje hladinu AMP v buňkách, což aktivuje AMP-kinázu – enzym, který se snaží šetřit energií a může tlumit anabolické procesy.
        
        Pokud zařadíte náročné kardio bezprostředně před silový trénink, dojde k několika negativním jevům:
        1. Vyčerpání glykogenových zásob, což omezí vaši schopnost generovat maximální sílu.
        2. Centrální únava nervové soustavy, která sníží nábor motorických jednotek.
        3. Hormonální prostředí nakloněné katabolismu skrze zvýšenou hladinu kortizolu.
        
        Ideálním řešením je oddělit these aktivity alespoň o 6-24 hodin, nebo zařadit kardio až po silovém tréninku v mírné intenzitě pro podporu regenerace a prokrvení tkání.`,
      date: '15.05.2024',
      category: 'Věda o tréninku',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
      readTime: '6 min'
    },
    {
      id: 'b2',
      title: 'Biomechanika dřepu: Jsou kolena před špičkou skutečně problém?',
      excerpt: 'Mýtus, který v gymech přežívá desetiletí. Rozebíráme kinematiku dolních končetin.',
      content: `Mnoho trenérů stále trvá na tom, že kolena nesmí při dřepu přesáhnout úroveň špiček. Tento názor vychází ze studií ze 70. let, které ale nebraly v potaz celkové zatížení řetězce.

        Pokud se snažíme za každou cenu udržet kolena za špičku, dochází k extrémnímu předklonu trupu, což dramaticky zvyšuje střižné síly v bederní páteři. Lidské tělo je stavěno na to, aby koleno v hlubokém dřepu mírně přesahovalo špičku – je to přirozený mechanismus pro udržení těžiště a zapojení kvadricepsů.

        Klíčem není omezovat pohyb kolene, ale zaměřit se na mobilitu hlezenního kloubu a kontrolu kyčlí. Pokud je technika správná a zátěž progresivní, kolena před špičkou nepředstavují žádné riziko.`,
      date: '02.06.2024',
      category: 'Technika',
      imageUrl: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=1470&auto=format&fit=crop',
      readTime: '8 min'
    }
  ],
  faq: [
    {
      id: 'f1',
      question: 'Je trénink vhodný i pro lidi s bolestmi zad?',
      answer: 'Ano, právě diagnostika a nápravná cvičení jsou základem mé práce.',
    },
  ],
  howWeWorkSteps: [
    {
      title: 'Vstupní Analýza',
      description: 'Hloubkový rozbor tvého zdravotního stavu, historie a ambicí.'
    },
    {
      title: 'Návrh Strategie',
      description: 'Sestavení tvého unikátního tréninkového a nutričního protokolu.'
    }
  ],
  machines: [
    {
      id: 'm1',
      name: 'Základna: Vizovice',
      imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop',
      description: 'Tréninková základna s nekompromisním vybavením pro silový trénink i rehabilitaci.',
      specs: [
        'Špičkové vybavení Hammer Strength',
        'Zóna volných vah',
        'Prostředí pro absolutní soustředění',
      ],
    }
  ],
  materials: [
    { id: 'mat1', name: 'Silový trénink', description: 'Základ pro budování tkání a kostní hustoty.' },
    { id: 'mat2', name: 'Nutriční timing', description: 'Strategické rozvržení živin pro regeneraci.' }
  ],
  seo: {
    siteName: 'Martin Šťastný',
    titleSeparator: '|',
    home: {
      title: 'Osobní trenér Vizovice | Martin Šťastný',
      description: 'Profesionální fitness trenér ve Vizovicích a Zlíně. Individuální osobní tréninky, tréninkové plány na míru a nápravné cvičení.',
      keywords: 'osobní trenér, vizovice, zlín, zlínský kraj, fitness trenér, cvičení, hubnutí, silový trénink'
    },
    services: {
      title: 'Služby a Ceník | Osobní trenér Vizovice',
      description: 'Komplexní fitness služby - osobní tréninky ve Vizovicích, sportovní příprava mládeže a online spolupráce. Vyberte si program na míru.',
      keywords: 'ceník fitness, osobní trénink vizovice, sportovní příprava, online coaching'
    },
    gallery: {
      title: 'Výsledky a Galerie | Osobní trenér Martin Šťastný',
      description: 'Reálné proměny klientů a ukázky z tréninků ve Vizovicích. Podívejte se, jakých výsledků dosahujeme společně.',
      keywords: 'proměny postavy, výsledky cvičení, foto před a po, fitness galerie'
    },
    blog: {
      title: 'Fitness Blog | Tipy od trenéra',
      description: 'Odborné články o tréninku, stravě a zdravém životním stylu. Tipy pro efektivní cvičení a regeneraci.',
      keywords: 'fitness blog, články o cvičení, zdravá strava, tipy trenéra'
    },
    aboutMe: {
      title: 'O mně | Martin Šťastný - Osobní trenér',
      description: 'Jsem certifikovaný fitness trenér se zaměřením na silový trénink a zdravý pohyb. Působím ve Vizovicích a okolí Zlína.',
      keywords: 'o trenérovi, martin šťastný, kvalifikace trenéra, vizovice'
    },
    order: {
      title: 'Nezávazná poptávka | Začít cvičit',
      description: 'Vyplňte krátký formulář a domluvte si úvodní konzultaci. První krok k vaší lepší kondici a zdraví.',
      keywords: 'objednat trénink, konzultace zdarma, začít cvičit vizovice'
    },
    globalKeywords: 'osobní trenér, vizovice, zlínský kraj, fitness, cvičení, zdravý životní styl, hubnutí, náběr svalů',
    ogImage: '',
  },
  orderForm: {
    firstName: { enabled: true, required: true, label: 'Jméno' },
    lastName: { enabled: true, required: true, label: 'Příjmení' },
    email: { enabled: true, required: true, label: 'E-mail' },
    phone: { enabled: true, required: true, label: 'Telefon' },
    note: { enabled: true, required: true, label: 'Tvá motivace' },
    servicesSelection: { enabled: true, required: true, label: 'VYBERTE SLUŽBY' },
    consentText: 'Souhlasím se zpracováním osobních údajů'
  },
  appearance: {
    colors: {
      background: '#0F172A',
      surface: '#D1D5DB',
      primaryText: '#F8FAFC',
      secondaryText: '#94A3B8',
      accent: '#FB923C',
      accentHover: '#F43F5E',
      border: 'rgba(255,255,255,0.1)',
      footerBg: '#D1D5DB',
      footerText: '#0F172A',
      footerTextSecondary: '#475569',
    },
    fonts: {
      sans: "'Manrope', sans-serif",
      heading: "'Space Grotesk', sans-serif",
    },
    components: {
      globalRadius: '2rem',
      globalShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    },
    header: {
      logoPosition: 'left',
      logoMaxWidth: '140px'
    },
    layout: {
      baseFontSize: '16px',
      contentMaxWidth: '1440px',
      layoutType: 'full-width',
    },
    decorativeImages: [],
  },
  integrations: {
    headScripts: '',
    bodyScripts: '',
    email: {
      enabled: true,
      provider: 'emailjs',
      config: {
        serviceId: 'service_2m1lsn8',
        templateId: 'template_cxbqppi',
        publicKey: 'oH75QBxPioG8wjGwj',
        notificationEmail: 'slavik-petr@seznam.cz',
        recoveryEmail: 'slavik-petr@seznam.cz'
      }
    }
  },
  localization: {
    defaultLang: 'cs',
    dateFormat: 'dd.MM.yyyy',
    multiLanguage: false,
  },
  legal: {
    cookieConsent: {
      enabled: true,
      text: 'Tento web používá nezbytné technické a analytické soubory cookies pro zajištění správné funkčnosti a analýzu návštěvnosti.',
      linkText: 'Zásady ochrany soukromí',
      linkUrl: '/ochrana-soukromi',
      buttonText: 'Souhlasím'
    }
  },
  ai: {
    enabled: true,
    botName: 'Asistent Martina Šťastného',
    welcomeMessage: 'Dobrý den, jak vám mohu pomoci s vaším tréninkem nebo progresem?',
    systemPrompt: 'Jste zkušený fitness asistent pro osobního trenéra Martina Šťastného. Odpovídejte profesionálně, povzbudivě a věcně v češtině na dotazy ohledně tréninku, výživy a služeb ve Vizovicích a Zlínském kraji.',
    model: 'gemini-3-flash-preview'
  },
};
