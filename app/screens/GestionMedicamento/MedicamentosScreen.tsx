import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Producto {
  nombre: string;
  precio: string;
  imagen: any;
}

const medicamentos: { [categoria: string]: Producto[] } = {
  Medicamentos: [
    {
      nombre: 'antibiotico 200 mg x tableta',
      precio: 'bs 10.00',
      imagen: require('../../../assets/Antiobiotic.png'),
    },
    {
      nombre: 'antefidl 400mg x tableta',
      precio: 'bs 20.00',
      imagen: require('../../../assets/antefidl.png'),
    },
  ],
  'Salud y Bienestar': [
    {
      nombre: 'colageno x tableta',
      precio: 'bs 10.00',
      imagen: require('../../../assets/colageno.png'),
    },
    {
      nombre: 'Vitamina C x tableta',
      precio: 'bs 10.00',
      imagen: require('../../../assets/vitaminaC.png'),
    },
  ],
  'Mis medicamentos': [],
};


export default function MedicamentosScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={28} color="#5e35b1" />
        </TouchableOpacity>
        <Text style={styles.title}>Online Pharmacy</Text>
        <TouchableOpacity>
          <Ionicons name="settings" size={24} color="#5e35b1" />
        </TouchableOpacity>
      </View>


      {/* Secciones */}
      {Object.entries(medicamentos).map(([categoria, productos], index) => (
        <View key={index} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{categoria}</Text>
            <Text style={styles.viewAll}>Ver todo</Text>
          </View>

          <View style={styles.grid}>
            {productos.map((producto, i) => (
              <View key={i} style={styles.card}>
                <Image source={producto.imagen} style={styles.image} />
                <Text style={styles.nombre}>{producto.nombre}</Text>
                <Text style={styles.precio}>{producto.precio}</Text>
              </View>
            ))}
          </View>
        </View>
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5e35b1',
  },
  menu: {
    backgroundColor: '#f3e5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuItem: {
    paddingVertical: 6,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
    color: '#7e57c2',
    fontWeight: 'bold',
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
  precio: {
    fontSize: 13,
    color: '#757575',
  },
});
