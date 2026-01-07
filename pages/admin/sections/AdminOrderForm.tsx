
import React from 'react';
import { AdminSectionProps } from '../AdminDashboard';
import { OrderFormFieldSetting } from '../../../types';
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


const AdminOrderForm: React.FC<AdminSectionProps> = ({ data, setData }) => {
    
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
    
    const baseInputClasses = "w-full bg-gray-50 border border-surface-dark/5 rounded-2xl p-4 text-surface-dark focus:outline-none focus:border-neon-blaze transition-all duration-500 font-medium text-sm shadow-sm";

    if (!data.orderForm) {
        return <div className="text-surface-dark/20 font-black uppercase tracking-widest text-center py-10">Konfigurace nebyla nalezena.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-px w-10 neon-gradient"></div>
                    <h3 className="text-xl font-black text-surface-dark uppercase tracking-tighter">Onboarding</h3>
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
    );
};

export default AdminOrderForm;
