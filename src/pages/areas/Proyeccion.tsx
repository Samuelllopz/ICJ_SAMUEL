import React from 'react';
import AreaSubNav from '../../components/AreaSubNav';

const Proyeccion: React.FC = () => {
  const responsabilidades = [
    { icon: '📺', title: 'Letras de Alabanza y Adoración', desc: 'Sincronización en tiempo real de letras, estrofas y coros en pantallas principales y de retorno.' },
    { icon: '📖', title: 'Citas Bíblicas y Puntos del Mensaje', desc: 'Presentación clara de versículos bíblicos y notas clave del pastor durante la prédica.' },
    { icon: '🎬', title: 'Videos, Anuncios y Bienvenida', desc: 'Lanzamiento puntual de videos promocionales, cuentas regresivas (countdown) e informativos.' },
    { icon: '💻', title: 'Software de Proyección (ProPresenter / EasyWorship)', desc: 'Organización de listas de reproducción, diapositivas y plantillas con tipografía legible.' },
  ];

  const equipos = [
    { icon: '🖥️', title: 'Pantallas Principales & Proyector', desc: 'Calibración de resolución, formato 16:9 y nitidez para el auditorio.' },
    { icon: '⏱️', title: 'Monitor de Retorno (Stage Display)', desc: 'Pantalla de apoyo para músicos, cantantes y predicador con reloj y siguiente estrofa.' },
    { icon: '⌨️', title: 'Controlador de Presentación', desc: 'Atajos de teclado y mando a distancia para cambios fluidos sin distracciones.' },
  ];

  return (
    <div className="page-wrapper">
      <AreaSubNav />
      <div className="page-hero">
        <div className="badge">Área de Multimedia</div>
        <h1>🖥️ <span>Proyección</span></h1>
        <p>Facilitamos la adoración y la comprensión del mensaje conectando a la congregación visualmente.</p>
      </div>

      <div className="container section">
        <h2 className="section-title">Responsabilidades del <span>Área de Proyección</span></h2>
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
          <h2 className="section-title">Sistemas y <span>Equipamiento</span></h2>
          <div className="accent-divider" />
          <div className="card-grid">
            {equipos.map((e, i) => (
              <div key={i} className="card">
                <div className="card-icon">{e.icon}</div>
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proyeccion;
