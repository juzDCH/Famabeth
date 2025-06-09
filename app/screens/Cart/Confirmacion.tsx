import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useRouter } from 'expo-router';

export default function Confirmacion() {
  const [productos, setProductos] = useState<any[]>([]);
  const [carrito, setCarrito] = useState<{ id: string; cantidad: number }[]>([]);
  const [referencia, setReferencia] = useState('');
  const [direccion, setDireccion] = useState('');
  const router = useRouter();

  useEffect(() => {
    const cargarDatos = async () => {
      const datos = await AsyncStorage.getItem('carrito');
      if (datos) setCarrito(JSON.parse(datos));

      const ref = await AsyncStorage.getItem('referencia');
      if (ref) setReferencia(ref);

      const dir = await AsyncStorage.getItem('direccion');
      if (dir) setDireccion(dir);
    };

    const fetchProductos = async () => {
      const snap = await getDocs(collection(db, 'medicamento'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductos(data);
    };

    cargarDatos();
    fetchProductos();
  }, []);

  const total = carrito.reduce((sum, item) => {
    const producto = productos.find(p => p.id === item.id);
    if (!producto) return sum;
    return sum + producto.precio * item.cantidad;
  }, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Confirmación de Pedido</Text>

      <Text style={styles.section}>Dirección de Entrega</Text>
      <Text style={styles.label}>Calle:</Text>
      <Text style={styles.referencia}>{direccion || 'No detectada'}</Text>

      <Text style={styles.label}>Referencia:</Text>
      <Text style={styles.referencia}>{referencia || 'No especificada'}</Text>

      <Text style={styles.section}>Productos Seleccionados</Text>
      {carrito.map(item => {
        const producto = productos.find(p => p.id === item.id);
        if (!producto) return null;

        return (
          <View key={item.id} style={styles.item}>
            <Image source={{ uri: producto.imagen_url }} style={styles.image} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.nombre}>{producto.nombre}</Text>
              <Text style={styles.detalle}>Cantidad: {item.cantidad}</Text>
              <Text style={styles.detalle}>Subtotal: {(producto.precio * item.cantidad).toFixed(2)} Bs</Text>
            </View>
          </View>
        );
      })}

      <Text style={styles.total}>Total a pagar: {total.toFixed(2)} Bs</Text>

      <TouchableOpacity style={styles.boton} onPress={() => router.push('/screens/Cart/pay')}>
        <Text style={styles.botonTexto}>Pagar por QR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.boton, { backgroundColor: '#777' }]} onPress={() => router.push('/screens/Cart/PedidoConfirmado')}>
        <Text style={styles.botonTexto}>Pagar en Efectivo</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4a148c',
    textAlign: 'center',
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 4,
    color: '#555',
  },
  referencia: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
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
    backgroundColor: '#4a148c',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
