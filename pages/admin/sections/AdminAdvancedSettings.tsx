
import React, { useState } from 'react';
import { AdminSectionProps } from '../AdminDashboard';
import { PageSEO, SiteData } from '../../../types';
import AdminFormField from '../../../components/admin/AdminFormField';
import ImageUploader from '../../../components/admin/ImageUploader';
import JSZip from 'jszip';
import { useAuth } from '../../../context/AuthContext';
import AdminAppearanceSettings from './AdminAppearanceSettings';

// NEW: Settings Tab Definition
type SettingsTab = 'global' | 'appearance' | 'seo' | 'security' | 'system' | 'integrations';

// --- SHARED COMPONENTS ---

const baseInputClasses = "w-full bg-gray-50 border border-surface-dark/5 rounded-2xl p-5 text-surface-dark placeholder-surface-dark/30 focus:outline-none focus:border-neon-blaze transition-all font-medium text-base shadow-sm";

const SettingCard: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white rounded-[2.5rem] border border-surface-dark/5 p-8 lg:p-10 shadow-sm transition-all h-full">
        {title && (
            <div className="flex items-center gap-5 mb-8">
                <div className="h-px w-10 neon-gradient"></div>
                <h4 className="text-xl font-black text-surface-dark uppercase tracking-tighter">{title}</h4>
            </div>
        )}
        <div className="relative z-10">
            {children}
        </div>
    </div>
);

