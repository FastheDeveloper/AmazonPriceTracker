import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '../utils/supabase';
import { AuthSession, Session } from '@supabase/supabase-js';
import { ActivityIndicator, View } from 'react-native';
import { getValueFor } from '../utils/secureStorage';
import { STORAGE_KEYS } from '../core/constants/asyncKeys';
interface AuthContextType {
  session: Session | null;
  user: Session['user'] | null;
  setHasBeenUsed: (value: boolean) => void;
  hasBeenUsed: boolean;
}

// Create the AuthContext with a default value that satisfies the type
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  setHasBeenUsed: () => {},
  hasBeenUsed: false,
});

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [hasBeenUsed, setHasBeenUsed] = useState(false);

  const [isReady, setIsReady] = useState(false);
  const checkBeenUsed = useCallback(async () => {
    console.log('checking');
    try {
      const usedApp = await getValueFor(STORAGE_KEYS.HAS_APP_BEEN_USED);
      setHasBeenUsed(!!usedApp);
    } catch (err) {
    } finally {
      console.log('done');
    }
  }, []);

  useEffect(() => {
    console.log('runnings');
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });
    supabase.auth.onAuthStateChange((_evemt, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    checkBeenUsed();
  }, [checkBeenUsed]);

  if (!isReady) {
    return <ActivityIndicator />;
  }
  return (
    // <AuthContext.Provider value={{ session:null, user:null || null }}>
    <AuthContext.Provider
      value={{ session, user: session?.user || null, hasBeenUsed, setHasBeenUsed }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
