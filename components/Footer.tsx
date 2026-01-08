
import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import Logo from './Logo';
import { useData } from '../context/DataProvider';

const Footer: React.FC = () => {
  const { data } = useData();
  const footerLinks = data.navigation.footerNavLinks || [];
  const services = data.services || [];

  return (
    <footer className="bg-background text-white border-t border-white/5 overflow-hidden relative shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.5)]">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>

      {/* Top Accent Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-orange/20 to-transparent"></div>

      <div className="container mx-auto px-6 lg:px-12 py-24 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 text-center sm:text-left">

          {/* Column 1: Brand */}
          <div className="flex flex-col items-center sm:items-start space-y-8">
            <div className="flex flex-col gap-4">
              <Logo className="h-20 lg:h-24 w-auto" style={{ transform: `scale(${(data.general.logoScale || 100) / 100})`, transformOrigin: 'center' }} />
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-white/20">Prozkoumat</h3>
            <ul className="space-y-4 font-black uppercase tracking-widest text-[11px]">
              {footerLinks.map(link => (
                <li key={link.id}>
                  <ReactRouterDom.Link to={link.path} className="text-white/40 hover:text-white hover:tracking-[0.2em] transition-all duration-300">
                    {link.name}
                  </ReactRouterDom.Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-white/20">Specializace</h3>
            <ul className="space-y-4 font-black uppercase tracking-widest text-[11px]">
              {services.map(service => (
                <li key={service.id}>
                  <ReactRouterDom.Link to={`/#${service.id}`} className="text-white/40 hover:text-white hover:tracking-[0.2em] transition-all duration-300">
                    {service.title}
                  </ReactRouterDom.Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-white/20">Kontakt</h3>
            <ul className="space-y-4 font-black tracking-widest text-[11px] flex flex-col items-center sm:items-start mb-6">
              {/* Email Item */}
              <li className="flex items-center gap-4 group">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:neon-gradient group-hover:text-white group-hover:shadow-neon-glow flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <a href={`mailto:${data.general.contactEmail}`} className="text-white/40 hover:text-white hover:tracking-[0.2em] transition-all duration-300 lowercase">
                  {data.general.contactEmail}
                </a>
              </li>

              {data.general.contactPhone && (
                <li className="flex items-center gap-4 group">
                  <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:neon-gradient group-hover:text-white group-hover:shadow-neon-glow flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.81 12.81 0 00.6 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.6A2 2 0 0122 16.92z" />
                    </svg>
                  </span>
                  <a href={`tel:${data.general.contactPhone}`} className="text-white/40 hover:text-white hover:tracking-[0.2em] transition-all duration-300">
                    {data.general.contactPhone}
                  </a>
                </li>
              )}
            </ul>

            {/* Footer Social Icons - Refined for perfect vertical alignment */}
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 overflow-visible py-2">
              <a
                href={data.general.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all group hover:-translate-y-1 transform transform-gpu will-change-transform hover:neon-gradient hover:shadow-neon-glow hover:border-transparent"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294H9.691v-3.622h3.134V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325c0-.731-.593-1.325-1.324-1.325z" />
                </svg>
              </a>
              <a
                href={data.general.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all group hover:-translate-y-1 transform transform-gpu will-change-transform hover:neon-gradient hover:shadow-neon-glow hover:border-transparent"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] font-black uppercase tracking-[0.4em] text-white/10 gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 flex-wrap justify-center md:justify-start">
            <p className="whitespace-nowrap">{data.general.copyright}</p>

            <span className="hidden md:block w-1 h-1 bg-white/10 rounded-full"></span>
            <ReactRouterDom.Link to="/ochrana-soukromi" className="hover:text-white transition-colors whitespace-nowrap">Ochrana soukromí</ReactRouterDom.Link>

            <span className="hidden md:block w-1 h-1 bg-white/10 rounded-full"></span>
            <ReactRouterDom.Link to="/obchodni-podminky" className="hover:text-white transition-colors whitespace-nowrap">Obchodní podmínky</ReactRouterDom.Link>

            <span className="hidden md:block w-1 h-1 bg-white/10 rounded-full"></span>
            <ReactRouterDom.Link to="/admin" className="hover:text-white transition-colors whitespace-nowrap">Admin Hub Access</ReactRouterDom.Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
