import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProductoScreen() {
  const [cantidad, setCantidad] = useState('1');
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

      {/* Contenido del producto */}
      <Image source={require('../../../assets/digestan.jpeg')} style={styles.imagen} />
      <Text style={styles.nombre}>Digestan x sobre</Text>
      <Text style={styles.precio}>bs 3.00</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.etiqueta}>Cant:</Text>
        <Picker
          selectedValue={cantidad}
          style={styles.picker}
          onValueChange={(itemValue) => setCantidad(itemValue)}
        >
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
        </Picker>
      </View>

      <TouchableOpacity
              style={styles.boton}
              onPress={() => router.push('/screens/Cart/pay')}
            >
              <Text style={styles.botonTexto}>Comprar Via QR</Text>
            </TouchableOpacity>
      <TouchableOpacity style={styles.boton}>
        <Text style={styles.botonTexto}>Agregar al carrito</Text>
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.infoTexto}>En stock: 565</Text>
        <Text style={styles.infoTexto}>Unidad de venta: Sobres</Text>
      </View>
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
    marginBottom: 10,
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
  picker: {
    flex: 1,
  },
  boton: {
    backgroundColor: '#6a1b9a',
    padding: 14,
    borderRadius: 6,
    marginVertical: 6,
  },
  botonTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  info: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  infoTexto: {
    fontSize: 14,
    marginBottom: 4,
  },
  settingsIcon: {
    padding: 10,
  },
  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
