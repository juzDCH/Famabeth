import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido a FarmaBeth365</Text>

      <Image
        source={require('../../../assets/customer-support.png')}
        style={styles.image}
      />

      <Text style={styles.subtitle}>¿Qué necesitas hoy?</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(Tabs)/medicamentos')}>
        <Text style={styles.buttonText}>Ver Medicamentos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(Tabs)/carrito')}>
        <Text style={styles.buttonText}>Ir al Carrito</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(Tabs)/soporte')}>
        <Text style={styles.buttonText}>Atención al Cliente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(Tabs)/perfil')}>
        <Text style={styles.buttonText}>Mi perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#fff',
      alignItems: 'center',
      flexGrow: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 20,
    },
    image: {
      width: 200,
      height: 150,
      resizeMode: 'contain',
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#4B0082',
      padding: 14,
      borderRadius: 8,
      width: '90%',
      alignItems: 'center',
      marginBottom: 15,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });
  