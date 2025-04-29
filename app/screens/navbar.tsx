import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Importación de tus pantallas
import HomeScreen from './Home/HomeScreen';
import Carrito from './Cart/Carrito';
import CustomerSupport from './Soporte/customer-support';
import MedicationManagement from './GestionMedicamento/MedicationManagement';
import AccountScreen from './Usuario/account';

const Tab = createBottomTabNavigator();

export default function Navbar() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Carrito"
        screenOptions={({ route }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          switch (route.name) {
            case 'Inicio':
              iconName = 'home-outline';
              break;
            case 'Carrito':
              iconName = 'car-outline';
              break;
            case 'Soporte':
              iconName = 'help-circle-outline';
              break;
            case 'Medicamentos':
              iconName = 'medkit-outline';
              break;
            case 'Perfil':
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
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Carrito" component={Carrito} />
        <Tab.Screen name="Soporte" component={CustomerSupport} />
        <Tab.Screen name="Medicamentos" component={MedicationManagement} />
        <Tab.Screen name="Perfil" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
