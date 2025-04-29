import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Switch, TouchableOpacity } from 'react-native';


type MedicamentoKey = 'ibuprofeno' | 'antibiotico' | 'presion';

const medicamentos = [
  {
    nombre: 'Ibuprofeno',
    hora: '12:40',
    frecuencia: 'cada 8 hs',
    icon: require('../../../assets/pill-blue.png'),
    key: 'ibuprofeno' as MedicamentoKey,
    sun: true,
  },
  {
    nombre: 'Antibiótico',
    hora: '14:00',
    frecuencia: 'cada 12 hs',
    icon: require('../../../assets/pill-orange.png'),
    key: 'antibiotico' as MedicamentoKey,
    sun: true,
  },
  {
    nombre: 'Presión',
    hora: '21:00',
    frecuencia: 'cada 24 hs',
    icon: require('../../../assets/pill-red.png'),
    key: 'presion' as MedicamentoKey,
    sun: false,
  },
];

export default function RecordatorioScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [alarms, setAlarms] = useState<Record<MedicamentoKey, boolean>>({
    ibuprofeno: true,
    antibiotico: true,
    presion: true,
  });



  const toggleAlarm = (key: MedicamentoKey) => {
    setAlarms((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <View style={styles.container}>
      {/* Botón del menú */}
      <TouchableOpacity onPress={toggleMenu} style={styles.menuToggle}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      {/* Menú desplegable */}
      {menuOpen && (
        <View style={styles.menu}>
          <Text style={styles.menuItem}>Inicio</Text>
          <Text style={styles.menuItem}>Medicamentos</Text>
          <Text style={styles.menuItem}>Carrito</Text>
          <Text style={styles.menuItem}>Contacto</Text>
          <Text style={styles.menuItem}>Atención al Cliente</Text>
          <Text style={styles.menuItem}>Historial de Compras</Text>
        </View>
      )}


      <Text style={styles.title}>Mi Medicación</Text>

      {medicamentos.map((med) => (
        <View key={med.key} style={styles.card}>
          <Image source={med.icon} style={styles.pillIcon} />
          <View style={styles.cardContent}>
            <Text style={styles.nombre}>{med.nombre}</Text>
            <Text style={styles.alarma}>Alarma</Text>
            <Switch
              value={alarms[med.key]}
              onValueChange={() => toggleAlarm(med.key)}
              trackColor={{ false: '#999', true: '#800080' }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.horaContainer}>
            <Text style={styles.hora}>{med.hora}</Text>
            <Text style={styles.frecuencia}>{med.frecuencia}</Text>
            <Text style={styles.iconoClima}>{med.sun ? '☀️' : '🌙'}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  menuToggle: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  menuIcon: {
    fontSize: 28,
  },
  menu: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: '#f3eafa',
    padding: 15,
    borderRadius: 10,
    width: '70%',
    elevation: 3,
    zIndex: 5,
  },
  menuItem: {
    fontSize: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#6A1B9A',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 3,
    borderRadius: 8,
    padding: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  pillIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alarma: {
    fontSize: 12,
    color: '#555',
  },
  horaContainer: {
    alignItems: 'flex-end',
  },
  hora: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  frecuencia: {
    fontSize: 12,
    color: '#555',
  },
  iconoClima: {
    fontSize: 16,
    marginTop: 4,
  },
});
