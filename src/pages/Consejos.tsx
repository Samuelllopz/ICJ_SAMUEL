import React from 'react';

const consejos = [
  {
    categoria: 'Cámara',
    icon: '📷',
    items: [
      'Llega 30 minutos antes para verificar el equipo.',
      'Mantén la cámara estable; usa el trípode siempre que sea posible.',
      'Verifica el balance de blancos antes de grabar.',
      'Nunca apuntes la cámara directamente a las luces de escenario.',
    ],
  },
  {
    categoria: 'Transmisión',
    icon: '📡',
    items: [
      'Revisa la conexión a internet antes del servicio.',
      'Ten un plan B: grabación local en caso de falla de streaming.',
      'Monitorea la calidad del stream en un dispositivo secundario.',
      'Coordina con el sonidista para el nivel de audio del stream.',
    ],
  },
  {
    categoria: 'Fotografía',
    icon: '📸',
    items: [
      'Usa modo continuo para momentos dinámicos de adoración.',
      'La luz natural de las ventanas puede ser tu mejor aliada.',
      'Prefiere ISO bajo para evitar ruido en las fotos.',
      'Edita siempre las fotos antes de publicarlas.',
    ],
  },
  {
    categoria: 'Iluminación',
    icon: '💡',
    items: [
      'Configura las luces durante el ensayo, no en el servicio.',
      'Evita contraluz fuerte detrás del predicador.',
      'La temperatura de color debe ser consistente con la cámara.',
      'Ten repuestos de focos importantes siempre disponibles.',
    ],
  },
  {
    categoria: 'General',
    icon: '🛠️',
    items: [
      'Lleva un kit de herramientas básicas (cables, adaptadores, baterías).',
      'Documenta cualquier falla de equipo para reportarla.',
      'El servicio al Señor requiere excelencia y preparación.',
      'Ora antes de cada servicio; el trabajo multimedia es ministerio.',
    ],
  },
];

const Consejos: React.FC = () => {
  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="badge">Tips & Buenas Prácticas</div>
        <h1>Consejos de <span>Multimedia</span></h1>
        <p>Recomendaciones prácticas para servir con excelencia en cada área del ministerio.</p>
      </div>

      <div className="container section">
        <div className="accent-divider" />
        <div className="card-grid">
          {consejos.map((cat, i) => (
            <div key={i} className="card">
              <div className="card-icon">{cat.icon}</div>
              <div className="badge">{cat.categoria}</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                {cat.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Consejos;
