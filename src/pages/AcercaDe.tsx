import React from 'react';
import './AcercaDe.css';

const valores = [
  { icon: '✝️', titulo: 'Fe', desc: 'Todo lo que hacemos nace de nuestra fe en Dios.' },
  { icon: '🎯', titulo: 'Excelencia', desc: 'Servimos con lo mejor de nuestras capacidades.' },
  { icon: '🤝', titulo: 'Trabajo en equipo', desc: 'Juntos logramos más para el reino de Dios.' },
  { icon: '📖', titulo: 'Integridad', desc: 'Honramos a Dios en cada aspecto de nuestro servicio.' },
];

const AcercaDe: React.FC = () => {
  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="badge">Nuestra historia</div>
        <h1>Acerca del <span>Ministerio</span></h1>
        <p>Conoce quiénes somos, nuestra misión y los valores que nos guían.</p>
      </div>

      <div className="container section">
        {/* Misión */}
        <div className="acerca-section">
          <div className="acerca-text">
            <div className="badge">Misión</div>
            <h2 className="section-title">¿Quiénes <span>somos</span>?</h2>
            <div className="accent-divider" />
            <p>
              El Ministerio de Multimedia de la Iglesia Cristiana Josué (ICJ) de Santa Ana
              es un equipo de servidores comprometidos con llevar la Palabra de Dios a través
              de la tecnología audiovisual.
            </p>
            <p style={{ marginTop: 16 }}>
              Nacimos con la visión de que ninguna frontera física limite el mensaje del Evangelio.
              A través de transmisiones en vivo, fotografía y proyección, conectamos a la congregación
              local y a creyentes alrededor del mundo.
            </p>
          </div>
          <div className="acerca-visual">
            <div className="about-badge">🎬</div>
          </div>
        </div>

        {/* Visión */}
        <div className="vision-box">
          <div className="badge">Visión</div>
          <h3>Nuestra <span style={{ color: 'var(--accent)' }}>Visión</span></h3>
          <p>
            Ser un ministerio de referencia en el uso de la tecnología al servicio de la iglesia,
            formando siervos capacitados que impacten su generación a través de los medios de comunicación.
          </p>
        </div>

        {/* Valores */}
        <div style={{ marginTop: 60 }}>
          <h2 className="section-title">Nuestros <span>Valores</span></h2>
          <p className="section-subtitle">Los principios que guían cada decisión y servicio.</p>
          <div className="card-grid">
            {valores.map((v, i) => (
              <div key={i} className="card">
                <div className="card-icon">{v.icon}</div>
                <h3>{v.titulo}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcercaDe;
