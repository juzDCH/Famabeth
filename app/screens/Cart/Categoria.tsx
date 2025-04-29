import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const categorias = [
  { nombre: 'Dermocosmetica', imagen: require('../../../assets/dermocosmetica.jpeg') },
  { nombre: 'Medicamentos', imagen: require('../../../assets/medicamentos.jpg') },
  { nombre: 'Cuidado Personal', imagen: require('../../../assets/cuidado.jpg') },
  { nombre: 'Suplementos', imagen: require('../../../assets/suplementos.png') },
];

export default function CategoriasScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header con botón de menú */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Online Pharmacy</Text>
        <TouchableOpacity style={styles.settingsIcon}>
                  <Text style={styles.iconText}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Menú lateral */}
      {menuVisible && (
        <View style={styles.menu}>
          <Text style={styles.menuItem}>Inicio</Text>
          <Text style={styles.menuItem}>Medicamentos</Text>
          <Text style={styles.menuItem}>Carrito</Text>
          <Text style={styles.menuItem}>Contacto</Text>
          <Text style={styles.menuItem}>Atención al Cliente</Text>
          <Text style={styles.menuItem}>Historial de Compras</Text>
        </View>
      )}

      {/* Título de Categorías */}
      <Text style={styles.categoriasTitulo}>Categorias</Text>

      {/* Cards de categorías */}
      {categorias.map((item, index) => (
        <TouchableOpacity key={index} style={styles.card}>
          <Image source={item.imagen} style={styles.imagen} />
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
  categoriasTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6a1b9a',
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
  settingsIcon: {
    padding: 10,
  },
  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
