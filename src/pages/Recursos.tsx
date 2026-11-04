import React from 'react';

const recursos = [
  {
    categoria: 'Software',
    icon: '💻',
    items: [
      { nombre: 'OBS Studio', desc: 'Software libre para transmisión y grabación.', link: 'https://obsproject.com' },
      { nombre: 'ProPresenter', desc: 'Software de presentación para iglesias.', link: '#' },
      { nombre: 'DaVinci Resolve', desc: 'Editor de video profesional gratuito.', link: 'https://www.blackmagicdesign.com/products/davinciresolve' },
    ],
  },
  {
    categoria: 'Tutoriales',
    icon: '📚',
    items: [
      { nombre: 'Configurar OBS para streaming', desc: 'Guía básica de configuración para Facebook Live.', link: '#' },
      { nombre: 'Iluminación para video', desc: 'Conceptos básicos de iluminación en tres puntos.', link: '#' },
      { nombre: 'Fotografía de servicios', desc: 'Ajustes recomendados para fotografía en interiores.', link: '#' },
    ],
  },
  {
    categoria: 'Plantillas',
    icon: '📋',
    items: [
      { nombre: 'Hoja de turno semanal', desc: 'Planilla para organizar turnos del equipo.', link: '#' },
      { nombre: 'Checklist pre-servicio', desc: 'Lista de verificación antes de cada servicio.', link: '#' },
      { nombre: 'Reporte de equipo', desc: 'Formato para reportar daños o necesidades.', link: '#' },
    ],
  },
];

const Recursos: React.FC = () => {
  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="badge">Herramientas</div>
        <h1>Recursos del <span>Ministerio</span></h1>
        <p>Software, tutoriales y plantillas útiles para el equipo multimedia.</p>
      </div>

      <div className="container section">
        {recursos.map((cat, i) => (
          <div key={i} style={{ marginBottom: 60 }}>
            <h2 className="section-title">{cat.icon} {cat.categoria}</h2>
            <div className="accent-divider" />
            <div className="card-grid">
              {cat.items.map((item, j) => (
                <a
                  key={j}
                  href={item.link}
                  target={item.link !== '#' ? '_blank' : undefined}
                  rel="noreferrer"
                  className="card"
                  style={{ display: 'block' }}
                >
                  <h3 style={{ marginBottom: 8 }}>{item.nombre}</h3>
                  <p style={{ marginBottom: 12 }}>{item.desc}</p>
                  <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}>
                    {item.link !== '#' ? '↗ Visitar sitio' : '📥 Descargar'}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recursos;
