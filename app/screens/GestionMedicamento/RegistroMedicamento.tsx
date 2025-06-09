import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, Switch, Image
} from 'react-native';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
 
import { supabase, supabaseUrl } from '../../../supabaseClient';
 
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';

 
 
export default function CrearMedicamentoScreen() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [dosis, setDosis] = useState('');
  const [precio, setPrecio] = useState('');
  const [categorias, setCategorias] = useState<any[]>([]);
  const [idCategoria, setIdCategoria] = useState('');
  const [requiereReceta, setRequiereReceta] = useState(false);
  const [imagen, setImagen] = useState<string | null>(null);

  const [fechaVencimiento, setFechaVencimiento] = useState<Date>(new Date());
  const [mostrarPickerFecha, setMostrarPickerFecha] = useState(false);
  const [stock, setStock] = useState('');

 
  const router = useRouter();
 
  useFocusEffect(
    useCallback(() => {
      const obtenerCategorias = async () => {
        const snapshot = await getDocs(collection(db, 'categoria'));
        const items: any[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setCategorias(items);
      };
 
      obtenerCategorias();
    }, [])
  );
 
 
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
      const nombreArchivo = `${Date.now()}.jpg`;
      console.log('URI seleccionada:', uri);
 
      const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
 
      const blob = Buffer.from(fileBase64, 'base64');
 
      const { data, error } = await supabase.storage
        .from('medicamentos') // ✅ nombre exacto del bucket
        .upload(nombreArchivo, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });
 
      if (error) {
        console.error('Error al subir a Supabase:', error);
        throw new Error('Error al subir');
      }
 
      return `${supabaseUrl}/storage/v1/object/public/medicamentos/${nombreArchivo}`;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw error;
    }
  };
 
  const handleGuardar = async () => {
    if (!nombre || !descripcion || !dosis || !precio || !idCategoria) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
 
    try {
      let urlImagen = '';
      if (imagen) {
        urlImagen = await subirImagenSupabase(imagen);
      }
 
      await addDoc(collection(db, 'medicamento'), {
        nombre,
        descripcion,
        dosis,
        precio: Number(precio),
        id_categoria: idCategoria,
        receta: requiereReceta,
        imagen_url: urlImagen,
        fecha_vencimiento: fechaVencimiento,
        stock: Number(stock),
      });
 
      Alert.alert('Éxito', 'Medicamento registrado correctamente');
      setNombre('');
      setDescripcion('');
      setDosis('');
      setPrecio('');
      setIdCategoria('');
      setRequiereReceta(false);
      setImagen(null);
      setStock('');
      setFechaVencimiento(new Date());

    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo registrar el medicamento');
    }
  };
 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Medicamento</Text>
 
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
      <TextInput style={styles.input} placeholder="Dosis" value={dosis} onChangeText={setDosis} />
      <TextInput style={styles.input} placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
 
      <Text style={styles.label}>Categoría:</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={idCategoria} onValueChange={setIdCategoria}>
          <Picker.Item label="Seleccione una categoría" value="" />
          {categorias.map((cat) => (
            <Picker.Item key={cat.id} label={cat.nombre} value={cat.id} />
          ))}
        </Picker>
      </View>
 
      <View style={styles.switchContainer}>
        <Text style={styles.label}>¿Requiere receta?</Text>
        <Switch value={requiereReceta} onValueChange={setRequiereReceta} thumbColor={requiereReceta ? '#fff' : '#ccc'} trackColor={{ true: '#4B0082', false: '#999' }} />
      </View>

      <Text style={styles.label}>Fecha de vencimiento:</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setMostrarPickerFecha(true)}>
          <Text style={styles.dateButtonText}>
            {fechaVencimiento.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {mostrarPickerFecha && (
          <DateTimePicker
            value={fechaVencimiento}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setMostrarPickerFecha(false);
              if (date) setFechaVencimiento(date);
            }}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Stock"
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
        />

 
      {imagen && <Image source={{ uri: imagen }} style={{ height: 200, marginBottom: 10 }} />}
      <TouchableOpacity style={styles.button} onPress={seleccionarImagen}>
        <Text style={styles.buttonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>
 
      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Guardar Medicamento</Text>
      </TouchableOpacity>
 
      <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/GestionMedicamento/ListaMedicamentos')}>
        <Text style={styles.buttonText}>Lista Medicamentos</Text>
      </TouchableOpacity>
 
      <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/GestionMedicamento/Categoria/CrearCategoria')}>
        <Text style={styles.buttonText}>Crear Categoría</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#003366',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  dateButton: {
  padding: 12,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  marginBottom: 10,
  backgroundColor: '#f0f0f0',
},
dateButtonText: {
  fontSize: 16,
  color: '#333',
},

});
 
 