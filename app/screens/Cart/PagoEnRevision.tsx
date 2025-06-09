import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function PagoEnRevision() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/espera.png')} style={styles.image} />
      <Text style={styles.title}>Estamos revisando tu pago</Text>
      <Text style={styles.subtitle}>
        Una vez aprobado, cambiará el estado de tu pedido y nos pondremos en contacto contigo.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/screens/Cart/PedidosLista')}
      >
        <Text style={styles.buttonText}>Ver pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 30,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6a1b9a',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
