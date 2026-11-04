import React from 'react';
import { Link } from 'react-router-dom';
import './Inicio.css';

const stats = [
  { value: '+5', label: 'Años de ministerio' },
  { value: '4', label: 'Áreas especializadas' },
  { value: '∞', label: 'Servicio a Dios' },
];

const quickLinks = [
  { to: '/encargados', icon: '👥', title: 'Encargados', desc: 'Conoce al equipo detrás del ministerio.' },
  { to: '/programacion', icon: '📅', title: 'Programación', desc: 'Revisa el calendario de actividades y turnos.' },
  { to: '/areas/camara', icon: '🎥', title: 'Áreas de Multimedia', desc: 'Cámara, Fotos y Luces, Transmisión y Proyección.' },
  { to: '/alabanzas', icon: '🎵', title: 'Alabanzas', desc: 'Banco de letras y notas para proyección.' },
  { to: '/galeria', icon: '🖼️', title: 'Galería de Fotos', desc: 'Carga y organiza paquetes de fotos por fecha.' },
  { to: '/consejos', icon: '💡', title: 'Consejos', desc: 'Tips técnicos y espirituales para el servicio.' },
];

const valores = [
  { icon: '✝️', titulo: 'Fe', desc: 'Todo lo que hacemos nace de nuestra profunda fe y agradecimiento a Dios.' },
  { icon: '🎯', titulo: 'Excelencia', desc: 'Cuidamos cada detalle técnico para ofrecer lo mejor al Señor en cada servicio.' },
  { icon: '🤝', titulo: 'Trabajo en equipo', desc: 'Músicos, técnicos y predicadores sincronizados en una sola visión.' },
  { icon: '📖', titulo: 'Integridad', desc: 'Servimos con humildad, orden y compromiso ministerial dentro y fuera del templo.' },
];

const Inicio: React.FC = () => {
  return (
    <div className="inicio-page">
      {/* 1. HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">Iglesia Cristiana Josué • Santa Ana</div>
          <h1>
            Ministerio de<br />
            <span>Multimedia</span>
          </h1>
          <p>
            Capturando momentos, transmitiendo fe. Conectamos la
            Palabra de Dios con la tecnología audiovisual para bendecir vidas local y globalmente.
          </p>
          <div className="hero-actions">
            <Link to="/encargados" className="btn-primary">Conocer el equipo</Link>
            <Link to="/areas/camara" className="btn-outline">Ver áreas</Link>
            <Link to="/galeria" className="btn-outline">Ver fotos</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-badge-big">🎬</div>
        </div>
      </section>

      {/* 2. STATS */}
      <section className="stats-bar">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* 3. QUICK LINKS / EXPLORACIÓN */}
      <section className="container section">
        <div className="badge">Navegación rápida</div>
        <h2 className="section-title">¿Qué deseas <span>explorar</span>?</h2>
        <p className="section-subtitle">Accede rápidamente a cada módulo del ministerio.</p>
        <div className="card-grid">
          {quickLinks.map(link => (
            <Link to={link.to} key={link.to} className="card quick-card">
              <div className="card-icon">{link.icon}</div>
              <h3>{link.title}</h3>
              <p>{link.desc}</p>
              <span className="card-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. SECCIÓN INTEGRADA: ACERCA DE LA IGLESIA CRISTIANA JOSUÉ Y EL MINISTERIO */}
      <section className="inicio-acerca-section">
        <div className="container">
          <div className="acerca-grid-layout">
            <div className="acerca-content-col">
              <div className="badge">Nuestra Identidad</div>
              <h2 className="section-title">
                Acerca de la <span>Iglesia Cristiana Josué</span>
              </h2>
              <div className="accent-divider" />
              <p className="acerca-paragraph">
                La <strong>Iglesia Cristiana Josué de Santa Ana</strong> es una congregación comprometida
                con la predicación del Evangelio de Jesucristo, la edificación de familias y el discipulado.
              </p>
              <p className="acerca-paragraph" style={{ marginTop: 14 }}>
                A través del <strong>Ministerio de Multimedia</strong>, unimos la pasión por servir a Dios
                con las herramientas tecnológicas modernas: transmisiones en vivo en alta definición,
                proyección dinámica de letras y escrituras, iluminación para ambientación de adoración y
                fotografía documental de cada evento sagrado.
              </p>

              {/* Caja de Visión */}
              <div className="inicio-vision-card">
                <span className="badge">Nuestra Visión</span>
                <h3>Tecnología al Servicio del Reino</h3>
                <p>
                  Ser un ministerio referente que capacite a las nuevas generaciones,
                  garantizando que ninguna barrera de distancia impida escuchar la voz de Dios.
                </p>
              </div>
            </div>

            <div className="acerca-visual-col">
              <div className="acerca-art-badge">
                <span className="art-icon">🏛️</span>
                <div className="art-label">
                  <strong>ICJ Santa Ana</strong>
                  <p>Adoración • Palabra • Comunidad</p>
                </div>
              </div>
            </div>
          </div>

          {/* Valores en Cards */}
          <div className="inicio-valores-container">
            <h3 className="section-title" style={{ fontSize: '1.4rem', textAlign: 'center' }}>
              Valores que Nos <span>Inspiran</span>
            </h3>
            <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: 24 }}>
              Principios que guían cada transmisión, toma y servicio dominical.
            </p>
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
      </section>
    </div>
  );
};

export default Inicio;
