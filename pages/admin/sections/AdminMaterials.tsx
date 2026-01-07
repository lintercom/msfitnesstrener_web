import React, { useState } from 'react';
import { MaterialDetail } from '../../../types';
import AdminModal from '../../../components/admin/AdminModal';
import { AdminSectionProps } from '../AdminDashboard';
import AdminFormField from '../../../components/admin/AdminFormField';

const IconButton: React.FC<{ onClick: () => void; children: React.ReactNode, className?: string }> = ({ onClick, children, className }) => (
    <button onClick={onClick} className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${className}`}>
        {children}
    </button>
)

const MaterialForm: React.FC<{ item: MaterialDetail; onSave: (item: MaterialDetail) => void; }> = ({ item, onSave }) => {
    const [formData, setFormData] = useState<MaterialDetail>(item);
    const baseInputClasses = "block w-full px-3 py-2 border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent bg-surface text-primary-text";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form id="material-form" onSubmit={handleSubmit} className="space-y-4">
            <AdminFormField label="Název materiálu" htmlFor="name">
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={baseInputClasses}/>
            </AdminFormField>
            <AdminFormField label="Popis" htmlFor="description">
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} required className={baseInputClasses} rows={3}></textarea>
            </AdminFormField>
        </form>
    );
};

const AdminMaterials: React.FC<AdminSectionProps> = ({ data, setData, showToast }) => {
    const [modalState, setModalState] = useState<{ mode: 'add' | 'edit' | 'closed'; item: MaterialDetail | null }>({ mode: 'closed', item: null });
    const [itemToDelete, setItemToDelete] = useState<MaterialDetail | null>(null);
    
    const handleSave = (itemToSave: MaterialDetail) => {
        if (modalState.mode === 'add') {
            const newItem = { ...itemToSave, id: `mat${Date.now()}` };
            setData(prev => prev ? { ...prev, materials: [...prev.materials, newItem] } : null);
            showToast('Materiál byl úspěšně přidán.');
        } else {
            setData(prev => prev ? { ...prev, materials: prev.materials.map(m => m.id === itemToSave.id ? itemToSave : m)} : null);
            showToast('Materiál byl úspěšně upraven.');
        }
        setModalState({ mode: 'closed', item: null });
    };

    const handleDelete = (id: string) => {
        setData(prev => prev ? { ...prev, materials: prev.materials.filter(m => m.id !== id) } : null);
        setItemToDelete(null);
        showToast('Materiál byl smazán.', 'success');
    };

    const openModal = (mode: 'add' | 'edit', item?: MaterialDetail) => {
        const defaultItem = { id: '', name: '', description: '' };
        setModalState({ mode, item: item || defaultItem });
    }

    const modalFooter = (
      <div className="flex gap-2">
        <button type="button" onClick={() => setModalState({ mode: 'closed', item: null })} className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">Zrušit</button>
        <button type="submit" form="material-form" className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover">Uložit</button>
      </div>
    );
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary-text">Správa materiálů</h2>
                <button onClick={() => openModal('add')} className="px-4 py-2 bg-footer-bg text-white rounded-md hover:bg-gray-700 text-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Přidat materiál
                </button>
            </div>
            
            <AdminModal
                isOpen={modalState.mode !== 'closed'}
                onClose={() => setModalState({ mode: 'closed', item: null })}
                title={modalState.mode === 'add' ? 'Přidat nový materiál' : 'Upravit materiál'}
                footer={modalFooter}
            >
                {modalState.item && <MaterialForm item={modalState.item} onSave={handleSave} />}
            </AdminModal>

            <AdminModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                title="Potvrdit smazání"
            >
                <p>Opravdu si přejete smazat materiál "{itemToDelete?.name}"?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => setItemToDelete(null)} className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">Zrušit</button>
                    <button onClick={() => handleDelete(itemToDelete!.id)} className="px-4 py-2 bg-red-700 text-white rounded-md text-sm font-medium hover:bg-red-800">Smazat</button>
                </div>
            </AdminModal>

            <div className="space-y-3">
                {data.materials.map((item) => (
                    <div 
                        key={item.id} 
                        className="p-3 border border-border-color rounded-md flex justify-between items-start md:items-center flex-col md:flex-row gap-4 hover:bg-gray-50 transition-colors bg-surface shadow-sm"
                    >
                       <div>
                            <h4 className="font-bold">{item.name}</h4>
                            <p className="text-sm text-secondary-text">{item.description}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 self-end md:self-auto">
                            <IconButton onClick={() => openModal('edit', item)} className="bg-blue-100 text-blue-600 hover:bg-blue-200">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                            </IconButton>
                            <IconButton onClick={() => setItemToDelete(item)} className="bg-red-100 text-red-600 hover:bg-red-200">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </IconButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminMaterials;