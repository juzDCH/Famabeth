
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../../firebaseConfig';

export default function PayScreen() {
  const [total, setTotal] = useState(0);
  const [productos, setProductos] = useState<any[]>([]);
  const [carrito, setCarrito] = useState<{ id: string; cantidad: number }[]>([]);
  const [imagenComprobante, setImagenComprobante] = useState<string | null>(null);
  const [tipoEntrega, setTipoEntrega] = useState<string>('');
  const [direccionEntrega, setDireccionEntrega] = useState<string | null>(null);
  const [referenciaUbicacion, setReferenciaUbicacion] = useState<string>('');
  const [clienteNombre, setClienteNombre] = useState<string>('');
  const [clienteTelefono, setClienteTelefono] = useState<string>('');
  const [clienteId, setClienteId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const CLOUD_NAME = 'didxwy6sp';
  const UPLOAD_PRESET = 'imagenesFarmaBeth';

  useEffect(() => {
    const cargarDatos = async () => {
      const datos = await AsyncStorage.getItem('carrito');
      if (datos) setCarrito(JSON.parse(datos));

      const tipo = await AsyncStorage.getItem('tipo_entrega');
      const direccion = await AsyncStorage.getItem('direccion_entrega');
      const ref = await AsyncStorage.getItem('referencia');
      setTipoEntrega(tipo || '');
      setDireccionEntrega(direccion || null);
      setReferenciaUbicacion(ref || '');

      const user = auth.currentUser;
      if (user) {
        setClienteId(user.uid);
        const userDoc = await getDoc(doc(db, 'usuario', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setClienteNombre(`${data.nombres} ${data.primer_apellido}`);
          setClienteTelefono(data.telefono);
        }
      }
    };

    const cargarProductos = async () => {
      const snap = await getDocs(collection(db, 'medicamento'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductos(data);
    };

    cargarDatos();
    cargarProductos();
  }, []);

  useEffect(() => {
    const totalCalculado = carrito.reduce((acc, item) => {
      const prod = productos.find(p => p.id === item.id);
      return prod ? acc + prod.precio * item.cantidad : acc;
    }, 0);
    setTotal(totalCalculado);
  }, [carrito, productos]);

  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a tu galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImagenComprobante(result.assets[0].uri);
    }
  };

  const subirImagenACloudinary = async (uri: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'comprobante.jpg',
    } as any);
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!data.secure_url) throw new Error('Error al subir la imagen');
    return data.secure_url;
  };

  const enviarComprobante = async () => {
    if (!imagenComprobante) {
      alert('Selecciona una imagen de comprobante.');
      return;
    }
    if (!tipoEntrega) {
      alert('No se detectó el tipo de entrega.');
      return;
    }

    try {
      setLoading(true);
      const url = await subirImagenACloudinary(imagenComprobante);

      await addDoc(collection(db, 'pedidos'), {
        imagen_url: url,
        total,
        carrito,
        creado_en: serverTimestamp(),
        estado: 'En revisión',
        tipo_entrega: tipoEntrega,
        direccion_entrega: tipoEntrega === 'domicilio' ? direccionEntrega : null,
        referencia_ubicacion: tipoEntrega === 'domicilio' ? referenciaUbicacion : null,
        cliente_nombre: clienteNombre,
        cliente_telefono: clienteTelefono,
        cliente_id: clienteId,
        tipo_pago: 'Qr',
      });

      await AsyncStorage.multiRemove([
        'carrito',
        'tipo_entrega',
        'direccion_entrega',
        'referencia',
      ]);

      setImagenComprobante(null);
      router.push('/screens/Cart/PagoEnRevision');
    } catch (error) {
      console.error('Error al subir comprobante:', error);
      Alert.alert('Error', 'No se pudo registrar el pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FarmaBeth365</Text>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total a pagar</Text>
        <Text style={styles.totalAmount}>Bs {total.toFixed(2)}</Text>
      </View>

      <View style={styles.qrContainer}>
        <Image source={require('../../../assets/QRCode.jpg')} style={styles.qrImage} />
        <Text style={styles.qrNote}>Escanea el código con tu app bancaria</Text>
      </View>

      <TouchableOpacity style={styles.boton} onPress={seleccionarImagen}>
        <Text style={styles.botonTexto}>Seleccionar Comprobante</Text>
      </TouchableOpacity>

      {imagenComprobante && (
        <>
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <Text style={{ marginBottom: 8 }}>Previsualización:</Text>
            <Image source={{ uri: imagenComprobante }} style={{ width: 200, height: 200, borderRadius: 10 }} />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4a148c" style={{ marginTop: 20 }} />
          ) : (
            <TouchableOpacity
              style={[styles.boton, { backgroundColor: '#388e3c', marginTop: 20 }]}
              onPress={enviarComprobante}
            >
              <Text style={styles.botonTexto}>Enviar Comprobante</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    paddingTop: 60,
    flexGrow: 1,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
  },
  totalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    marginBottom: 30,
  },
  totalLabel: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6a1b9a',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrImage: {
    width: 230,
    height: 230,
    resizeMode: 'contain',
  },
  qrNote: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  boton: {
    backgroundColor: '#003366',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  botonTexto: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
