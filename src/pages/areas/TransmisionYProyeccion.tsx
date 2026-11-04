import React from 'react';
import AreaSubNav from '../../components/AreaSubNav';

const TransmisionYProyeccion: React.FC = () => {
  const responsabilidades = [
    { icon: '📡', title: 'Transmisión en vivo', desc: 'Gestión de transmisiones en tiempo real a Facebook, YouTube y otras plataformas.' },
    { icon: '📺', title: 'Proyección', desc: 'Control del contenido proyectado durante los servicios (letras, anuncios, videos).' },
    { icon: '🔊', title: 'Streaming de audio', desc: 'Coordinación del audio para las transmisiones en línea.' },
    { icon: '💻', title: 'Software', desc: 'Manejo de OBS, ProPresenter y otras herramientas de transmisión.' },
  ];

  return (
    <div className="page-wrapper">
      <AreaSubNav />
      <div className="page-hero">
        <div className="badge">Área de Multimedia</div>
        <h1>📡 <span>Transmisión y Proyección</span></h1>
        <p>Llevamos el mensaje más allá de las paredes del templo, conectando con la congregación en línea.</p>
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
          <h2 className="section-title">Plataformas de <span>Transmisión</span></h2>
          <div className="accent-divider" />
          <div className="card-grid">
            <div className="card">
              <div className="card-icon">📘</div>
              <h3>Facebook Live</h3>
              <p>Transmisión en vivo a través de la página oficial del ministerio.</p>
            </div>
            <div className="card">
              <div className="card-icon">▶️</div>
              <h3>YouTube</h3>
              <p>Canal de YouTube para archivos y transmisiones en vivo.</p>
            </div>
            <div className="card">
              <div className="card-icon">🖥️</div>
              <h3>Proyector</h3>
              <p>Sistema de proyección para el interior del templo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransmisionYProyeccion;