// Reusable Internal Tabs (Must match style in Appearance for consistency)
const InternalTabs: React.FC<{
    tabs: { id: string; label: string }[]; // Updated to accept id/label objects
    activeTab: string;
    onTabChange: (tab: string) => void;
}> = ({ tabs, activeTab, onTabChange }) => (
    <div className="flex flex-wrap gap-2 mb-8 bg-gray-50/50 p-1.5 rounded-full w-fit border border-surface-dark/5">
        {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                    ? 'bg-surface-dark text-white shadow-md'
                    : 'text-surface-dark/40 hover:text-surface-dark hover:bg-white/50'
                    }`}
            >
                {tab.label}
            </button>
        ))}
    </div>
);

// --- CARD NAVIGATION COMPONENTS (Reused style from AdminContent) ---

interface PageCardProps {
    id: SettingsTab;
    label: string;
    icon: React.ReactElement;
    isActive: boolean;
    onClick: () => void;
}

const SettingsControlCard: React.FC<PageCardProps> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2.5 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all border ${isActive
            ? 'bg-surface-dark border-surface-dark text-white shadow-lg'
            : 'bg-white border-surface-dark/5 text-surface-dark/60 hover:bg-gray-50'
            }`}
    >
        <div className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-colors ${isActive ? 'bg-white/10 text-white' : 'bg-surface-dark/5 text-surface-dark/40'
            }`}>
            {React.cloneElement(icon as React.ReactElement<any>, { className: "w-4 h-4 md:w-5 md:h-5" })}
        </div>

        <div className="text-left">
            <div className={`text-[11px] md:text-[13px] font-black uppercase tracking-tight ${isActive ? 'text-white' : 'text-surface-dark'}`}>
                {label}
            </div>
        </div>
    </button>
);


// --- TAB COMPONENTS ---

const GlobalTab: React.FC<AdminSectionProps> = ({ data, setData, showToast }) => {
    const [activeSubTab, setActiveSubTab] = useState('identity');

    const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'range' || type === 'number' ? parseInt(value, 10) : value;
        setData(prev => prev ? { ...prev, general: { ...prev.general, [name]: val } } : null);
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prev => prev ? { ...prev, general: { ...prev.general, socials: { ...prev.general.socials, [name]: value } } } : null);
    };

    const tabs = [
        { id: 'identity', label: 'Identita' },
        { id: 'media', label: 'Média' },
        { id: 'contact', label: 'Kontakty' }
    ];

    return (
        <div className="h-full">
            <InternalTabs tabs={tabs} activeTab={activeSubTab} onTabChange={setActiveSubTab} />

            {activeSubTab === 'identity' && (
                <SettingCard title="Identita Firmy">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AdminFormField label="Název projektu" htmlFor="companyName">
                            <input type="text" id="companyName" name="companyName" value={data.general.companyName} onChange={handleGeneralChange} className={baseInputClasses} />
                        </AdminFormField>
                        <AdminFormField label="Slogan" htmlFor="slogan">
                            <input type="text" id="slogan" name="slogan" value={data.general.slogan} onChange={handleGeneralChange} className={baseInputClasses} />
                        </AdminFormField>
                    </div>
                </SettingCard>
            )}

            {activeSubTab === 'media' && (
                <SettingCard title="Loga & Grafika">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ImageUploader
                            label="Logo (Světlé - pro tmavé pozadí)"
                            imageUrl={data.general.logo.light}
                            onImageChange={(url) => setData(prev => prev ? { ...prev, general: { ...prev.general, logo: { ...prev.general.logo, light: url || '' } } } : null)}
                            showToast={showToast}
                        />
                        <ImageUploader
                            label="Logo (Tmavé - pro světlé pozadí)"
                            imageUrl={data.general.logo.dark}
                            onImageChange={(url) => setData(prev => prev ? { ...prev, general: { ...prev.general, logo: { ...prev.general.logo, dark: url || '' } } } : null)}
                            showToast={showToast}
                        />
                        <AdminFormField label="Velikost loga (%)" htmlFor="logoScale">
                            <input type="range" id="logoScale" name="logoScale" min="20" max="200" value={data.general.logoScale || 100} onChange={handleGeneralChange} className="w-full accent-neon-blaze" />
                            <div className="text-right text-sm font-bold text-surface-dark">{data.general.logoScale || 100}%</div>
                        </AdminFormField>
                        <AdminFormField label="Favicon" htmlFor="favicon">
                            <input type="text" id="favicon" name="favicon" value={data.general.favicon} onChange={handleGeneralChange} className={baseInputClasses} />
                        </AdminFormField>
                    </div>
                </SettingCard>
            )}

            {activeSubTab === 'contact' && (
                <div className="space-y-8">
                    <SettingCard title="Kontaktní údaje">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <AdminFormField label="E-mail" htmlFor="contactEmail">
                                <input type="email" id="contactEmail" name="contactEmail" value={data.general.contactEmail} onChange={handleGeneralChange} className={baseInputClasses} />
                            </AdminFormField>
                            <AdminFormField label="Telefon" htmlFor="contactPhone">
                                <input type="text" id="contactPhone" name="contactPhone" value={data.general.contactPhone} onChange={handleGeneralChange} className={baseInputClasses} />
                            </AdminFormField>
                        </div>
                    </SettingCard>

                    <SettingCard title="Sociální sítě">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <AdminFormField label="Facebook" htmlFor="facebook">
                                <input type="text" id="facebook" name="facebook" value={data.general.socials.facebook} onChange={handleSocialChange} className={baseInputClasses} />
                            </AdminFormField>
                            <AdminFormField label="Instagram" htmlFor="instagram">
                                <input type="text" id="instagram" name="instagram" value={data.general.socials.instagram} onChange={handleSocialChange} className={baseInputClasses} />
                            </AdminFormField>
                        </div>
                    </SettingCard>
                </div>
            )}
        </div>
    );
};

const SecurityTab: React.FC<AdminSectionProps> = ({ showToast }) => {
    const { updateCredentials, currentUser } = useAuth();
    const [username, setUsername] = useState(currentUser?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdate = () => {
        if (!username || !password) {
            showToast('Vyplňte prosím uživatelské jméno a heslo.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Hesla se neshodují.', 'error');
            return;
        }

        updateCredentials(username, password);
        showToast('Přihlašovací údaje byly aktualizovány.', 'success');
        setPassword('');
        setConfirmPassword('');
    };

    const tabs = [{ id: 'password', label: 'Heslo & Přístup' }];

    return (
        <div>
            {/* Consistent 1-tab layout */}
            <InternalTabs tabs={tabs} activeTab="password" onTabChange={() => { }} />

            <SettingCard title="Změna přihlášení">
                <div className="space-y-6 max-w-xl">
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-orange-800 text-sm mb-6">
                        <p className="font-bold mb-1">Důležité upozornění:</p>
                        <p>Jelikož se jedná o aplikaci bez serverové databáze, přihlašovací údaje se ukládají do vašeho prohlížeče. Pokud vymažete data prohlížeče, obnoví se výchozí: <strong>admin / admin</strong>.</p>
                    </div>

                    <AdminFormField label="Uživatelské jméno" htmlFor="sec-username">
                        <input type="text" id="sec-username" value={username} onChange={(e) => setUsername(e.target.value)} className={baseInputClasses} />
                    </AdminFormField>

                    <AdminFormField label="Nové heslo" htmlFor="sec-password">
                        <input type="password" id="sec-password" value={password} onChange={(e) => setPassword(e.target.value)} className={baseInputClasses} placeholder="Zadejte nové heslo" />
                    </AdminFormField>

                    <AdminFormField label="Potvrzení hesla" htmlFor="sec-confirm">
                        <input type="password" id="sec-confirm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={baseInputClasses} placeholder="Zadejte heslo znovu" />
                    </AdminFormField>

                    <button
                        onClick={handleUpdate}
                        className="w-full py-4 neon-gradient text-white rounded-full font-black uppercase tracking-[0.3em] shadow-lg hover:shadow-neon-glow transition-all text-xs"
                    >
                        Uložit změny
                    </button>
                </div>
            </SettingCard>
        </div>
    );
};

const SeoTab: React.FC<AdminSectionProps> = ({ data, setData }) => {
    const [activePage, setActivePage] = useState('home');

    const SEO_PAGES = [
        { key: 'home', name: 'Domů' },
        { key: 'services', name: 'Služby' },
        { key: 'gallery', name: 'Coaching' },
        { key: 'aboutMe', name: 'O mně' },
    ] as const;

    const handleSeoChange = (page: any, field: keyof PageSEO, value: string) => {
        setData(prev => prev ? {
            ...prev,
            seo: { ...prev.seo, [page]: { ...prev.seo[page], [field]: value } }
        } : null);
    };

    const tabs = SEO_PAGES.map(p => ({ id: p.key, label: p.name }));
    const currentPage = SEO_PAGES.find(p => p.key === activePage);

    return (
        <div>
            <InternalTabs tabs={tabs} activeTab={activePage} onTabChange={setActivePage} />

            {currentPage && (
                <SettingCard title={`SEO: ${currentPage.name}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <AdminFormField label="Titulek (Title)" htmlFor={`seo-title-${activePage}`} description="Zobrazí se v záložce prohlížeče a ve vyhledávání.">
                            <input type="text" id={`seo-title-${activePage}`} value={data.seo[activePage].title} onChange={(e) => handleSeoChange(activePage, 'title', e.target.value)} className={baseInputClasses} />
                        </AdminFormField>
                        <AdminFormField label="Popis (Description)" htmlFor={`seo-desc-${activePage}`} description="Krátký popis stránky pro vyhledávače (cca 160 znaků).">
                            <textarea id={`seo-desc-${activePage}`} value={data.seo[activePage].description} onChange={(e) => handleSeoChange(activePage, 'description', e.target.value)} className={baseInputClasses} rows={4}></textarea>
                        </AdminFormField>
                    </div>
                </SettingCard>
            )}
        </div>
    );
};

