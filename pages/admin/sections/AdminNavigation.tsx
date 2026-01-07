import React from 'react';
import { AdminSectionProps } from '../AdminDashboard';
import { NavLink } from '../../../types';

const AdminNavigation: React.FC<AdminSectionProps> = ({ data, setData }) => {
    
    const handleLinkChange = (type: 'header' | 'footer', index: number, field: keyof NavLink, value: string) => {
        const linkKey = type === 'header' ? 'headerNavLinks' : 'footerNavLinks';
        const newLinks = [...data.navigation[linkKey]];
        newLinks[index] = {...newLinks[index], [field]: value};
        setData(prev => prev ? { ...prev, navigation: { ...prev.navigation, [linkKey]: newLinks } } : null);
    };

    const addLink = (type: 'header' | 'footer') => {
        const linkKey = type === 'header' ? 'headerNavLinks' : 'footerNavLinks';
        const newLink = { id: `nav${Date.now()}`, name: 'Nová položka', path: '#' };
        setData(prev => prev ? { ...prev, navigation: { ...prev.navigation, [linkKey]: [...prev.navigation[linkKey], newLink] } } : null);
    };

    const removeLink = (type: 'header' | 'footer', index: number) => {
        const linkKey = type === 'header' ? 'headerNavLinks' : 'footerNavLinks';
        setData(prev => prev ? { ...prev, navigation: { ...prev.navigation, [linkKey]: prev.navigation[linkKey].filter((_, i) => i !== index) } } : null);
    };
    
    const navInputClasses = "flex-1 px-3 py-2 border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent bg-surface text-primary-text";

    const renderNavEditor = (title: string, type: 'header' | 'footer') => {
        const links = type === 'header' ? data.navigation.headerNavLinks : data.navigation.footerNavLinks;
        return (
            <div className="p-4 bg-surface border border-border-color rounded-md shadow-sm">
                <h3 className="text-lg font-semibold text-primary-text mb-4">{title}</h3>
                <div className="space-y-3">
                    {links.map((link, index) => (
                        <div key={link.id} className="flex items-center gap-2 p-2 bg-background rounded-md border border-border-color">
                            <input type="text" placeholder="Název" value={link.name} onChange={e => handleLinkChange(type, index, 'name', e.target.value)} className={navInputClasses} />
                            <input type="text" placeholder="Cesta (např. /sluzby)" value={link.path} onChange={e => handleLinkChange(type, index, 'path', e.target.value)} className={navInputClasses} />
                            <button onClick={() => removeLink(type, index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </button>
                        </div>
                    ))}
                    <button onClick={() => addLink(type)} className="text-sm text-blue-600 hover:underline pt-2 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Přidat položku
                    </button>
                </div>
            </div>
        );
    };
    return (
         <div>
            <h2 className="text-2xl font-bold text-primary-text mb-6">Správa navigace</h2>
            <div className="space-y-6">
                {renderNavEditor('Navigace v hlavičce', 'header')}
                {renderNavEditor('Navigace v patičce', 'footer')}
            </div>
        </div>
    );
};

export default AdminNavigation;