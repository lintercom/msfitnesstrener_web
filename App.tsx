import React, { useEffect, Suspense } from 'react';
import * as ReactRouterDom from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataProvider';

// Eager loaded - hlavní stránka pro rychlý první render
import { HomePage } from './pages/HomePage';
import MainLayout from './components/layouts/MainLayout';

// Lazy loaded - sekundární stránky
const GalleryPage = React.lazy(() => import('./pages/GalleryPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const OrderPage = React.lazy(() => import('./pages/OrderPage'));
const AboutMePage = React.lazy(() => import('./pages/AboutMePage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Lazy loaded - právní stránky (málokdy navštěvované)
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsAndConditionsPage = React.lazy(() => import('./pages/TermsAndConditionsPage'));

// Lazy loaded - admin sekce (velký bundle, pouze pro adminy)
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));

/**
 * Loading komponenta pro Suspense
 */
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-neon-blaze/20 border-t-neon-blaze rounded-full animate-spin"></div>
      <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Načítám...</span>
    </div>
  </div>
);

/**
 * Komponenta pro ochranu administrátorských cest.
 * Přesměruje na /admin pouze pokud se uživatel pokusí vejít přímo do dashboardu bez auth.
 */
const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated || !isAdmin) {
    return <ReactRouterDom.Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};

/**
 * Pomocná komponenta pro zajištění scrollování nahoru při změně stránky.
 */
const ScrollToTop = () => {
  const { pathname, hash } = ReactRouterDom.useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AuthProvider>
        <ReactRouterDom.BrowserRouter basename={import.meta.env.VITE_BASE_URL || ''}>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <ReactRouterDom.Routes>
              {/* HLAVNÍ VEŘEJNÝ WEB - HomePage je indexem pro "/" */}
              <ReactRouterDom.Route path="/" element={<MainLayout />}>
                <ReactRouterDom.Route index element={<HomePage />} />
                <ReactRouterDom.Route path="galerie" element={<GalleryPage />} />
                <ReactRouterDom.Route path="blog" element={<BlogPage />} />
                <ReactRouterDom.Route path="objednat" element={<OrderPage />} />
                <ReactRouterDom.Route path="o-mne" element={<AboutMePage />} />
                <ReactRouterDom.Route path="ochrana-soukromi" element={<PrivacyPolicyPage />} />
                <ReactRouterDom.Route path="obchodni-podminky" element={<TermsAndConditionsPage />} />
              </ReactRouterDom.Route>

              {/* ADMINISTRACE - Pouze na cestě /admin */}
              <ReactRouterDom.Route path="/admin" element={<LoginPage />} />

              {/* CHRÁNĚNÝ DASHBOARD - Pouze po přihlášení */}
              <ReactRouterDom.Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />

              {/* CATCH-ALL PRO 404 */}
              <ReactRouterDom.Route path="*" element={<NotFoundPage />} />
            </ReactRouterDom.Routes>
          </Suspense>
        </ReactRouterDom.BrowserRouter>
      </AuthProvider>
    </DataProvider>
  );
};

export default App;
