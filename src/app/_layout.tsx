import { useEffect, useState } from 'react';
import '../../global.css';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import LottieView from 'lottie-react-native';

import { Stack } from 'expo-router';
import { supabase } from '../utils/supabase';
import AuthContextProvider from '../Context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { FONT_NAMES } from '../core/constants/fontConstants';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};
SplashScreen.preventAutoHideAsync();

const LottieAnimation = ({
  setAnimationPlayed,
}: {
  setAnimationPlayed: (played: boolean) => void;
}) => {
  return (
    <LottieView
      autoPlay
      source={require('src/assets/LottieAnimations/fasplash.json')}
      style={{
        flex: 1,
      }}
      resizeMode="contain"
      loop={false}
      onAnimationFinish={() => setAnimationPlayed(true)}
    />
  );
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [FONT_NAMES.DMSANS_BOLD]: require('src/assets/fonts/DMSans-Bold.ttf'),
    [FONT_NAMES.DMSANS_MEDIUM]: require('src/assets/fonts/DMSans-Medium.ttf'),
    [FONT_NAMES.DMSANS_REGULAR]: require('src/assets/fonts/DMSans-Regular.ttf'),
    [FONT_NAMES.DMSANS_SEMIBOLD]: require('src/assets/fonts/DMSans-SemiBold.ttf'),
    [FONT_NAMES.SPACEG_BOLD]: require('src/assets/fonts/SpaceGrotesk-Bold.ttf'),
    [FONT_NAMES.SPACEG_MEDIUM]: require('src/assets/fonts/SpaceGrotesk-Medium.ttf'),
    [FONT_NAMES.SPACEG_REGULAR]: require('src/assets/fonts/SpaceGrotesk-Regular.ttf'),
    [FONT_NAMES.SPACEG_SEMIBOLD]: require('src/assets/fonts/SpaceGrotesk-SemiBold.ttf'),
  });
  const [animationPlayed, setAnimationPlayed] = useState(false);

  if (!animationPlayed && !!fontsLoaded) {
    SplashScreen.hideAsync();
    return <LottieAnimation setAnimationPlayed={setAnimationPlayed} />;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContextProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(app)/(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(app)/modal"
              options={{ headerShown: false, animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="(app)/search/[id]"
              options={{ title: 'Search Result', headerBackTitleVisible: false }}
            />
          </Stack>
        </AuthContextProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
