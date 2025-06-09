import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../../firebaseConfig';
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp } from 'firebase/firestore';

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  imagen_url: string;
  [key: string]: any;
};

export default function PedidoConfirmado() {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const guardarPedido = async () => {
      try {
        const [carritoStr, tipoEntrega, direccionEntrega, referencia] = await Promise.all([
          AsyncStorage.getItem('carrito'),
          AsyncStorage.getItem('tipo_entrega'),
          AsyncStorage.getItem('direccion_entrega'),
          AsyncStorage.getItem('referencia'),
        ]);

        if (!carritoStr) return;

        const carrito = JSON.parse(carritoStr);

        const productosSnap = await getDocs(collection(db, 'medicamento'));
        const productos: Producto[] = productosSnap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            nombre: data.nombre || '',
            precio: data.precio || 0,
            imagen_url: data.imagen_url || '',
            ...data,
          };
        });

        const total = carrito.reduce((sum: number, item: any) => {
          const producto = productos.find(p => p.id === item.id);
          return producto ? sum + producto.precio * item.cantidad : sum;
        }, 0);

        const user = auth.currentUser;
        if (!user) return;

        const userDoc = await getDoc(doc(db, 'usuario', user.uid));
        if (!userDoc.exists()) return;

        const data = userDoc.data();

        await addDoc(collection(db, 'pedidos'), {
          carrito,
          total,
          creado_en: serverTimestamp(),
          estado: 'En revisión',
          tipo_pago: 'efectivo',
          tipo_entrega: tipoEntrega,
          direccion_entrega: tipoEntrega === 'domicilio' ? direccionEntrega : null,
          referencia_ubicacion: tipoEntrega === 'domicilio' ? referencia : null,
          cliente_id: user.uid,
          cliente_nombre: `${data.nombres} ${data.primer_apellido}`,
          cliente_telefono: data.telefono,
        });

        await AsyncStorage.multiRemove([
          'carrito',
          'tipo_entrega',
          'direccion_entrega',
          'referencia',
        ]);
      } catch (error) {
        console.error('Error al guardar pedido en efectivo:', error);
        Alert.alert('Error', 'No se pudo registrar el pedido.');
      } finally {
        setCargando(false);
      }
    };

    guardarPedido();
  }, []);

  const handleRegresar = () => {
    router.push('/screens/Cart/PedidosLista');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Pedido Confirmado!</Text>
      <Text style={styles.subtitle}>Tu pedido ha sido registrado con éxito.</Text>
      <Text style={styles.text}>Te contactaremos pronto para confirmar los detalles.</Text>

      <TouchableOpacity style={styles.button} onPress={handleRegresar} disabled={cargando}>
  <Text style={styles.buttonText}>
    {cargando ? 'Guardando pedido...' : 'Ver mis pedidos'}
  </Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4B0082',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
