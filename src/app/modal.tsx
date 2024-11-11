import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { ScreenContent } from '~/src/components/ScreenContent';
import { Container } from '../components/Container';
// import { Container } from '@components/Container';

export default function Modal() {
  return (
    <>
      <ScreenContent path="app/modal.tsx" title="Modal" />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  );
}
