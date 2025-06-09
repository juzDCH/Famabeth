import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, collection, getDocs } from '../../../firebaseConfig';
import { useRouter } from 'expo-router';

export default function RecogerSucursal() {
  const [productos, setProductos] = useState<any[]>([]);
  const [carrito, setCarrito] = useState<{ id: string; cantidad: number }[]>([]);
  const router = useRouter();

  const sucursalUrl =
    'https://maps.app.goo.gl/YXtK3FHRkGU8w6y96?g_st=com.google.maps.preview.copy';

  useEffect(() => {
    const cargarDatos = async () => {
      const datos = await AsyncStorage.getItem('carrito');
      if (datos) setCarrito(JSON.parse(datos));
    };

    const fetchProductos = async () => {
      const snap = await getDocs(collection(db, 'medicamento'));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductos(data);
    };

    cargarDatos();
    fetchProductos();
  }, []);

  const total = carrito.reduce((sum, item) => {
    const producto = productos.find((p) => p.id === item.id);
    if (!producto) return sum;
    return sum + producto.precio * item.cantidad;
  }, 0);

  const manejarPago = async () => {
    try {
      await AsyncStorage.setItem('tipo_entrega', 'sucursal');
      await AsyncStorage.removeItem('direccion_entrega');
      await AsyncStorage.removeItem('referencia');
      await AsyncStorage.removeItem('coordenadas');
      router.push('/screens/Cart/pay');
    } catch (error) {
      Alert.alert('Error', 'No se pudo continuar con el pago.');
      console.error('Error guardando datos en AsyncStorage:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dirección de Sucursal</Text>
      <TouchableOpacity onPress={() => Linking.openURL(sucursalUrl)}>
        <Text>Av. América #435, C.Pantaleon Dalence y</Text>
        <Text style={styles.link}>Ver en Google Maps</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Productos Seleccionados</Text>
      {carrito.map((item) => {
        const producto = productos.find((p) => p.id === item.id);
        if (!producto) return null;

        return (
          <View key={item.id} style={styles.item}>
            <Image source={{ uri: producto.imagen_url }} style={styles.image} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.nombre}>{producto.nombre}</Text>
              <Text style={styles.detalle}>Cantidad: {item.cantidad}</Text>
              <Text style={styles.detalle}>
                Subtotal: {(producto.precio * item.cantidad).toFixed(2)} Bs
              </Text>
            </View>
          </View>
        );
      })}

      <Text style={styles.total}>Total a pagar: {total.toFixed(2)} Bs</Text>

      <TouchableOpacity style={styles.boton} onPress={manejarPago}>
        <Text style={styles.botonTexto}>Pagar con QR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 8,
  },
  link: {
    color: '#1e88e5',
    textDecorationLine: 'underline',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
  },
  detalle: {
    fontSize: 14,
    color: '#555',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a1b9a',
    marginTop: 20,
    textAlign: 'center',
  },
  boton: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  botonTexto: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
