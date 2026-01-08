
import React from 'react';

interface AdminFormFieldProps {
    label: string;
    htmlFor: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

const AdminFormField: React.FC<AdminFormFieldProps> = ({ label, htmlFor, description, children, className = '' }) => {
    return (
        <div className={className}>
            <label htmlFor={htmlFor} className="block text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-surface-dark/65 mb-2 md:mb-4 ml-1 md:ml-4">
                {label}
            </label>
            <div className="relative">
                {children}
            </div>
            {description && (
                <p className="mt-3 md:mt-4 text-[10px] md:text-[11px] font-black text-neon-pink/80 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-1 md:ml-4 leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
};

export default AdminFormField;
