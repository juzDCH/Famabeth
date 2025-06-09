import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { db } from '../../../firebaseConfig';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
 
export default function ConfigurarNumero() {
  const [numero, setNumero] = useState('');
  const [cargando, setCargando] = useState(true);
 
  useEffect(() => {
    const obtenerNumero = async () => {
      try {
        const docRef = doc(db, 'config', 'whatsapp');
        const docSnap = await getDoc(docRef);
 
        if (docSnap.exists()) {
          setNumero(docSnap.data().numero);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener el número');
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
 
    obtenerNumero();
  }, []);
 
  const guardarNumero = async () => {
    if (numero.trim() === '') {
      Alert.alert('Error', 'El número no puede estar vacío');
      return;
    }
 
    try {
      await setDoc(doc(db, 'config', 'whatsapp'), {
        numero: numero.trim()
      });
      Alert.alert('Éxito', 'Número guardado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el número');
      console.error(error);
    }
  };
 
  const eliminarNumero = async () => {
    try {
      await deleteDoc(doc(db, 'config', 'whatsapp'));
      setNumero('');
      Alert.alert('Eliminado', 'Número eliminado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el número');
      console.error(error);
    }
  };
 
  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#4B0082" />
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Configurar número de WhatsApp</Text>
 
      <TextInput
        style={styles.input}
        placeholder="Ej: 59171234567"
        value={numero}
        onChangeText={setNumero}
        keyboardType="phone-pad"
      />
 
      <TouchableOpacity style={styles.boton} onPress={guardarNumero}>
        <Text style={styles.textoBoton}>Guardar número</Text>
      </TouchableOpacity>
 
      <TouchableOpacity
        style={[styles.boton, { backgroundColor: '#B00020' }]}
        onPress={eliminarNumero}
      >
        <Text style={styles.textoBoton}>Eliminar número</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center'
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20
  },
  boton: {
    backgroundColor: '#4B0082',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  textoBoton: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});