import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Alert,
  Modal, ActivityIndicator, Image
} from 'react-native';
import {
  collection, getDocs, deleteDoc, doc
} from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

interface Medicamento {
  id: string;
  nombre: string;
  descripcion: string;
  dosis: string;
  precio: number;
  id_categoria: string;
  receta?: boolean;
  imagen_url?: string;
  fecha_vencimiento?: any;
  stock?: number;
}

interface Categoria {
  id: string;
  nombre: string;
}

export default function ListaMedicamentosScreen() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      obtenerMedicamentos();
      obtenerCategorias();
    }, [])
  );

  const obtenerMedicamentos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'medicamento'));
      const meds: Medicamento[] = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data() as Omit<Medicamento, 'id'>;
        meds.push({ id: docSnapshot.id, ...data });
      });
      setMedicamentos(meds);
    } catch (error) {
      console.error('Error al obtener medicamentos:', error);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categoria'));
      const cats: Categoria[] = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data() as Omit<Categoria, 'id'>;
        cats.push({ id: docSnapshot.id, ...data });
      });
      setCategorias(cats);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const eliminarMedicamento = async (id: string) => {
    try {
      setModalVisible(true);
      await deleteDoc(doc(db, 'medicamento', id));
      await obtenerMedicamentos();
      setTimeout(() => setModalVisible(false), 1500);
    } catch (error) {
      console.error('Error al eliminar medicamento:', error);
      setModalVisible(false);
      Alert.alert('Error', 'No se pudo eliminar el medicamento');
    }
  };

  const confirmarEliminar = (id: string) => {
    Alert.alert(
      '¿Eliminar medicamento?',
      'Esta acción no se puede deshacer',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminarMedicamento(id) }
      ]
    );
  };

  const irAEditar = (medicamento: Medicamento) => {
    router.push({
      pathname: '/screens/GestionMedicamento/EditarMedicamento',
      params: {
        id: medicamento.id,
        nombre: medicamento.nombre,
        descripcion: medicamento.descripcion,
        dosis: medicamento.dosis,
        precio: medicamento.precio.toString(),
        id_categoria: medicamento.id_categoria,
        receta: medicamento.receta ? 'true' : 'false',
        imagen_url: medicamento.imagen_url || '',
        stock: medicamento.stock?.toString() || '',
        fecha_vencimiento: medicamento.fecha_vencimiento?.toDate
          ? medicamento.fecha_vencimiento.toDate().toISOString()
          : '',
      },
    });
  };

  const obtenerNombreCategoria = (id: string) => {
    const categoria = categorias.find(cat => cat.id === id);
    return categoria ? categoria.nombre : `ID: ${id}`;
  };

  const renderItem = ({ item }: { item: Medicamento }) => {
    const fecha = item.fecha_vencimiento?.toDate
      ? item.fecha_vencimiento.toDate().toLocaleDateString()
      : 'No definida';

    return (
      <TouchableOpacity style={styles.card} onPress={() => irAEditar(item)}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
        <Text style={styles.detalle}>💊 Dosis: {item.dosis}</Text>
        <Text style={styles.detalle}>💰 Precio: Bs {item.precio}</Text>
        <Text style={styles.detalle}>📂 Categoría: {obtenerNombreCategoria(item.id_categoria)}</Text>
        <Text style={styles.detalle}>📄 Requiere receta: {item.receta ? 'Sí' : 'No'}</Text>
        <Text style={styles.detalle}>📅 Vencimiento: {fecha}</Text>
        <Text style={styles.detalle}>📦 Stock: {item.stock ?? 'No definido'}</Text>

        {item.imagen_url && (
          <Image
            source={{ uri: item.imagen_url }}
            style={{ height: 150, width: '100%', borderRadius: 8, marginVertical: 10 }}
            resizeMode="cover"
          />
        )}

        <View style={styles.botones}>
          <TouchableOpacity style={styles.botonEditar} onPress={() => irAEditar(item)}>
            <Text style={styles.botonTexto}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botonEliminar} onPress={() => confirmarEliminar(item.id)}>
            <Text style={styles.botonTexto}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Medicamentos</Text>
      <FlatList
        data={medicamentos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#b00020" />
            <Text style={styles.modalText}>Eliminando...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f3eafa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descripcion: {
    marginBottom: 6,
    fontStyle: 'italic',
  },
  detalle: {
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
    backgroundColor: '#b00020',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    color: '#b00020',
    fontWeight: 'bold',
  },
});
