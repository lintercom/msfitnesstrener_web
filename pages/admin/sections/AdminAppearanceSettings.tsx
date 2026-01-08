
import React, { useState } from 'react';
import { AdminSectionProps } from '../AdminDashboard';
import { AppearanceSettings, SiteData, DecorativeImage } from '../../../types';
import AdminFormField from '../../../components/admin/AdminFormField';
import ImageUploader from '../../../components/admin/ImageUploader';
import AdminModal from '../../../components/admin/AdminModal';

// --- SHARED STYLES & COMPONENTS ---

const baseInputClasses = "w-full bg-gray-50 border border-surface-dark/5 rounded-2xl p-4 text-surface-dark placeholder-surface-dark/30 focus:outline-none focus:border-neon-blaze transition-all font-medium text-sm shadow-sm";

const SettingCard: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white rounded-[2rem] border border-surface-dark/5 p-6 lg:p-8 shadow-sm transition-all h-full">
        {title && (
            <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 neon-gradient"></div>
                <h4 className="text-lg font-black text-surface-dark uppercase tracking-tighter">{title}</h4>
            </div>
        )}
        <div className="relative z-10">
            {children}
        </div>
    </div>
);

// Internal Tab Component
const InternalTabs: React.FC<{
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}> = ({ tabs, activeTab, onTabChange }) => (
    <div className="flex flex-wrap gap-2 mb-8 bg-gray-50/50 p-1.5 rounded-full w-fit border border-surface-dark/5">
        {tabs.map(tab => (
            <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                    ? 'bg-surface-dark text-white shadow-md'
                    : 'text-surface-dark/40 hover:text-surface-dark hover:bg-white/50'
                    }`}
            >
                {tab}
            </button>
        ))}
    </div>
);

const FONT_OPTIONS = [
    { name: 'Inter', value: "'Inter', sans-serif" },
    { name: 'Roboto', value: "'Roboto', sans-serif" },
    { name: 'Poppins', value: "'Poppins', sans-serif" },
    { name: 'Lato', value: "'Lato', sans-serif" },
    { name: 'DM Sans', value: "'DM Sans', sans-serif" },
];

const RADIUS_OPTIONS = [
    { name: 'Ostré (0px)', value: '0px' },
    { name: 'Decentní (0.5rem)', value: '0.5rem' },
    { name: 'Plně zaoblené', value: '9999px' },
];

const SHADOW_OPTIONS = [
    { name: 'Žádný', value: 'none' },
    { name: 'Střední', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
    { name: 'Výrazný', value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
];

// --- SUB-COMPONENTS ---

const DecorativeImageForm: React.FC<{
    image: DecorativeImage;
    onSave: (image: DecorativeImage) => void;
    showToast: AdminSectionProps['showToast'];
}> = ({ image, onSave, showToast }) => {
    const [formData, setFormData] = useState(image);

    const handleChange = (field: keyof DecorativeImage, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form id="decorative-image-form" onSubmit={handleSubmit} className="space-y-6">
            <ImageUploader label="Obrázek" imageUrl={formData.imageUrl} onImageChange={url => handleChange('imageUrl', url || '')} showToast={showToast} />

            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-surface-dark/5">
                <input type="checkbox" id="img-enabled" checked={formData.enabled} onChange={e => handleChange('enabled', e.target.checked)} className="h-5 w-5 text-neon-blaze rounded border-gray-300 focus:ring-neon-blaze" />
                <label htmlFor="img-enabled" className="ml-3 font-bold text-surface-dark uppercase tracking-tight text-sm">Zobrazit obrázek</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminFormField label="Šířka" htmlFor="img-width" description="např. 45% nebo 300px">
                    <input type="text" id="img-width" value={formData.width} onChange={e => handleChange('width', e.target.value)} className={baseInputClasses} />
                </AdminFormField>
                <AdminFormField label="Z-Index" htmlFor="img-zIndex" description="Vrstva (např. -1)">
                    <input type="number" id="img-zIndex" value={formData.zIndex} onChange={e => handleChange('zIndex', parseInt(e.target.value, 10) || 0)} className={baseInputClasses} />
                </AdminFormField>
                <AdminFormField label="Pozice zprava" htmlFor="img-right" description="např. 0px nebo 10%">
                    <input type="text" id="img-right" value={formData.right} onChange={e => handleChange('right', e.target.value)} className={baseInputClasses} />
                </AdminFormField>
                <AdminFormField label="Pozice zespodu" htmlFor="img-bottom" description="např. 0px nebo 10%">
                    <input type="text" id="img-bottom" value={formData.bottom} onChange={e => handleChange('bottom', e.target.value)} className={baseInputClasses} />
                </AdminFormField>
            </div>

            <div className="space-y-4 pt-4 border-t border-surface-dark/5">
                <AdminFormField label={`Rotace (${formData.rotate}deg)`} htmlFor="img-rotate">
                    <input type="range" id="img-rotate" min="-180" max="180" value={formData.rotate} onChange={e => handleChange('rotate', parseInt(e.target.value, 10))} className="w-full accent-neon-blaze" />
                </AdminFormField>
                <AdminFormField label={`Průhlednost (${formData.opacity})`} htmlFor="img-opacity">
                    <input type="range" id="img-opacity" min="0" max="1" step="0.05" value={formData.opacity} onChange={e => handleChange('opacity', parseFloat(e.target.value))} className="w-full accent-neon-blaze" />
                </AdminFormField>
            </div>
        </form>
    );
};

// --- MAIN COMPONENT ---

const AdminAppearanceSettings: React.FC<AdminSectionProps> = ({ data, setData, showToast }) => {
    const [activeTab, setActiveTab] = useState('Design');

    // Helper to update specific appearance sections
    const handleUpdate = <T extends keyof AppearanceSettings>(section: T, key: keyof AppearanceSettings[T], value: any) => {
        setData(prev => {
            if (!prev) return null;
            const newData = JSON.parse(JSON.stringify(prev)) as SiteData;
            (newData.appearance[section] as any)[key] = value;
            return newData;
        });
    };

    // Header Helper - updated to accept any value (string | number | object)
    const handleHeaderChange = (field: keyof SiteData['appearance']['header'], value: any) => {
        setData(prev => prev ? { ...prev, appearance: { ...prev.appearance, header: { ...prev.appearance.header, [field]: value } } } : null);
    }

    // Color Input Helper
    const ColorInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-surface-dark/5 rounded-2xl">
            <label className="text-xs font-bold text-surface-dark uppercase tracking-tight">{label}</label>
            <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-surface-dark/5 shadow-sm">
                <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-6 h-6 rounded-lg border-none cursor-pointer" />
                <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-16 font-mono text-[10px] text-surface-dark bg-transparent focus:outline-none text-center" />
            </div>
        </div>
    );

    // DECORATIONS LOGIC
    const [modalState, setModalState] = useState<{ isOpen: boolean; image: DecorativeImage | null; }>({ isOpen: false, image: null });
    const openModal = (image: DecorativeImage | null) => {
        const newImage: DecorativeImage = image || { id: `img-${Date.now()}`, enabled: true, imageUrl: '', width: '30%', opacity: 1, rotate: 0, right: '0px', bottom: '0px', zIndex: 1 };
        setModalState({ isOpen: true, image: newImage });
    };
    const handleSaveImage = (imageToSave: DecorativeImage) => {
        setData(prev => {
            if (!prev) return null;
            const currentImages = prev.appearance.decorativeImages || [];
            const newImages = [...currentImages];
            const existingIndex = newImages.findIndex(img => img.id === imageToSave.id);
            if (existingIndex > -1) newImages[existingIndex] = imageToSave;
            else newImages.push(imageToSave);
            return { ...prev, appearance: { ...prev.appearance, decorativeImages: newImages } };
        });
        setModalState({ isOpen: false, image: null });
    };
    const handleDeleteImage = (id: string) => {
        if (window.confirm('Opravdu smazat?')) {
            setData(prev => prev ? { ...prev, appearance: { ...prev.appearance, decorativeImages: (prev.appearance.decorativeImages || []).filter(img => img.id !== id) } } : null);
        }
    };

    const appearance = data.appearance;

    const renderContent = () => {
        switch (activeTab) {
            case 'Design':
                return (
                    <SettingCard title="Barvy & Typografie">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h5 className="font-bold text-surface-dark/50 uppercase tracking-widest text-xs mb-2">Paleta barev</h5>
                                <ColorInput label="Primární (Accent)" value={appearance.colors.accent} onChange={v => handleUpdate('colors', 'accent', v)} />
                                <ColorInput label="Sekundární (Hover)" value={appearance.colors.accentHover} onChange={v => handleUpdate('colors', 'accentHover', v)} />
                                <ColorInput label="Text (Hlavní)" value={appearance.colors.primaryText} onChange={v => handleUpdate('colors', 'primaryText', v)} />
                                <ColorInput label="Text (Vedlejší)" value={appearance.colors.secondaryText} onChange={v => handleUpdate('colors', 'secondaryText', v)} />
                            </div>

                            <div className="space-y-6">
                                <h5 className="font-bold text-surface-dark/50 uppercase tracking-widest text-xs mb-2">Písma</h5>
                                <AdminFormField label="Nadpisy" htmlFor="font-heading">
                                    <select id="font-heading" value={appearance.fonts.heading} onChange={e => handleUpdate('fonts', 'heading', e.target.value)} className={`${baseInputClasses} appearance-none`}>
                                        {FONT_OPTIONS.map(opt => <option key={opt.name} value={opt.value} style={{ fontFamily: opt.value }}>{opt.name}</option>)}
                                    </select>
                                </AdminFormField>
                                <AdminFormField label="Běžný text" htmlFor="font-sans">
                                    <select id="font-sans" value={appearance.fonts.sans} onChange={e => handleUpdate('fonts', 'sans', e.target.value)} className={`${baseInputClasses} appearance-none`}>
                                        {FONT_OPTIONS.map(opt => <option key={opt.name} value={opt.value} style={{ fontFamily: opt.value }}>{opt.name}</option>)}
                                    </select>
                                </AdminFormField>
                                <AdminFormField label="Velikost zákl. textu" htmlFor="baseFontSize">
                                    <input type="text" id="baseFontSize" value={appearance.layout.baseFontSize} onChange={e => handleUpdate('layout', 'baseFontSize', e.target.value)} className={baseInputClasses} />
                                </AdminFormField>
                            </div>
                        </div>
                    </SettingCard>
                );
            case 'Layout':
                return (
                    <SettingCard title="Layout & Komponenty">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <AdminFormField label="Zaoblení prvků" htmlFor="globalRadius">
                                <select id="globalRadius" value={appearance.components.globalRadius} onChange={e => handleUpdate('components', 'globalRadius', e.target.value)} className={`${baseInputClasses} appearance-none`}>
                                    {RADIUS_OPTIONS.map(opt => <option key={opt.name} value={opt.value}>{opt.name}</option>)}
                                </select>
                            </AdminFormField>
                            <AdminFormField label="Stíny (Hloubka)" htmlFor="globalShadow">
                                <select id="globalShadow" value={appearance.components.globalShadow} onChange={e => handleUpdate('components', 'globalShadow', e.target.value)} className={`${baseInputClasses} appearance-none`}>
                                    {SHADOW_OPTIONS.map(opt => <option key={opt.name} value={opt.value}>{opt.name}</option>)}
                                </select>
                            </AdminFormField>
                        </div>
                        <div className="p-6 bg-gray-50 border border-surface-dark/5 rounded-3xl space-y-8">
                            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                                <h5 className="font-bold text-surface-dark uppercase tracking-tight text-sm">Hlavička</h5>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <AdminFormField label="Pozice loga" htmlFor="logoPosition">
                                    <select id="logoPosition" value={data.appearance.header.logoPosition || 'left'} onChange={e => handleHeaderChange('logoPosition', e.target.value)} className={`${baseInputClasses} appearance-none`}>
                                        <option value="left">Vlevo</option>
                                        <option value="center">Uprostřed</option>
                                        <option value="right">Vpravo</option>
                                    </select>
                                </AdminFormField>
                                <AdminFormField label="Max. šířka loga" htmlFor="logoMaxWidth">
                                    <input type="text" id="logoMaxWidth" value={data.appearance.header.logoMaxWidth} onChange={e => handleHeaderChange('logoMaxWidth', e.target.value)} className={baseInputClasses} placeholder="např. 140px" />
                                </AdminFormField>
                            </div>
                        </div>
                    </SettingCard>
                );
            case 'Dekorace':
                return (
                    <SettingCard title="Dekorace">
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-end">
                                <p className="text-surface-dark/60 text-sm max-w-lg">
                                    Přidejte plovoucí grafické prvky (kettlebelly, činky, tvary) na pozadí webu.
                                </p>
                                <button
                                    onClick={() => openModal(null)}
                                    className="bg-surface-dark text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:neon-gradient transition-all shadow-lg flex items-center gap-2"
                                >
                                    <span>+</span> Přidat
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(data.appearance.decorativeImages || []).map(img => (
                                    <div key={img.id} className="relative group bg-gray-50 rounded-2xl border border-surface-dark/5 p-4 aspect-square flex items-center justify-center overflow-hidden hover:shadow-md transition-all">
                                        {img.imageUrl ?
                                            <img src={img.imageUrl} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                            : <span className="text-xs text-gray-400 font-bold uppercase">Bez obr.</span>
                                        }
                                        <div className="absolute inset-0 bg-surface-dark/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                            <button onClick={() => openModal(img)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-surface-dark shadow-lg hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                                            </button>
                                            <button onClick={() => handleDeleteImage(img.id)} className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(data.appearance.decorativeImages || []).length === 0 && (
                                    <div className="col-span-full py-10 flex flex-col items-center justify-center text-surface-dark/30 border-2 border-dashed border-surface-dark/5 rounded-2xl">
                                        <span className="font-bold uppercase tracking-widest text-xs">Žádné dekorace</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </SettingCard>
                );
            default:
                return null;
        }
    };

    const modalFooter = (
        <div className="flex gap-3">
            <button type="button" onClick={() => setModalState({ isOpen: false, image: null })} className="px-6 py-3 bg-gray-100 text-surface-dark rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Zrušit</button>
            <button type="submit" form="decorative-image-form" className="px-6 py-3 neon-gradient text-white rounded-full text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all">Uložit</button>
        </div>
    );

    return (
        <div>
            <InternalTabs
                tabs={['Design', 'Layout', 'Dekorace']}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            {renderContent()}

            <AdminModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, image: null })}
                title={modalState.image?.imageUrl ? 'Upravit dekoraci' : 'Nová dekorace'}
                footer={modalFooter}
            >
                {modalState.image && <DecorativeImageForm image={modalState.image} onSave={handleSaveImage} showToast={showToast} />}
            </AdminModal>
        </div>
    );
};

export default AdminAppearanceSettings;
