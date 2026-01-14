
import React from 'react';
import { AdminSectionProps } from '../AdminDashboard';
import AdminFormField from '../../../components/admin/AdminFormField';

interface AdminHeroEditorProps extends AdminSectionProps {
    pageKey: 'home' | 'gallery' | 'blog' | 'aboutMe' | 'order';
}

const AdminHeroEditor: React.FC<AdminHeroEditorProps> = ({ data, setData, pageKey }) => {
    const isHome = pageKey === 'home';

    const axisLabels = (originX: 'left' | 'right', originY: 'top' | 'bottom') => {
        const x = originX === 'left' ? 'Doprava' : 'Doleva';
        const y = originY === 'top' ? 'Dolů' : 'Nahoru';
        return { x, y };
    };
    
    const handleChange = (field: string, value: string) => {
        setData(prev => {
            if (!prev) return null;
            if (isHome) {
                return {
                    ...prev,
                    general: { ...prev.general, [field]: value }
                };
            } else {
                return {
                    ...prev,
                    pageHeroes: {
                        ...prev.pageHeroes,
                        [pageKey]: { ...prev.pageHeroes[pageKey], [field]: value }
                    }
                };
            }
        });
    };

    const handleHeroTextChange = (field: string, value: any) => {
        setData((prev: any) => {
            if (!prev) return null;
            const current = prev.homeDecorations?.heroText || {
                enabled: true,
                text: 'Pomůžu ti začít trénovat správně, bezpečně a efektivně – podle tvých cílů, kondice a možností',
                originX: 'left',
                originY: 'bottom',
                offsetX: 24,
                offsetY: 96,
                width: 46,
                height: 0,
                bgColor: '#0F172A',
                bgOpacity: 65,
                font: 'sans'
            };
            return {
                ...prev,
                homeDecorations: {
                    ...prev.homeDecorations,
                    heroText: {
                        ...current,
                        [field]: value
                    }
                }
            };
        });
    };

    const inputClasses = "w-full bg-gray-50 border border-surface-dark/10 rounded-2xl p-4 text-surface-dark placeholder-surface-dark/30 focus:outline-none focus:border-neon-blaze transition-colors font-medium text-sm shadow-sm";

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-px w-10 neon-gradient"></div>
                <h3 className="text-xl font-black text-surface-dark uppercase tracking-tighter">HERO SEKCE</h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {isHome ? (
                    <div className="space-y-6">
                        <div className="space-y-6 p-6 md:p-8 bg-white rounded-[2rem] border border-surface-dark/5 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AdminFormField label="Jméno (Bílá část)" htmlFor="hero-h1">
                                    <input 
                                        type="text" 
                                        id="hero-h1"
                                        value={data.general.heroHeadlinePart1} 
                                        onChange={e => handleChange('heroHeadlinePart1', e.target.value)}
                                        className={inputClasses}
                                        placeholder="MARTIN"
                                    />
                                </AdminFormField>
                                <AdminFormField label="Příjmení (Gradient)" htmlFor="hero-accent">
                                    <input 
                                        type="text" 
                                        id="hero-accent"
                                        value={data.general.heroHeadlinePart3Accent} 
                                        onChange={e => handleChange('heroHeadlinePart3Accent', e.target.value)}
                                        className={inputClasses}
                                        placeholder="ŠŤASTNÝ"
                                    />
                                </AdminFormField>
                            </div>
                            <AdminFormField label="podnadpis" htmlFor="hero-slogan">
                                <input 
                                    type="text" 
                                    id="hero-slogan"
                                    value={data.general.slogan} 
                                    onChange={e => handleChange('slogan', e.target.value)}
                                    className={inputClasses}
                                    placeholder="Fitness Coach"
                                />
                            </AdminFormField>
                        </div>

                        <div className="space-y-6 p-6 md:p-8 bg-white rounded-[2rem] border border-surface-dark/5 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-sm font-black text-surface-dark uppercase tracking-tight">Text v hero sekci</h4>
                                    <p className="text-[10px] font-bold text-surface-dark/40 uppercase tracking-[0.25em] mt-1">Pozice + šířka/výška bloku (vrstva nad obrázkem)</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleHeroTextChange('enabled', !data.homeDecorations.heroText.enabled)}
                                    className={`w-14 h-8 rounded-full transition-all relative ${data.homeDecorations.heroText.enabled ? 'bg-neon-blaze shadow-neon-glow' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${data.homeDecorations.heroText.enabled ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>

                            <AdminFormField label="Text" htmlFor="hero-text">
                                <textarea
                                    id="hero-text"
                                    value={data.homeDecorations.heroText.text}
                                    onChange={e => handleHeroTextChange('text', e.target.value)}
                                    className={inputClasses}
                                    rows={3}
                                />
                            </AdminFormField>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AdminFormField label="Nulový bod" htmlFor="hero-text-origin">
                                    <select
                                        id="hero-text-origin"
                                        value={`${data.homeDecorations.heroText.originY}-${data.homeDecorations.heroText.originX}`}
                                        onChange={(e) => {
                                            const [originY, originX] = e.target.value.split('-') as ['top' | 'bottom', 'left' | 'right'];
                                            handleHeroTextChange('originX', originX);
                                            handleHeroTextChange('originY', originY);
                                        }}
                                        className={`${inputClasses} appearance-none`}
                                    >
                                        <option value="top-left">Levý horní roh</option>
                                        <option value="top-right">Pravý horní roh</option>
                                        <option value="bottom-left">Levý dolní roh</option>
                                        <option value="bottom-right">Pravý dolní roh</option>
                                    </select>
                                </AdminFormField>

                                <AdminFormField label={`Šířka bloku (${data.homeDecorations.heroText.width}%)`} htmlFor="hero-text-width">
                                    <input
                                        type="range"
                                        id="hero-text-width"
                                        min={20}
                                        max={80}
                                        value={data.homeDecorations.heroText.width}
                                        onChange={e => handleHeroTextChange('width', parseInt(e.target.value, 10) || 0)}
                                        className="w-full accent-neon-blaze"
                                    />
                                </AdminFormField>

                                <AdminFormField label={`Výška bloku (${data.homeDecorations.heroText.height || 0}px)`} htmlFor="hero-text-height" description="0 = automaticky podle obsahu">
                                    <input
                                        type="range"
                                        id="hero-text-height"
                                        min={0}
                                        max={360}
                                        step={10}
                                        value={data.homeDecorations.heroText.height || 0}
                                        onChange={e => handleHeroTextChange('height', parseInt(e.target.value, 10) || 0)}
                                        className="w-full accent-neon-blaze"
                                    />
                                </AdminFormField>

                                <AdminFormField label={`${axisLabels(data.homeDecorations.heroText.originX, data.homeDecorations.heroText.originY).x} (${data.homeDecorations.heroText.offsetX}px)`} htmlFor="hero-text-x">
                                    <input
                                        type="range"
                                        id="hero-text-x"
                                        min={-200}
                                        max={400}
                                        value={data.homeDecorations.heroText.offsetX}
                                        onChange={e => handleHeroTextChange('offsetX', parseInt(e.target.value, 10) || 0)}
                                        className="w-full accent-neon-blaze"
                                    />
                                </AdminFormField>

                                <AdminFormField label={`${axisLabels(data.homeDecorations.heroText.originX, data.homeDecorations.heroText.originY).y} (${data.homeDecorations.heroText.offsetY}px)`} htmlFor="hero-text-y">
                                    <input
                                        type="range"
                                        id="hero-text-y"
                                        min={-200}
                                        max={400}
                                        value={data.homeDecorations.heroText.offsetY}
                                        onChange={e => handleHeroTextChange('offsetY', parseInt(e.target.value, 10) || 0)}
                                        className="w-full accent-neon-blaze"
                                    />
                                </AdminFormField>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-surface-dark/5">
                                <AdminFormField label="Font" htmlFor="hero-text-font">
                                    <select
                                        id="hero-text-font"
                                        value={data.homeDecorations.heroText.font || 'sans'}
                                        onChange={e => handleHeroTextChange('font', e.target.value)}
                                        className={`${inputClasses} appearance-none`}
                                    >
                                        <option value="sans">Běžný text</option>
                                        <option value="heading">Nadpisový</option>
                                    </select>
                                </AdminFormField>

                                <AdminFormField label={`Průhlednost pozadí (${data.homeDecorations.heroText.bgOpacity ?? 65}%)`} htmlFor="hero-text-bg-opacity">
                                    <input
                                        type="range"
                                        id="hero-text-bg-opacity"
                                        min={0}
                                        max={100}
                                        value={data.homeDecorations.heroText.bgOpacity ?? 65}
                                        onChange={e => handleHeroTextChange('bgOpacity', parseInt(e.target.value, 10) || 0)}
                                        className="w-full accent-neon-blaze"
                                    />
                                </AdminFormField>

                                <AdminFormField label="Barva pozadí" htmlFor="hero-text-bg-color">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            id="hero-text-bg-color"
                                            value={data.homeDecorations.heroText.bgColor || '#0F172A'}
                                            onChange={e => handleHeroTextChange('bgColor', e.target.value)}
                                            className="w-12 h-12 rounded-xl border border-surface-dark/10 bg-white"
                                        />
                                        <input
                                            type="text"
                                            value={data.homeDecorations.heroText.bgColor || '#0F172A'}
                                            onChange={e => handleHeroTextChange('bgColor', e.target.value)}
                                            className={inputClasses}
                                            placeholder="#0F172A"
                                        />
                                    </div>
                                </AdminFormField>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 p-6 md:p-8 bg-white rounded-[2rem] border border-surface-dark/5 shadow-sm">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AdminFormField label="Titulek Stránky" htmlFor="hero-title">
                                <input 
                                    type="text" 
                                    id="hero-title"
                                    value={data.pageHeroes[pageKey].titlePart1} 
                                    onChange={e => handleChange('titlePart1', e.target.value)}
                                    className={inputClasses}
                                />
                            </AdminFormField>
                            <AdminFormField label="Akcentovaný Titulek" htmlFor="hero-accent">
                                <input 
                                    type="text" 
                                    id="hero-accent"
                                    value={data.pageHeroes[pageKey].titlePart2Accent} 
                                    onChange={e => handleChange('titlePart2Accent', e.target.value)}
                                    className={inputClasses}
                                />
                            </AdminFormField>
                        </div>
                        <AdminFormField label="podnadpis" htmlFor="hero-desc">
                            <input 
                                type="text" 
                                id="hero-desc"
                                value={data.pageHeroes[pageKey].description} 
                                onChange={e => handleChange('description', e.target.value)}
                                className={inputClasses}
                                placeholder="Stručný popis sekce..."
                            />
                        </AdminFormField>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHeroEditor;
