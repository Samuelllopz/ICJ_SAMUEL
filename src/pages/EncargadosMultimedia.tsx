import React from 'react';

const encargados = [
  {
    nombre: 'Josue Castillo',
    rol: 'Coordinador de Culto',
    area: 'Dirección',
    icon: '🎬',
    descripcion: 'Responsable de coordinar todas las áreas del ministerio multimedia.',
  },
  {
    nombre: 'Carla Roman',
    rol: 'Coordinador de Culto',
    area: 'Dirección',
    icon: '🎬',
    descripcion: 'Responsable de coordinar todas las áreas del ministerio multimedia',
  },
  {
    nombre: 'Billy Tobar',
    rol: 'Coordinador de Culto',
    area: 'Dirección',
    icon: '🎬',
    descripcion: 'Responsable de coordinar todas las áreas del ministerio multimedia',
  },
  {
    nombre: 'Cesar Martinez',
    rol: 'Coordinador de Culto',
    area: 'Dirección',
    icon: '🎬',
    descripcion: 'Responsable de coordinar todas las áreas del ministerio multimedia',
  },

];

const EncargadosMultimedia: React.FC = () => {
  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="badge">Equipo</div>
        <h1>Encargados de <span>Multimedia</span></h1>
        <p>Conoce a los siervos que hacen posible cada transmisión, fotografía y proyección.</p>
      </div>

      <div className="container section">
        <div className="accent-divider" />
        <div className="card-grid">
          {encargados.map((enc, i) => (
            <div key={i} className="card">
              <div className="card-icon">{enc.icon}</div>
              <div className="badge">{enc.area}</div>
              <h3>{enc.nombre}</h3>
              <p style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: 8, fontSize: '0.9rem' }}>
                {enc.rol}
              </p>
              <p>{enc.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EncargadosMultimedia;
