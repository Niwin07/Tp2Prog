export default function Filtros({ setCategoriaActiva, categoriaActiva }) {
  const categorias = ["Todas", "Trabajo", "Hogar", "Estudio", "Personal"];

  return (
    <div className="filtros-contenedor">
      <h3>Filtros</h3>
      <div className="filtros-botones">
        {categorias.map(categoria => (
          <button
            key={categoria}
            className={categoria === categoriaActiva ? 'activo' : ''}
            onClick={() => setCategoriaActiva(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>
    </div>
  );
}