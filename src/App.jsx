import { useState, useEffect } from 'react';
import { Router, Route, Link, useLocation } from 'wouter';
import axios from 'axios';
import './App.css';
import FormularioNuevaTarea from './components/FormularioNuevaTarea.jsx';
import ListaTareas from './components/ListaTareas.jsx';
import Filtros from './components/Filtros.jsx';

function App() {
  const [tareas, setTareas] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [loading, setLoading] = useState(false);

  // Configuración de la API
  const API_BASE_URL = 'https://api-tareas.ctpoba.edu.ar/v1';
  const API_TOKEN = '47811521';

  // Cargar tareas al iniciar la aplicación
  useEffect(() => {
    cargarTareas();
  }, []);

  // Función para obtener todas las tareas
  const cargarTareas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/tareas/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_TOKEN,
        },
        timeout: 10000,
      });

      const tareasObtenidas = (response.data.tareas || []).map(t => ({
        ...t,
        id: t._id,
      }));
      
      setTareas(tareasObtenidas);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      alert('Error al cargar las tareas. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  // Función para crear una nueva tarea
  const agregarTarea = async (tarea) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tareas/`, tarea, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_TOKEN,
        },
        timeout: 10000,
      });

      // Recargar las tareas después de crear una nueva
      await cargarTareas();
    } catch (error) {
      console.error('Error al agregar tarea:', error);
      throw error; // Para que el formulario pueda manejar el error
    }
  };

  // Función para eliminar una tarea
  const eliminarTareaHandler = async (idTarea) => {
    try {
      await axios.delete(`${API_BASE_URL}/tareas/${idTarea}/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_TOKEN,
        },
        timeout: 10000,
      });

      // Actualizar el estado local eliminando la tarea
      setTareas(prevTareas => prevTareas.filter(tarea => tarea.id !== idTarea));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      alert('Error al eliminar la tarea. Intenta nuevamente.');
    }
  };

  // Función para actualizar el estado de una tarea
  const actualizarEstadoTarea = async (idTarea, nuevoEstado) => {
    try {
      const tareaActual = tareas.find(t => t.id === idTarea);
      const tareaActualizada = {
        ...tareaActual,
        estado: nuevoEstado,
        completada: nuevoEstado === 'Finalizado'
      };
      
      await axios.put(`${API_BASE_URL}/tareas/${idTarea}/`, tareaActualizada, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_TOKEN,
        },
        timeout: 10000,
      });
      
      // Actualizar el estado local
      setTareas(prevTareas => 
        prevTareas.map(tarea => 
          tarea.id === idTarea ? tareaActualizada : tarea
        )
      );
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      alert('Error al actualizar la tarea. Intenta nuevamente.');
    }
  };

  // Filtrar tareas por categoría
  const tareasFiltradas = categoriaActiva === 'Todas'
    ? tareas
    : tareas.filter(tarea => tarea.categoria === categoriaActiva);

  // Ordenar tareas por prioridad
  const ordenPrioridad = {
    "Alta": 1,
    "Media": 2,
    "Baja": 3
  };

  const tareasOrdenadasYFiltradas = tareasFiltradas.sort((a, b) => {
    return ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad];
  });

  // Componente de navegación
  function Navegacion() {
    const [location] = useLocation();
    
    return (
      <nav className="navegacion">
        <Link href="/nueva-tarea" className={location === '/nueva-tarea' ? 'activo' : ''}>
          Nueva Tarea
        </Link>
        <Link href="/lista-tareas" className={location === '/lista-tareas' ? 'activo' : ''}>
          Lista de Tareas
        </Link>
      </nav>
    );
  }

  // Página del formulario
  function PaginaFormulario() {
    return (
      <div className='gestor-tareas-app'>
        <div className='panel-control'>
          <h1>Mi Gestor de Tareas</h1>
          <Navegacion />
          <FormularioNuevaTarea alAgregarTarea={agregarTarea} />
        </div>
        <div className='panel-contenido'>
          <h2>Agregar Nueva Tarea</h2>
          <p style={{color: '#ccc'}}>
            Completa el formulario en el panel izquierdo para agregar una nueva tarea.
          </p>
        </div>
      </div>
    );
  }

  // Página de la lista
  function PaginaLista() {
    return (
      <div className='gestor-tareas-app'>
        <div className='panel-control'>
          <h1>Mi Gestor de Tareas</h1>
          <Navegacion />
          <Filtros 
            categoriaActiva={categoriaActiva}
            setCategoriaActiva={setCategoriaActiva} 
          />
        </div>
        <div className='panel-contenido'>
          <h2>Tareas {loading && '(Cargando...)'}</h2>
          <ListaTareas 
            tareas={tareasOrdenadasYFiltradas} 
            alEliminarTarea={eliminarTareaHandler}
            alActualizarEstado={actualizarEstadoTarea}
          />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Route path="/nueva-tarea" component={PaginaFormulario} />
      <Route path="/lista-tareas" component={PaginaLista} />
      <Route path="/">
        {() => {
          // Redirigir a nueva-tarea por defecto
          window.location.href = '/nueva-tarea';
          return null;
        }}
      </Route>
    </Router>
  );
}

export default App;