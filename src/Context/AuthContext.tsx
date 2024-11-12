import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { AuthSession, Session } from '@supabase/supabase-js';
import { View } from 'react-native';
interface AuthContextType {
  session: Session | null;
  user: Session['user'] | null;
}

// Create the AuthContext with a default value that satisfies the type
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
});

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });
    supabase.auth.onAuthStateChange((_evemt, session) => {
      setSession(session);
    });
  }, []);

  if (!isReady) {
    return <View className="flex-1 bg-red-700" />;
  }
  return (
    // <AuthContext.Provider value={{ session:null, user:null || null }}>
    <AuthContext.Provider value={{ session, user: session?.user || null }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
