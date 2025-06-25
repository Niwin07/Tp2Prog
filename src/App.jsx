import { useState } from 'react';
import './App.css';
import FormularioNuevaTarea from './components/FormularioNuevaTarea';
import ListaTareas from './components/ListaTareas';
import Filtros from './components/Filtros';

function App() {
  const [tareas, setTareas] = useState([]);
  const [idActual, setIdActual] = useState(1);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  const agregarTarea = (tarea) => {
    const nuevasTareas = [...tareas, { ...tarea, id: idActual }];
    setTareas(nuevasTareas);
    setIdActual(idActual + 1);
  };

  const eliminarTarea = (idTarea) => {
    const nuevasTareas = tareas.filter(tarea => tarea.id !== idTarea);
    setTareas(nuevasTareas);
  };

  const actualizarEstadoTarea = (idTarea, nuevoEstado) => {
    const nuevasTareas = tareas.map(tarea => {
      if (tarea.id === idTarea) {
        return { ...tarea, estado: nuevoEstado, completada: nuevoEstado === 'Finalizado' };
      }
      return tarea;
    });
    setTareas(nuevasTareas);
  };

  const toggleCompletada = (idTarea) => {
    const nuevasTareas = tareas.map(tarea => {
      if (tarea.id === idTarea) {
        return { ...tarea, completada: !tarea.completada };
      }
      return tarea;
    });
    setTareas(nuevasTareas);
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

  return (
    <div className='gestor-tareas-app'>
      <div className='panel-control'>
        <h1>Mi Gestor de Tareas</h1>
        <FormularioNuevaTarea alAgregarTarea={agregarTarea} />
        <Filtros 
          categoriaActiva={categoriaActiva}
          setCategoriaActiva={setCategoriaActiva} 
        />
      </div>
      <div className='panel-contenido'>
        <h2>Tareas</h2>
        <ListaTareas 
          tareas={tareasOrdenadasYFiltradas} 
          alEliminarTarea={eliminarTarea}
          alActualizarEstado={actualizarEstadoTarea}
        />
      </div>
    </div>
  )
}

export default App;