import { useEffect, useState } from 'react';
import '../../global.css';

import { Stack } from 'expo-router';
import { supabase } from '../utils/supabase';
import AuthContextProvider from '../Context/AuthContext';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Stack>
        <Stack.Screen name="(app)/(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(app)/modal"
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
        />
      </Stack>
    </AuthContextProvider>
  );
}
