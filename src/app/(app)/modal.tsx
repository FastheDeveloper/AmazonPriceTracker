import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View } from 'react-native';
import { ScreenContent } from '~/src/components/ScreenContent';
import { Container } from '../../components/Container';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../Context/AuthContext';
import { Link, Redirect } from 'expo-router';
// import { Container } from '@components/Container';

export default function Modal() {
  // const { user } = useAuth();
  // if (!user) {
  //   return <Redirect href="/(auth)/Login" />;
  // }
  return (
    <View className="h-full w-full flex-1 items-center justify-center">
      <Text onPress={() => supabase.auth.signOut()}>Sign out</Text>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
