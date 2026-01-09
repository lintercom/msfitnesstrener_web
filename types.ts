
export interface NavLink {
  id: string;
  name: string;
  path: string;
}

export interface FormFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'file' | 'select' | 'radio';
  required: boolean;
  options?: string[];
  optionsSource?: 'materials';
  description?: string;
}

export interface Service {
  id: string;
  title: string;
  subheading?: string; // Nové pole pro text v závorce (např. věk)
  description: string;
  materials: string[];
  processSteps: string[];
  order: number;
  fields: FormFieldDefinition[];
  imageUrl: string;
  imageScale?: number;
  imageOpacity?: number; // 0-100
  imageRotation?: number; // degrees
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  material: string;
  printTime: string;
  consumption: string;
  note: string;
  tags: string[];
  serviceIds: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface HowWeWorkStep {
  title: string;
  description: string;
  link?: {
    text: string;
    path: string;
  };
}

export interface PageSEO {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  link?: {
    text: string;
    path: string;
  };
}

export interface MaterialDetail {
  id: string;
  name: string;
  description: string;
}

export interface MachineInfo {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  specs: string[];
  imageScale?: number;
  imageOpacity?: number; // 0-100
  imageRotation?: number; // degrees
}

export interface OrderFormFieldSetting {
  enabled: boolean;
  required: boolean;
  label: string;
}

export interface DecorativeImage {
  id: string;
  enabled: boolean;
  imageUrl: string;
  width: string; // e.g. '45%' or '300px'
  opacity: number;
  rotate: number;
  right: string; // e.g. '10px' or '-5%'
  bottom: string; // e.g. '10px' or '-5%'
  zIndex: number;
}

export interface SectionDecoration {
  enabled: boolean;
  imageUrl: string;
  originX: 'left' | 'right'; // Horizontal anchor point
  originY: 'top' | 'bottom'; // Vertical anchor point
  offsetX: number; // Pixels
  offsetY: number; // Pixels
  scale: number; // Percentage (Size)
  opacity: number; // 0-100
  rotation: number; // degrees
}

export interface GeneralSettings {
  companyName: string;
  logo: string;
  logoScale: number;
  heroImage: string;
  favicon: string;
  slogan: string;
  heroHeadlinePart1: string;
  heroHeadlinePart2: string;
  heroHeadlinePart3Accent: string;
  heroText: string;
  servicesHighlightText: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  copyright: string;
  socials: {
    facebook: string;
    instagram: string;
  };
}

export interface NavigationSettings {
  headerNavLinks: NavLink[];
  footerNavLinks: NavLink[];
}

export interface AppearanceSettings {
  colors: {
    background: string;
    surface: string;
    primaryText: string;
    secondaryText: string;
    accent: string;
    accentHover: string;
    border: string;
    footerBg: string;
    footerText: string;
    footerTextSecondary: string;
  };
  fonts: {
    sans: string;
    heading: string;
  };
  components: {
    globalRadius: string;
    globalShadow: string;
  };
  header: {
    logoPosition: 'left' | 'center' | 'right';
    logoMaxWidth: string; // e.g. '120px'
  };
  layout: {
    baseFontSize: string;
    contentMaxWidth: string;
    layoutType: 'full-width' | 'boxed';
  };
  decorativeImages: DecorativeImage[];
}


export interface SeoSettings {
  siteName: string;
  titleSeparator: string;
  home: PageSEO;
  services: PageSEO;
  gallery: PageSEO;
  blog: PageSEO;
  aboutMe: PageSEO;
  order: PageSEO;
  globalKeywords: string;
  ogImage: string;
}

export interface LegalSettings {
  cookieConsent: {
    enabled: boolean;
    text: string;
    linkText: string;
    linkUrl: string;
    buttonText: string;
  };
}

export interface IntegrationsSettings {
  headScripts: string;
  bodyScripts: string;
  email: {
    enabled: boolean;
    provider: 'emailjs';
    config: {
      serviceId: string;
      templateId: string;
      publicKey: string;
      notificationEmail: string;
      resetTemplateId?: string;
      recoveryEmail: string;
    }
  };
}

export interface LocalizationSettings {
  defaultLang: string;
  dateFormat: string;
  multiLanguage: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this should be a hash
  isAdmin: boolean;
}

export interface PageHeroConfig {
  titlePart1: string;
  titlePart2Accent: string;
  description: string;
}

// Added AISettings interface
export interface AISettings {
  enabled: boolean;
  botName: string;
  welcomeMessage: string;
  systemPrompt: string;
  model: string;
}

export interface SiteData {
  general: GeneralSettings;
  pageHeroes: {
    services: PageHeroConfig;
    gallery: PageHeroConfig;
    blog: PageHeroConfig;
    aboutMe: PageHeroConfig;
    order: PageHeroConfig;
  };
  homeDecorations: {
    hero: SectionDecoration;
    services: SectionDecoration;
    process: SectionDecoration;
    gallery: SectionDecoration;
  };
  navigation: NavigationSettings;
  services: Service[];
  gallery: GalleryItem[];
  blog: BlogPost[];
  faq: FaqItem[];
  howWeWorkSteps: HowWeWorkStep[];
  machines: MachineInfo[];
  materials: MaterialDetail[];
  seo: SeoSettings;
  orderForm: {
    firstName: OrderFormFieldSetting;
    lastName: OrderFormFieldSetting;
    email: OrderFormFieldSetting;
    phone: OrderFormFieldSetting;
    note: OrderFormFieldSetting;
    servicesSelection: OrderFormFieldSetting;
    consentText: string;
  };
  appearance: AppearanceSettings;
  integrations: IntegrationsSettings;
  localization: LocalizationSettings;
  legal: LegalSettings;
  // Added ai property to SiteData
  ai: AISettings;
}