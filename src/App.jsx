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
  const API_BASE_URL = 'https://api-tareas.ctpoba.edu.ar/v1';
  const API_TOKEN = '47811521';

useEffect(() => {
  cargarTareas(categoriaActiva);
}, [categoriaActiva]);

const cargarTareas = async (categoria = 'Todas') => {
  try {
    let params = {
      limit: 9999999,
      offset: 0
    };
    if (categoria !== 'Todas') {
      params.busqueda = categoria;
    }
    const response = await axios.get(`${API_BASE_URL}/tareas/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_TOKEN,
      },
      params,
      timeout: 10000,
    });

    const tareasObtenidas = (response.data.tareas || []).map(t => ({
      ...t,
      id: t._id,
    }));
    setTareas(tareasObtenidas);
  } catch (error) {
    console.error('Error al cargar tareas:', error);
    alert('Error al cargar las tareas. Que pasho papu');
  }
};

  const agregarTarea = async (tarea) => {
  try {
    await axios.post(`${API_BASE_URL}/tareas/`, tarea, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_TOKEN,
      },
      timeout: 10000,
    });
    await cargarTareas(categoriaActiva);
  } catch (error) {
    console.error('Error al agregar tarea:', error);
    throw error;
  }
};

  const eliminarTareaHandler = async (idTarea) => {
  try {
    await axios.delete(`${API_BASE_URL}/tareas/${idTarea}/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_TOKEN,
      },
      timeout: 10000,
    });
    await cargarTareas(categoriaActiva);
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    alert('Error al eliminar la tarea. Intenta nuevamente.');
  }
};

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
    await cargarTareas(categoriaActiva);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    alert('Error al actualizar la tarea. Intenta nuevamente.');
  }
};


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


function PaginaLista() {
    const ordenPrioridad = {
      "Alta": 1,
      "Media": 2,
      "Baja": 3
    };
    const tareasOrdenadas = [...tareas].sort((a, b) => {
      return ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad];
    });

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
          <ListaTareas 
            tareas={tareasOrdenadas} 
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
          window.location.href = '/nueva-tarea';
          return null;
        }}
      </Route>
    </Router>
  );
}
export default App;