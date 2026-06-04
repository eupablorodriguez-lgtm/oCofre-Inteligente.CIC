import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useApp } from './contexts/AppContext';
import { Sidebar, BottomNav } from './components/layout/Navigation';
import type { Page } from './components/layout/Navigation';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ShiftPanelPage from './pages/ShiftPanelPage';
import PauseCapacityPage from './pages/PauseCapacityPage';
import ScaleFundPage from './pages/ScaleFundPage';
import ThermometerPage from './pages/ThermometerPage';
import ImpactCalculatorPage from './pages/ImpactCalculatorPage';
import AssistantPage from './pages/AssistantPage';
import PlatformsPage from './pages/PlatformsPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loadingData } = useApp();
  const [page, setPage] = useState<Page>('dashboard');

  if (authLoading || (user && loadingData && !profile)) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00b4d8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#8888a0] text-sm">Carregando cabine...</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthPage onAuth={() => {}} />;
  if (user && !profile?.onboarding_complete) return <OnboardingPage onComplete={() => {}} />;

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage />;
      case 'turno': return <ShiftPanelPage />;
      case 'pausa': return <PauseCapacityPage />;
      case 'fundo': return <ScaleFundPage />;
      case 'termometro': return <ThermometerPage />;
      case 'calculadora': return <ImpactCalculatorPage />;
      case 'assistente': return <AssistantPage />;
      case 'plataformas': return <PlatformsPage />;
      case 'configuracoes': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  const isAssistant = page === 'assistente';

  return (
    <div className={`min-h-screen bg-[#0a0a0f] flex ${isAssistant ? 'flex-col' : ''}`}>
      {!isAssistant && <Sidebar current={page} onNavigate={setPage} />}
      <main className={`flex-1 overflow-y-auto ${!isAssistant ? 'pb-20 lg:pb-0' : ''}`}>
        {!isAssistant && (
          <div className="max-w-3xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
            {renderPage()}
          </div>
        )}
        {isAssistant && renderPage()}
      </main>
      <BottomNav current={page} onNavigate={setPage} />
    </div>
  );
}

export default AppContent;
