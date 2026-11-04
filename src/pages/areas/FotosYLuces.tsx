import React from 'react';
import AreaSubNav from '../../components/AreaSubNav';

const FotosYLuces: React.FC = () => {
  const responsabilidades = [
    { icon: '📸', title: 'Fotografía de servicios', desc: 'Captura de imágenes de alta calidad durante los servicios y eventos especiales.' },
    { icon: '💡', title: 'Iluminación', desc: 'Configuración y control de luces para ambientar el templo adecuadamente.' },
    { icon: '🎨', title: 'Edición fotográfica', desc: 'Retoque y edición de fotos para publicación en redes y materiales.' },
    { icon: '📂', title: 'Archivo de imágenes', desc: 'Organización y almacenamiento del registro fotográfico del ministerio.' },
  ];

  return (
    <div className="page-wrapper">
      <AreaSubNav />
      <div className="page-hero">
        <div className="badge">Área de Multimedia</div>
        <h1>💡 <span>Fotos y Luces</span></h1>
        <p>Iluminamos el ambiente y capturamos los momentos más significativos de cada servicio.</p>
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
          <h2 className="section-title">Equipo de <span>Iluminación</span></h2>
          <div className="accent-divider" />
          <div className="card-grid">
            <div className="card">
              <div className="card-icon">🔦</div>
              <h3>Luces LED</h3>
              <p>Paneles LED ajustables para iluminación del escenario.</p>
            </div>
            <div className="card">
              <div className="card-icon">🎭</div>
              <h3>Luces de Color</h3>
              <p>Luces de ambiente para eventos especiales y adoración.</p>
            </div>
            <div className="card">
              <div className="card-icon">📷</div>
              <h3>Cámara Fotográfica</h3>
              <p>DSLR/Mirrorless de alta resolución para fotografía profesional.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FotosYLuces;
