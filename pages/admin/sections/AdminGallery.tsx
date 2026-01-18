
import React, { useState } from 'react';
import { GalleryItem, Service } from '../../../types';
import AdminModal from '../../../components/admin/AdminModal';
import { AdminSectionProps } from '../AdminDashboard';
import AdminFormField from '../../../components/admin/AdminFormField';

const GalleryItemForm: React.FC<{ 
    item: GalleryItem; 
    services: Service[];
    onSave: (item: GalleryItem) => void; 
    onCancel: () => void;
    showToast: AdminSectionProps['showToast'] 
}> = ({ item, services, onSave, onCancel, showToast }) => {
    const [formData, setFormData] = useState<GalleryItem>(item);
    
    const inputClasses = "w-full bg-gray-50 border border-surface-dark/10 rounded-2xl p-4 text-surface-dark placeholder-surface-dark/30 focus:outline-none focus:border-neon-blaze transition-colors font-medium text-base shadow-sm";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleServiceChange = (serviceId: string, checked: boolean) => {
        setFormData(prev => {
            const currentServiceIds = prev.serviceIds || [];
            if (checked) {
                return { ...prev, serviceIds: [...currentServiceIds, serviceId] };
            } else {
                return { ...prev, serviceIds: currentServiceIds.filter(id => id !== serviceId) };
            }
        });
    };
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files: File[] = Array.from(e.target.files);
            const base64Promises = files.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });
            });
            try {
                const base64urls = await Promise.all(base64Promises);
                setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...base64urls] }));
            } catch (error) {
                showToast("Chyba při nahrávání obrázků.", "error");
            }
        }
    };
    
    const removeImage = (index: number) => {
        setFormData(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.imageUrls.length === 0) {
            showToast('Nahrajte prosím alespoň jeden obrázek.', 'error');
            return;
        }
        onSave(formData);
    };

    return (
        <form id="gallery-form" onSubmit={handleSubmit} className="p-0 md:p-2 space-y-8 md:space-y-10">
            {/* SEKCE 1: MÉDIA */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-px w-8 neon-gradient"></div>
                    <h4 className="text-[10px] font-black text-surface-dark uppercase tracking-[0.4em]">Fotogalerie</h4>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                    {formData.imageUrls.map((url, index) => (
                        <div key={`img-${index}-${url.slice(-30)}`} className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-surface-dark/5 shadow-sm">
                            <img src={url} className="w-full h-full object-cover" alt="Preview"/>
                            <div className="absolute top-2 right-2 flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    type="button" 
                                    onClick={() => removeImage(index)}
                                    className="w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg transition-colors active:scale-90"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                            {index === 0 && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-neon-blaze text-white text-[7px] font-black uppercase tracking-widest rounded-full shadow-lg">Hlavní</div>
                            )}
                        </div>
                    ))}
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-surface-dark/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-neon-blaze hover:bg-neon-blaze/5 transition-colors group bg-gray-50/50">
                        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-surface-dark/5 flex items-center justify-center text-surface-dark/20 group-hover:text-neon-blaze transition-colors shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        </div>
                        <span className="text-[8px] font-black text-surface-dark/30 uppercase tracking-[0.2em]">Přidat</span>
                    </label>
                </div>
            </div>

            {/* SEKCE 2: INFO */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-px w-8 neon-gradient"></div>
                    <h4 className="text-[10px] font-black text-surface-dark uppercase tracking-[0.4em]">ZÁKLADNÍ INFO</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <AdminFormField label="Jméno klienta" htmlFor="title">
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className={inputClasses} placeholder="JAN NOVÁK"/>
                    </AdminFormField>
                    <AdminFormField label="Doba trvání" htmlFor="printTime">
                        <input type="text" id="printTime" name="printTime" value={formData.printTime} onChange={handleChange} className={inputClasses} placeholder="16 TÝDNŮ"/>
                    </AdminFormField>
                </div>
            </div>

            {/* SEKCE 3: OBSAH */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-px w-8 neon-gradient"></div>
                    <h4 className="text-[10px] font-black text-surface-dark uppercase tracking-[0.4em]">Příběh</h4>
                </div>

                <AdminFormField label="Detailní popis" htmlFor="description">
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} required className={inputClasses} rows={5} placeholder="Popište průběh coachingu..."></textarea>
                </AdminFormField>

                <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-surface-dark/40 ml-1 md:ml-4">Přiřazené Služby</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                        {services.map(service => (
                            <label key={service.id} className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border transition-colors cursor-pointer ${ (formData.serviceIds || []).includes(service.id) ? 'bg-neon-blaze/5 border-neon-blaze shadow-sm' : 'bg-white border-surface-dark/5' }`}>
                                <input
                                    type="checkbox"
                                    checked={(formData.serviceIds || []).includes(service.id)}
                                    onChange={e => handleServiceChange(service.id, e.target.checked)}
                                    className="w-5 h-5 rounded text-neon-blaze border-surface-dark/10 cursor-pointer"
                                />
                                <span className="text-[11px] md:text-[12px] font-black uppercase tracking-tight text-surface-dark">{service.title}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* AKCE */}
            <div className="pt-6 flex flex-col sm:flex-row gap-3 md:gap-4">
                <button 
                    type="submit" 
                    className="flex-1 py-4 neon-gradient text-white rounded-full font-black uppercase tracking-[0.3em] shadow-lg active:scale-95 transition-all text-sm"
                >
                    Uložit
                </button>
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="flex-1 py-4 bg-gray-50 border border-surface-dark/10 text-surface-dark/40 rounded-full font-black uppercase tracking-[0.3em] transition-all text-sm"
                >
                    Zrušit
                </button>
            </div>
        </form>
    );
};

const AdminGallery: React.FC<AdminSectionProps> = ({ data, setData, showToast }) => {
    const [modalState, setModalState] = useState<{ mode: 'add' | 'edit' | 'closed'; item: GalleryItem | null }>({ mode: 'closed', item: null });
    const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);

    const handleSave = (itemToSave: GalleryItem) => {
        if (modalState.mode === 'add') {
            const newItem = { ...itemToSave, id: `g${Date.now()}` };
            setData(prev => prev ? { ...prev, gallery: [newItem, ...prev.gallery] } : null);
            showToast('Záznam coachingu publikován', 'success');
        } else {
            setData(prev => prev ? { ...prev, gallery: prev.gallery.map(i => i.id === itemToSave.id ? itemToSave : i)} : null);
            showToast('Změny uloženy', 'success');
        }
        setModalState({ mode: 'closed', item: null });
    };

    const handleDelete = (id: string) => {
        setData(prev => prev ? { ...prev, gallery: prev.gallery.filter(i => i.id !== id) } : null);
        setItemToDelete(null);
        showToast('Záznam odstraněn', 'success');
    };
    
    const openModal = (mode: 'add' | 'edit', item?: GalleryItem) => {
        const defaultItem = { id: '', title: '', description: '', imageUrls: [], material: '', printTime: '', consumption: '', note: '', tags: [], serviceIds: [] };
        setModalState({ mode, item: item || defaultItem });
    };

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-px w-8 md:w-10 neon-gradient"></div>
                    <h3 className="text-lg md:text-xl font-black text-surface-dark uppercase tracking-tighter leading-tight">TRÉNINKY</h3>
                </div>
                <button 
                    onClick={() => openModal('add')} 
                    className="w-full sm:w-auto px-8 py-3.5 neon-gradient text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-md transition-all active:scale-95"
                >
                    PŘIDAT
                </button>
            </div>
            
            <AdminModal
                isOpen={modalState.mode !== 'closed'}
                onClose={() => setModalState({ mode: 'closed', item: null })}
                title={modalState.mode === 'add' ? 'NOVÝ VÝSLEDEK' : 'UPRAVIT'}
            >
                {modalState.item && (
                    <GalleryItemForm 
                        item={modalState.item} 
                        services={data.services} 
                        onSave={handleSave} 
                        onCancel={() => setModalState({ mode: 'closed', item: null })}
                        showToast={showToast} 
                    />
                )}
            </AdminModal>

            <AdminModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                title="SMAZAT"
                size="sm"
            >
                <div className="space-y-6 p-1 text-center">
                    <p className="text-surface-dark/50 font-medium text-base leading-relaxed">Opravdu odstranit výsledek klienta <br/><span className="text-surface-dark font-black uppercase tracking-tight">"{itemToDelete?.title}"</span>?</p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button onClick={() => setItemToDelete(null)} className="flex-1 py-3.5 bg-gray-100 border border-surface-dark/10 text-surface-dark/40 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">Zrušit</button>
                        <button onClick={() => handleDelete(itemToDelete!.id)} className="flex-1 py-3.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">Smazat</button>
                    </div>
                </div>
            </AdminModal>

            <div className="grid grid-cols-1 gap-3 md:gap-4">
                {data.gallery.map((item) => (
                    <div 
                        key={item.id} 
                        className="p-4 md:p-6 bg-white border border-surface-dark/5 rounded-[1.5rem] md:rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center group relative overflow-hidden shadow-sm transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-blaze opacity-0 group-hover:opacity-5 blur-3xl transition-opacity"></div>
                        
                        <div className="flex items-center gap-4 md:gap-6 w-full">
                           <div className="relative flex-shrink-0 flex items-center">
                               <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden border border-surface-dark/5 shadow-sm bg-gray-50 flex-shrink-0">
                                   <img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover" />
                               </div>
                           </div>

                           <div className="space-y-0.5 md:space-y-1">
                                <h4 className="font-black text-base md:text-xl text-surface-dark uppercase tracking-tighter transition-colors leading-tight">{item.title}</h4>
                                {item.printTime && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="text-[7px] md:text-[8px] font-black text-surface-dark/30 border border-surface-dark/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-[0.1em] md:tracking-[0.2em]">{item.printTime}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex gap-2 md:gap-3 mt-4 sm:mt-0 w-full sm:w-auto justify-end relative z-10">
                            <button 
                                onClick={() => openModal('edit', item)}
                                className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gray-50 border border-surface-dark/5 text-surface-dark/30 hover:text-surface-dark flex items-center justify-center transition-colors shadow-sm active:scale-90"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                            </button>
                            <button 
                                onClick={() => setItemToDelete(item)} 
                                className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gray-50 border border-surface-dark/5 text-surface-dark/30 hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-colors shadow-sm active:scale-90"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminGallery;
