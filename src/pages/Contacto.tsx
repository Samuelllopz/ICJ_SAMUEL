import React, { useState } from 'react';
import './Contacto.css';

const Contacto: React.FC = () => {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se conectaría con el backend o servicio de email
    setEnviado(true);
  };

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="badge">Comunícate</div>
        <h1>Contacto con el <span>Ministerio</span></h1>
        <p>¿Tienes preguntas, sugerencias o quieres unirte al equipo? Escríbenos.</p>
      </div>

      <div className="container section">
        <div className="contacto-grid">
          {/* Información */}
          <div className="contacto-info">
            <h2 className="section-title">¿Cómo <span>contactarnos</span>?</h2>
            <div className="accent-divider" />
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <strong>Ubicación</strong>
                <p>ICJ Santa Ana, Santa Ana, El Salvador</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📱</span>
              <div>
                <strong>Redes Sociales</strong>
                <p>@ICJSantaAna en Facebook e Instagram</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📅</span>
              <div>
                <strong>Servicios</strong>
                <p>Domingos 7:00 AM,9:00 AM y 11:00 AM</p>
                <p>Viernes 6:15 PM</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="contacto-form-wrapper">
            {enviado ? (
              <div className="empty-state">
                <div className="icon">✅</div>
                <h3>¡Mensaje enviado!</h3>
                <p>Nos pondremos en contacto contigo pronto.</p>
              </div>
            ) : (
              <form className="contacto-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Asunto</label>
                  <select name="asunto" value={form.asunto} onChange={handleChange} required>
                    <option value="">Selecciona un asunto</option>
                    <option value="union">Quiero unirme al ministerio</option>
                    <option value="sugerencia">Sugerencia</option>
                    <option value="pregunta">Pregunta general</option>
                    <option value="equipo">Sobre el equipo</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mensaje</label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none', fontSize: '1rem', padding: '14px' }}>
                  Enviar mensaje ✉️
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
