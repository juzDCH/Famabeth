import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useUser } from '../../UserContext'; // ajusta la ruta según corresponda

const CustomerSupport: React.FC = () => {
  const navigation = useNavigation<any>();
  const router = useRouter();
  const { rol, loading } = useUser();

  const [numeroWhatsApp, setNumeroWhatsApp] = useState<string | null>(null);

  useEffect(() => {
    const fetchNumero = async () => {
      try {
        const docRef = doc(db, 'config', 'whatsapp');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNumeroWhatsApp(docSnap.data().numero);
        }
      } catch (error) {
        console.error('Error al obtener número de WhatsApp:', error);
      }
    };

    fetchNumero();
  }, []);

  const abrirWhatsApp = () => {
    if (!numeroWhatsApp) {
      Alert.alert('Error', 'No hay un número de WhatsApp configurado.');
      return;
    }
    const mensaje = 'Hola, necesito ayuda con FarmaBeth365.';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'No se pudo abrir WhatsApp.')
    );
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atención al Cliente</Text>
      <Image source={require('../../../assets/customer-support.png')} style={styles.image} />
      <Text style={styles.description}>
        Ahora se encuentra en el soporte de FarmaBeth365. Por favor elija la ayuda que requiera y se le enviará la respectiva guía o ayuda. Gracias.
      </Text>
      {rol === 'admin' && (
        <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/Soporte/ConfigurarNumero')}>
          <Text style={styles.buttonText}>Configurar Número</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.whatsappContainer} onPress={abrirWhatsApp}>
        <Image source={require('../../../assets/wspLogo.png')} style={styles.whatsappIcon} />
        <Text style={styles.whatsappText}>CONTACTANOS</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomerSupport;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 150,
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#003366',
    padding: 12,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  whatsappContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  whatsappIcon: {
    width: 50,
    height: 50,
  },
  whatsappText: {
    color: '#4B0082',
    fontSize: 16,
    marginTop: 5,
  },
});
