import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage from './pages/DashboardPage';

type AuthScreen = 'login' | 'register';

function AppContent() {
  const { session, profile, loading } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#1E1E35] border-t-[#FF4D1C] rounded-full animate-spin" />
          <p className="text-[#6B6B85] text-sm">Carregando plataforma...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    if (authScreen === 'register') {
      return <RegisterPage onSwitchToLogin={() => setAuthScreen('login')} />;
    }
    return <LoginPage onSwitchToRegister={() => setAuthScreen('register')} />;
  }

  if (!profile?.profile_complete) {
    return <ProfileSetupPage />;
  }

  return <DashboardPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
