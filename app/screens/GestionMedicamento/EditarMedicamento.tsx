import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Modal, ActivityIndicator, Switch, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import { supabase, supabaseUrl } from '../../../supabaseClient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';

export default function EditarMedicamentoScreen() {
  const navigation = useNavigation<any>();
  const {
    id,
    nombre,
    descripcion,
    dosis,
    precio,
    id_categoria,
    receta,
    imagen_url,
    fecha_vencimiento,
    stock
  } = useLocalSearchParams();

  const [nombreState, setNombre] = useState(nombre as string || '');
  const [descripcionState, setDescripcion] = useState(descripcion as string || '');
  const [dosisState, setDosis] = useState(dosis as string || '');
  const [precioState, setPrecio] = useState(precio as string || '');
  const [idCategoria, setIdCategoria] = useState(id_categoria as string || '');
  const [requiereReceta, setRequiereReceta] = useState(receta === 'true');
  const [imagen, setImagen] = useState<string | null>(imagen_url as string || null);
  const [fechaVencimiento, setFechaVencimiento] = useState<Date>(
    fecha_vencimiento ? new Date(fecha_vencimiento as string) : new Date()
  );
  const [mostrarPickerFecha, setMostrarPickerFecha] = useState(false);
  const [stockState, setStock] = useState(stock as string || '');
  const [modalVisible, setModalVisible] = useState(false);
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    const obtenerCategorias = async () => {
      const snap = await getDocs(collection(db, 'categoria'));
      const catList: any[] = [];
      snap.forEach(doc => {
        catList.push({ id: doc.id, ...doc.data() });
      });
      setCategorias(catList);
    };

    obtenerCategorias();
  }, []);

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
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const blob = Buffer.from(base64, 'base64');

      const { error } = await supabase.storage
        .from('medicamentos')
        .upload(nombreArchivo, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) {
        console.error('Error al subir a Supabase:', error);
        throw new Error('Error al subir imagen');
      }

      return `${supabaseUrl}/storage/v1/object/public/medicamentos/${nombreArchivo}`;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw error;
    }
  };

  const handleActualizar = async () => {
    if (!nombreState || !descripcionState || !dosisState || !precioState || !idCategoria) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      const ref = doc(db, 'medicamento', id as string);
      let nuevaUrlImagen = imagen_url as string || '';

      if (imagen && imagen !== imagen_url) {
        if (imagen_url) {
          const url = new URL(imagen_url as string);
          const path = decodeURIComponent(url.pathname.split('/storage/v1/object/public/')[1]);
          await supabase.storage.from('medicamentos').remove([path]);
        }
        nuevaUrlImagen = await subirImagenSupabase(imagen);
      }

      await updateDoc(ref, {
        nombre: nombreState,
        descripcion: descripcionState,
        dosis: dosisState,
        precio: Number(precioState),
        id_categoria: idCategoria,
        receta: requiereReceta,
        imagen_url: nuevaUrlImagen,
        fecha_vencimiento: fechaVencimiento,
        stock: Number(stockState),
      });

      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.goBack();
      }, 2000);
    } catch (error) {
      console.error('Error actualizando:', error);
      alert('Error al actualizar el medicamento');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Medicamento</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput value={nombreState} onChangeText={setNombre} style={styles.input} />

      <Text style={styles.label}>Descripción</Text>
      <TextInput value={descripcionState} onChangeText={setDescripcion} style={styles.input} />

      <Text style={styles.label}>Dosis</Text>
      <TextInput value={dosisState} onChangeText={setDosis} style={styles.input} />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        value={precioState}
        onChangeText={setPrecio}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={idCategoria}
          onValueChange={(val) => setIdCategoria(val)}
        >
          <Picker.Item label="Seleccione una categoría" value="" />
          {categorias.map((cat) => (
            <Picker.Item key={cat.id} label={cat.nombre} value={cat.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>¿Requiere receta?</Text>
        <Switch
          value={requiereReceta}
          onValueChange={setRequiereReceta}
          thumbColor={requiereReceta ? '#fff' : '#ccc'}
          trackColor={{ true: '#4B0082', false: '#999' }}
        />
      </View>

      <Text style={styles.label}>Fecha de vencimiento</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setMostrarPickerFecha(true)}>
        <Text style={styles.dateButtonText}>{fechaVencimiento.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {mostrarPickerFecha && (
        <DateTimePicker
          value={fechaVencimiento}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setMostrarPickerFecha(false);
            if (selectedDate) setFechaVencimiento(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Stock</Text>
      <TextInput
        value={stockState}
        onChangeText={setStock}
        keyboardType="numeric"
        style={styles.input}
      />

      {imagen && <Image source={{ uri: imagen }} style={{ height: 200, marginVertical: 10 }} />}

      <TouchableOpacity style={styles.button} onPress={seleccionarImagen}>
        <Text style={styles.buttonText}>Cambiar Imagen</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleActualizar}>
        <Text style={styles.buttonText}>Actualizar Medicamento</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#4B0082" />
            <Text style={styles.modalText}>Actualizando...</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4B0082',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4B0082',
    fontWeight: 'bold',
  },
  dateButton: {
  padding: 12,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  marginBottom: 15,
  backgroundColor: '#f0f0f0',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
});
 
 