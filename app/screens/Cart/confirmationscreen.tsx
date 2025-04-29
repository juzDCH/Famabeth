import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ConfirmationScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con menú */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
          <Text style={styles.iconText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Online Pharmacy</Text>
        <TouchableOpacity style={styles.settingsIcon}>
          <Text style={styles.iconText}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Menú lateral */}
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

      <View style={styles.content}>
        <View style={styles.checkmarkContainer}>
          <Text style={styles.checkmark}>✔</Text>
        </View>
        <Text style={styles.message}>¡Se ha realizado la compra con éxito!</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Volver atrás</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  menuIcon: {
    padding: 10,
  },
  settingsIcon: {
    padding: 10,
  },
  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  checkmarkContainer: {
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  menu: {
    backgroundColor: '#f3e5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 4,
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 6,
    fontSize: 16,
  },
});

export default ConfirmationScreen;
