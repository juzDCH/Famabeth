import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, createUserWithEmailAndPassword, updateProfile } from '../../../firebaseConfig';
import { db, doc, setDoc, serverTimestamp } from '../../../firebaseConfig';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombres: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '01/01/1995', // Formato DD/MM/AAAA
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const parseFechaNacimiento = (fechaStr: string): Date => {
    try {
      const [day, month, year] = fechaStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    } catch (error) {
      console.error('Error al parsear fecha:', error);
      return new Date(); // Fecha por defecto si hay error
    }
  };

  const handleRegister = async () => {
    const { nombres, primerApellido, email, password, confirmPassword, fechaNacimiento } = formData;

    // Validaciones mejoradas
    if (!nombres.trim() || !primerApellido.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'Los campos marcados con * son obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fechaNacimiento)) {
      Alert.alert('Error', 'Formato de fecha inválido. Use DD/MM/AAAA');
      return;
    }

    try {
      setLoading(true);
      
      // 1. Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Preparar datos para Firestore
      const userData = {
        nombres: nombres.trim(),
        primer_apellido: primerApellido.trim(),
        segundo_apellido: formData.segundoApellido.trim() || '',
        email: email.trim().toLowerCase(),
        telefono: formData.telefono.trim() || '',
        direccion: formData.direccion.trim() || '',
        fecha_nacimiento: parseFechaNacimiento(fechaNacimiento),
        fecha_registro: serverTimestamp(),
        id_rol: 'cliente',
        contrasenia: '' // No almacenamos la contraseña en Firestore
      };

      // 3. Crear documento en Firestore (CORRECCIÓN DEL PARÉNTESIS AQUÍ)
      await setDoc(doc(db, 'usuario', user.uid), userData);

      // 4. Actualizar perfil en Auth
      await updateProfile(user, {
        displayName: `${nombres.trim()} ${primerApellido.trim()}`
      });

      Alert.alert('Éxito', 'Cuenta creada correctamente');
      router.replace('/(Tabs)/home'); // Asegúrate que esta ruta existe en tu navegación
    } catch (error: any) {
      console.error('Error completo:', error);
      let errorMessage = 'Error al registrar usuario';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El correo ya está registrado';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Operación no permitida';
          break;
        default:
          errorMessage = `Error desconocido: ${error.code}`;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>

      <TextInput
        placeholder="Nombres *"
        style={styles.input}
        value={formData.nombres}
        onChangeText={(text) => handleChange('nombres', text)}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Primer Apellido *"
        style={styles.input}
        value={formData.primerApellido}
        onChangeText={(text) => handleChange('primerApellido', text)}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Segundo Apellido"
        style={styles.input}
        value={formData.segundoApellido}
        onChangeText={(text) => handleChange('segundoApellido', text)}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Correo electrónico *"
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
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
      <TextInput
        placeholder="Fecha de Nacimiento (DD/MM/AAAA) *"
        style={styles.input}
        value={formData.fechaNacimiento}
        onChangeText={(text) => handleChange('fechaNacimiento', text)}
        keyboardType="numbers-and-punctuation"
      />
      <TextInput
        placeholder="Contraseña * (mínimo 6 caracteres)"
        style={styles.input}
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Confirmar Contraseña *"
        style={styles.input}
        value={formData.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        secureTextEntry
        autoCapitalize="none"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4B0082" style={styles.loading} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => router.replace('/screens/Usuario/login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#4B0082',
    textAlign: 'center',
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
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4B0082',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#4B0082',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  loading: {
    marginVertical: 20,
  },
});