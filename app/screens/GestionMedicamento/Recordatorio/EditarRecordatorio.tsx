import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';

export default function EditarRecordatorioScreen() {
  const router = useRouter();
  const {
    id,
    id_medicamento,
    hora_toma,
    fecha_inicio,
    frecuencia_dias,
    activo,
  } = useLocalSearchParams();

  const [horaToma, setHoraToma] = useState(new Date());
  const [frecuencia, setFrecuencia] = useState('');
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [activoState, setActivoState] = useState(true);
  const [idMedicamento, setIdMedicamento] = useState('');
  const [seleccion, setSeleccion] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [showHora, setShowHora] = useState(false);
  const [showFecha, setShowFecha] = useState(false);

  const medicamentosComunes = ['Ibuprofeno', 'Paracetamol', 'Amoxicilina', 'Loratadina', 'Otro'];

  useEffect(() => {
    setIdMedicamento(id_medicamento as string || '');
    setFrecuencia(frecuencia_dias as string || '');
    setActivoState(activo === 'true');

    // Definir selección visible
    if (id_medicamento && medicamentosComunes.includes(id_medicamento as string)) {
      setSeleccion(id_medicamento as string);
    } else {
      setSeleccion('Otro');
    }

    if (hora_toma) {
      const [hh, mm, ss] = (hora_toma as string).split(':');
      const hora = new Date();
      hora.setHours(parseInt(hh), parseInt(mm), parseInt(ss));
      setHoraToma(hora);
    }

    if (fecha_inicio) {
      setFechaInicio(new Date(fecha_inicio as string));
    }

    pedirPermisos();
  }, []);

  const pedirPermisos = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: nuevoStatus } = await Notifications.requestPermissionsAsync();
      if (nuevoStatus !== 'granted') {
        Alert.alert('Permisos necesarios', 'Se requieren permisos para notificaciones.');
      }
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  const actualizarRecordatorio = async () => {
    if (!idMedicamento || !frecuencia) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const datos = {
      id_medicamento: idMedicamento,
      hora_toma: horaToma.toTimeString().split(' ')[0],
      fecha_inicio: fechaInicio.toISOString().split('T')[0],
      frecuencia_dias: Number(frecuencia),
      activo: activoState,
    };

    try {
      const ref = doc(db, 'recordatorio', id as string);
      await updateDoc(ref, datos);

      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        router.back();
      }, 1500);
    } catch (error) {
      console.error('Error al actualizar:', error);
      Alert.alert('Error', 'No se pudo actualizar el recordatorio');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Recordatorio</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Seleccionar Medicamento</Text>
        <Picker
          selectedValue={seleccion}
          onValueChange={(itemValue) => {
            setSeleccion(itemValue);
            if (itemValue === 'Otro') {
              setIdMedicamento('');
            } else {
              setIdMedicamento(itemValue);
            }
          }}
          style={styles.picker}
        >
          {medicamentosComunes.map((med) => (
            <Picker.Item label={med} value={med} key={med} />
          ))}
        </Picker>
      </View>

      {seleccion === 'Otro' && (
        <TextInput
          placeholder="Escribe el nombre del medicamento"
          value={idMedicamento}
          onChangeText={setIdMedicamento}
          style={styles.input}
        />
      )}

      <TouchableOpacity onPress={() => setShowHora(true)} style={styles.buttonSmall}>
        <Text style={styles.buttonText}>Seleccionar Hora</Text>
      </TouchableOpacity>
      {showHora && (
        <DateTimePicker
          value={horaToma}
          mode="time"
          is24Hour
          display="default"
          onChange={(e, date) => {
            setShowHora(false);
            if (date) setHoraToma(date);
          }}
        />
      )}
      <Text style={styles.label}>Hora seleccionada: {horaToma.toTimeString().split(' ')[0]}</Text>

      <TouchableOpacity onPress={() => setShowFecha(true)} style={styles.buttonSmall}>
        <Text style={styles.buttonText}>Seleccionar Fecha de Inicio</Text>
      </TouchableOpacity>
      {showFecha && (
        <DateTimePicker
          value={fechaInicio}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowFecha(false);
            if (date) setFechaInicio(date);
          }}
        />
      )}
      <Text style={styles.label}>Fecha seleccionada: {fechaInicio.toISOString().split('T')[0]}</Text>

      <TextInput
        placeholder="Frecuencia (en horas)"
        value={frecuencia}
        onChangeText={setFrecuencia}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>¿Activo?</Text>
        <Switch
          value={activoState}
          onValueChange={setActivoState}
          trackColor={{ true: '#4B0082', false: '#999' }}
          thumbColor="#fff"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={actualizarRecordatorio}>
        <Text style={styles.buttonText}>Actualizar Recordatorio</Text>
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
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
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
    backgroundColor: '#4B0082',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonSmall: {
    backgroundColor: '#6A1B9A',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
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
});
