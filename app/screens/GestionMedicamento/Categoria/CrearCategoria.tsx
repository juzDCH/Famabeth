import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
// ...existing code...
import { db } from '../../../../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import { supabase, supabaseUrl } from '../../../../supabaseClient';


export default function CrearCategoria() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [imagen, setImagen] = useState<string | null>(null);
// ...existing code...
  // ...existing code...
const guardarCategoria = async () => {
  if (nombre.trim() === '' || descripcion.trim() === '') {
    alert('Todos los campos son obligatorios');
    return;
  }

  try {
    let urlImagen = '';
    if (imagen) {
      urlImagen = await subirImagenSupabase(imagen);
    }
    await addDoc(collection(db, 'categoria'), {
      nombre,
      descripcion,
      imagen_url: urlImagen,
      fechaCreacion: new Date()
    });
    setNombre('');
    setDescripcion('');
    setImagen(null);
    setModalVisible(true);
  } catch (error) {
    alert('No se pudo guardar la categoría');
    console.error(error);
  }
};

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Registrar Categoría</Text>
 
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
 
      <TouchableOpacity style={styles.boton} onPress={guardarCategoria}>
        <Text style={styles.botonTexto}>Guardar Categoría</Text>
      </TouchableOpacity>
 
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/screens/GestionMedicamento/Categoria/ListaCategorias')}
      >
        <Text style={styles.buttonText}>Listas Categoría</Text>
      </TouchableOpacity>
 
      {/* Modal de confirmación */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTexto}>¡Categoría creada correctamente!</Text>
            <TouchableOpacity
              style={styles.modalBoton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalBotonTexto}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center'
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#003366', // color cambiado
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15
  },
  boton: {
    backgroundColor: '#003366', // color cambiado
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  botonTexto: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#003366', // color cambiado
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTexto: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalBoton: {
    backgroundColor: '#003366', // color cambiado
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalBotonTexto: {
    color: 'white',
    fontWeight: 'bold',
  }
});

 
 