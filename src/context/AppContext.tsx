import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, VehicleParams, Shift, ScaleFund, UserPlatform } from '../lib/types';
import { useAuth } from './AuthContext';

interface AppContextValue {
  profile: Profile | null;
  vehicleParams: VehicleParams | null;
  shifts: Shift[];
  scaleFund: ScaleFund | null;
  platforms: UserPlatform[];
  loadingData: boolean;
  refreshData: () => Promise<void>;
  setProfile: (p: Profile) => void;
  setVehicleParams: (v: VehicleParams) => void;
  setScaleFund: (f: ScaleFund) => void;
  setShifts: (s: Shift[]) => void;
  setPlatforms: (p: UserPlatform[]) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [vehicleParams, setVehicleParams] = useState<VehicleParams | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [scaleFund, setScaleFund] = useState<ScaleFund | null>(null);
  const [platforms, setPlatforms] = useState<UserPlatform[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [profileRes, paramsRes, shiftsRes, fundRes, platformsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('vehicle_params').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('shifts').select('*').eq('user_id', user.id).order('shift_date', { ascending: false }).limit(90),
        supabase.from('scale_fund').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_platforms').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (paramsRes.data) setVehicleParams(paramsRes.data);
      if (shiftsRes.data) setShifts(shiftsRes.data);
      if (fundRes.data) setScaleFund(fundRes.data);
      if (platformsRes.data) setPlatforms(platformsRes.data);
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchData();
    else {
      setProfile(null);
      setVehicleParams(null);
      setShifts([]);
      setScaleFund(null);
      setPlatforms([]);
    }
  }, [user, fetchData]);

  return (
    <AppContext.Provider value={{
      profile,
      vehicleParams,
      shifts,
      scaleFund,
      platforms,
      loadingData,
      refreshData: fetchData,
      setProfile,
      setVehicleParams,
      setScaleFund,
      setShifts,
      setPlatforms,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

