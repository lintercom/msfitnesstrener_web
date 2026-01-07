
import React, { useState } from 'react';
import { BlogPost } from '../../../types';
import AdminModal from '../../../components/admin/AdminModal';
import { AdminSectionProps } from '../AdminDashboard';
import AdminFormField from '../../../components/admin/AdminFormField';
import ImageUploader from '../../../components/admin/ImageUploader';

const BlogPostForm: React.FC<{ 
    item: BlogPost; 
    onSave: (item: BlogPost) => void; 
    onCancel: () => void;
    showToast: AdminSectionProps['showToast'] 
}> = ({ item, onSave, onCancel, showToast }) => {
    const [formData, setFormData] = useState<BlogPost>(item);
    
    const inputClasses = "w-full bg-gray-50 border border-surface-dark/10 rounded-2xl p-4 text-surface-dark placeholder-surface-dark/30 focus:outline-none focus:border-neon-blaze transition-colors font-medium text-base shadow-sm";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageChange = (url: string | null) => {
        setFormData(prev => ({ ...prev, imageUrl: url || '' }));
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
        <form id="blog-form" onSubmit={handleSubmit} className="p-0 md:p-2 space-y-8 md:space-y-10">
            {/* SEKCE 1: MÉDIA */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-px w-8 neon-gradient"></div>
                    <h4 className="text-[10px] font-black text-surface-dark uppercase tracking-[0.4em]">Náhledový obrázek</h4>
                </div>
                
                <div className="max-w-xl mx-auto">
                    <ImageUploader 
                        label="" 
                        imageUrl={formData.imageUrl} 
                        onImageChange={handleImageChange} 
                        showToast={showToast} 
                    />
                </div>
            </div>

            {/* SEKCE 2: INFO */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-px w-8 neon-gradient"></div>
                    <h4 className="text-[10px] font-black text-surface-dark uppercase tracking-[0.4em]">ZÁKLADNÍ ÚDAJE</h4>
                </div>
                
                <AdminFormField label="Titulek článku" htmlFor="title">
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className={inputClasses} placeholder="Např. Proč kardio před tréninkem?"/>
                </AdminFormField>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                    <AdminFormField label="Kategorie" htmlFor="category">
                        <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} className={inputClasses} placeholder="Věda / Trénink"/>
                    </AdminFormField>
                    <AdminFormField label="Datum" htmlFor="date">
                        <input type="text" id="date" name="date" value={formData.date} onChange={handleChange} className={inputClasses} placeholder="DD.MM.YYYY"/>
                    </AdminFormField>
                    <AdminFormField label="Doba čtení" htmlFor="readTime">
                        <input type="text" id="readTime" name="readTime" value={formData.readTime} onChange={handleChange} className={inputClasses} placeholder="5 min"/>
                    </AdminFormField>
                </div>
            </div>

            {/* SEKCE 3: OBSAH */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-px w-8 neon-gradient"></div>
                    <h4 className="text-[10px] font-black text-surface-dark uppercase tracking-[0.4em]">TEXT ČLÁNKU</h4>
                </div>

                <AdminFormField label="Stručný výtah (Perex)" htmlFor="excerpt">
                    <textarea name="excerpt" id="excerpt" value={formData.excerpt} onChange={handleChange} required className={inputClasses} rows={2} placeholder="Krátké shrnutí pro seznam článků..."></textarea>
                </AdminFormField>

                <AdminFormField label="Hlavní obsah" htmlFor="content">
                    <textarea name="content" id="content" value={formData.content} onChange={handleChange} required className={inputClasses} rows={12} placeholder="Sem napište celý text článku..."></textarea>
                </AdminFormField>
            </div>

            {/* AKCE */}
            <div className="pt-6 flex flex-col sm:flex-row gap-3 md:gap-4">
                <button 
                    type="submit" 
                    className="flex-1 py-4 neon-gradient text-white rounded-full font-black uppercase tracking-[0.3em] shadow-lg active:scale-95 transition-all text-sm"
                >
                    Publikovat článek
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

const AdminBlog: React.FC<AdminSectionProps> = ({ data, setData, showToast }) => {
    const [modalState, setModalState] = useState<{ mode: 'add' | 'edit' | 'closed'; item: BlogPost | null }>({ mode: 'closed', item: null });
    const [itemToDelete, setItemToDelete] = useState<BlogPost | null>(null);

    const handleSave = (itemToSave: BlogPost) => {
        if (modalState.mode === 'add') {
            const newItem = { ...itemToSave, id: `b${Date.now()}` };
            setData(prev => prev ? { ...prev, blog: [newItem, ...prev.blog] } : null);
            showToast('Článek byl publikován', 'success');
        } else {
            setData(prev => prev ? { ...prev, blog: prev.blog.map(b => b.id === itemToSave.id ? itemToSave : b)} : null);
            showToast('Článek byl aktualizován', 'success');
        }
        setModalState({ mode: 'closed', item: null });
    };

    const handleDelete = (id: string) => {
        setData(prev => prev ? { ...prev, blog: prev.blog.filter(b => b.id !== id) } : null);
        setItemToDelete(null);
        showToast('Článek odstraněn', 'success');
    };
    
    const openModal = (mode: 'add' | 'edit', item?: BlogPost) => {
        const today = new Date().toLocaleDateString('cs-CZ');
        const defaultItem: BlogPost = { id: '', title: '', excerpt: '', content: '', date: today, category: '', imageUrl: '', readTime: '' };
        setModalState({ mode, item: item || defaultItem });
    };

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-px w-8 md:w-10 neon-gradient"></div>
                    <h3 className="text-lg md:text-xl font-black text-surface-dark uppercase tracking-tighter leading-tight">ČLÁNKY</h3>
                </div>
                <button 
                    onClick={() => openModal('add')} 
                    className="w-full sm:w-auto px-8 py-3.5 neon-gradient text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-md transition-all active:scale-95"
                >
                    NOVÝ ČLÁNEK
                </button>
            </div>

            <AdminModal
                isOpen={modalState.mode !== 'closed'}
                onClose={() => setModalState({ mode: 'closed', item: null })}
                title={modalState.mode === 'add' ? 'VYTVOŘIT ČLÁNEK' : 'UPRAVIT ČLÁNEK'}
            >
                {modalState.item && (
                    <BlogPostForm 
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
                title="SMAZAT ČLÁNEK"
                size="sm"
            >
                <div className="space-y-6 p-1 text-center">
                    <p className="text-surface-dark/50 font-medium text-base leading-relaxed">Opravdu chcete trvale odstranit článek <br/><span className="text-surface-dark font-black uppercase tracking-tight">"{itemToDelete?.title}"</span>?</p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button onClick={() => setItemToDelete(null)} className="flex-1 py-3.5 bg-gray-100 border border-surface-dark/10 text-surface-dark/40 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">Zrušit</button>
                        <button onClick={() => handleDelete(itemToDelete!.id)} className="flex-1 py-3.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">Smazat</button>
                    </div>
                </div>
            </AdminModal>

            <div className="grid grid-cols-1 gap-3 md:gap-4">
                {data.blog.map((post) => (
                    <div 
                        key={post.id} 
                        className="p-4 md:p-6 bg-white border border-surface-dark/5 rounded-[1.5rem] md:rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center group relative overflow-hidden shadow-sm transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-blaze opacity-0 group-hover:opacity-5 blur-3xl transition-opacity"></div>
                        
                        <div className="flex items-center gap-4 md:gap-6 w-full">
                           <div className="relative flex-shrink-0 flex items-center gap-2 md:gap-4">
                               <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden border border-surface-dark/5 shadow-sm bg-gray-50 flex-shrink-0">
                                   <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                               </div>
                           </div>

                           <div className="space-y-0.5 md:space-y-1">
                                <h4 className="font-black text-base md:text-xl text-surface-dark uppercase tracking-tighter transition-colors leading-tight">{post.title}</h4>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <span className="text-[7px] md:text-[8px] font-black text-neon-blaze border border-neon-blaze/20 px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-[0.1em] md:tracking-[0.2em]">{post.category}</span>
                                    <span className="text-[7px] md:text-[8px] font-black text-surface-dark/30 border border-surface-dark/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-[0.1em] md:tracking-[0.2em]">{post.date}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 md:gap-3 mt-4 sm:mt-0 w-full sm:w-auto justify-end relative z-10">
                            <button 
                                onClick={() => openModal('edit', post)}
                                className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gray-50 border border-surface-dark/5 text-surface-dark/30 hover:text-surface-dark flex items-center justify-center transition-colors shadow-sm active:scale-90"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                            </button>
                            <button 
                                onClick={() => setItemToDelete(post)} 
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

export default AdminBlog;
