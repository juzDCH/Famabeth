import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth, signOut, updateProfile } from '../../../firebaseConfig';
import { db, doc, getDoc, updateDoc, serverTimestamp } from '../../../firebaseConfig';
 
interface UserData {
  nombres: string;
  primer_apellido: string;
  segundo_apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  fecha_registro: any;
  id_rol: string;
}
 
export default function AccountScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    telefono: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
 
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.replace('../Usuario/login');
        return;
      }
 
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'usuario', user.uid));
 
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          setFormData({
            nombres: data.nombres || '',
            primerApellido: data.primer_apellido || '',
            segundoApellido: data.segundo_apellido || '',
            telefono: data.telefono || '',
            direccion: data.direccion || ''
          });
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };
 
    fetchUserData();
  }, []);
 
  const handleUpdate = async () => {
    const user = auth.currentUser;
    if (!user || !userData) return;
 
    try {
      setUpdating(true);
 
      await updateDoc(doc(db, 'usuario', user.uid), {
        nombres: formData.nombres,
        primer_apellido: formData.primerApellido,
        segundo_apellido: formData.segundoApellido,
        telefono: formData.telefono,
        direccion: formData.direccion,
        ultima_actualizacion: serverTimestamp()
      });
 
      await updateProfile(user, {
        displayName: `${formData.nombres} ${formData.primerApellido}`
      });
 
      Alert.alert('Éxito', 'Datos actualizados correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    } finally {
      setUpdating(false);
    }
  };
 
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('../Usuario/login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar la sesión');
    }
  };
 
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };
 
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
      </View>
    );
  }
 
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image
        source={require('../../../assets/user.png')}
        style={styles.profileImage}
      />
 
      <Text style={styles.sectionTitle}>Información Personal</Text>
 
      <TextInput
        placeholder="Nombres"
        style={styles.input}
        value={formData.nombres}
        onChangeText={(text) => handleChange('nombres', text)}
      />
      <TextInput
        placeholder="Primer Apellido"
        style={styles.input}
        value={formData.primerApellido}
        onChangeText={(text) => handleChange('primerApellido', text)}
      />
      <TextInput
        placeholder="Segundo Apellido"
        style={styles.input}
        value={formData.segundoApellido}
        onChangeText={(text) => handleChange('segundoApellido', text)}
      />
 
      <Text style={styles.sectionTitle}>Información de Contacto</Text>
 
      <TextInput
        placeholder="Correo electrónico"
        style={[styles.input, styles.disabledInput]}
        value={userData?.email || ''}
        editable={false}
      />
      <TextInput
        placeholder="Teléfono"
        style={styles.input}
        value={formData.telefono}
        onChangeText={(text) => handleChange('telefono', text)}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Dirección"
        style={styles.input}
        value={formData.direccion}
        onChangeText={(text) => handleChange('direccion', text)}
      />
 
      {userData?.id_rol !== 'admin' && (
  <>
    <TouchableOpacity
      style={styles.reminderButton}
      onPress={() => router.push('/screens/GestionMedicamento/Recordatorio/recordatorio')}
    >
      <Ionicons name="alarm-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
      <Text style={styles.reminderText}>Ir a Recordatorio de Medicación</Text>
    </TouchableOpacity>
 
    <TouchableOpacity
      style={styles.reminderButton}
      onPress={() => router.push('/screens/Cart/PedidosLista')}
    >
      <Ionicons name="list-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
      <Text style={styles.reminderText}>Historial de Pedidos</Text>
    </TouchableOpacity>
  </>
)}
 
      {updating ? (
        <ActivityIndicator size="large" color="#4B0082" style={styles.loading} />
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      )}
 
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  disabledInput: {
    backgroundColor: '#eee',
    color: '#666',
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#003366',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  reminderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#003366',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButton: {
    width: '100%',
    height: 50,
    borderColor: '#ff4444',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    marginVertical: 20,
  },
});