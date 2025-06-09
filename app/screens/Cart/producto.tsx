import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen_url: string;
  stock: number;
  unidad?: string;
  requiere_receta: boolean;
  fecha_vencimiento: {
    toDate: () => Date;
  } | string;
  dosis: string;
}

export default function ProductoScreen() {
  const [cantidad, setCantidad] = useState('1');
  const [menuVisible, setMenuVisible] = useState(false);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { id } = useLocalSearchParams();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const productoId = typeof id === 'string' ? id : id?.[0];

        if (!productoId) {
          console.error('ID inválido');
          return;
        }

        const docRef = doc(db, 'medicamento', productoId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<Producto, 'id'>;
          setProducto({ id: productoId, ...data });
        } else {
          console.warn('Producto no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  const agregarAlCarrito = async () => {
    if (!producto) return;

    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum < 1) {
      alert('Cantidad inválida');
      return;
    }

    const carritoStorage = await AsyncStorage.getItem('carrito');
    let carrito = carritoStorage ? JSON.parse(carritoStorage) : [];

    const index = carrito.findIndex((item: { id: string }) => item.id === producto.id);
    if (index !== -1) {
      carrito[index].cantidad += cantidadNum;
    } else {
      carrito.push({
        id: producto.id,
        cantidad: cantidadNum,
      });
    }

    await AsyncStorage.setItem('carrito', JSON.stringify(carrito));

    alert('Producto agregado al carrito');
  };

  const fechaVenc =
    producto &&
    typeof producto.fecha_vencimiento === 'object' &&
    'toDate' in producto.fecha_vencimiento
      ? producto.fecha_vencimiento.toDate().toLocaleDateString()
      : producto?.fecha_vencimiento;

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (!producto) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Producto no encontrado</Text>;
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        
        <Text style={styles.headerTitle}>FarmaBeth365</Text>
        
      </View>

      {/* Producto */}
      <Image source={{ uri: producto.imagen_url }} style={styles.imagen} />
      <Text style={styles.nombre}>{producto.nombre}</Text>
      <Text style={styles.dosis}>{producto.dosis}</Text>

      <Text style={styles.precio}>Bs.{producto.precio.toFixed(2)}</Text>
      <Text style={styles.descripcion}>{producto.descripcion}</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.etiqueta}>Cant:</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              setCantidad((prev) => String(Math.max(1, parseInt(prev) - 1)))
            }
          >
            <Ionicons name="remove-circle-outline" size={32} color="#6a1b9a" />
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 15, fontSize: 18 }}>{cantidad}</Text>
          <TouchableOpacity
            onPress={() =>
              setCantidad((prev) => String(parseInt(prev) + 1))
            }
          >
            <Ionicons name="add-circle-outline" size={32} color="#6a1b9a" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.boton} onPress={agregarAlCarrito}>
        <Text style={styles.botonTexto}>Agregar al carrito</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  imagen: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  precio: {
    textAlign: 'center',
    marginBottom: 6,
  },
  descripcion: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  etiqueta: {
    marginRight: 10,
    backgroundColor: '#e1bee7',
    padding: 6,
    borderRadius: 6,
  },
  boton: {
    backgroundColor: '#003366',
    padding: 14,
    borderRadius: 6,
    marginVertical: 6,
  },
  botonTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  settingsIcon: {
    padding: 10,
  },
  dosis: {
  textAlign: 'center',
  marginBottom: 6,
  fontSize: 14,
  color: '#555',
},

  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
