import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  imagen_url: string;
  id_categoria: string;
  dosis: string;
}

export default function MedicamentosScreen() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const { id_categoria } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'medicamento'));
        const data = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            nombre: d.nombre?.trim() || '',
            precio: d.precio,
            imagen_url: d.imagen_url?.trim() || '',
            id_categoria: d.id_categoria,
            dosis: d.dosis?.trim() || '',
          };
        }) as Producto[];
        const filtrados = data.filter(p => p.id_categoria === id_categoria);
        setProductos(filtrados);
      } catch (error) {
        console.error('Error al obtener medicamentos:', error);
      }
    };

    if (id_categoria) {
      fetchProductos();
    }
  }, [id_categoria]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medicamentos</Text>
      </View>

      <View style={styles.grid}>
        {productos.map((producto) => (
          <TouchableOpacity
            key={producto.id}
            style={styles.card}
            onPress={() => router.push(`/screens/Cart/producto?id=${producto.id}`)}
          >
            <Image source={{ uri: producto.imagen_url }} style={styles.image} />
            <Text style={styles.nombre}>{producto.nombre}</Text>
            <Text style={styles.dosis}>{producto.dosis}</Text>
            <Text style={styles.precio}>{producto.precio} Bs</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  nombre: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  dosis: {
    fontSize: 12,
    color: '#444',
    marginBottom: 4,
  },
  precio: {
    fontSize: 13,
    color: '#757575',
  },
});
