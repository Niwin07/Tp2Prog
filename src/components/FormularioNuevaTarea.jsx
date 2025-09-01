import { useState } from 'react';
import { useLocation } from 'wouter';
import useTarea from '../hooks/useTarea';

export default function FormularioNuevaTarea({ alAgregarTarea }) {
    const [datos, setDato] = useTarea();
    const [loading, setLoading] = useState(false);
    const [, setLocation] = useLocation();

    const enviarFormulario = async (evento) => {
        evento.preventDefault();
        if (datos.descripcion.trim() === '') {
            alert("Por favor, escribe una descripción para la tarea.");
            return;
        }

        setLoading(true);
        try {
            const exito = await alAgregarTarea(datos);
            if (exito) {
                setDato('descripcion', '');
                alert('Tarea agregada exitosamente');
                // Opcional: redirigir a la lista después de agregar
                // setLocation('/lista-tareas');
            } else {
                alert('Error al agregar la tarea. Intenta nuevamente.');
            }
        } catch (error) {
            alert('Error al agregar la tarea. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className='formulario-contenedor'>
            <form className='formulario' onSubmit={enviarFormulario}>
                <input 
                    type="text" 
                    placeholder="Descripción de la tarea" 
                    value={datos.descripcion}
                    onChange={(e) => setDato("descripcion", e.target.value)}
                    disabled={loading}
                />
                <label>Prioridad</label>
                <select 
                    value={datos.prioridad}
                    onChange={(e) => setDato("prioridad", e.target.value)}
                    disabled={loading}>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                </select>
                <label>Categoría</label>
                <select 
                    value={datos.categoria}
                    onChange={(e) => setDato("categoria", e.target.value)}
                    disabled={loading}>
                    <option value="Trabajo">Trabajo</option>
                    <option value="Hogar">Hogar</option>
                    <option value="Estudio">Estudio</option>
                    <option value="Personal">Personal</option>
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : 'Agregar'}
                </button>
            </form>
        </div>
    );
}