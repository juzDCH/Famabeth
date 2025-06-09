import { useState, useEffect } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { auth } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { UserProvider, useUser } from '../UserContext'; // Asegúrate que useUser esté bien exportado
 
type TabRoute =
  | '/screens/Home/HomeScreen'
  | '/screens/Cart/Carrito'
  | '/screens/Cart/Categoria'
  | '/screens/Soporte/customer-support'
  | '/screens/Usuario/account';
 
type TabIcon = keyof typeof Ionicons.glyphMap;
 
const allTabs = [
  { name: 'home', icon: 'home-outline' as TabIcon, label: 'Inicio', route: '/screens/Home/HomeScreen' as TabRoute },
  { name: 'carrito', icon: 'cart-outline' as TabIcon, label: 'Carrito', route: '/screens/Cart/Carrito' as TabRoute },
  { name: 'productos', icon: 'medkit-outline' as TabIcon, label: 'Productos', route: '/screens/Cart/Categoria' as TabRoute },
  { name: 'soporte', icon: 'help-circle-outline' as TabIcon, label: 'Soporte', route: '/screens/Soporte/customer-support' as TabRoute },
  { name: 'perfil', icon: 'person-outline' as TabIcon, label: 'Perfil', route: '/screens/Usuario/account' as TabRoute },
];
 
function LayoutWithTabs() {
  const { rol, loading } = useUser(); // Acceder al rol
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
 
    return () => unsubscribe();
  }, []);
 
  if (loading) {
    return <ActivityIndicator size="large" />;
  }
 
  // Filtrar tabs según el rol
  const visibleTabs = rol === 'admin'
    ? allTabs.filter(tab => tab.name === 'home' || tab.name === 'soporte' || tab.name === 'perfil')
    : allTabs;
 
  return (
    <View style={{ flex: 1 }}>
      <Slot />
 
      {isAuthenticated && (
        <View style={styles.tabBar}>
          {visibleTabs.map((tab) => {
            const isActive = pathname === tab.route;
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabItem}
                onPress={() => router.push(tab.route)}
              >
                <Ionicons
                  name={tab.icon}
                  size={24}
                  color={isActive ? '#003366' : 'gray'}
                />
                <Text style={{ color: isActive ? '#003366' : 'gray', fontSize: 12 }}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
 
// Envolver con UserProvider
export default function GlobalLayout() {
  return (
    <UserProvider>
      <LayoutWithTabs />
    </UserProvider>
  );
}
 
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
});