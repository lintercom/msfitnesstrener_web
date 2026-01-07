
import React, { useState } from 'react';
import { MachineInfo } from '../../../types';
import AdminModal from '../../../components/admin/AdminModal';
import { AdminSectionProps } from '../AdminDashboard';
import AdminFormField from '../../../components/admin/AdminFormField';
import ImageUploader from '../../../components/admin/ImageUploader';

const IconButton: React.FC<{ onClick: (e: React.MouseEvent) => void; children: React.ReactNode, className?: string }> = ({ onClick, children, className }) => (
    <button onClick={onClick} className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${className}`}>
        {children}
    </button>
)

const MachineForm: React.FC<{ machine: MachineInfo; onSave: (machine: MachineInfo) => void; showToast: AdminSectionProps['showToast'] }> = ({ machine, onSave, showToast }) => {
    const [formData, setFormData] = useState<MachineInfo>(machine);
    const baseInputClasses = "block w-full px-3 py-2 border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent bg-surface text-primary-text";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (name === 'specs') {
             // Specs are handled via text area, split by newlines
             setFormData(prev => ({ ...prev, specs: value.split('\n').filter(s => s.trim() !== '') }));
        } else if (type === 'number' || name === 'imageScale' || name === 'imageOpacity' || name === 'imageRotation') {
             setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (url: string | null) => {
        setFormData(prev => ({ ...prev, imageUrl: url || '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form id="machine-form" onSubmit={handleSubmit} className="space-y-6">
            <AdminFormField label="Název zařízení" htmlFor="name">
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={baseInputClasses}/>
            </AdminFormField>
            
            <ImageUploader
                label="Obrázek zařízení"
                imageUrl={formData.imageUrl}
                onImageChange={handleImageChange}
                showToast={showToast}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <AdminFormField 
                    label={`Velikost: ${formData.imageScale || 100}%`} 
                    htmlFor="imageScale"
                >
                    <input 
                        type="range" 
                        name="imageScale" 
                        id="imageScale" 
                        value={formData.imageScale || 100} 
                        onChange={handleChange} 
                        min="50" 
                        max="200"
                        step="1"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                        disabled={!formData.imageUrl}
                    />
                </AdminFormField>
                <AdminFormField 
                    label={`Průhlednost: ${formData.imageOpacity !== undefined ? formData.imageOpacity : 100}%`} 
                    htmlFor="imageOpacity"
                >
                    <input 
                        type="range" 
                        name="imageOpacity" 
                        id="imageOpacity" 
                        value={formData.imageOpacity !== undefined ? formData.imageOpacity : 100} 
                        onChange={handleChange} 
                        min="0" 
                        max="100"
                        step="5"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                        disabled={!formData.imageUrl}
                    />
                </AdminFormField>
                <AdminFormField 
                    label={`Rotace: ${formData.imageRotation || 0}°`} 
                    htmlFor="imageRotation"
                >
                    <input 
                        type="range" 
                        name="imageRotation" 
                        id="imageRotation" 
                        value={formData.imageRotation || 0} 
                        onChange={handleChange} 
                        min="-180" 
                        max="180"
                        step="1"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                        disabled={!formData.imageUrl}
                    />
                </AdminFormField>
            </div>

            <AdminFormField label="Popis" htmlFor="description">
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} required className={baseInputClasses} rows={3}></textarea>
            </AdminFormField>

            <AdminFormField label="Technické specifikace" htmlFor="specs" description="Každou specifikaci napište na nový řádek.">
                <textarea 
                    name="specs" 
                    id="specs" 
                    value={formData.specs.join('\n')} 
                    onChange={handleChange} 
                    className={baseInputClasses} 
                    rows={5}
                    placeholder="Tiskový objem: 256x256x256 mm&#10;Rychlost: 500 mm/s"
                ></textarea>
            </AdminFormField>
        </form>
    );
};

const AdminMachines: React.FC<AdminSectionProps> = ({ data, setData, showToast }) => {
    const [modalState, setModalState] = useState<{ mode: 'add' | 'edit' | 'closed'; machine: MachineInfo | null }>({ mode: 'closed', machine: null });
    const [machineToDelete, setMachineToDelete] = useState<MachineInfo | null>(null);

    const handleSave = (machineToSave: MachineInfo) => {
        if (modalState.mode === 'add') {
            const newMachine = { ...machineToSave, id: `m${Date.now()}` };
            setData(prev => prev ? { ...prev, machines: [...prev.machines, newMachine] } : null);
        } else {
            setData(prev => prev ? { ...prev, machines: prev.machines.map(m => m.id === machineToSave.id ? machineToSave : m)} : null);
        }
        setModalState({ mode: 'closed', machine: null });
    };

    const handleDelete = (id: string) => {
        setData(prev => prev ? { ...prev, machines: prev.machines.filter(m => m.id !== id) } : null);
        setMachineToDelete(null);
    };

    const openModal = (mode: 'add' | 'edit', machine?: MachineInfo) => {
        const defaultMachine: MachineInfo = { id: '', name: '', imageUrl: '', description: '', specs: [], imageScale: 100, imageOpacity: 100, imageRotation: 0 };
        setModalState({ mode, machine: machine || defaultMachine });
    }

    const modalFooter = (
      <div className="flex gap-2">
        <button type="button" onClick={() => setModalState({ mode: 'closed', machine: null })} className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">Zrušit</button>
        <button type="submit" form="machine-form" className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover">Uložit</button>
      </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary-text">Naše technologie</h2>
                <button onClick={() => openModal('add')} className="px-4 py-2 bg-footer-bg text-white rounded-md hover:bg-gray-700 text-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Přidat zařízení
                </button>
            </div>

            <AdminModal
                isOpen={modalState.mode !== 'closed'}
                onClose={() => setModalState({ mode: 'closed', machine: null })}
                title={modalState.mode === 'add' ? 'Přidat nové zařízení' : 'Upravit zařízení'}
                footer={modalFooter}
            >
                {modalState.machine && <MachineForm machine={modalState.machine} onSave={handleSave} showToast={showToast} />}
            </AdminModal>

            <AdminModal
                isOpen={!!machineToDelete}
                onClose={() => setMachineToDelete(null)}
                title="Potvrdit smazání"
            >
                <p>Opravdu si přejete smazat zařízení "{machineToDelete?.name}"?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => setMachineToDelete(null)} className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">Zrušit</button>
                    <button onClick={() => handleDelete(machineToDelete!.id)} className="px-4 py-2 bg-red-700 text-white rounded-md text-sm font-medium hover:bg-red-800">Smazat</button>
                </div>
            </AdminModal>

            <div className="space-y-4">
                {(data.machines || []).map((machine) => (
                    <div key={machine.id} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-full md:w-48 h-32 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            {machine.imageUrl ? (
                                <img 
                                    src={machine.imageUrl} 
                                    alt={machine.name} 
                                    className="w-full h-full object-cover"
                                    style={{
                                        transform: `scale(${(machine.imageScale || 100) / 100}) rotate(${machine.imageRotation || 0}deg)`,
                                        opacity: (machine.imageOpacity !== undefined ? machine.imageOpacity : 100) / 100
                                    }} 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Bez obrázku</div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{machine.name}</h3>
                                <div className="flex gap-2">
                                    <IconButton onClick={(e) => { e.stopPropagation(); openModal('edit', machine); }} className="bg-blue-100 text-blue-600 hover:bg-blue-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                                    </IconButton>
                                    <IconButton onClick={(e) => { e.stopPropagation(); setMachineToDelete(machine); }} className="bg-red-100 text-red-600 hover:bg-red-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                    </IconButton>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{machine.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {machine.specs.map((spec, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-mono border border-gray-200">{spec}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                
                {(!data.machines || data.machines.length === 0) && (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        Zatím zde nejsou žádné technologie.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMachines;
