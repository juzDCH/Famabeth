import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { db } from '../../../../firebaseConfig';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
 
export default function ListaCategorias() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(false);
  const [eliminadoExito, setEliminadoExito] = useState(false);
 
  const navigation = useNavigation<any>();
 
  const manejarEditar = (categoria: any) => {
    navigation.navigate('screens/GestionMedicamento/Categoria/EditarCategorias', { categoria });
  };
 
  const manejarEliminar = (id: string) => {
  console.log('Presionaste eliminar para ID:', id); // <- VERIFICA SI SE MUESTRA
 
    Alert.alert(
      '¿Eliminar categoría?',
      'Esta acción no se puede deshacer',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => eliminarCategoria(id)
        }
      ]
    );
  };
 
 
  const eliminarCategoria = async (id: string) => {
    try {
      setEliminando(true);
      await deleteDoc(doc(db, 'categoria', id));
      setEliminando(false);
      setEliminadoExito(true);
      setTimeout(() => setEliminadoExito(false), 1500); // Oculta el check
    } catch (error) {
      console.error('Error al eliminar:', error);
      setEliminando(false);
      Alert.alert('Error', 'No se pudo eliminar la categoría');
    }
  };
 
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categoria'), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategorias(lista);
      setCargando(false);
    });
 
    return () => unsubscribe(); // Cleanup listener
  }, []);
 
  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#4B0082" />
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Categorías</Text>
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.categoriaCard}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
 
            <View style={styles.botonesContainer}>
              <TouchableOpacity
                style={styles.botonEditar}
                onPress={() => manejarEditar(item)}
              >
                <Text style={styles.textoBoton}>Editar</Text>
              </TouchableOpacity>
 
              <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => manejarEliminar(item.id)}
              >
                <Text style={styles.textoBoton}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
 
      {/* Modal de eliminación */}
      {eliminando && (
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#FF6347" />
            <Text style={styles.modalText}>Eliminando categoría...</Text>
          </View>
        </View>
      )}
 
      {/* Modal de éxito */}
      {eliminadoExito && (
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Icon name="check-circle" size={60} color="green" />
            <Text style={[styles.modalText, { color: 'green' }]}>¡Categoría eliminada!</Text>
          </View>
        </View>
      )}
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#003366' // color cambiado
  },
  categoriaCard: {
    backgroundColor: '#F3F3F3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366' // color cambiado para nombre
  },
  descripcion: {
    fontSize: 14,
    marginTop: 5
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  botonEditar: {
    backgroundColor: '#003366', // color cambiado
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 5
  },
  botonEliminar: {
    backgroundColor: '#B22222', // color cambiado
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5
  },
  textoBoton: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366' // color cambiado
  }
});
