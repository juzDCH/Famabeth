import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} | null;

export default function SideMenuScreen() {
  const [location, setLocation] = useState<LocationType>(null);
  const [marker, setMarker] = useState<any>(null);
  const [city, setCity] = useState('');
  const [direccion, setDireccion] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setLocation(coords);
      setMarker({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (geocode.length > 0) {
        const dir = `${geocode[0].street || ''}, ${geocode[0].region || ''}`;
        setDireccion(dir);
      }
    })();
  }, []);

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });

    const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (geocode.length > 0) {
      const dir = `${geocode[0].street || ''}, ${geocode[0].region || ''}`;
      setDireccion(dir);
    }
  };

  const handleConfirm = async () => {
    if (!marker) {
      Alert.alert('Ubicación no seleccionada', 'Por favor, selecciona una ubicación en el mapa.');
      return;
    }

    try {
      await AsyncStorage.setItem('referencia', city);
      await AsyncStorage.setItem('direccion', direccion);
      await AsyncStorage.setItem('coordenadas', JSON.stringify(marker));
      await AsyncStorage.setItem('tipo_entrega', 'domicilio');
      await AsyncStorage.setItem('direccion_entrega', direccion);
      router.push('/screens/Cart/Confirmacion');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la dirección. Inténtalo de nuevo.');
      console.error('Error guardando dirección:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dirección de Entrega</Text>

      {location && (
        <MapView
          style={styles.map}
          region={location}
          onRegionChangeComplete={(region) => setLocation(region)}
          onPress={handleMapPress}
        >
          {marker && <Marker coordinate={marker} />}
        </MapView>
      )}

      {direccion !== '' && (
        <View style={styles.direccionBox}>
          <Text style={styles.direccionLabel}>Dirección detectada:</Text>
          <Text style={styles.direccionText}>{direccion}</Text>
        </View>
      )}

      <Text style={styles.label}>Referencia:</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholder="Casa roja num. 878"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleConfirm}>
        <Text style={styles.submitText}>Confirmar Dirección</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  direccionBox: {
    marginBottom: 12,
    backgroundColor: '#f2e6ff',
    padding: 10,
    borderRadius: 8,
  },
  direccionLabel: {
    fontWeight: '600',
    color: '#4a148c',
  },
  direccionText: {
    color: '#444',
    marginTop: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#6699CC',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#003366',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
});
