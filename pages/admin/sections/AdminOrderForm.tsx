
import React, { useState } from 'react';
import { AdminSectionProps } from '../AdminDashboard';
import { OrderFormFieldSetting, BookingLink } from '../../../types';
import AdminFormField from '../../../components/admin/AdminFormField';

const FormFieldEditor: React.FC<{
    fieldKey: 'firstName' | 'lastName' | 'email' | 'phone' | 'servicesSelection';
    setting: OrderFormFieldSetting;
    onUpdate: (fieldKey: 'firstName' | 'lastName' | 'email' | 'phone' | 'servicesSelection', newSetting: OrderFormFieldSetting) => void;
    fieldName: string;
}> = ({ fieldKey, setting, onUpdate, fieldName }) => {
    const baseInputClasses = "w-full bg-gray-50 border border-surface-dark/5 rounded-2xl p-4 text-surface-dark focus:outline-none focus:border-neon-blaze transition-all duration-500 font-medium text-sm";

    return (
        <div className="p-6 bg-white rounded-[2rem] border border-surface-dark/5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center group transition-all shadow-sm">
            <div className="flex items-center md:col-span-3 border-b border-surface-dark/5 pb-4">
                <div className="relative">
                    <input
                        type="checkbox"
                        id={`${fieldKey}-enabled`}
                        checked={setting.enabled}
                        onChange={e => onUpdate(fieldKey, { ...setting, enabled: e.target.checked })}
                        className="w-5 h-5 rounded bg-gray-100 border-surface-dark/10 text-neon-pink focus:ring-neon-pink cursor-pointer"
                    />
                </div>
                <label htmlFor={`${fieldKey}-enabled`} className="ml-4 text-lg font-black text-surface-dark uppercase tracking-tighter">{fieldName}</label>
            </div>

            <div className={`md:col-span-2 ${!setting.enabled && 'opacity-30'}`}>
                <AdminFormField label="Popisek pole" htmlFor={`${fieldKey}-label`}>
                    <input
                        type="text"
                        id={`${fieldKey}-label`}
                        value={setting.label}
                        onChange={e => onUpdate(fieldKey, { ...setting, label: e.target.value })}
                        className={baseInputClasses}
                        disabled={!setting.enabled}
                    />
                </AdminFormField>
            </div>

            <div className={`flex items-center self-end pb-3 ${!setting.enabled && 'opacity-30'}`}>
                <input
                    type="checkbox"
                    id={`${fieldKey}-required`}
                    checked={setting.required}
                    onChange={e => onUpdate(fieldKey, { ...setting, required: e.target.checked })}
                    className="w-4 h-4 rounded bg-gray-100 border-surface-dark/10 text-neon-blaze focus:ring-neon-blaze cursor-pointer"
                    disabled={!setting.enabled}
                />
                <label htmlFor={`${fieldKey}-required`} className="ml-3 text-[8px] font-black uppercase tracking-widest text-surface-dark/30">Povinné pole</label>
            </div>
        </div>
    );
};


