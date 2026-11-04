import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        {/* Columna 1: Información de la Iglesia */}
        <div className="footer-column footer-church-info">
          <div className="footer-brand">
            <span className="footer-brand-icon">🎬</span>
            <div className="footer-brand-text">
              <h3>Iglesia Cristiana Josué</h3>
              <p className="footer-subtitle">Ministerio de Multimedia • Santa Ana</p>
            </div>
          </div>
          <p className="footer-mission-desc">
            Al servicio de Dios para llevar el mensaje de esperanza a cada rincón,
            integrando cámaras, iluminación, transmisión digital y proyección con excelencia.
          </p>

          <div className="footer-contact-details">
            <div className="footer-contact-item">
              <span className="contact-icon">📍</span>
              <span>Santa Ana, El Salvador</span>
            </div>
            <div className="footer-contact-item">
              <span className="contact-icon">⏰</span>
              <div>
                <p><strong>Domingos:</strong> 7:00 AM, 9:00 AM y 11:00 AM</p>
                <p><strong>Martes:</strong> 7:30 PM (Oración)</p>
                <p><strong>Viernes:</strong> 6:15 PM (Culto de enseñanza)</p>
              </div>
            </div>
            <div className="footer-contact-item">
              <span className="contact-icon">🌐</span>
              <div className="footer-social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-pill">
                  Facebook
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-pill">
                  YouTube
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-pill">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Columna 2: Navegación General */}
        <div className="footer-column">
          <h4 className="footer-heading">Navegación</h4>
          <ul className="footer-links-list">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/encargados">Encargados de Multimedia</Link></li>
            <li><Link to="/programacion">Programación & Turnos</Link></li>
            <li><Link to="/alabanzas">Repertorio de Alabanzas</Link></li>
            <li><Link to="/galeria">Galería de Servicios</Link></li>
            <li><Link to="/acerca-de">Acerca de Nosotros</Link></li>
          </ul>
        </div>

        {/* Columna 3: Áreas de Multimedia */}
        <div className="footer-column">
          <h4 className="footer-heading">Áreas de Multimedia</h4>
          <ul className="footer-links-list">
            <li><Link to="/areas/camara">📷 Área de Cámara</Link></li>
            <li><Link to="/areas/fotos-y-luces">💡 Fotos y Luces</Link></li>
            <li><Link to="/areas/transmision">📡 Transmisión en Vivo</Link></li>
            <li><Link to="/areas/proyeccion">🖥️ Área de Proyección</Link></li>
          </ul>
        </div>

        {/* Columna 4: Recursos & Soporte */}
        <div className="footer-column">
          <h4 className="footer-heading">Recursos & Ayuda</h4>
          <ul className="footer-links-list">
            <li><Link to="/consejos">Consejos Técnicos & Tips</Link></li>
            <li><Link to="/recursos">Software & Plantillas</Link></li>
            <li><Link to="/contacto">Contacto con el Ministerio</Link></li>
            <li>
              <a
                href="https://acortar.link/L95EAY"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-external-link"
              >
                📋 Rol Oficial en Línea ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Franja de Copyright */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} Iglesia Cristiana Josué - Santa Ana. Ministerio de Multimedia.</p>
          <p className="footer-verse">"Todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres." — Colosenses 3:23</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
