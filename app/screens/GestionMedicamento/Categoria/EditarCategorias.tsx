import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db, auth } from '../../../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import { supabase, supabaseUrl } from '../../../../supabaseClient';
import { Image } from 'react-native';


export default function EditarCategoria() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { categoria } = route.params;

  const [imagen, setImagen] = useState<string | null>(categoria?.imagen_url || null);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
 
  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre);
      setDescripcion(categoria.descripcion);
    }
  }, [categoria]);
 
  // ...existing code...
  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImagen(result.assets[0].uri);
    }
  };

  const subirImagenSupabase = async (uri: string): Promise<string> => {
    try {
      const nombreArchivo = `categoria_${Date.now()}.jpg`;
      const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const blob = Buffer.from(fileBase64, 'base64');
      const { data, error } = await supabase.storage
        .from('categorias')
        .upload(nombreArchivo, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });
      if (error) throw error;
      return `${supabaseUrl}/storage/v1/object/public/categorias/${nombreArchivo}`;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw error;
    }
  };

    // ...existing code...
  const actualizarCategoria = async () => {
    if (nombre.trim() === '' || descripcion.trim() === '') {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      let urlImagen = categoria.imagen_url || '';
      if (imagen && imagen !== categoria.imagen_url) {
        urlImagen = await subirImagenSupabase(imagen);
      }
      const ref = doc(db, 'categoria', categoria.id);
      await updateDoc(ref, {
        nombre,
        descripcion,
        imagen_url: urlImagen,
      });
      Alert.alert('Éxito', 'Categoría actualizada correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la categoría');
      console.error(error);
    }
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Categoría</Text>
 
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
 
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      {imagen && <Image source={{ uri: imagen }} style={{ height: 200, marginBottom: 10 }} />}
      <TouchableOpacity style={styles.boton} onPress={seleccionarImagen}>
        <Text style={styles.botonTexto}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.boton} onPress={actualizarCategoria}>
        <Text style={styles.botonTexto}>Actualizar Categoría</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15
  },
  boton: {
    backgroundColor: '#4B0082',
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  botonTexto: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
 
 