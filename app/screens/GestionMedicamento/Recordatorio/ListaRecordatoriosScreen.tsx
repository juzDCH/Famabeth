import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
 
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
 
 
 
 
export default function ListaRecordatoriosScreen() {
  const navigation = useNavigation<any>();
  const [recordatorios, setRecordatorios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
 
  useFocusEffect(
  useCallback(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserId(user.uid);
          await cargarRecordatorios(user.uid);
        }
      });
 
      return unsubscribe;
    }, [])
  );
 
 
  const cargarRecordatorios = async (uid: string) => {
    setCargando(true);
    try {
      const q = query(collection(db, 'recordatorio'), where('id_usuario', '==', uid));
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecordatorios(lista);
    } catch (error) {
      console.error('Error al cargar recordatorios:', error);
    } finally {
      setCargando(false);
    }
  };
 
  const confirmarEliminar = (id: string) => {
    Alert.alert('¿Eliminar?', '¿Deseas eliminar este recordatorio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => eliminarRecordatorio(id),
      },
    ]);
  };
 
  const eliminarRecordatorio = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'recordatorio', id));
      Alert.alert('Eliminado', 'Recordatorio eliminado correctamente');
      if (userId) await cargarRecordatorios(userId);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };
 
    const editarRecordatorio = (item: any) => {
      router.push({
        pathname: '/screens/GestionMedicamento/Recordatorio/EditarRecordatorio',
        params: {
          id: item.id,
          id_medicamento: item.id_medicamento,
          hora_toma: item.hora_toma,
          fecha_inicio: item.fecha_inicio,
          frecuencia_dias: item.frecuencia_dias.toString(),
          activo: item.activo.toString(),
        }
      });
  };

 
 
  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#4B0082" />
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Recordatorios</Text>
 
      <FlatList
        data={recordatorios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.texto}>🧪 Medicamento: {item.id_medicamento}</Text>
            <Text style={styles.texto}>⏰ Hora: {item.hora_toma}</Text>
            <Text style={styles.texto}>📅 Inicio: {item.fecha_inicio}</Text>
            <Text style={styles.texto}>🔁 Cada: {item.frecuencia_dias} h</Text>
            <Text style={styles.texto}>✅ Activo: {item.activo ? 'Sí' : 'No'}</Text>
 
            <View style={styles.botones}>
              <TouchableOpacity style={styles.botonEditar} onPress={() => editarRecordatorio(item)}>
                <Text style={styles.botonTexto}>Editar</Text>
              </TouchableOpacity>
 
              <TouchableOpacity style={styles.botonEliminar} onPress={() => confirmarEliminar(item.id)}>
                <Text style={styles.botonTexto}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#F3F3F3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  texto: {
    fontSize: 14,
    marginBottom: 4,
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botonEditar: {
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  botonEliminar: {
    backgroundColor: '#B00020',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});