const AdminOrderForm: React.FC<AdminSectionProps> = ({ data, setData, showToast }) => {
    const [activeTab, setActiveTab] = useState<'new' | 'existing'>('new');

    const handleFieldUpdate = (fieldKey: 'firstName' | 'lastName' | 'email' | 'phone' | 'servicesSelection', newSetting: OrderFormFieldSetting) => {
        setData(prev => prev ? {
            ...prev,
            orderForm: {
                ...prev.orderForm,
                [fieldKey]: newSetting
            }
        } : null);
    };

    const handleConsentTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setData(prev => prev ? {
            ...prev,
            orderForm: {
                ...prev.orderForm,
                consentText: value
            }
        } : null);
    };

    // Booking Links handlers
    const handleAddBookingLink = () => {
        const newLink: BookingLink = {
            id: `bl${Date.now()}`,
            name: '',
            url: '',
            icon: 'person'
        };
        setData(prev => prev ? {
            ...prev,
            orderForm: {
                ...prev.orderForm,
                bookingLinks: [...(prev.orderForm.bookingLinks || []), newLink]
            }
        } : null);
    };

    const handleUpdateBookingLink = (id: string, field: keyof BookingLink, value: string) => {
        setData(prev => prev ? {
            ...prev,
            orderForm: {
                ...prev.orderForm,
                bookingLinks: (prev.orderForm.bookingLinks || []).map(link =>
                    link.id === id ? { ...link, [field]: value } : link
                )
            }
        } : null);
    };

    const handleRemoveBookingLink = (id: string) => {
        setData(prev => prev ? {
            ...prev,
            orderForm: {
                ...prev.orderForm,
                bookingLinks: (prev.orderForm.bookingLinks || []).filter(link => link.id !== id)
            }
        } : null);
        showToast('Odkaz byl odstraněn', 'success');
    };

    const baseInputClasses = "w-full bg-gray-50 border border-surface-dark/5 rounded-2xl p-4 text-surface-dark focus:outline-none focus:border-neon-blaze transition-all duration-500 font-medium text-sm shadow-sm";

    if (!data.orderForm) {
        return <div className="text-surface-dark/20 font-black uppercase tracking-widest text-center py-10">Konfigurace nebyla nalezena.</div>;
    }

    return (
        <div className="space-y-8">
            {/* TABS */}
            <div className="flex justify-center">
                <div className="bg-gray-100 p-1.5 rounded-full border border-surface-dark/5 flex items-center">
                    <button
                        onClick={() => setActiveTab('new')}
                        className={`px-6 md:px-10 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === 'new' ? 'neon-gradient text-white shadow-lg' : 'text-surface-dark/50 hover:text-surface-dark'}`}
                    >
                        Nová spolupráce
                    </button>
                    <button
                        onClick={() => setActiveTab('existing')}
                        className={`px-6 md:px-10 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === 'existing' ? 'neon-gradient text-white shadow-lg' : 'text-surface-dark/50 hover:text-surface-dark'}`}
                    >
                        Pro klienty
                    </button>
                </div>
            </div>

            {/* TAB: NOVÁ SPOLUPRÁCE */}
            {activeTab === 'new' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-px w-10 neon-gradient"></div>
                            <h3 className="text-xl font-black text-surface-dark uppercase tracking-tighter">Vstupní formulář</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <FormFieldEditor fieldKey="firstName" fieldName="Jméno" setting={data.orderForm.firstName} onUpdate={handleFieldUpdate} />
                            <FormFieldEditor fieldKey="lastName" fieldName="Příjmení" setting={data.orderForm.lastName} onUpdate={handleFieldUpdate} />
                            <FormFieldEditor fieldKey="email" fieldName="E-mail" setting={data.orderForm.email} onUpdate={handleFieldUpdate} />
                            <FormFieldEditor fieldKey="phone" fieldName="Telefon" setting={data.orderForm.phone} onUpdate={handleFieldUpdate} />
                            <FormFieldEditor fieldKey="servicesSelection" fieldName="Výběr služeb" setting={data.orderForm.servicesSelection} onUpdate={handleFieldUpdate} />
                        </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-surface-dark/10">
                        <div className="flex items-center gap-4">
                            <div className="h-px w-10 neon-gradient"></div>
                            <h3 className="text-xl font-black text-surface-dark uppercase tracking-tighter">Právní Doložka</h3>
                        </div>
                        <div className="p-6 bg-white border border-surface-dark/5 rounded-[2.5rem] shadow-sm">
                            <AdminFormField label="Text souhlasu" htmlFor="consentText">
                                <textarea
                                    id="consentText"
                                    value={data.orderForm.consentText}
                                    onChange={handleConsentTextChange}
                                    rows={3}
                                    className={baseInputClasses}
                                />
                            </AdminFormField>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: PRO KLIENTY */}
            {activeTab === 'existing' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-px w-10 neon-gradient"></div>
                                <h3 className="text-xl font-black text-surface-dark uppercase tracking-tighter">Rezervační odkazy</h3>
                            </div>
                            <button
                                onClick={handleAddBookingLink}
                                className="px-6 py-3 neon-gradient text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-md hover:shadow-neon-glow transition-all"
                            >
                                Přidat odkaz
                            </button>
                        </div>

                        <p className="text-sm text-surface-dark/60 font-medium">
                            Zde nastavíte tlačítka rezervací, která se zobrazí stávajícím klientům pro rychlou rezervaci tréninků.
                        </p>

                        <div className="space-y-4">
                            {(data.orderForm.bookingLinks || []).map((link, index) => (
                                <div key={link.id} className="p-6 bg-white rounded-[2rem] border border-surface-dark/5 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between border-b border-surface-dark/5 pb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-surface-dark/40">Odkaz #{index + 1}</span>
                                        <button
                                            onClick={() => handleRemoveBookingLink(link.id)}
                                            className="text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <AdminFormField label="Název tlačítka" htmlFor={`link-name-${link.id}`}>
                                            <input
                                                type="text"
                                                id={`link-name-${link.id}`}
                                                value={link.name}
                                                onChange={e => handleUpdateBookingLink(link.id, 'name', e.target.value)}
                                                className={baseInputClasses}
                                                placeholder="Např. Osobní trénink"
                                            />
                                        </AdminFormField>

                                        <AdminFormField label="Podnadpis (volitelné)" htmlFor={`link-subtitle-${link.id}`}>
                                            <input
                                                type="text"
                                                id={`link-subtitle-${link.id}`}
                                                value={link.subtitle || ''}
                                                onChange={e => handleUpdateBookingLink(link.id, 'subtitle', e.target.value)}
                                                className={baseInputClasses}
                                                placeholder="Např. Kettlebell Total Steel"
                                            />
                                        </AdminFormField>
                                    </div>

                                    <AdminFormField label="URL odkazu (Reenio nebo jiný)" htmlFor={`link-url-${link.id}`}>
                                        <input
                                            type="url"
                                            id={`link-url-${link.id}`}
                                            value={link.url}
                                            onChange={e => handleUpdateBookingLink(link.id, 'url', e.target.value)}
                                            className={baseInputClasses}
                                            placeholder="https://martin-stastny.reenio.cz/..."
                                        />
                                    </AdminFormField>

                                    <AdminFormField label="Ikona" htmlFor={`link-icon-${link.id}`}>
                                        <div className="flex gap-3">
                                            {(['person', 'group', 'circle'] as const).map(icon => (
                                                <button
                                                    key={icon}
                                                    type="button"
                                                    onClick={() => handleUpdateBookingLink(link.id, 'icon', icon)}
                                                    className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${link.icon === icon ? 'border-neon-blaze bg-orange-50 text-neon-blaze' : 'border-surface-dark/10 text-surface-dark/40 hover:border-surface-dark/30'}`}
                                                >
                                                    {icon === 'person' && (
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                    )}
                                                    {icon === 'group' && (
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                    )}
                                                    {icon === 'circle' && (
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </AdminFormField>
                                </div>
                            ))}

                            {(!data.orderForm.bookingLinks || data.orderForm.bookingLinks.length === 0) && (
                                <div className="text-center py-12 text-surface-dark/30">
                                    <p className="text-sm font-bold uppercase tracking-widest">Zatím nemáte žádné rezervační odkazy</p>
                                    <p className="text-xs mt-2">Klikněte na "Přidat odkaz" pro vytvoření prvního</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrderForm;
