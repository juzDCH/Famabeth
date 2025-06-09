import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router'; // 👈 AÑADIDO
import { db } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface Categoria {
  id: string;
  nombre: string;
  image_url: string;
}

export default function CategoriasScreen() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const router = useRouter(); 

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'categoria'));
        const categoriasData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Categoria[];
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>FarmaBeth365</Text>
      </View>

      <Text style={styles.categoriasTitulo}>Categorias</Text>

      {categorias.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => router.push(`/screens/GestionMedicamento/MedicamentosScreen?id_categoria=${item.id}`)}
        >
          <Image source={{ uri: item.image_url }} style={styles.imagen} />
          <Text style={styles.nombre}>{item.nombre}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  categoriasTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  card: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
  },
  imagen: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  nombre: {
    padding: 12,
    fontSize: 18,
  },
});
