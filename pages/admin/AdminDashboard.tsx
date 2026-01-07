
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as ReactRouterDom from 'react-router-dom';
import { useData } from '../../context/DataProvider';
import { SiteData } from '../../types';
import { BlueprintGrid } from '../../components/PageDecorations';

// Section Components
import AdminAdvancedSettings from './sections/AdminAdvancedSettings';
import AdminContent from './sections/AdminContent';

import { ToastContainer, ToastMessage } from '../../components/admin/Toast';

export type AdminSection = 'content' | 'settings';

export interface AdminSectionProps {
  data: SiteData;
  setData: React.SetStateAction<SiteData> | any;
  showToast: (message: string, type?: 'success' | 'error') => void;
  setActiveSection: (section: AdminSection) => void;
}

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = ReactRouterDom.useNavigate();
  const { data, setData: setGlobalData, loading } = useData();

  const [localData, setLocalData] = useState<SiteData | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>('content');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!loading && data) {
      setLocalData(JSON.parse(JSON.stringify(data)));
    }
  }, [data, loading]);

  useEffect(() => {
    if (isInitialLoad.current) {
      if (localData) {
        isInitialLoad.current = false;
      }
      return;
    }

    if (localData) {
      const localDataString = JSON.stringify(localData);
      const globalDataString = JSON.stringify(data);
      setHasUnsavedChanges(localDataString !== globalDataString);
    }
  }, [localData, data]);

  const handleSave = () => {
    if (!localData) return;
    setSaveStatus('saving');
    setTimeout(() => {
      setGlobalData(localData);
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      showToast('HUB AKTUALIZOVÁN', 'success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleHeaderClick = () => {
    setActiveSection('content');
    setResetKey(prev => prev + 1);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }]);
  };

  const dismissToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  const renderSection = () => {
    if (!localData) return null;
    const props: AdminSectionProps = { data: localData, setData: setLocalData, showToast, setActiveSection };
    return activeSection === 'content' ? <AdminContent {...props} key={`content-${resetKey}`} /> : <AdminAdvancedSettings {...props} key={`settings-${resetKey}`} />;
  };

  if (loading || !localData) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-white uppercase font-black tracking-[0.6em] text-xs">
        Performance Hub Initializing...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden text-white isolation-auto">
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-20"
        style={{
          background: `
                radial-gradient(circle at 10% 10%, rgba(251, 146, 60, 0.05) 0%, transparent 30%),
                radial-gradient(circle at 90% 90%, rgba(244, 63, 94, 0.05) 0%, transparent 30%)
            `
        }}
      ></div>

      <header className="relative z-50 border-b border-white/5 bg-[#0F172A] shadow-xl">
        <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1
              onClick={handleHeaderClick}
              className="text-lg md:text-xl font-black uppercase tracking-tighter leading-none select-none cursor-pointer hover:opacity-80 transition-all active:scale-95"
            >
              Admin <span className="ms-gradient-text hidden sm:inline">Dashboard</span>
              <span className="ms-gradient-text sm:hidden">HUB</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving' || !hasUnsavedChanges}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all
                                ${hasUnsavedChanges
                  ? 'neon-gradient text-white shadow-lg active:scale-95'
                  : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                }`
              }
            >
              {saveStatus === 'saving' ? '...' : 'Uložit'}
            </button>

            <div className="flex items-center gap-1.5 md:gap-3">
              <button
                onClick={() => setActiveSection(activeSection === 'settings' ? 'content' : 'settings')}
                className={`w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center border transition-all duration-300 ${activeSection === 'settings'
                    ? 'neon-gradient text-white border-transparent shadow-neon-glow'
                    : 'bg-white/5 text-white/30 border-white/10'
                  }`}
                title={activeSection === 'settings' ? 'Zavřít nastavení' : 'Nastavení'}
              >
                {activeSection === 'settings' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-white/5 text-white/30 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <span className="text-[11px] md:text-[13px] font-black tracking-tighter">WEB</span>
              </button>

              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-white/5 text-white/30 border border-white/10 flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative z-20 px-3 md:px-6 py-6 md:py-8 custom-scrollbar isolation-auto">
        <div className="container mx-auto max-w-7xl">
          {renderSection()}
        </div>
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}} />
    </div>
  );
};

export default AdminDashboard;
