import React, { useState } from 'react';
import { useAuth, type UserRole } from '../context/AuthContext';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin, login, loginAs, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const ok = await login(username, password);
      if (ok) {
        setUsername('');
        setPassword('');
        onClose();
      } else {
        setErrorMsg('Credenciales incorrectas. Usa admin / icjadmin2026 para modificar o usuario / icj2026 para navegar.');
      }
    } catch {
      setErrorMsg('Error al conectar con el servicio de autenticación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    loginAs(role);
    onClose();
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          <div className="login-badge-header">
            <span className="login-icon">🔐</span>
            <div>
              <h3>Acceso al Sistema</h3>
              <p>Ministerio Multimedia • ICJ Santa Ana</p>
            </div>
          </div>
          <button type="button" className="login-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Estado actual de la sesión */}
        <div className="current-session-bar">
          <div>
            <span className="session-label">Modo activo:</span>
            <strong>{user?.name || 'Visitante'}</strong>
          </div>
          <span className={`role-pill ${isAdmin ? 'admin' : 'user'}`}>
            {isAdmin ? '⭐ Administrador (Modificar)' : '👤 Usuario Normal (Solo Navegar)'}
          </span>
        </div>

        {/* Botones de selección directa de perfil */}
        <div className="roles-explanation-box">
          <div className="role-exp-item">
            <strong>👤 Modo Usuario (Solo Navegar):</strong>
            <p>Navega libremente, consulta la programación, visualiza y descarga fotos de servicios, descarga repertorio de alabanzas.</p>
          </div>
          <div className="role-exp-item">
            <strong>⭐ Modo Administrador (Modificar):</strong>
            <p>Sube y gestiona fotos de servicios, sube o reemplaza archivos Excel de programación, agrega y modifica alabanzas.</p>
          </div>
        </div>

        {/* Botones rápidos de selección de los 2 logins */}
        <div className="quick-access-section">
          <span className="quick-divider-text">Elige tu modo de acceso directo</span>
          <div className="quick-buttons-row">
            <button
              type="button"
              className="btn-quick-role admin"
              onClick={() => handleQuickLogin('admin')}
            >
              ⭐ Entrar como Administrador (Modificar)
            </button>
            <button
              type="button"
              className="btn-quick-role user"
              onClick={() => handleQuickLogin('user')}
            >
              👤 Entrar como Usuario (Solo Navegar)
            </button>
          </div>
        </div>

        {/* Formulario opcional con credenciales o correo de Supabase */}
        <form onSubmit={handleSubmit} className="login-form">
          <div style={{ textAlign: 'center', margin: '14px 0 8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            O ingresa con usuario o correo:
          </div>

          {errorMsg && <div className="login-error-alert">{errorMsg}</div>}

          <div className="form-group">
            <label>Usuario o Correo</label>
            <input
              type="text"
              required
              placeholder="admin / usuario / correo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-actions">
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
              {isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>

        <div className="credentials-hint">
          <p><strong>Claves de acceso rápido:</strong></p>
          <p>• Administrador: <code>admin</code> / <code>icjadmin2026</code></p>
          <p>• Usuario Normal: <code>usuario</code> / <code>icj2026</code></p>
        </div>

        {isAdmin && (
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => { logout(); onClose(); }}
              className="btn-logout-link"
            >
              Cambiar a modo solo navegación
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
