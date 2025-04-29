import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

        switch (route.name) {
          case 'home':
            iconName = 'home-outline';
            break;
          case 'carrito':
            iconName = 'cart-outline';
            break;
          case 'medicamentos':
            iconName = 'medkit-outline';
            break;
          case 'soporte':
            iconName = 'help-circle-outline';
            break;
          case 'perfil':
            iconName = 'person-outline';
            break;
        }

        return {
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
          tabBarActiveTintColor: '#4B0082',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        };
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="carrito" options={{ title: 'Carrito' }} />
      <Tabs.Screen name="medicamentos" options={{ title: 'Medicamentos' }} />
      <Tabs.Screen name="soporte" options={{ title: 'Soporte' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
