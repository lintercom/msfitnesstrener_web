
import React, { useState } from 'react';
import { SiteData } from '../../../types';
import { AdminSectionProps } from '../AdminDashboard';

// Import Specific Editors
import AdminServices from './AdminServices';
import AdminGallery from './AdminGallery';
import AdminBlog from './AdminBlog';
import AdminOrderForm from './AdminOrderForm';
import AdminAboutMe from './AdminAboutMe';
import AdminHeroEditor from './AdminHeroEditor';

type ContentTab = 'home' | 'gallery' | 'blog' | 'about' | 'order';

interface PageCardProps {
    id: ContentTab;
    label: string;
    icon: React.ReactElement;
    isActive: boolean;
    onClick: () => void;
}

const PageControlCard: React.FC<PageCardProps> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2.5 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all border ${
            isActive
                ? 'bg-surface-dark border-surface-dark text-white shadow-lg'
                : 'bg-white border-surface-dark/5 text-surface-dark/60 hover:bg-gray-50'
        }`}
    >
        <div className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-colors ${
            isActive ? 'bg-white/10 text-white' : 'bg-surface-dark/5 text-surface-dark/40'
        }`}>
            {React.cloneElement(icon as React.ReactElement<any>, { className: "w-4 h-4 md:w-5 md:h-5" })}
        </div>

        <div className="text-left">
            <div className={`text-[11px] md:text-[13px] font-black uppercase tracking-tight ${isActive ? 'text-white' : 'text-surface-dark'}`}>
                {label}
            </div>
        </div>
    </button>
);

const AdminContent: React.FC<AdminSectionProps> = (props) => {
    const [activeTab, setActiveTab] = useState<ContentTab>('home');

    const renderTabContent = () => {
        const contentMap: Record<ContentTab, React.ReactNode> = {
            home: (
                <div className="space-y-8 md:space-y-12">
                    <AdminHeroEditor pageKey="home" {...props} />
                    <AdminServices {...props} />
                </div>
            ),
            gallery: (
                <div className="space-y-8 md:space-y-12">
                    <AdminHeroEditor pageKey="gallery" {...props} />
                    <AdminGallery {...props} />
                </div>
            ),
            blog: (
                <div className="space-y-8 md:space-y-12">
                    <AdminHeroEditor pageKey="blog" {...props} />
                    <AdminBlog {...props} />
                </div>
            ),
            about: (
                <div className="space-y-8 md:space-y-12">
                    <AdminHeroEditor pageKey="aboutMe" {...props} />
                    <AdminAboutMe {...props} />
                </div>
            ),
            order: (
                <div className="space-y-8 md:space-y-12">
                    <AdminHeroEditor pageKey="order" {...props} />
                    <AdminOrderForm {...props} />
                </div>
            )
        };
        return contentMap[activeTab];
    }

    const tabs: {id: ContentTab, label: string, icon: React.ReactElement}[] = [
        { 
            id: 'home', 
            label: 'Domů', 
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        },
        { 
            id: 'gallery', 
            label: 'Tréninky', 
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        },
        { 
            id: 'blog', 
            label: 'Blog', 
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 4v4h4" /></svg>
        },
        { 
            id: 'about', 
            label: 'O mně', 
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        },
        { 
            id: 'order', 
            label: 'Formulář', 
            icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        },
    ];

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
             <div className="bg-white p-2 md:p-3 rounded-2xl md:rounded-[2rem] border border-surface-dark/5 shadow-md overflow-x-auto custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 md:gap-3 min-w-[320px]">
                    {tabs.map(tab => (
                        <PageControlCard
                            key={tab.id}
                            {...tab}
                            isActive={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </div>
             </div>

            <div className="bg-surface rounded-3xl md:rounded-[2.5rem] border border-surface-dark/5 p-4 sm:p-8 lg:p-12 relative overflow-hidden shadow-sm">
                <div className="relative z-10">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminContent;
