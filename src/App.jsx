import { useState, useEffect } from 'react';
import { Router, Route, Link, useLocation } from 'wouter';
import './App.css';
import FormularioNuevaTarea from './components/FormularioNuevaTarea';
import ListaTareas from './components/ListaTareas';
import Filtros from './components/Filtros';
import { obtenerTareas, crearTarea, eliminarTarea, actualizarTarea } from './services/apiService';

function App() {
  const [tareas, setTareas] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [loading, setLoading] = useState(false);

  // Cargar tareas al iniciar la aplicación
  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    setLoading(true);
    try {
      const tareasObtenidas = await obtenerTareas();
      setTareas(tareasObtenidas);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setLoading(false);
    }
  };

  const agregarTarea = async (tarea) => {
    try {
      await crearTarea(tarea);
      await cargarTareas();
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    }
  };

  const eliminarTareaHandler = async (idTarea) => {
    try {
      await eliminarTarea(idTarea);
      setTareas(prevTareas => prevTareas.filter(tarea => tarea.id !== idTarea));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
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
      
      await actualizarTarea(idTarea, tareaActualizada);
      
      setTareas(prevTareas => 
        prevTareas.map(tarea => 
          tarea.id === idTarea ? tareaActualizada : tarea
        )
      );
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  const tareasFiltradas = categoriaActiva === 'Todas'
    ? tareas
    : tareas.filter(tarea => tarea.categoria === categoriaActiva);

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