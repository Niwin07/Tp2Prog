

import ElementoTarea from './ElementoTarea';


export default function ListaTareas({ tareas, alEliminarTarea, alActualizarEstado }) {
  return (
    <div className="lista-tareas-contenedor">
      {tareas.map(tarea => (
        <ElementoTarea
        key={tarea.id}
        tarea={tarea}
        alEliminarTarea={alEliminarTarea}
        alActualizarEstado={alActualizarEstado} 
        />
      ))}
    </div>
  );
}