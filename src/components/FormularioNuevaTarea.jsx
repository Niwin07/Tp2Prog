import useTarea from '../hooks/useTarea';

export default function FormularioNuevaTarea({ alAgregarTarea }) {
    const [datos, setDato] = useTarea();

    const enviarFormulario = (evento) => {
        evento.preventDefault();
        if (datos.descripcion.trim() === '') {
            alert("Por favor, escribe una descripción para la tarea.");
            return;
        }
        alAgregarTarea(datos);
        setDato('descripcion', '');
    }

    return(
        <div className='formulario-contenedor'>
            <form className='formulario' onSubmit={enviarFormulario}>
                <input 
                    type="text" 
                    placeholder="Descripción de la tarea" 
                    value={datos.descripcion}
                    onChange={(e) => setDato("descripcion", e.target.value)}
                />
                <label>Prioridad</label>
                <select 
                    value={datos.prioridad}
                    onChange={(e) => setDato("prioridad", e.target.value)}>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                </select>
                <label>Categoría</label>
                <select 
                    value={datos.categoria}
                    onChange={(e) => setDato("categoria", e.target.value)}>
                    <option value="Trabajo">Trabajo</option>
                    <option value="Hogar">Hogar</option>
                    <option value="Estudio">Estudio</option>
                    <option value="Personal">Personal</option>
                </select>
                <button type="submit">Agregar</button>
            </form>
        </div>
    );
}