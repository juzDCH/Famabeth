import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

export default function DetallePedido() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pedido, setPedido] = useState<any>(null);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const pedidoSnap = await getDoc(doc(db, 'pedidos', id));
        if (pedidoSnap.exists()) {
          setPedido(pedidoSnap.data());
        }

        const snap = await getDocs(collection(db, 'medicamento'));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar el pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) cargarDatos();
  }, [id]);

  const getProducto = (prodId: string) =>
    productos.find((p) => p.id === prodId);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#6a1b9a" style={{ marginTop: 50 }} />
    );
  }

  if (!pedido) {
    return <Text style={styles.loading}>Pedido no encontrado</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalle del Pedido</Text>

      <Text style={styles.label}>Cliente:</Text>
      <Text>{pedido.cliente_nombre} ({pedido.cliente_telefono})</Text>

      <Text style={styles.label}>Tipo de entrega:</Text>
      <Text>{pedido.tipo_entrega === 'domicilio' ? 'Entrega a domicilio' : 'Recoger en sucursal'}</Text>

      {pedido.tipo_entrega === 'domicilio' && (
        <>
          <Text style={styles.label}>Dirección:</Text>
          <Text>{pedido.direccion_entrega}</Text>

          <Text style={styles.label}>Referencia:</Text>
          <Text>{pedido.referencia_ubicacion || 'Sin referencia especificada'}</Text>
        </>
      )}

      <Text style={styles.label}>Tipo de pago:</Text>
      <Text>{pedido.tipo_pago}</Text>

      <Text style={styles.label}>Estado:</Text>
      <Text>{pedido.estado}</Text>

      <Text style={styles.label}>Productos:</Text>
      {pedido.carrito?.map((item: any, index: number) => {
        const prod = getProducto(item.id);
        if (!prod) return null;
        const subtotal = (prod.precio * item.cantidad).toFixed(2);

        return (
          <View key={index} style={styles.item}>
            <Image source={{ uri: prod.imagen_url }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{prod.nombre}</Text>
              <Text>Cantidad: {item.cantidad}</Text>
              <Text>Subtotal: {subtotal} Bs</Text>
            </View>
          </View>
        );
      })}

      <Text style={styles.total}>Total: {pedido.total?.toFixed(2)} Bs</Text>
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
  label: {
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 2,
  },
  item: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    padding: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  info: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  name: {
    fontWeight: '600',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a148c',
    marginTop: 20,
    textAlign: 'center',
  },
  loading: {
    marginTop: 60,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
});
