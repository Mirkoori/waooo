import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black,
} from '@expo-google-fonts/montserrat';
import { colors } from '../src/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({ Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black });
  useEffect(() => { if (loaded) SplashScreen.hideAsync(); }, [loaded]);
  if (!loaded) return null;
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }} />
    </SafeAreaProvider>
  );
}
