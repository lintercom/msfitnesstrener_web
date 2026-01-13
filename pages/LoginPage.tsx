
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as ReactRouterDom from 'react-router-dom';
import { BlueprintGrid } from '../components/PageDecorations';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = ReactRouterDom.useNavigate();
  const location = ReactRouterDom.useLocation();

  // Automatické přesměrování do dashboardu pouze pokud uživatel přijde na /admin a JIŽ JE přihlášen
  useEffect(() => {
    if (isAuthenticated && isAdmin && location.pathname === '/admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user && user.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        setError('Neplatné přihlašovací údaje. Zkuste admin/admin.');
      }
    } catch (err) {
      setError('Nastala chyba při komunikaci se serverem.');
    } finally {
      setLoading(false);
    }
  };



  const inputClasses = "w-full bg-gray-50 border border-surface-dark/10 rounded-2xl p-4 text-surface-dark placeholder-surface-dark/30 focus:outline-none focus:border-neon-blaze transition-all duration-500 font-medium text-lg";

  return (
    <div className="min-h-screen bg-background relative flex flex-col justify-center items-center py-12 px-6 overflow-hidden bg-noise">
      <BlueprintGrid className="opacity-[0.1]" />
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-neon-blaze/10 rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-neon-pink/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none">
            Admin <span className="ms-gradient-text">Hub</span>
          </h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Vstup do řídícího centra</p>
        </div>

        <div className="bg-surface-light rounded-[3rem] shadow-premium p-10 md:p-14 border border-white/5 relative overflow-hidden">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.4em] text-surface-dark/65 ml-4">
                ID
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="username"
                required
                placeholder="admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.4em] text-surface-dark/65 ml-4">
                Heslo
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClasses} pr-14`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-surface-dark/40 hover:text-neon-blaze transition-colors active:scale-90"
                  aria-label={showPassword ? "Skrýt heslo" : "Zobrazit heslo"}
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L3 3m18 18l-6.888-6.888m4.208-2.091A10.045 10.045 0 0121.543 12c-1.275 4.057-5.065 7-9.543 7-1.167 0-2.285-.195-3.33-.554m5.44-5.44L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 neon-gradient text-white rounded-full font-black uppercase tracking-widest transition-all shadow-[0_20px_40px_rgba(244,63,94,0.3)] transform hover:-translate-y-1 active:scale-95 text-center text-lg disabled:opacity-50"
            >
              {loading ? 'AUTORIZACE...' : 'VSTOUPIT'}
            </button>


          </form>
        </div>



        <div className="mt-12 text-center">
          <ReactRouterDom.Link to="/" className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 hover:text-white transition-all inline-flex items-center gap-4 group">
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            hlavní stránka
          </ReactRouterDom.Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
