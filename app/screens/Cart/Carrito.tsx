import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, collection, getDocs } from '../../../firebaseConfig';

const Carrito: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [productos, setProductos] = useState<any[]>([]);
  const [carrito, setCarrito] = useState<{ id: string; cantidad: number }[]>([]);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const guardarCarrito = async (carritoActualizado: { id: string; cantidad: number }[]) => {
    try {
      await AsyncStorage.setItem('carrito', JSON.stringify(carritoActualizado));
    } catch (error) {
      console.error('Error guardando en AsyncStorage:', error);
    }
  };

  const cargarCarrito = async () => {
    try {
      const datos = await AsyncStorage.getItem('carrito');
      if (datos) {
        setCarrito(JSON.parse(datos));
      }
    } catch (error) {
      console.error('Error cargando desde AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const medicamentosCol = collection(db, 'medicamento');
        const medicamentosSnap = await getDocs(medicamentosCol);
        const medicamentosData = medicamentosSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(medicamentosData);
      } catch (error) {
        console.error('Error al obtener medicamentos:', error);
      }
    };

    fetchMedicamentos();
    cargarCarrito();
  }, []);

  const aumentarCantidad = async (id: string) => {
    const nuevoCarrito = carrito.map(item =>
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
    );
    setCarrito(nuevoCarrito);
    await guardarCarrito(nuevoCarrito);
    cargarCarrito();
  };

  const disminuirCantidad = async (id: string) => {
    const nuevoCarrito = carrito
      .map(item =>
        item.id === id && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
      .filter(item => item.cantidad > 0);
    setCarrito(nuevoCarrito);
    await guardarCarrito(nuevoCarrito);
    cargarCarrito();
  };

  const eliminarDelCarrito = async (id: string) => {
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    setCarrito(nuevoCarrito);
    await guardarCarrito(nuevoCarrito);
    cargarCarrito();
  };

  const total = carrito.reduce((sum, item) => {
    const producto = productos.find(p => p.id === item.id);
    if (!producto) return sum;
    return sum + producto.precio * item.cantidad;
  }, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>FarmaBeth365</Text>
      </View>

      {carrito.map(item => {
        const producto = productos.find(p => p.id === item.id);
        if (!producto) return null;

        return (
          <View style={styles.itemCarrito} key={item.id}>
            <Image source={{ uri: producto.imagen_url }} style={styles.imagen} />
            <View style={styles.infoCarrito}>
              <Text style={styles.titulo}>{producto.nombre}</Text>
              <Text style={styles.precio}>Precio unitario: {producto.precio} Bs</Text>
              <Text style={styles.subtotal}>
                Subtotal: {(producto.precio * item.cantidad).toFixed(2)} Bs
              </Text>
            </View>
            <View style={styles.controles}>
              <TouchableOpacity onPress={() => router.push(`/screens/Cart/producto?id=${producto.id}`)}>
                <Text style={styles.verDetallesTexto}>Ver detalles</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => disminuirCantidad(item.id)}>
                <Text style={styles.botonControl}>-</Text>
              </TouchableOpacity>
              <Text style={styles.cantidad}>{item.cantidad}</Text>
              <TouchableOpacity onPress={() => aumentarCantidad(item.id)}>
                <Text style={styles.botonControl}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminarDelCarrito(item.id)}>
                <Text style={styles.botonControl}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* Total general */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalTexto}>Total: {total.toFixed(2)} Bs</Text>
      </View>


      {/* Botones de acción */}
      

      <TouchableOpacity style={styles.boton} onPress={() => router.push('/screens/Cart/Sucursal')}>
        <Text style={styles.botonTexto}>Recoger de Sucursal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.boton} onPress={() => router.push('/screens/Cart/formtohouse')}>
        <Text style={styles.botonTexto}>Entrega a Domicilio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Carrito;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
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
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
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
  precio: {
    fontSize: 16,
    color: '#555',
  },
  subtotal: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4a148c',
    marginTop: 4,
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
  verDetallesTexto: {
    color: '#6a1b9a',
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  boton: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  botonTexto: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
 totalContainer: {
  marginTop: 12,
  marginBottom: 24,
  paddingVertical: 16,
  paddingHorizontal: 20,
  backgroundColor: '#fff',
  borderRadius: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  borderTopWidth: 1,
  borderTopColor: '#e0e0e0',
},
totalTexto: {
  fontSize: 20,
  fontWeight: '600',
  color: '#333',
},


  settingsIcon: {
    padding: 10,
  },
  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
