import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db, auth } from '../../../../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import type { TimeIntervalTriggerInput } from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

import { useRouter } from 'expo-router';

export default function RecordatorioScreen() {
  const navigation = useNavigation<any>();

  const [horaToma, setHoraToma] = useState(new Date());
  const [frecuencia, setFrecuencia] = useState('');
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [activo, setActivo] = useState(true);
  const [idUsuario, setIdUsuario] = useState<string | null>(null);
  const [idMedicamento, setIdMedicamento] = useState('');
  const [seleccion, setSeleccion] = useState('');
  const [showHora, setShowHora] = useState(false);
  const [showFecha, setShowFecha] = useState(false);

  const medicamentosComunes = ['Ibuprofeno', 'Paracetamol', 'Amoxicilina', 'Loratadina', 'Otro'];

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIdUsuario(user.uid);
      }
    });
    pedirPermisos();
    return unsubscribe;
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

  const programarNotificacion = async (
    titulo: string,
    cuerpo: string,
    frecuenciaHoras: number
  ) => {
    const trigger: TimeIntervalTriggerInput = {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: frecuenciaHoras * 3600,
      repeats: true,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: titulo,
        body: cuerpo,
        sound: true,
      },
      trigger,
    });
  };

  const guardarRecordatorio = async () => {
    if (!idUsuario || !idMedicamento || !frecuencia) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const datos = {
      id_usuario: idUsuario,
      id_medicamento: idMedicamento,
      hora_toma: horaToma.toTimeString().split(' ')[0],
      fecha_inicio: fechaInicio.toISOString().split('T')[0],
      frecuencia_dias: Number(frecuencia),
      activo,
    };

    try {
      await addDoc(collection(db, 'recordatorio'), datos);
      Alert.alert('Éxito', 'Recordatorio guardado correctamente');

      if (activo) {
        await programarNotificacion(
          'Recordatorio de Medicación',
          `Es hora de tomar el medicamento: ${idMedicamento}`,
          parseInt(frecuencia)
        );
      }

      // Reset
      setFrecuencia('');
      setActivo(true);
      setIdMedicamento('');
      setSeleccion('');
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar el recordatorio');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nuevo Recordatorio</Text>

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
          value={activo}
          onValueChange={setActivo}
          trackColor={{ true: '#4B0082', false: '#999' }}
          thumbColor="#fff"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={guardarRecordatorio}>
        <Text style={styles.buttonText}>Guardar Recordatorio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/GestionMedicamento/Recordatorio/ListaRecordatoriosScreen')}>
        <Text style={styles.buttonText}>Lista Recordatorios</Text>
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
    backgroundColor: '#003366',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonSmall: {
    backgroundColor: '#003366',
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
});
