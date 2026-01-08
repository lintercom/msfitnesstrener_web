import React, { useState, useEffect } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import Logo from './Logo';
import { useData } from '../context/DataProvider';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data } = useData();
  const location = ReactRouterDom.useLocation();
  const navigate = ReactRouterDom.useNavigate();

  const navLinks = (data.navigation.headerNavLinks || []).filter(link => link.path !== '/');

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== isScrolled) setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handleNavLinkClick = (e: React.MouseEvent, path: string) => {
    if (path.includes('#sluzby')) {
      e.preventDefault();
      setIsMenuOpen(false);

      if (location.pathname === '/') {
        const element = document.getElementById('sluzby');
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      } else {
        navigate('/#sluzby');
      }
    } else {
      setIsMenuOpen(false);
    }
  };

  const { logo, logoScale, companyName, socials } = data.general;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-500 overflow-visible ${isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-white/5 shadow-2xl'
          : isMenuOpen
            ? 'bg-background border-b border-white/5 shadow-2xl'
            : 'bg-transparent border-b border-transparent'
          }`}
      >
        <div className={`w-full px-6 lg:px-12 relative flex items-center justify-between transition-all duration-300 overflow-visible ${isScrolled ? 'h-16' : 'h-20'
          }`}>

          <ReactRouterDom.Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center relative z-[60]">
            <div style={{
              height: isScrolled ? '40px' : '48px',
              width: data.appearance.header.logoMaxWidth || 'auto',
              transition: 'all 0.3s ease'
            }} className="flex items-center">
              <Logo
                className="h-full w-auto object-contain"
                style={{ transform: `scale(${(logoScale || 100) / 100})`, transformOrigin: 'left center' }}
              />
            </div>
          </ReactRouterDom.Link>

          <nav className="hidden lg:flex items-center gap-[clamp(2rem,4vw,6rem)] 2xl:gap-[clamp(4rem,6vw,10rem)] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-500">
            {navLinks.map((link) => {
              const isAnchor = link.path.includes('#');
              return (
                <ReactRouterDom.Link
                  key={link.id}
                  to={link.path}
                  onClick={(e) => isAnchor ? handleNavLinkClick(e, link.path) : undefined}
                  className="text-[11px] font-black uppercase tracking-[0.5em] text-white/70 hover:bg-gradient-to-r hover:from-neon-orange hover:to-neon-pink hover:bg-clip-text hover:text-transparent transition-all whitespace-nowrap hover:scale-105 transform-gpu"
                >
                  {link.name}
                </ReactRouterDom.Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4 md:gap-8 relative z-30 overflow-visible">
            {/* Social Icons - Clean Version */}
            <div className="hidden sm:flex items-center gap-6 overflow-visible py-2">
              <a
                href={data.general.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-all group hover:-translate-y-1 transform transform-gpu will-change-transform"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294H9.691v-3.622h3.134V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325c0-.731-.593-1.325-1.324-1.325z" />
                </svg>
              </a>
              <a
                href={data.general.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-all group hover:-translate-y-1 transform transform-gpu will-change-transform"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>

            <ReactRouterDom.Link
              to="/objednat"
              className="hidden md:inline-flex px-7 py-2.5 neon-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg transition-all hover:shadow-neon-glow hover:scale-[1.05] active:scale-95 transform will-change-transform"
            >
              Začít trénovat
            </ReactRouterDom.Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-neon-pink transition-colors"
              aria-label={isMenuOpen ? "Zavřít menu" : "Otevřít menu"}
            >
              <div className="w-5 h-4 flex flex-col justify-between relative">
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 w-full h-[100dvh] bg-background z-[1000] flex flex-col transition-all duration-500 lg:hidden ${isMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'
          }`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/5">
          <Logo className="h-10 w-auto" variant="light" />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-white"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-grow flex flex-col items-center justify-center gap-8 px-6 pb-12 overflow-y-auto">
          {data.navigation.headerNavLinks.map((link) => {
            const isAnchor = link.path.includes('#');
            return (
              <ReactRouterDom.Link
                key={link.id}
                to={link.path}
                onClick={(e) => {
                  if (isAnchor) handleNavLinkClick(e, link.path);
                  else setIsMenuOpen(false);
                }}
                className="text-3xl font-black text-white uppercase tracking-tighter text-center"
              >
                {link.name}
              </ReactRouterDom.Link>
            );
          })}

          <div className="w-16 h-px bg-white/10 my-4"></div>

          <ReactRouterDom.Link
            to="/objednat"
            onClick={() => setIsMenuOpen(false)}
            className="w-full max-w-xs py-5 neon-gradient text-white text-sm font-black uppercase tracking-widest rounded-full text-center transition-all hover:shadow-neon-glow hover:scale-[1.05] active:scale-95 transform will-change-transform"
          >
            Začít trénovat
          </ReactRouterDom.Link>

          {/* Mobile Social Icons */}
          <div className="flex items-center gap-8 pt-4">
            <a
              href={data.general.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-90 shadow-lg"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294H9.691v-3.622h3.134V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325c0-.731-.593-1.325-1.324-1.325z" />
              </svg>
            </a>
            <a
              href={data.general.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-90 shadow-lg"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
