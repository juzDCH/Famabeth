import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, signInWithEmailAndPassword, sendPasswordResetEmail } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
 
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
 
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
 
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
     
      // Verificar datos adicionales en Firestore
      const userDoc = await getDoc(doc(db, 'usuario', userCredential.user.uid));
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado en la base de datos');
      }
 
      // Redirigir al home después de login exitoso
      router.replace('/screens/Home/HomeScreen');
    } catch (error: any) {
      let errorMessage = 'Error al iniciar sesión';
      switch (error.code || error.message) {
        case 'auth/invalid-email': errorMessage = 'Correo electrónico inválido'; break;
        case 'auth/user-not-found':
        case 'auth/wrong-password': errorMessage = 'Correo o contraseña incorrectos'; break;
        case 'auth/too-many-requests': errorMessage = 'Demasiados intentos. Intenta más tarde'; break;
        case 'Usuario no encontrado en la base de datos': errorMessage = error.message; break;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };
 
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }
 
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Éxito', 'Se ha enviado un correo para restablecer tu contraseña');
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo enviar el correo de recuperación');
    }
  };
 
  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/log.png')} style={styles.logo} />
      <Text style={styles.title}>FARMABETTH 365</Text>
 
      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
 
      {loading ? (
        <ActivityIndicator size="large" color="#4B0082" style={styles.loading} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      )}
 
      <TouchableOpacity onPress={() => router.push('/screens/Usuario/register')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
 
      <TouchableOpacity onPress={handleResetPassword}>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: '#003366',
    fontWeight: 'bold',
    marginBottom: 40,
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
    backgroundColor: '#003366',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#003366',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  loading: {
    marginVertical: 20,
  },
});
 