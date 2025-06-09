export type RootStackParamList = {
  Recordatorio: {
    editar: boolean;
    data: {
      id: string;
      id_medicamento: string;
      hora_toma: string;
      fecha_inicio: string;
      frecuencia_dias: number;
      activo: boolean;
    };
  };
};