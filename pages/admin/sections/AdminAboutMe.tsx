
import React from 'react';
import { AdminSectionProps } from '../AdminDashboard';
import AdminFormField from '../../../components/admin/AdminFormField';
import ImageUploader from '../../../components/admin/ImageUploader';

const AdminAboutMe: React.FC<AdminSectionProps> = ({ data, setData, showToast }) => {
    
    const handleChange = (field: string, value: string) => {
        setData(prev => prev ? {
            ...prev,
            general: { ...prev.general, [field]: value }
        } : null);
    };

    const inputClasses = "w-full bg-gray-50 border border-surface-dark/10 rounded-2xl p-4 text-surface-dark placeholder-surface-dark/30 focus:outline-none focus:border-neon-blaze transition-colors font-medium text-base shadow-sm";

    return (
        <div className="space-y-8 md:space-y-12">
            <div className="flex items-center gap-4">
                <div className="h-px w-10 neon-gradient"></div>
                <h3 className="text-lg md:text-xl font-black text-surface-dark uppercase tracking-tighter leading-tight">PROFIL</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* TEXTOVÁ ČÁST */}
                <div className="lg:col-span-7">
                    <div className="bg-white border border-surface-dark/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm space-y-8 h-full flex flex-col">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-1.5 h-6 neon-gradient rounded-full"></div>
                            <h4 className="text-[10px] font-black text-surface-dark/40 uppercase tracking-[0.4em]">OBSAH STRÁNKY</h4>
                        </div>

                        <AdminFormField 
                            label="Profesní titul / Slogan" 
                            htmlFor="mission"
                        >
                            <input 
                                id="mission"
                                type="text"
                                value={data.general.slogan}
                                onChange={e => handleChange('slogan', e.target.value)}
                                className={inputClasses}
                                placeholder="NAPŘ. ELITNÍ PERFORMANCE COACH"
                            />
                        </AdminFormField>

                        <AdminFormField 
                            label="" 
                            htmlFor="bio"
                            className="flex-grow flex flex-col"
                        >
                            <textarea 
                                id="bio"
                                value={data.general.heroText} 
                                onChange={e => handleChange('heroText', e.target.value)}
                                className={`${inputClasses} flex-grow min-h-[300px]`}
                                rows={12}
                                placeholder="Popište svou cestu k fitness, zkušenosti a přístup ke klientům..."
                            />
                        </AdminFormField>
                    </div>
                </div>

                {/* VIZUÁLNÍ ČÁST */}
                <div className="lg:col-span-5">
                    <div className="bg-white border border-surface-dark/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm flex flex-col items-center h-full">
                        <div className="flex items-center gap-4 mb-8 w-full">
                            <div className="w-1.5 h-6 neon-gradient rounded-full"></div>
                            <h4 className="text-[10px] font-black text-surface-dark/40 uppercase tracking-[0.4em]">PORTRÉT</h4>
                        </div>

                        <div className="w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden border border-surface-dark/10 shadow-xl relative bg-gray-100 mb-8">
                            {data.general.heroImage ? (
                                <img 
                                    src={data.general.heroImage} 
                                    className="w-full h-full object-cover grayscale brightness-95" 
                                    alt="Portrét náhled" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-surface-dark/10">
                                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </div>
                            )}
                        </div>
                        
                        <div className="w-full mt-auto">
                            <ImageUploader 
                                label="" 
                                imageUrl={data.general.heroImage} 
                                onImageChange={url => handleChange('heroImage', url || '')} 
                                showToast={showToast} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAboutMe;
