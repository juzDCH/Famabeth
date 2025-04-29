import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { View, Image, StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();
  const [isSplashReady, setIsSplashReady] = useState(false);

  useEffect(() => {
    const loadApp = async () => {
      if (loaded) {
        setIsSplashReady(true);  // Marca que la splash está lista
        await SplashScreen.hideAsync();  // Esconde la splash screen
        router.replace('/');
      }
    };
    loadApp();
  }, [loaded, router]);

  // Mientras no se haya completado la carga, mostramos la splash screen
  if (!isSplashReady) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('../assets/splash.png')}  // Asegúrate de que el nombre y la ruta sean correctos
          style={styles.splashImage}
        />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="account" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',  
  },
  splashImage: {
    width: '80%',  
    height: '80%',
    resizeMode: 'contain',
  },
});
