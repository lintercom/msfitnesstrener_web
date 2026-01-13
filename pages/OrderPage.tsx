
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { useData } from '../context/DataProvider';
import { PageHero, BlueprintGrid } from '../components/PageDecorations';
import { Service } from '../types';
import emailjs from '@emailjs/browser';
import SEO from '../components/SEO';

import { emailConfig as emailServiceConfig } from '../src/config/email.config';

type ClientTab = 'new' | 'existing';

const OrderPage: React.FC = () => {
    const { data } = useData();
    const [searchParams] = ReactRouterDom.useSearchParams();
    const [activeTab, setActiveTab] = useState<ClientTab>('new');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    // State pro zjednodušený builder služeb
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [helpItem, setHelpItem] = useState<Service | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        note: '',
        selectedServices: [] as string[],
        consent: false
    });

    // Kliknutí mimo dropdown zavře menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Předvybrání služby z URL
    useEffect(() => {
        const serviceId = searchParams.get('service');
        const tabParam = searchParams.get('tab');

        if (serviceId && data.services.find(s => s.id === serviceId)) {
            addService(serviceId);
        }

        if (tabParam === 'existing') {
            setActiveTab('existing');
        }
    }, [searchParams, data.services]);

    const addService = (id: string) => {
        setFormData(prev => ({
            ...prev,
            selectedServices: prev.selectedServices.includes(id)
                ? prev.selectedServices
                : [...prev.selectedServices, id]
        }));
        setIsAddingNew(false);
        setIsDropdownOpen(false);
    };

    const removeService = (id: string) => {
        setFormData(prev => ({
            ...prev,
            selectedServices: prev.selectedServices.filter(sid => sid !== id)
        }));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (data.orderForm.servicesSelection.enabled && data.orderForm.servicesSelection.required && formData.selectedServices.length === 0) {
            alert('Prosím vyberte alespoň jednu službu.');
            return;
        }

        // Validační kontroly
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Prosím zadejte platnou emailovou adresu.');
            return;
        }

        const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
        if (cleanPhone.length < 9 || !/^[+]?[0-9]+$/.test(cleanPhone)) {
            alert('Prosím zadejte platné telefonní číslo (alespoň 9 číslic).');
            return;
        }

        setStatus('submitting');

        // EMAILJS INTEGRATION
        // Check if enabled in CMS/JSON, but usage config from file
        const isEmailEnabled = data.integrations.email.enabled;

        if (isEmailEnabled && emailServiceConfig.form.serviceId && emailServiceConfig.form.templateId && emailServiceConfig.publicKey) {
            try {
                // Mapping services names
                const servicesNames = formData.selectedServices.map(id => {
                    const s = data.services.find(s => s.id === id);
                    return s ? s.title : id;
                }).join(', ');

                // 1. Odeslání notifikace trenérovi
                await emailjs.send(
                    emailServiceConfig.form.serviceId,
                    emailServiceConfig.form.templateId, // template_vh4czst
                    {
                        title: 'Nová poptávka z webu',
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        message: `Email: ${formData.email}\nTelefon: ${formData.phone}\n\nVybrané služby: ${servicesNames}\n\nZpráva od klienta:\n${formData.note || 'Žádná zpráva'}`
                    },
                    emailServiceConfig.publicKey
                );



                setStatus('success');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('EmailJS Error:', error);
                setStatus('error');
                // Temporary debug alert
                const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
                alert(`Odeslání selhalo (Debug info): ${errorMsg}`);
            }
        } else {
            // Fallback or demo mode (when email is not configured)
            console.warn('EmailJS not configured, simulating success');
            setTimeout(() => {
                setStatus('success');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);
        }
    };

    const inputClasses = "w-full bg-white border border-surface-dark/10 rounded-2xl p-5 text-surface-dark placeholder-surface-dark/30 focus:outline-none focus:border-neon-blaze focus:ring-1 focus:ring-neon-blaze transition-all duration-300 font-medium text-lg shadow-sm";

    const availableServices = data.services.filter(s => !formData.selectedServices.includes(s.id));

    return (
        <div className="bg-background min-h-screen">
            <SEO
                title={data.seo.order.title}
                description={data.seo.order.description}
                keywords={data.seo.order.keywords}
            />
            <PageHero
                titlePart1={data.pageHeroes.order.titlePart1}
                titlePart2Accent={data.pageHeroes.order.titlePart2Accent}
                description=""
                subTitle={data.pageHeroes.order.description}
            />

            <div className="bg-surface pt-20 pb-20 md:pt-32 md:pb-32 relative overflow-hidden">
                <BlueprintGrid className="opacity-[0.03] grayscale invert" />

                <div className="container mx-auto px-6 relative z-10">
                    {/* TABS - Skryto při úspěšném odeslání */}
                    {status !== 'success' && (
                        <div className="flex justify-center mb-16 animate-in fade-in duration-500">
                            <div className="bg-surface-light/40 backdrop-blur-md p-1.5 rounded-full border border-surface-dark/5 flex items-center shadow-xl">
                                <button onClick={() => setActiveTab('new')} className={`px-8 md:px-12 py-3.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 ${activeTab === 'new' ? 'neon-gradient text-white shadow-lg' : 'text-surface-dark/65 hover:text-surface-dark'}`}>Nová spolupráce</button>
                                <button onClick={() => setActiveTab('existing')} className={`px-8 md:px-12 py-3.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 ${activeTab === 'existing' ? 'neon-gradient text-white shadow-lg' : 'text-surface-dark/65 hover:text-surface-dark'}`}>Pro klienty</button>
                            </div>
                        </div>
                    )}

                    <div className="max-w-4xl mx-auto">
                        {status === 'success' ? (
                            <div className="bg-surface-light border border-surface-dark/5 rounded-[3rem] p-12 md:p-20 text-center shadow-premium animate-[modal-entry_0.6s_ease-out]">
                                <div className="w-24 h-24 neon-gradient text-white rounded-full flex items-center justify-center mx-auto mb-10 text-4xl shadow-neon-glow">✓</div>
                                <h2 className="text-4xl md:text-5xl font-black text-surface-dark uppercase tracking-tighter mb-4">ODESLÁNO</h2>
                                <p className="text-surface-dark/75 text-xl font-medium mb-12 max-w-md mx-auto leading-relaxed">Tvé odhodlání začít je první krok k výsledku. Brzy se ti ozvu pro naplánování vstupní konzultace.</p>
                                <ReactRouterDom.Link to="/" className="inline-block px-12 py-5 neon-gradient text-white rounded-full font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-neon-glow hover:scale-105 active:scale-95">Zpět na úvod</ReactRouterDom.Link>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className={`transition-all duration-700 ease-in-out ${activeTab === 'new' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none absolute inset-0'}`}>
                                    <div className="bg-surface-light/80 backdrop-blur-sm border border-surface-dark/5 rounded-[3rem] p-8 md:p-16 shadow-premium relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blaze opacity-0 blur-[150px] group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none"></div>

                                        <div className="relative z-10 mb-16 text-center">
                                            <h2 className="text-4xl md:text-6xl font-black text-surface-dark uppercase tracking-tighter leading-[0.9] mb-6">
                                                VSTUPNÍ <span className="ms-gradient-text">FORMULÁŘ</span>
                                            </h2>
                                            <p className="text-surface-dark/70 font-medium text-lg leading-relaxed max-w-2xl mx-auto text-pretty">
                                                Vyberte služby, o které máte zájem. Po odeslání se vám ozvu a společně nastavíme další postup.
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                                            {/* KONTAKTNÍ ÚDAJE */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {data.orderForm.firstName.enabled && (
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-surface-dark/60 ml-4">{data.orderForm.firstName.label}</label>
                                                        <input type="text" autoComplete="given-name" required={data.orderForm.firstName.required} className={inputClasses} value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                                    </div>
                                                )}
                                                {data.orderForm.lastName.enabled && (
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-surface-dark/60 ml-4">{data.orderForm.lastName.label}</label>
                                                        <input type="text" autoComplete="family-name" required={data.orderForm.lastName.required} className={inputClasses} value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                                    </div>
                                                )}
                                                {data.orderForm.email.enabled && (
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-surface-dark/60 ml-4">{data.orderForm.email.label}</label>
                                                        <input type="email" autoComplete="email" required={data.orderForm.email.required} className={inputClasses} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                                    </div>
                                                )}
                                                {data.orderForm.phone.enabled && (
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-surface-dark/60 ml-4">{data.orderForm.phone.label}</label>
                                                        <input
                                                            type="tel"
                                                            autoComplete="tel"
                                                            required={data.orderForm.phone.required}
                                                            className={inputClasses}
                                                            value={formData.phone}
                                                            onChange={e => {
                                                                // Povolit pouze čísla, mezery, pomlčky, závorky a + na začátku
                                                                const value = e.target.value;
                                                                if (/^[+]?[0-9\s\-\(\)]*$/.test(value)) {
                                                                    setFormData({ ...formData, phone: value });
                                                                }
                                                            }}
                                                            placeholder="+420 123 456 789"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* SEZNAM VYBRANÝCH SLUŽEB */}
                                            {data.orderForm.servicesSelection.enabled && (
                                                <div className="space-y-6 pt-4">
                                                    <div className="flex items-center justify-between mb-4 px-4">
                                                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-surface-dark">VYBRAT SLUŽBY</h3>
                                                        <div className="h-px flex-grow mx-8 bg-surface-dark/5"></div>
                                                        <span className="text-[10px] font-bold text-surface-dark/30 uppercase tracking-widest">{formData.selectedServices.length} VYBRÁNO</span>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {formData.selectedServices.map(sid => {
                                                            const service = data.services.find(s => s.id === sid);
                                                            if (!service) return null;
                                                            return (
                                                                <div key={sid} className="bg-white/80 border border-surface-dark/5 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-left-4 duration-300">
                                                                    <div className="flex items-center gap-5">
                                                                        <div className="w-8 h-8 rounded-lg neon-gradient flex items-center justify-center text-white shadow-sm">
                                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                                        </div>
                                                                        <span className="text-base font-black text-surface-dark uppercase tracking-tight">{service.title}</span>
                                                                    </div>
                                                                    <button type="button" onClick={() => removeService(sid)} className="p-2 text-red-300 hover:text-red-500 transition-colors" title="Odebrat">
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* UI PRO PŘIDÁNÍ */}
                                                    <div className="flex flex-col items-center gap-6">
                                                        {isAddingNew ? (
                                                            <div className="w-full bg-white border-2 border-neon-blaze/20 rounded-[2.5rem] p-6 md:p-8 animate-in fade-in zoom-in-95 duration-500 shadow-xl relative">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-grow max-w-md relative" ref={dropdownRef}>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                                            className="w-full bg-gray-50 border border-surface-dark/10 rounded-xl p-4 text-left flex items-center justify-between hover:border-neon-blaze transition-all"
                                                                        >
                                                                            <span className="font-black uppercase tracking-tight text-surface-dark/30">--- Zvolte z nabídky ---</span>
                                                                            <svg className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                                                        </button>

                                                                        {isDropdownOpen && (
                                                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-surface-dark/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col">
                                                                                {availableServices.length > 0 ? (
                                                                                    availableServices.map(s => (
                                                                                        <div key={s.id} className="relative border-b border-surface-dark/5 last:border-none group/item flex items-center">
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => addService(s.id)}
                                                                                                className="flex-grow p-5 pr-14 text-left font-black uppercase tracking-tight text-surface-dark hover:bg-surface-dark hover:text-white transition-colors"
                                                                                            >
                                                                                                {s.title}
                                                                                            </button>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={(e) => { e.stopPropagation(); setHelpItem(s); }}
                                                                                                className="absolute right-4 w-8 h-8 rounded-full border border-surface-dark/10 text-surface-dark/30 hover:border-neon-blaze hover:text-neon-blaze flex items-center justify-center transition-colors bg-white/50"
                                                                                                title="Více informací"
                                                                                            >
                                                                                                <span className="text-[13px] font-black">?</span>
                                                                                            </button>
                                                                                        </div>
                                                                                    ))
                                                                                ) : (
                                                                                    <div className="p-5 text-center text-[10px] font-black uppercase tracking-widest text-surface-dark/30">Všechny služby jsou již vybrány</div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <button type="button" onClick={() => { setIsAddingNew(false); setIsDropdownOpen(false); }} className="text-[10px] font-black uppercase tracking-widest text-surface-dark/30 hover:text-red-500 transition-colors ml-6">Zrušit</button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsAddingNew(true)}
                                                                className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out group/plus shadow-xl hover:shadow-neon-glow relative overflow-hidden"
                                                            >
                                                                <div className="absolute inset-0 bg-background/80 backdrop-blur-md border border-white/5 group-hover:border-transparent transition-colors duration-500 rounded-full"></div>
                                                                <div className="absolute inset-0 neon-gradient opacity-0 group-hover:plus:opacity-100 transition-opacity duration-500 rounded-full"></div>

                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-8 w-8 md:h-9 md:w-9 text-white relative z-10 transition-transform duration-500 group-hover/plus:scale-110 group-hover/plus:rotate-90"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={3}
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* DODATEČNÁ POZNÁMKA */}
                                            {data.orderForm.note.enabled && !isAddingNew && (
                                                <div className="space-y-4 pt-4 animate-in fade-in duration-700">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-surface-dark/60 ml-4">{data.orderForm.note.label}</label>
                                                    <textarea rows={4} placeholder="Máš specifický dotaz, motivaci nebo omezení?" className={inputClasses} value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} />
                                                </div>
                                            )}

                                            {/* ODESLÁNÍ */}
                                            <div className="pt-8 border-t border-surface-dark/5 space-y-8 flex flex-col items-center">
                                                <label className="flex items-center justify-center gap-4 group cursor-pointer text-center">
                                                    <input type="checkbox" required className="h-6 w-6 rounded border-gray-300 text-neon-pink focus:ring-neon-pink cursor-pointer flex-shrink-0" checked={formData.consent} onChange={e => setFormData({ ...formData, consent: e.target.checked })} />
                                                    <span className="text-sm text-surface-dark/70 font-medium group-hover:text-surface-dark transition-colors">{data.orderForm.consentText}</span>
                                                </label>
                                                <button type="submit" disabled={status === 'submitting' || isAddingNew} className="w-full py-7 neon-gradient text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl hover:shadow-neon-glow hover:scale-[1.02] active:scale-95 transition-all text-xl disabled:opacity-50 flex items-center justify-center gap-4">
                                                    {status === 'submitting' ? <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'ODESLAT'}
                                                </button>
                                                {isAddingNew && (
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-center text-red-400 animate-pulse">Před odesláním dokončete výběr nebo jej zrušte</p>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className={`transition-all duration-700 ease-in-out ${activeTab === 'existing' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none absolute inset-0'}`}>
                                    <div className="bg-surface-light/80 backdrop-blur-sm border border-surface-dark/5 rounded-[3rem] p-8 md:p-16 shadow-premium relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blaze opacity-0 blur-[150px] group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none"></div>

                                        <div className="relative z-10 mb-12 text-center">
                                            <h2 className="text-4xl md:text-6xl font-black text-surface-dark uppercase tracking-tighter leading-[0.9] mb-6">
                                                REZERVAČNÍ <span className="ms-gradient-text">SYSTÉM</span>
                                            </h2>
                                            <p className="text-surface-dark/70 font-medium text-lg leading-relaxed max-w-2xl mx-auto text-pretty">
                                                Vyberte si typ tréninku a zarezervujte si svůj termín přímo v našem systému Reenio.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                                            {/* OSOBNÍ TRÉNINK */}
                                            <a
                                                href="https://martin-stastny.reenio.cz/cs/service/osobni-trenink-51708"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group/btn relative bg-white border border-surface-dark/5 rounded-3xl p-8 text-center transition-all duration-500 hover:shadow-neon-glow hover:-translate-y-2 flex flex-col items-center"
                                            >
                                                <div className="w-16 h-16 rounded-2xl neon-gradient flex items-center justify-center text-white mb-6 shadow-lg group-hover/btn:scale-110 transition-transform duration-500">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                </div>
                                                <h3 className="text-xl font-black text-surface-dark uppercase tracking-tight mb-2">OSOBNÍ<br />TRÉNINK</h3>
                                                <div className="mt-auto pt-6">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white bg-surface-dark px-6 py-2 rounded-full group-hover/btn:neon-gradient transition-colors">Rezervovat</span>
                                                </div>
                                            </a>

                                            {/* SKUPOVÝ TRÉNINK */}
                                            <a
                                                href="https://martin-stastny.reenio.cz/cs/service/kettlebell-total-steel-skupinova-lekce-53736"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group/btn relative bg-white border border-surface-dark/5 rounded-3xl p-8 text-center transition-all duration-500 hover:shadow-neon-glow hover:-translate-y-2 flex flex-col items-center"
                                            >
                                                <div className="w-16 h-16 rounded-2xl neon-gradient flex items-center justify-center text-white mb-6 shadow-lg group-hover/btn:scale-110 transition-transform duration-500">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                </div>
                                                <h3 className="text-xl font-black text-surface-dark uppercase tracking-tight mb-2">SKUPINOVÝ<br />TRÉNINK</h3>
                                                <p className="text-[10px] font-bold text-surface-dark/40 uppercase tracking-widest mb-4">(Kettlebell Total Steel)</p>
                                                <div className="mt-auto pt-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white bg-surface-dark px-6 py-2 rounded-full group-hover/btn:neon-gradient transition-colors">Rezervovat</span>
                                                </div>
                                            </a>

                                            {/* KRUHOVÝ TRÉNINK */}
                                            <a
                                                href="https://martin-stastny.reenio.cz/cs/service/kruhovy-trenink-pro-sportovce-10-18-let-54176"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group/btn relative bg-white border border-surface-dark/5 rounded-3xl p-8 text-center transition-all duration-500 hover:shadow-neon-glow hover:-translate-y-2 flex flex-col items-center"
                                            >
                                                <div className="w-16 h-16 rounded-2xl neon-gradient flex items-center justify-center text-white mb-6 shadow-lg group-hover/btn:scale-110 transition-transform duration-500">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                </div>
                                                <h3 className="text-xl font-black text-surface-dark uppercase tracking-tight mb-2">KRUHOVÝ<br />TRÉNINK</h3>
                                                <div className="mt-auto pt-6">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white bg-surface-dark px-6 py-2 rounded-full group-hover/btn:neon-gradient transition-colors">Rezervovat</span>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* HELP WINDOW / MODAL */}
            {helpItem && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 transition-all duration-300 animate-in fade-in">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setHelpItem(null)}></div>
                    <div className="bg-white border border-surface-dark/5 rounded-[2.5rem] shadow-premium max-w-md w-full relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 md:p-10">
                            <div className="w-12 h-1.5 neon-gradient rounded-full mb-8"></div>
                            <h3 className="text-3xl font-black text-surface-dark uppercase tracking-tighter leading-none mb-6">{helpItem.title}</h3>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-surface-dark/70 text-lg leading-relaxed font-medium whitespace-pre-line">
                                    {helpItem.description}
                                </p>
                            </div>
                            <button
                                onClick={() => setHelpItem(null)}
                                className="mt-10 w-full py-4 neon-gradient text-white rounded-full text-[11px] font-black uppercase tracking-[0.4em] shadow-lg hover:shadow-neon-glow hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Rozumím
                            </button>
                        </div>
                        <button
                            onClick={() => setHelpItem(null)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-surface-dark/20 hover:text-surface-dark transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderPage;
