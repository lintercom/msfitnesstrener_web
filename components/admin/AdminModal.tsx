
import React from 'react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'xl';
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, title, children, footer, size = 'xl' }) => {
  if (!isOpen) return null;

  const isSmall = size === 'sm';

  return (
    <div 
      className="fixed inset-0 bg-[#0F172A]/98 z-[100] flex items-center justify-center p-4 md:p-6 transition-opacity duration-300" 
      onClick={onClose}
    >
      <div 
        className={`bg-white md:border md:border-surface-dark/10 md:rounded-[2.5rem] shadow-2xl w-full flex flex-col overflow-hidden animate-[modal-entry_0.4s_cubic-bezier(0.2,0,0,1)] 
          ${isSmall ? 'max-w-md h-auto max-h-[80vh] rounded-[2rem]' : 'max-w-5xl h-full md:max-h-[88vh]'}`} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 md:px-10 md:py-6 border-b border-surface-dark/5 flex justify-between items-center bg-white sticky top-0 z-[110] ${isSmall ? 'md:px-8 md:py-5' : ''}`}>
          <div className="flex items-center gap-3">
            <div className={`w-1 neon-gradient rounded-full ${isSmall ? 'h-5' : 'h-6'}`}></div>
            <h3 className={`font-black text-surface-dark uppercase tracking-tighter leading-none ${isSmall ? 'text-base md:text-lg' : 'text-lg md:text-2xl'}`}>{title}</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-surface-dark/5 hover:bg-surface-dark hover:text-white flex items-center justify-center text-surface-dark/30 transition-colors group">
             <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        {/* Body */}
        <div className={`flex-grow overflow-y-auto custom-scrollbar relative bg-white px-6 md:px-10 ${isSmall ? 'md:px-8' : ''}`}>
          <div className={`max-w-4xl mx-auto py-6 md:py-8 ${isSmall ? 'py-5 md:py-6' : ''}`}>
            {children}
          </div>
        </div>
        
        {/* Optional Static Footer */}
        {footer && (
            <div className={`px-6 py-6 md:px-10 md:py-8 border-t border-surface-dark/5 bg-gray-50 flex justify-end gap-3 relative z-[110] ${isSmall ? 'md:px-8 md:py-5' : ''}`}>
                {footer}
            </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modal-entry {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(15, 23, 42, 0.05); border-radius: 10px; }
      `}} />
    </div>
  );
};

export default AdminModal;
