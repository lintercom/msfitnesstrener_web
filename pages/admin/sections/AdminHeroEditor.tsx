
import React from 'react';
import { AdminSectionProps } from '../AdminDashboard';
import AdminFormField from '../../../components/admin/AdminFormField';

interface AdminHeroEditorProps extends AdminSectionProps {
    pageKey: 'home' | 'gallery' | 'blog' | 'aboutMe' | 'order';
}

const AdminHeroEditor: React.FC<AdminHeroEditorProps> = ({ data, setData, pageKey }) => {
    const isHome = pageKey === 'home';
    
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

    const inputClasses = "w-full bg-gray-50 border border-surface-dark/10 rounded-2xl p-4 text-surface-dark placeholder-surface-dark/30 focus:outline-none focus:border-neon-blaze transition-colors font-medium text-sm shadow-sm";

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-px w-10 neon-gradient"></div>
                <h3 className="text-xl font-black text-surface-dark uppercase tracking-tighter">HERO SEKCE</h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {isHome ? (
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
