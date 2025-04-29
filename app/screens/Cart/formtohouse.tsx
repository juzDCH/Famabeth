import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SideMenuScreen() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con botón de menú */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Dirección de Entrega</Text>
      </View>

      {/* Menú lateral */}
      {menuOpen && (
        <View style={styles.menu}>
          <Text style={styles.menuItem}>Inicio</Text>
          <Text style={styles.menuItem}>Medicamentos</Text>
          <Text style={styles.menuItem}>Carrito</Text>
          <Text style={styles.menuItem}>Contacto</Text>
          <Text style={styles.menuItem}>Atención al Cliente</Text>
          <Text style={styles.menuItem}>Historial de Compras</Text>
        </View>
      )}

      {/* Formulario de Dirección */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Calle:</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Ciudad:</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Código postal:</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Referencias:</Text>
        <TextInput style={styles.input} />

        <Text style={styles.label}>Número/Teléfono:</Text>
        <TextInput style={styles.input} />

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 10,
  },
  menu: {
    backgroundColor: '#f3eafa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  menuItem: {
    fontSize: 16,
    marginVertical: 8,
  },
  formContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f3eafa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#4B0082',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },

  settingsIcon: {
    padding: 10,
  },
  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
