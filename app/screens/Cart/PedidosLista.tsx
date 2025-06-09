import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';

type Pedido = {
  id: string;
  total: number;
  tipo_pago: 'efectivo' | 'QR';
  estado: string;
  creado_en?: Timestamp;
};

export default function PedidosLista() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await cargarPedidos(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  const cargarPedidos = async (uid: string) => {
    setLoading(true);
    try {
      const q = query(collection(db, 'pedidos'), where('cliente_id', '==', uid));
      const snap = await getDocs(q);
      const data: Pedido[] = snap.docs
        .map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Pedido, 'id'>),
        }))
        .sort((a, b) => {
          const fechaA = a.creado_en?.toDate?.() ?? new Date(0);
          const fechaB = b.creado_en?.toDate?.() ?? new Date(0);
          return fechaB.getTime() - fechaA.getTime(); // Más recientes primero
        });

      setPedidos(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Pedido }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/screens/Cart/DetallePedido',
          params: { id: item.id },
        })
      }
    >
      <Text style={styles.titulo}>Pedido #{item.id.slice(0, 6)}</Text>
      <Text>Total: {item.total?.toFixed(2)} Bs</Text>
      <Text>Pago: {item.tipo_pago === 'efectivo' ? 'Efectivo' : 'QR'}</Text>
      <Text>
        Estado: <Text style={styles.estado}>{item.estado || 'En revisión'}</Text>
      </Text>
      <Text>
        Fecha:{' '}
        {item.creado_en?.toDate?.().toLocaleString() || 'Desconocida'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Pedidos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6a1b9a" />
      ) : pedidos.length === 0 ? (
        <Text style={styles.noPedidos}>No tienes pedidos registrados.</Text>
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
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  estado: {
    fontWeight: 'bold',
    color: '#6a1b9a',
  },
  noPedidos: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
    marginTop: 50,
  },
});