const SystemTab: React.FC<AdminSectionProps> = ({ data, showToast }) => {
    const svgToPng = (svgStr: string, width: number, height: number): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('Canvas context not available');

            const scale = 2;
            canvas.width = width * scale;
            canvas.height = height * scale;

            const img = new Image();
            const svgBase64 = btoa(unescape(encodeURIComponent(svgStr)));
            const url = `data:image/svg+xml;base64,${svgBase64}`;

            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.scale(scale, scale);
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject('PNG generation failed');
                }, 'image/png', 0.8);
            };

            img.onerror = () => {
                reject('SVG conversion failed');
            };

            img.src = url;
        });
    };

    const exportBrandIdentityZip = async () => {
        const h1 = data.general.heroHeadlinePart1 || 'MARTIN';
        const hAccent = data.general.heroHeadlinePart3Accent || 'ŠŤASTNÝ';
        const sloganText = data.general.slogan || 'FITNESS COACH';

        const zip = new JSZip();
        showToast('Exportuji brand kit...', 'success');

        const headlineSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="400" viewBox="0 0 1400 400"><defs><linearGradient id="ms-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#FB923C;stop-opacity:1" /><stop offset="100%" style="stop-color:#F43F5E;stop-opacity:1" /></linearGradient></defs><style>.txt { font-family: sans-serif; font-weight: 900; font-size: 110px; text-transform: uppercase; letter-spacing: -0.04em; }</style><text x="70" y="240" class="txt" fill="#FFFFFF">${h1}<tspan fill="url(#ms-grad)" dx="35">${hAccent}</tspan></text></svg>`;
        const sloganSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="200" viewBox="0 0 1000 200"><defs><linearGradient id="ms-grad-line" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#FB923C;stop-opacity:1" /><stop offset="100%" style="stop-color:#F43F5E;stop-opacity:1" /></linearGradient></defs><style>.slgn { font-family: sans-serif; font-weight: 800; font-size: 22px; text-transform: uppercase; letter-spacing: 0.6em; fill: #94A3B8; }</style><rect x="70" y="93" width="90" height="5" rx="2" fill="url(#ms-grad-line)" /><text x="195" y="105" class="slgn">${sloganText}</text></svg>`;

        try {
            const hPng = await svgToPng(headlineSVG, 1400, 400);
            const sPng = await svgToPng(sloganSVG, 1000, 200);

            zip.file("MS_Headline.svg", headlineSVG);
            zip.file("MS_Headline.png", hPng);
            zip.file("MS_Slogan.svg", sloganSVG);
            zip.file("MS_Slogan.png", sPng);

            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = `MS_Brand_Assets.zip`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            showToast('Export selhal', 'error');
        }
    };

    const exportSystemBlueprint = () => {
        showToast('Exportuji blueprint...', 'success');

        const blueprint = {
            projectMeta: {
                name: "Martin Šťastný Hub",
                exportDate: new Date().toISOString()
            },
            currentSnapshot: data
        };

        const jsonStr = JSON.stringify(blueprint, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ms-hub-blueprint.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const tabs = [
        { id: 'backup', label: 'Zálohování' },
        { id: 'assets', label: 'Podklady' }
    ];
    const [activeSubTab, setActiveSubTab] = useState('backup');

    return (
        <div>
            <InternalTabs tabs={tabs} activeTab={activeSubTab} onTabChange={setActiveSubTab} />

            {activeSubTab === 'backup' && (
                <SettingCard title="Nástroje systému">
                    <div className="space-y-4 max-w-md">
                        <p className="text-sm text-surface-dark/70 mb-4">Vytvořte si úplnou zálohu nastavení webu do jednoho souboru.</p>
                        <button
                            onClick={exportSystemBlueprint}
                            className="w-full px-6 py-4 bg-surface-dark text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:neon-gradient transition-all flex items-center justify-center gap-3"
                        >
                            Exportovat (.json)
                        </button>
                    </div>
                </SettingCard>
            )}

            {activeSubTab === 'assets' && (
                <SettingCard title="Firemní Identita">
                    <div className="space-y-4 max-w-md">
                        <p className="text-sm text-surface-dark/70 mb-4">Stáhněte si balíček s logem, sloganem a dalšími prvky vizuální identity.</p>
                        <button
                            onClick={exportBrandIdentityZip}
                            className="w-full px-6 py-4 bg-surface-dark text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:neon-gradient transition-all flex items-center justify-center gap-3"
                        >
                            Stáhnout (.zip)
                        </button>
                    </div>
                </SettingCard>
            )}
        </div>
    );
};

const IntegrationsTab: React.FC<AdminSectionProps> = ({ data, setData }) => {
    // Initialize email config if missing (backward compatibility)
    React.useEffect(() => {
        if (!data.integrations.email) {
            setData((prev: SiteData) => prev ? {
                ...prev,
                integrations: {
                    ...prev.integrations,
                    email: {
                        enabled: true,
                        provider: 'emailjs',
                        config: {
                            serviceId: '',
                            templateId: '',
                            publicKey: '',
                            notificationEmail: 'slavik-petr@seznam.cz'
                        }
                    }
                }
            } : null);
        }
    }, []);

    if (!data.integrations.email) {
        return <div>Inicializace integrací...</div>;
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev: SiteData) => prev ? {
            ...prev,
            integrations: {
                ...prev.integrations,
                email: {
                    ...prev.integrations.email,
                    config: {
                        ...prev.integrations.email.config,
                        [name]: value
                    }
                }
            }
        } : null);
    };

    const toggleEmail = () => {
        setData((prev: SiteData) => prev ? {
            ...prev,
            integrations: {
                ...prev.integrations,
                email: {
                    ...prev.integrations.email,
                    enabled: !prev.integrations.email.enabled
                }
            }
        } : null);
    };

    const tabs = [{ id: 'email', label: 'Email (EmailJS)' }];

    return (
        <div>
            <InternalTabs tabs={tabs} activeTab="email" onTabChange={() => { }} />

            <SettingCard title="Konfigurace odesílání emailů">
                <div className="space-y-8">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-surface-dark/5">
                        <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${data.integrations.email.enabled ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-300'}`}></div>
                            <div>
                                <h4 className="font-bold text-surface-dark text-sm uppercase tracking-wide">Aktivovat odesílání</h4>
                                <p className="text-xs text-surface-dark/60">Povolí odesílání formulářů přes EmailJS</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleEmail}
                            className={`w-12 h-7 rounded-full transition-colors relative ${data.integrations.email.enabled ? 'bg-neon-blaze' : 'bg-gray-200'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-all ${data.integrations.email.enabled ? 'left-6' : 'left-1'}`}></div>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AdminFormField label="Service ID" htmlFor="serviceId" description="ID služby z EmailJS dashboardu">
                            <input type="text" id="serviceId" name="serviceId" value={data.integrations.email.config.serviceId} onChange={handleEmailChange} className={baseInputClasses} placeholder="service_xxxxxx" />
                        </AdminFormField>
                        <AdminFormField label="Template ID" htmlFor="templateId" description="ID šablony z EmailJS">
                            <input type="text" id="templateId" name="templateId" value={data.integrations.email.config.templateId} onChange={handleEmailChange} className={baseInputClasses} placeholder="template_xxxxxx" />
                        </AdminFormField>
                        <AdminFormField label="Public Key" htmlFor="publicKey" description="Váš veřejný API klíč">
                            <input type="password" id="publicKey" name="publicKey" value={data.integrations.email.config.publicKey} onChange={handleEmailChange} className={baseInputClasses} placeholder="*********" />
                        </AdminFormField>
                        <AdminFormField label="Notifikační Email" htmlFor="notificationEmail" description="Email, kam budou chodit poptávky">
                            <input type="email" id="notificationEmail" name="notificationEmail" value={data.integrations.email.config.notificationEmail} onChange={handleEmailChange} className={baseInputClasses} placeholder="email@example.com" />
                        </AdminFormField>
                        <AdminFormField label="Email pro obnovu hesla" htmlFor="recoveryEmail" description="Na tento email bude zasláno nové heslo při obnově">
                            <input type="email" id="recoveryEmail" name="recoveryEmail" value={data.integrations.email.config.recoveryEmail} onChange={handleEmailChange} className={baseInputClasses} placeholder="email@example.com" />
                        </AdminFormField>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-800 text-sm">
                        <p className="font-bold mb-2">Jak nastavit šablonu v EmailJS:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs opacity-80">
                            <li>Vytvořte novou šablonu v sekci "Email Templates".</li>
                            <li>Použijte tyto proměnné: <code>{'{{to_email}}'}</code>, <code>{'{{reply_to}}'}</code>, <code>{'{{message}}'}</code>, <code>{'{{from_name}}'}</code>, <code>{'{{phone}}'}</code>, <code>{'{{services}}'}</code>.</li>
                            <li>Pro automatickou odpověď klientovi zapněte v nastavení šablony "Auto-Reply" nebo vytvořte druhou šablonu.</li>
                        </ul>
                    </div>
                </div>
            </SettingCard>
        </div>
    );
};

