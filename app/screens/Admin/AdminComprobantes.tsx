import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';

export default function AdminComprobantes() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'pedidos'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPedidos(data);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (pedidoId: string, nuevoEstado: string) => {
    try {
      await updateDoc(doc(db, 'pedidos', pedidoId), {
        estado: nuevoEstado,
      });

      // Actualizar el estado local para que la UI se actualice sin necesidad de refrescar toda la lista
      setPedidos(prev =>
        prev.map(pedido =>
          pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
        )
      );

      Alert.alert('Éxito', `El estado del pedido se actualizó a "${nuevoEstado}".`);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del pedido.');
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.cliente}>
        Cliente: {item.cliente_nombre} ({item.cliente_telefono})
      </Text>
      <Text style={styles.total}>Total: Bs {item.total?.toFixed(2)}</Text>
      <Text>Tipo de pago: <Text style={styles.bold}>{item.tipo_pago}</Text></Text>
      <Text>Tipo de entrega: {item.tipo_entrega === 'domicilio' ? 'A domicilio' : 'En sucursal'}</Text>

      <Text style={{ marginTop: 6, marginBottom: 4 }}>Estado actual:</Text>
      <Picker
        selectedValue={item.estado}
        style={styles.picker}
        onValueChange={(value) => actualizarEstado(item.id, value)}
      >
        <Picker.Item label="En revisión" value="En revisión" />
        <Picker.Item label="Aceptado" value="Aceptado" />
        <Picker.Item label="Rechazado" value="Rechazado" />
        <Picker.Item label="Entregado" value="Entregado" />
      </Picker>

      <Text style={styles.fecha}>
        Fecha: {item.creado_en?.toDate ? moment(item.creado_en.toDate()).format('DD/MM/YYYY HH:mm') : 'Desconocida'}
      </Text>

      {item.tipo_entrega === 'domicilio' && (
        <>
          <Text>Dirección: {item.direccion_entrega}</Text>
          <Text>Referencia: {item.referencia_ubicacion || 'Sin referencia'}</Text>
        </>
      )}

      {item.tipo_pago === 'Qr' && item.imagen_url && (
        <Image source={{ uri: item.imagen_url }} style={styles.imagen} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pedidos Recibidos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6a1b9a" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  cliente: {
    fontWeight: '600',
    marginBottom: 6,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bold: {
    fontWeight: '600',
  },
  fecha: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  imagen: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
    resizeMode: 'cover',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
});
