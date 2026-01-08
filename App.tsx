
import React, { useEffect } from 'react';
import * as ReactRouterDom from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataProvider';

import { HomePage } from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import OrderPage from './pages/OrderPage';
import AboutMePage from './pages/AboutMePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import MainLayout from './components/layouts/MainLayout';

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
  const { pathname } = ReactRouterDom.useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AuthProvider>
        <ReactRouterDom.BrowserRouter basename="/msfitnesstrener_web">
          <ScrollToTop />
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
        </ReactRouterDom.BrowserRouter>
      </AuthProvider>
    </DataProvider>
  );
};

export default App;