// --- MAIN COMPONENT ---

const AdminSettings: React.FC<AdminSectionProps> = (props) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('global');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'global': return <GlobalTab {...props} />;
            case 'appearance': return <AdminAppearanceSettings {...props} />;
            case 'seo': return <SeoTab {...props} />;
            case 'security': return <SecurityTab {...props} />;
            case 'system': return <SystemTab {...props} />;
            case 'integrations': return <IntegrationsTab {...props} />;
            default: return null;
        }
    };

    const tabs: { id: SettingsTab, label: string, icon: React.ReactElement }[] = [
        {
            id: 'global',
            label: 'Globální',
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
        },
        {
            id: 'appearance',
            label: 'Vzhled',
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 11-2.119-5.931 3 3 0 015.93 2.119c-.312.312-.625.624-.938.937M4.5 9.75v-1.5a14.99 14.99 0 013.785-3.37L10.5 2.5l2.215 2.38a14.99 14.99 0 013.785 3.37v1.5M10.5 7.5v-1M13.5 7.5v-1" /></svg>
        },
        {
            id: 'seo',
            label: 'SEO',
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
        },
        {
            id: 'security',
            label: 'Zabezpečení',
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
        },
        {
            id: 'system',
            label: 'Systém',
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>
        },
        {
            id: 'integrations',
            label: 'Integrace',
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
        },
    ];

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            {/* Navigation Cards */}
            <div className="bg-white p-2 md:p-3 rounded-2xl md:rounded-[2rem] border border-surface-dark/5 shadow-md overflow-x-auto custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 md:gap-3 min-w-[320px]">
                    {tabs.map(tab => (
                        <SettingsControlCard
                            key={tab.id}
                            {...tab}
                            isActive={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-surface rounded-3xl md:rounded-[2.5rem] border border-surface-dark/5 p-4 sm:p-8 lg:p-12 relative overflow-hidden shadow-sm">
                <div className="relative z-10 w-full">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
