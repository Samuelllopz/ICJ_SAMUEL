import React from 'react';
import AreaSubNav from '../../components/AreaSubNav';

const Transmision: React.FC = () => {
  const responsabilidades = [
    { icon: '📡', title: 'Transmisión en Vivo (Streaming)', desc: 'Configuración, monitoreo y emisión en tiempo real hacia plataformas como Facebook Live y YouTube.' },
    { icon: '🎛️', title: 'Control de Software de Emisión', desc: 'Manejo de OBS Studio, vMix o switcher digital, transiciones de escenas y títulos dinámicos.' },
    { icon: '🔊', title: 'Monitoreo de Audio de Transmisión', desc: 'Asegurar que la mezcla enviada a internet sea clara, balanceada y sin distorsión o eco.' },
    { icon: '💾', title: 'Grabación y Respaldo Digital', desc: 'Grabación local de alta fidelidad para archivo histórico, podcast y clips para redes sociales.' },
  ];

  const plataformas = [
    { icon: '📘', title: 'Facebook Live', desc: 'Transmisión para la comunidad conectada a través de la página oficial del ministerio.' },
    { icon: '▶️', title: 'YouTube Streaming', desc: 'Transmisión en alta definición (1080p/60fps) y repositorio de mensajes dominicales.' },
    { icon: '☁️', title: 'Servidor RTMP / Backup', desc: 'Servidor de contingencia con conexión LTE de respaldo para evitar cortes imprevistos.' },
  ];

  return (
    <div className="page-wrapper">
      <AreaSubNav />
      <div className="page-hero">
        <div className="badge">Área de Multimedia</div>
        <h1>📡 <span>Transmisión</span></h1>
        <p>Llevamos el mensaje del evangelio más allá de las fronteras físicas a través del streaming digital en vivo.</p>
      </div>

      <div className="container section">
        <h2 className="section-title">Responsabilidades del <span>Área de Transmisión</span></h2>
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
          <h2 className="section-title">Plataformas y <span>Flujo de Trabajo</span></h2>
          <div className="accent-divider" />
          <div className="card-grid">
            {plataformas.map((p, i) => (
              <div key={i} className="card">
                <div className="card-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transmision;
