import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


const Carrito: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con menú */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Online Pharmacy</Text>
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

      {/* Contenido del carrito */}
      <View style={styles.itemCarrito}>
        <Image source={require('../../../assets/digestan.jpeg')} style={styles.imagen} />

        <View style={styles.infoCarrito}>
          <Text style={styles.titulo}>Digestan simple</Text>
          <Text style={styles.precio}>3.00 Bs</Text>
        </View>

        <View style={styles.controles}>
          <TouchableOpacity>
            <Text style={styles.botonControl}>🗑</Text>
          </TouchableOpacity>
          <Text style={styles.cantidad}>1</Text>
          <TouchableOpacity>
            <Text style={styles.botonControl}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.eliminar}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => router.push('/screens/Cart/pay')}
      >
        <Text style={styles.botonTexto}>Comprar Via QR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => router.push('/screens/Cart/formtohouse')}
      >
        <Text style={styles.botonTexto}>Entrega a Domicilio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => router.push('/screens/Cart/producto')}
      >
        <Text style={styles.botonTexto}>Producto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => router.push('/screens/Cart/Categoria')}
      >
        <Text style={styles.botonTexto}>Categoria</Text>
      </TouchableOpacity>

    </View>
  );
};

export default Carrito;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
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
  },
  menuItem: {
    paddingVertical: 6,
    fontSize: 16,
  },
  itemCarrito: {
    flexDirection: 'column',
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  imagen: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },
  infoCarrito: {
    alignItems: 'center',
    marginBottom: 10,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  precio: {
    fontSize: 16,
    color: '#555',
  },
  controles: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  botonControl: {
    fontSize: 20,
    padding: 10,
  },
  cantidad: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  eliminar: {
    color: 'red',
    textDecorationLine: 'underline',
    marginLeft: 10,
  },
  boton: {
    backgroundColor: '#6a1b9a',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  botonTexto: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  settingsIcon: {
    padding: 10,
  },
  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },

});
