import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { store, storeEvents } from './lib/store';

// Components
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AutomationsPage } from './pages/AutomationsPage';
import { FlowBuilderPage } from './pages/FlowBuilderPage';
import { ContactsPage } from './pages/ContactsPage';
import { SequencesPage } from './pages/SequencesPage';
import { GrowthToolsPage } from './pages/GrowthToolsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PricingPage } from './pages/PricingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminPlansPage } from './pages/AdminPlansPage';
import { AdminCouponsPage } from './pages/AdminCouponsPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AdminWebhookLogsPage } from './pages/AdminWebhookLogsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import DataDeletionPage from './pages/DataDeletionPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Handle OAuth callback - runs once on mount
  useEffect(() => {
    const processOAuthCallback = async () => {
      const hash = window.location.hash;
      
      // Check if URL contains OAuth tokens
      if (hash && hash.includes('access_token')) {
        console.log('🔐 OAuth callback detected, processing...');
        
        try {
          // Parse hash fragment
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token') || '';
          
          if (accessToken) {
            console.log('🔑 Setting Supabase session...');
            
            // Set session in Supabase
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (error) {
              console.error('❌ Session error:', error.message);
            } else if (data.user) {
              console.log('✅ Logged in as:', data.user.email);
              
              // Use demoLogin to set user in store (it handles user creation)
              await store.demoLogin(
                data.user.email || '',
                data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'User'
              );
              
              setIsLoggedIn(true);
            }
          }
        } catch (err) {
          console.error('❌ OAuth error:', err);
        } finally {
          // Clean URL - remove hash
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else {
        // Check existing session
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            console.log('✅ Existing session found:', session.user.email);
            await store.demoLogin(
              session.user.email || '',
              session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User'
            );
            setIsLoggedIn(true);
          }
        } catch (err) {
          console.error('Session check error:', err);
        }
      }
      
      setLoading(false);
    };

    processOAuthCallback();
  }, []);

  // Subscribe to store events
  useEffect(() => {
    const unsubscribe = storeEvents.on('auth', () => {
      setIsLoggedIn(store.isLoggedIn());
      setIsAdmin(store.isAdmin());
      setLoading(store.isLoading());
    });

    const unsubAdmin = storeEvents.on('admin', () => {
      setIsAdmin(store.isAdmin());
    });

    // Initial state
    setIsLoggedIn(store.isLoggedIn());
    setIsAdmin(store.isAdmin());

    return () => {
      unsubscribe();
      unsubAdmin();
    };
  }, []);

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading igone...</p>
        </div>
      </div>
    );
  }

  // Legal pages - accessible without login
  if (currentPage === 'privacy') {
    return <PrivacyPage onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'terms') {
    return <TermsPage onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'data-deletion') {
    return <DataDeletionPage onNavigate={setCurrentPage} />;
  }

  // Show landing page if not logged in
  if (!isLoggedIn) {
    return <LandingPage onNavigate={setCurrentPage} />;
  }

  const renderPage = () => {
    // Admin pages
    if (isAdmin) {
      switch (currentPage) {
        case 'admin-dashboard':
          return <AdminDashboard onNavigate={setCurrentPage} />;
        case 'admin-users':
          return <AdminUsersPage onNavigate={setCurrentPage} />;
        case 'admin-plans':
          return <AdminPlansPage />;
        case 'admin-coupons':
          return <AdminCouponsPage />;
        case 'admin-webhooks':
          return <AdminWebhookLogsPage />;
        case 'admin-settings':
          return <AdminSettingsPage />;
        case 'admin-analytics':
          return <AdminAnalyticsPage />;
      }
    }

    // User pages
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'automations':
        return <AutomationsPage />;
      case 'flow-builder':
        return <FlowBuilderPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'sequences':
        return <SequencesPage />;
      case 'growth-tools':
        return <GrowthToolsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'pricing':
        return <PricingPage />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isAdmin={isAdmin}
      />
      
      <div className="lg:pl-64">
        <TopBar
          currentPage={currentPage}
          onMenuClick={() => setSidebarOpen(true)}
          isAdmin={isAdmin}
        />
        
        <main className="p-4 lg:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
