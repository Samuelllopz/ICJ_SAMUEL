import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { areasList } from './AreaSubNav';
import LoginModal from './LoginModal';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin } = useAuth();

  const [areasOpen, setAreasOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Cerrar el menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAreasOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNavClick = () => {
    setMenuOpen(false);
    setAreasOpen(false);
  };

  const handleOpenLogin = () => {
    handleNavClick();
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <button
            className="navbar-brand"
            onClick={() => { navigate('/'); handleNavClick(); }}
          >
            <span className="brand-icon">🎬</span>
            <span className="brand-text">
              ICJ <span className="brand-accent">Multimedia</span>
            </span>
          </button>

          {/* Enlaces de Navegación */}
          <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" end onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Inicio
            </NavLink>

            <NavLink to="/encargados" onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Encargados
            </NavLink>

            <NavLink to="/programacion" onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Programación
            </NavLink>

            {/* Áreas Dropdown */}
            <div className="nav-dropdown" ref={dropdownRef}>
              <button
                className={`nav-link dropdown-trigger ${areasOpen ? 'active' : ''}`}
                onClick={() => setAreasOpen(prev => !prev)}
                type="button"
              >
                Áreas Multimedia
                <span className={`chevron ${areasOpen ? 'up' : ''}`}>▾</span>
              </button>
              <div className={`dropdown-menu ${areasOpen ? 'show' : ''}`}>
                {areasList.map(area => (
                  <NavLink
                    key={area.to}
                    to={area.to}
                    onClick={handleNavClick}
                    className={({ isActive }) => isActive ? 'dropdown-item active' : 'dropdown-item'}
                  >
                    {area.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <NavLink to="/alabanzas" onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Alabanzas
            </NavLink>

            <NavLink to="/galeria" onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Galería
            </NavLink>

            <NavLink to="/consejos" onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Consejos
            </NavLink>

            <NavLink to="/recursos" onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Recursos
            </NavLink>

            <NavLink to="/contacto" onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Contacto
            </NavLink>

            <NavLink to="/acerca-de" onClick={handleNavClick} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Acerca de
            </NavLink>

            {/* Botón de Login o perfil de usuario dentro del menú */}
            <button
              type="button"
              className="nav-link login-btn"
              onClick={handleOpenLogin}
            >
              {isAdmin ? '⭐ Admin (Modificar)' : `👤 ${user?.name || 'Usuario'} (Navegar)`}
            </button>
          </nav>

          {/* Controles del lado derecho */}
          <div className="navbar-controls">
            {/* Pill de acceso rápido con indicador de rol */}
            <button
              type="button"
              className={`auth-btn-pill ${isAdmin ? 'admin' : 'user'}`}
              onClick={handleOpenLogin}
              title={`Sesión activa: ${user?.name || (isAdmin ? 'Administrador' : 'Usuario')}. Clic para cambiar modo.`}
            >
              <span className="auth-icon">{isAdmin ? '⭐' : '👤'}</span>
              <span className="auth-role-text">{isAdmin ? 'Admin' : 'Usuario'}</span>
            </button>

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              type="button"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
              <span className="theme-label">
                {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
            </button>

            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label="Menú principal"
              type="button"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Renderizado explícito pasando la propiedad isOpen requerida */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Navbar;