import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const MedicationManagement: React.FC = () => {
  const router = useRouter();

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Encabezado con botón de menú */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Gestión de Medicamentos</Text>
      </View>

      {/* Menú desplegable */}
      {menuVisible && (
        <View style={styles.menu}>
          <Text style={styles.menuItem}>Inicio</Text>
          <Text style={styles.menuItem}>Medicamentos</Text>
          <Text style={styles.menuItem}>Carrito</Text>
          <Text style={styles.menuItem}>Contacto</Text>
          <Text style={styles.menuItem}>Atención al Cliente</Text>
          <Text style={styles.menuItem}>Historial de Compras</Text>
        </View>
      )}

      {/* Formulario de medicamentos */}
      <Text style={styles.subtitle}>Registro Medicamento</Text>

      <Text style={styles.label}>Nombre Medicamento</Text>
      <TextInput style={styles.input} placeholder="Ingrese el nombre" />

      <Text style={styles.label}>Dosis</Text>
      <TextInput style={styles.input} placeholder="Ingrese la dosis" keyboardType="numeric" />

      <Text style={styles.label}>Frecuencia</Text>
      <TextInput style={styles.input} placeholder="Ejemplo: Cada 8 horas" />

      <Text style={styles.label}>Hora Recomendada</Text>
      <TextInput style={styles.input} placeholder="Ejemplo: 08:00 AM" />

      <Text style={styles.label}>Hora Inicio</Text>
      <TextInput style={styles.input} placeholder="Ejemplo: 09:30 AM" />


      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/screens/GestionMedicamento/RegistroMedicamento')}
      >
        <Text style={styles.buttonText}>Registrar Medicamento</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/screens/Cart/Categoria')}
      >
        <Text style={styles.buttonText}>Categoria</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MedicationManagement;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menu: {
    backgroundColor: '#f3eafa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 4,
  },
  menuItem: {
    fontSize: 16,
    marginVertical: 6,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4B0082',
    padding: 12,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
