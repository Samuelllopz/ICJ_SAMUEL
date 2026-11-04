import React from 'react';
import AreaSubNav from '../../components/AreaSubNav';

const Camara: React.FC = () => {
  const responsabilidades = [
    { icon: '🎥', title: 'Captura de video', desc: 'Grabación de todos los servicios y eventos especiales con equipos profesionales.' },
    { icon: '🔄', title: 'Ángulos y planos', desc: 'Manejo de diferentes tipos de planos para enriquecer la experiencia visual.' },
    { icon: '🎞️', title: 'Edición de video', desc: 'Post-producción de los videos para redes sociales y archivos.' },
    { icon: '🧹', title: 'Mantenimiento', desc: 'Cuidado y limpieza del equipo de cámara.' },
  ];

  return (
    <div className="page-wrapper">
      <AreaSubNav />
      <div className="page-hero">
        <div className="badge">Área de Multimedia</div>
        <h1>📷 <span>Cámara</span></h1>
        <p>El área de cámara se encarga de capturar cada momento de los servicios con calidad y dedicación.</p>
      </div>

      <div className="container section">
        <h2 className="section-title">Responsabilidades del <span>Área</span></h2>
        <div className="accent-divider" />
        <div className="card-grid">
          {responsabilidades.map((r, i) => (
            <div key={i} className="card">
              <div className="card-icon">{r.icon}</div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 60 }}>
          <h2 className="section-title">Equipo <span>Disponible</span></h2>
          <div className="accent-divider" />
          <div className="card-grid">
            <div className="card">
              <div className="card-icon">📹</div>
              <h3>Cámara Principal</h3>
              <p>Cámara de video HD para captura principal del servicio.</p>
            </div>
            <div className="card">
              <div className="card-icon">🎦</div>
              <h3>Cámara Secundaria</h3>
              <p>Cámara de apoyo para tomas complementarias.</p>
            </div>
            <div className="card">
              <div className="card-icon">🔭</div>
              <h3>Trípode Profesional</h3>
              <p>Soporte estable para captura fluida y profesional.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camara;
