import axios from 'axios';

const API_BASE_URL = 'https://api-tareas.ctpoba.edu.ar/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: '47811521',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la API:', error);
    return Promise.reject(error);
  }
);

export const obtenerTareas = async () => {
  try {
    const response = await api.get('/tareas/');

    return (response.data.tareas || []).map(t => ({
      ...t,
      id: t._id,
    }));
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    throw error;
  }
};

export const crearTarea = async (tarea) => {
  try {
    const response = await api.post('/tareas/', tarea);
    return {
      ...response.data,
      id: response.data._id,
    };
  } catch (error) {
    console.error('Error al crear tarea:', error);
    throw error; 
  }
};
export const actualizarTarea = async (id, tarea) => {
  try {
    const response = await api.put(`/tareas/${id}/`, tarea);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    throw error;
  }
};

export const eliminarTarea = async (id) => {
  try {
    await api.delete(`/tareas/${id}/`);
    return true;
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    throw error;
  }
};

export const obtenerTareaPorId = async (id) => {
  try {
    const response = await api.get(`/tareas/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tarea por ID:', error);
    throw error;
  }
};

export default api;