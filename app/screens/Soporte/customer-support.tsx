import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const CustomerSupport: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atención al Cliente</Text>
      <Image source={require('../../../assets/customer-support.png')} style={styles.image} />
      <Text style={styles.description}>
        Ahora se encuentra en el soporte de FarmaBeth365. Por favor elija la ayuda que requiera y se le enviará la respectiva guía o ayuda. Gracias.
      </Text>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Asistencia Productos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Asistencia Compra</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Asistencia Guía sobre la App</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Problemas con la App</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.whatsappContainer}>
        <Image source={require('../../../assets/wspLogo.png')} style={styles.whatsappIcon} />
        <Text style={styles.whatsappText}>CONTACTANOS</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomerSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 150,
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4B0082',
    padding: 12,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  whatsappContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  whatsappIcon: {
    width: 50,
    height: 50,
  },
  whatsappText: {
    color: '#4B0082',
    fontSize: 16,
    marginTop: 5,
  },
});
