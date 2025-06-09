import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../../UserContext';
 
const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { rol, loading } = useUser();
 
  if (loading) {
    return <ActivityIndicator />;
  }
 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: '#003366' }]}>Bienvenido a FarmaBeth365</Text>
 
      <Image source={require('../../../assets/customer-support.png')} style={styles.image} />
 
      <Text style={styles.subtitle}>¿Qué necesitas hoy?</Text>
 
      {rol === 'admin' && (
        <>
          <TouchableOpacity style={styles.button} onPress={() => router.replace('../GestionMedicamento/RegistroMedicamento')}>
            <Text style={styles.buttonText}>Gestionar Medicamentos</Text>
          </TouchableOpacity>
 
          <TouchableOpacity style={styles.button} onPress={() => router.replace('../Admin/AdminComprobantes')}>
            <Text style={styles.buttonText}>Comprobantes Admin</Text>
          </TouchableOpacity>
        </>
      )}
 
      {rol !== 'admin' && (
        <>
          <TouchableOpacity style={styles.button} onPress={() => router.replace('../Cart/Categoria')}>
            <Text style={styles.buttonText}>Ver Productos</Text>
          </TouchableOpacity>
 
          <TouchableOpacity style={styles.button} onPress={() => router.replace('../Soporte/customer-support')}>
            <Text style={styles.buttonText}>Atención al Cliente</Text>
          </TouchableOpacity>
 
          <TouchableOpacity style={styles.button} onPress={() => router.replace('../Usuario/account')}>
            <Text style={styles.buttonText}>Mi Cuenta</Text>
          </TouchableOpacity>
        </>
      )}
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
    backgroundColor: '#003366',
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