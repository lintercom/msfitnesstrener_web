import React, { useEffect } from 'react';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const baseClasses = 'flex items-center justify-between w-full max-w-sm p-4 text-white rounded-lg shadow-lg transform transition-all duration-300';
  const typeClasses = {
      success: 'bg-[#54728C]',
      error: 'bg-red-700'
  }

  return (
    <div className={`${baseClasses} ${typeClasses[toast.type]}`}>
      <div className="flex items-center">
        {toast.type === 'success' && (
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )}
        {toast.type === 'error' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )}
        <p className="font-medium">{toast.message}</p>
      </div>
      <button onClick={() => onDismiss(toast.id)} className="-mr-1.5 p-1.5 rounded-full hover:bg-white/20 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastMessage[]; onDismiss: (id: number) => void }> = ({ toasts, onDismiss }) => {
    return (
        <div className="fixed bottom-5 right-5 z-50 space-y-3">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    )
}