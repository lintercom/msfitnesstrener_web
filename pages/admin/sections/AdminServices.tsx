
import React, { useState, useMemo } from 'react';
import { Service, FormFieldDefinition } from '../../../types';
import AdminModal from '../../../components/admin/AdminModal';
import { AdminSectionProps } from '../AdminDashboard';
import AdminFormField from '../../../components/admin/AdminFormField';

const ServiceForm: React.FC<{
    item: Service;
    onSave: (item: Service) => void;
    onCancel: () => void;
    showToast: AdminSectionProps['showToast']
}> = ({ item, onSave, onCancel, showToast }) => {
    const [formData, setFormData] = useState<Service>(item);

    const inputClasses = "w-full bg-gray-50 border border-surface-dark/10 rounded-2xl p-4 text-surface-dark placeholder-surface-dark/30 focus:outline-none focus:border-neon-blaze transition-colors font-medium text-sm shadow-sm";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (index: number, value: string) => {
        const newLocations = [...(formData.locations || [])];
        newLocations[index] = value;
        setFormData(prev => ({ ...prev, locations: newLocations }));
    };

    const addLocation = () => {
        setFormData(prev => ({ ...prev, locations: [...(prev.locations || []), ''] }));
    };

    const removeLocation = (index: number) => {
        setFormData(prev => ({ ...prev, locations: (prev.locations || []).filter((_, i) => i !== index) }));
    };

    const handlePriceChange = (index: number, field: 'label' | 'price', value: string) => {
        const newPrices = [...(formData.prices || [])];
        newPrices[index] = { ...newPrices[index], [field]: value };
        setFormData(prev => ({ ...prev, prices: newPrices }));
    };

    const addPrice = () => {
        setFormData(prev => ({ ...prev, prices: [...(prev.prices || []), { label: '', price: '' }] }));
    };

    const removePrice = (index: number) => {
        setFormData(prev => ({ ...prev, prices: (prev.prices || []).filter((_, i) => i !== index) }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.imageUrl) {
            showToast('Název a obrázek jsou povinné.', 'error');
            return;
        }
        onSave(formData);
    };

    return (
        <form id="service-form" onSubmit={handleSubmit} className="p-1 md:p-2 space-y-12 pb-20">
            {/* SEKCE 1: MÉDIA */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-px w-8 neon-gradient"></div>
                    <h4 className="text-[10px] font-black text-surface-dark uppercase tracking-[0.4em]">Obrázek služby</h4>
                </div>

                <div className="relative group aspect-video rounded-3xl overflow-hidden bg-gray-100 border border-surface-dark/5 shadow-lg max-w-xl mx-auto">
                    {formData.imageUrl ? (
                        <>
                            <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Service Preview" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label className="cursor-pointer px-6 py-3 bg-white text-surface-dark rounded-full font-black text-[9px] uppercase tracking-widest shadow-2xl transition-colors">
                                    Změnit fotografii
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </label>
                            </div>
                        </>
                    ) : (
                        <label className="flex flex-col items-center justify-center gap-4 cursor-pointer group h-full">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            <div className="w-12 h-12 rounded-xl bg-white border border-surface-dark/5 flex items-center justify-center text-surface-dark/20 group-hover:text-neon-blaze transition-colors shadow-sm">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            </div>
                            <span className="text-[9px] font-black text-surface-dark/60 uppercase tracking-[0.2em]">Nahrát hero obrázek</span>
                        </label>
                    )}
                </div>
            </div>

            {/* SEKCE 2: DEFINICE */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-px w-8 neon-gradient"></div>
                    <h4 className="text-[10px] font-black text-surface-dark uppercase tracking-[0.4em]">základní info</h4>
                </div>

                <AdminFormField label="Název služby" htmlFor="title">
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className={inputClasses} placeholder="Např. OSOBNÍ TRÉNINK" />
                </AdminFormField>

                <AdminFormField label="Podnadpis (v závorce, např. věk)" htmlFor="subheading">
                    <input type="text" id="subheading" name="subheading" value={formData.subheading || ''} onChange={handleChange} className={inputClasses} placeholder="Např. 10–18 let" />
                </AdminFormField>

                <AdminFormField label="Popis služby" htmlFor="description">
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} required className={inputClasses} rows={6} placeholder="Stručně popište, v čem je tato služba výjimečná..."></textarea>
                </AdminFormField>
            </div>

            {/* SEKCE 3: LOKACE A CENY */}
            <div className="space-y-8">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-px w-8 neon-gradient"></div>
                            <h4 className="text-[10px] font-black text-surface-dark uppercase tracking-[0.4em]">Místa konání</h4>
                        </div>
                        <button type="button" onClick={addLocation} className="text-[9px] font-black text-neon-blaze uppercase tracking-widest hover:underline">Přidat místo</button>
                    </div>

                    <div className="space-y-3">
                        {formData.locations?.map((loc, idx) => (
                            <div key={idx} className="flex gap-3">
                                <input
                                    type="text"
                                    value={loc}
                                    onChange={(e) => handleLocationChange(idx, e.target.value)}
                                    className={inputClasses}
                                    placeholder="Např. Sportcentrum Vizovice"
                                />
                                <button type="button" onClick={() => removeLocation(idx)} className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-px w-8 neon-gradient"></div>
                            <h4 className="text-[10px] font-black text-surface-dark uppercase tracking-[0.4em]">Ceník</h4>
                        </div>
                        <button type="button" onClick={addPrice} className="text-[9px] font-black text-neon-blaze uppercase tracking-widest hover:underline">Přidat cenu</button>
                    </div>

                    <div className="space-y-3">
                        {formData.prices?.map((p, idx) => (
                            <div key={idx} className="flex gap-3 items-center">
                                <input
                                    type="text"
                                    value={p.label}
                                    onChange={(e) => handlePriceChange(idx, 'label', e.target.value)}
                                    className={`${inputClasses} flex-[1]`}
                                    placeholder="Štítek (např. STUDENT)"
                                />
                                <input
                                    type="text"
                                    value={p.price}
                                    onChange={(e) => handlePriceChange(idx, 'price', e.target.value)}
                                    className={`${inputClasses} flex-[1]`}
                                    placeholder="Cena (např. 500 Kč/osoba)"
                                />
                                <button type="button" onClick={() => removePrice(idx)} className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AKCE */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4 sticky bottom-0 bg-white/100 backdrop-blur-md py-6 z-50">
                <button
                    type="submit"
                    className="flex-1 py-4 neon-gradient text-white rounded-full font-black uppercase tracking-[0.3em] shadow-lg hover:shadow-neon-glow transition-all text-sm"
                >
                    Uložit službu
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-4 bg-white border border-surface-dark/10 text-surface-dark/60 rounded-full font-black uppercase tracking-[0.3em] hover:text-surface-dark hover:bg-gray-50 transition-all text-sm"
                >
                    Zrušit úpravy
                </button>
            </div>
        </form>
    );
};

const AdminServices: React.FC<AdminSectionProps> = ({ data, setData, showToast }) => {
    const [modalState, setModalState] = useState<{ mode: 'add' | 'edit' | 'closed'; item: Service | null }>({ mode: 'closed', item: null });
    const [itemToDelete, setItemToDelete] = useState<Service | null>(null);

    const sortedServices = useMemo(() => {
        return [...data.services].sort((a, b) => a.order - b.order);
    }, [data.services]);

    const handleSave = (itemToSave: Service) => {
        if (modalState.mode === 'add') {
            const newItem = {
                ...itemToSave,
                id: `s${Date.now()}`,
                order: data.services.length + 1,
                fields: [] // Vyčištění polí
            };
            setData(prev => prev ? { ...prev, services: [...prev.services, newItem] } : null);
            showToast('Nová služba byla přidána do portfolia', 'success');
        } else {
            setData(prev => prev ? { ...prev, services: prev.services.map(s => s.id === itemToSave.id ? itemToSave : s) } : null);
            showToast('Služba byla aktualizována', 'success');
        }
        setModalState({ mode: 'closed', item: null });
    };

    const handleDelete = (id: string) => {
        const remainingServices = data.services
            .filter(s => s.id !== id)
            .sort((a, b) => a.order - b.order)
            .map((s, idx) => ({ ...s, order: idx + 1 }));

        setData(prev => prev ? { ...prev, services: remainingServices } : null);
        setItemToDelete(null);
        showToast('Služba byla odstraněna', 'success');
    };

    const openModal = (mode: 'add' | 'edit', item?: Service) => {
        const defaultItem: Service = {
            id: '',
            title: '',
            subheading: '',
            description: '',
            materials: [],
            processSteps: [],
            order: data.services.length + 1,
            fields: [],
            imageUrl: ''
        };
        setModalState({ mode, item: item || defaultItem });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-px w-10 neon-gradient"></div>
                    <h3 className="text-xl font-black text-surface-dark uppercase tracking-tighter leading-tight">SLUŽBY</h3>
                </div>
                <button
                    onClick={() => openModal('add')}
                    className="w-full sm:w-auto px-8 py-3.5 neon-gradient text-white rounded-full text-[9px] font-black uppercase tracking-[0.4em] shadow-md hover:shadow-neon-glow transition-all"
                >
                    NOVÁ SLUŽBA
                </button>
            </div>

            <AdminModal
                isOpen={modalState.mode !== 'closed'}
                onClose={() => setModalState({ mode: 'closed', item: null })}
                title={modalState.mode === 'add' ? 'NOVÁ SLUŽBA' : 'EDITACE SLUŽBY'}
            >
                {modalState.item && (
                    <ServiceForm
                        item={modalState.item}
                        onSave={handleSave}
                        onCancel={() => setModalState({ mode: 'closed', item: null })}
                        showToast={showToast}
                    />
                )}
            </AdminModal>

            <AdminModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                title="ODSTRANIT SLUŽBU"
                size="sm"
            >
                <div className="space-y-6 p-1 text-center">
                    <p className="text-surface-dark/75 font-medium text-base leading-relaxed">Opravdu chcete trvale odstranit službu <br /><span className="text-surface-dark font-black uppercase tracking-tight">"{itemToDelete?.title}"</span>?</p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button onClick={() => setItemToDelete(null)} className="flex-1 py-3.5 bg-gray-100 border border-surface-dark/10 text-surface-dark/60 text-[9px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-gray-200 transition-colors">Ponechat</button>
                        <button onClick={() => handleDelete(itemToDelete!.id)} className="flex-1 py-3.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg transition-colors">Potvrdit smazání</button>
                    </div>
                </div>
            </AdminModal>

            <div className="grid grid-cols-1 gap-4">
                {sortedServices.map((service) => (
                    <div
                        key={service.id}
                        className="p-5 md:p-6 bg-white border border-surface-dark/5 rounded-[2rem] flex flex-col md:flex-row justify-between items-center group relative overflow-hidden shadow-sm transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-pink opacity-0 group-hover:opacity-5 blur-3xl transition-opacity"></div>

                        <div className="flex items-center gap-6 w-full">
                            <div className="relative flex-shrink-0 flex items-center">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-surface-dark/5 shadow-sm bg-gray-50 flex-shrink-0">
                                    <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h4 className="font-black text-lg md:text-xl text-surface-dark uppercase tracking-tighter transition-colors">
                                    {service.title}
                                    {service.subheading && <span className="ml-2 text-surface-dark/40 font-bold">({service.subheading})</span>}
                                </h4>
                                <div className="flex items-center gap-3">
                                    <p className="text-[10px] text-surface-dark/70 font-medium line-clamp-1 max-w-sm">{service.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 md:mt-0 w-full md:w-auto justify-end relative z-10">
                            <button
                                onClick={() => openModal('edit', service)}
                                className="w-10 h-10 rounded-xl bg-gray-50 border border-surface-dark/5 text-surface-dark/60 hover:text-surface-dark hover:border-surface-dark/20 flex items-center justify-center transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                            </button>
                            <button
                                onClick={() => setItemToDelete(service)}
                                className="w-10 h-10 rounded-xl bg-gray-50 border border-surface-dark/5 text-surface-dark/60 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/10 flex items-center justify-center transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminServices;