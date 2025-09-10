export default function ElementoTarea({ tarea, alEliminarTarea, alActualizarEstado }) {
  const estaCompletada = tarea.estado === 'Finalizado';

  return (
    <div className={`elemento-tarea ${estaCompletada ? 'completada' : ''}`}>
      <div className="tarea-info">
        <input 
          type="checkbox" 
          checked={estaCompletada}
          readOnly
        />
        <span className="tarea-descripcion">
          {tarea.descripcion}
        </span>
      </div>

      <div className="tarea-detalles">
        <span className="etiqueta-categoria">{tarea.categoria}</span>
        <span className={`etiqueta-prioridad prioridad-${(tarea.prioridad || '').toLowerCase()}`}>
          {tarea.prioridad || 'Sin prioridad'}
        </span>
        
      </div>

      <div className="tarea-acciones">
        <select 
          className="selector-estado"
          value={tarea.estado}
          onChange={(e) => alActualizarEstado(tarea.id, e.target.value)}
        >
          <option value="Pendiente">Pendientes</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Finalizado">Finalizado</option>
        </select>
        <button 
          className="boton-eliminar"
          onClick={() => alEliminarTarea(tarea.id)}
          disabled={!estaCompletada}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}