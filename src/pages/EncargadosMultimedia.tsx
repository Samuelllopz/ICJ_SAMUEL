import React, { useState, useEffect, useRef } from 'react';
import './EncargadosMultimedia.css';

interface AreaDetalle {
  nombre: string;
  icono: string;
  rolEnArea: string;
  descripcion: string;
  destacada?: boolean;
}

interface Encargado {
  id: string;
  nombre: string;
  rol: string;
  area: string;
  icon: string;
  avatar: string; // Iniciales de respaldo
  fotoDefault: string; // URL de fotografía
  descripcion: string;
  // Datos personales y de servicio
  cumpleanos: string;
  profesion: string;
  hobbies: string[];
  telefono: string;
  correo: string;
  disponibilidad: string;
  tiempoEnMinisterio: string;
  areasDondeSirve: AreaDetalle[];
  herramientas: string[];
  versiculoFavorito: string;
  frase: string;
}

const encargadosIniciales: Encargado[] = [
  {
    id: 'josue-castillo',
    nombre: 'Josue Castillo',
    rol: 'Coordinador General & Director Técnico',
    area: 'Dirección General',
    icon: '🎬',
    avatar: 'JC',
    fotoDefault: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    descripcion: 'Lidera y supervisa todas las ramas del ministerio audiovisual, coordinando pautas de transmisión, asignación de equipos y enlace pastoral.',
    cumpleanos: '14 de Julio',
    profesion: 'Ingeniero en Telecomunicaciones & Medios Digitales',
    hobbies: ['Producción de video', 'Ajedrez', 'Guitarra acústica', 'Senderismo'],
    telefono: '+503 7000-1122',
    correo: 'josue.castillo@icjsantaana.org',
    disponibilidad: 'Domingos cultos 7:00 AM y 10:00 AM · Miércoles de Oración 6:30 PM',
    tiempoEnMinisterio: '5 años y 4 meses',
    areasDondeSirve: [
      {
        nombre: 'Dirección de Culto',
        icono: '🎬',
        rolEnArea: 'Director de Pauta',
        descripcion: 'Coordina los tiempos entre alabanza, predicación, avisos y enlaces de transmisión en tiempo real.',
        destacada: true
      },
      {
        nombre: 'Transmisión en Vivo',
        icono: '📡',
        rolEnArea: 'Supervisor de Streaming',
        descripcion: 'Asegura estabilidad del bitrate, sincronía audio/video y calidad 1080p en YouTube y Facebook.'
      },
      {
        nombre: 'Operación de Cámaras',
        icono: '🎥',
        rolEnArea: 'Planos y Dirección',
        descripcion: 'Diseño de tiros de cámara en plataforma, planos cerrados del predicador y planos abiertos de adoración.'
      },
      {
        nombre: 'Capacitación del Equipo',
        icono: '🎓',
        rolEnArea: 'Instructor',
        descripcion: 'Formación continua de nuevos servidores en software, etiqueta ministerial y técnicas audiovisuales.'
      }
    ],
    herramientas: ['OBS Studio', 'ATEM Mini Pro', 'vMix', 'Sony Alpha FX3', 'Consola Behringer X32', 'ProPresenter 7'],
    versiculoFavorito: 'Colosenses 3:23-24 — "Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres; sabiendo que del Señor recibiréis la recompensa."',
    frase: 'La excelencia no es perfección ni vanagloria, es ofrecerle a Dios el fruto más esmerado de nuestros dones.'
  },
  {
    id: 'carla-roman',
    nombre: 'Carla Roman',
    rol: 'Encargada de Proyección y Contenido Visual',
    area: 'Proyección',
    icon: '📽️',
    avatar: 'CR',
    fotoDefault: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    descripcion: 'Gestiona la pantalla principal y monitores de confianza, proyectando letras de alabanzas, citas bíblicas, videos temáticos y anuncios.',
    cumpleanos: '28 de Noviembre',
    profesion: 'Licenciada en Diseño Gráfico & Publicidad',
    hobbies: ['Lettering bíblico', 'Diseño tipográfico', 'Fotografía botánica', 'Repostería'],
    telefono: '+503 7111-2233',
    correo: 'carla.roman@icjsantaana.org',
    disponibilidad: 'Domingos ambos cultos matutinos · Sábados Culto de Jóvenes',
    tiempoEnMinisterio: '3 años y 8 meses',
    areasDondeSirve: [
      {
        nombre: 'Proyección en Sala',
        icono: '📽️',
        rolEnArea: 'Operadora Principal',
        descripcion: 'Lanzamiento oportuno de letras, fondos dinámicos y pasajes bíblicos durante la alabanza y mensaje.',
        destacada: true
      },
      {
        nombre: 'Repertorio de Alabanzas',
        icono: '🎵',
        rolEnArea: 'Curadora de Letras',
        descripcion: 'Verificación lírica, ortografía, formato ProPresenter y organización de repertorios por servicio.'
      },
      {
        nombre: 'Diseño de Afiches y Diapositivas',
        icono: '🎨',
        rolEnArea: 'Diseñadora de Pantalla',
        descripcion: 'Creación de placas de bienvenida, ofrendas, eventos especiales y banners del culto.'
      },
      {
        nombre: 'Monitores de Confianza',
        icono: '📺',
        rolEnArea: 'Stage Display Lead',
        descripcion: 'Configuración de monitores para pastores y coro con cronómetros, reloj y acordes.'
      }
    ],
    herramientas: ['ProPresenter 7', 'Photoshop', 'Canva Pro', 'PowerPoint Avanzado', 'Resolume Arena', 'Figma'],
    versiculoFavorito: 'Salmos 150:6 — "Todo lo que respira alabe al Señor. ¡Aleluya!"',
    frase: 'Cada palabra que proyectamos en la pantalla puede ser el versículo que transforme una vida rota.'
  },
  {
    id: 'billy-tobar',
    nombre: 'Billy Tobar',
    rol: 'Jefe de Cámaras y Fotografía Documental',
    area: 'Cámaras y Fotografía',
    icon: '📷',
    avatar: 'BT',
    fotoDefault: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    descripcion: 'Responsable de la cobertura fotográfica de cada servicio y evento, así como de la operación de cámaras cinematográficas en el santuario.',
    cumpleanos: '05 de Marzo',
    profesion: 'Fotógrafo Profesional & Realizador Audiovisual',
    hobbies: ['Astrofotografía', 'Ciclismo de montaña', 'Colección de lentes vintage', 'Música instrumental'],
    telefono: '+503 7222-3344',
    correo: 'billy.tobar@icjsantaana.org',
    disponibilidad: 'Domingos cultos completos · Bautismos, vigilias y aniversarios',
    tiempoEnMinisterio: '4 años y 2 meses',
    areasDondeSirve: [
      {
        nombre: 'Fotografía de Servicios',
        icono: '📸',
        rolEnArea: 'Fotógrafo Principal',
        descripcion: 'Captura momentos de adoración, entrega en el altar, bautismos y la congregación unida.',
        destacada: true
      },
      {
        nombre: 'Cámara Principal en Vivo',
        icono: '🎥',
        rolEnArea: 'Camarógrafo A',
        descripcion: 'Operador de cámara central sobre trípode fluido con lentes telefoto de largo alcance.'
      },
      {
        nombre: 'Galería y Edición',
        icono: '🖼️',
        rolEnArea: 'Revelado Digital',
        descripcion: 'Selección, compresión por lotes, corrección de color y publicación en el portal multimedia.'
      },
      {
        nombre: 'Mantenimiento Óptico',
        icono: '🔧',
        rolEnArea: 'Cuidado de Equipos',
        descripcion: 'Calibración de lentes, limpieza de sensores y gestión del inventario de cámaras y estabilizadores.'
      }
    ],
    herramientas: ['Canon EOS R6', 'Sony A7 IV', 'Adobe Lightroom', 'Gimbal DJI Ronin', 'Lentes 24-70mm f/2.8 & 70-200mm'],
    versiculoFavorito: 'Eclesiastés 9:10a — "Todo lo que te viniere a la mano para hacer, hazlo según tus fuerzas."',
    frase: 'La fotografía no es un clic mecánico; es saber congelar un instante donde el Espíritu Santo tocó un corazón.'
  },
  {
    id: 'cesar-martinez',
    nombre: 'Cesar Martinez',
    rol: 'Técnico Especialista en Transmisión y Redes',
    area: 'Transmisión & Iluminación',
    icon: '📡',
    avatar: 'CM',
    fotoDefault: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    descripcion: 'Controla el flujo de emisión digital hacia internet, balanceo de red, codificación de video en vivo y control de iluminación del escenario.',
    cumpleanos: '22 de Septiembre',
    profesion: 'Especialista en Infraestructura TI & Redes',
    hobbies: ['Domótica', 'Robótica educativa', 'Acústica de salas', 'Lectura teológica'],
    telefono: '+503 7333-4455',
    correo: 'cesar.martinez@icjsantaana.org',
    disponibilidad: 'Domingos mañana y tarde · Miércoles y ensayos técnicos',
    tiempoEnMinisterio: '2 años y 9 meses',
    areasDondeSirve: [
      {
        nombre: 'Transmisión en Redes',
        icono: '📡',
        rolEnArea: 'Operador de Streaming',
        descripcion: 'Gestión de streams redundantes para evitar caídas durante cortes momentáneos de internet.',
        destacada: true
      },
      {
        nombre: 'Iluminación Escénica',
        icono: '💡',
        rolEnArea: 'Técnico DMX',
        descripcion: 'Control de escenas de luces para balance de blancos adecuado en video y ambientación del culto.'
      },
      {
        nombre: 'Audio para Streaming',
        icono: '🎧',
        rolEnArea: 'Mezcla Auxiliar',
        descripcion: 'Ajuste de matriz y compresión de audio dedicado exclusivamente a los oyentes de internet.'
      },
      {
        nombre: 'Grabación y Respaldo',
        icono: '💾',
        rolEnArea: 'Archivista Digital',
        descripcion: 'Grabación multipista de sermones y respaldo de servicios completos en la nube.'
      }
    ],
    herramientas: ['OBS Studio Multi-RTMP', 'Consolas DMX 512', 'Software QLC+', 'Switches Gigabit gestionados', 'Tarjetas Blackmagic DeckLink'],
    versiculoFavorito: 'Marcos 16:15 — "Y les dijo: Id por todo el mundo y predicad el evangelio a toda criatura."',
    frase: 'Detrás de cada cable y cada megabit hay personas orando en sus hogares al otro lado de la pantalla.'
  }
];

const LOCAL_STORAGE_PHOTOS_KEY = 'icj-encargados-custom-photos-v1';

const EncargadosMultimedia: React.FC = () => {
  const [encargados, setEncargados] = useState<Encargado[]>(encargadosIniciales);
  const [seleccionado, setSeleccionado] = useState<Encargado | null>(null);
  const [pestanaModal, setPestanaModal] = useState<'areas' | 'personal' | 'herramientas' | 'contacto'>('areas');
  const [imagenFallo, setImagenFallo] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [encargadoParaFoto, setEncargadoParaFoto] = useState<string | null>(null);

  // Cargar fotos personalizadas desde localStorage
  useEffect(() => {
    try {
      const guardadas = localStorage.getItem(LOCAL_STORAGE_PHOTOS_KEY);
      if (guardadas) {
        const mapaFotos: Record<string, string> = JSON.parse(guardadas);
        setEncargados(prev =>
          prev.map(enc => (mapaFotos[enc.id] ? { ...enc, fotoDefault: mapaFotos[enc.id] } : enc))
        );
      }
    } catch {
      // fallback silencioso
    }
  }, []);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSeleccionado(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Manejo de cambio de foto personalizada
  const handleCambiarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && encargadoParaFoto) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = ev => {
        const base64 = ev.target?.result as string;
        if (base64) {
          setEncargados(prev =>
            prev.map(item => (item.id === encargadoParaFoto ? { ...item, fotoDefault: base64 } : item))
          );
          if (seleccionado && seleccionado.id === encargadoParaFoto) {
            setSeleccionado(prev => (prev ? { ...prev, fotoDefault: base64 } : null));
          }
          // Guardar en localStorage
          try {
            const guardadas = localStorage.getItem(LOCAL_STORAGE_PHOTOS_KEY);
            const mapa: Record<string, string> = guardadas ? JSON.parse(guardadas) : {};
            mapa[encargadoParaFoto] = base64;
            localStorage.setItem(LOCAL_STORAGE_PHOTOS_KEY, JSON.stringify(mapa));
          } catch (err) {
            console.warn('No se pudo guardar la foto en almacenamiento local:', err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const abrirSelectorFoto = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEncargadoParaFoto(id);
    fileInputRef.current?.click();
  };

  const abrirModal = (enc: Encargado) => {
    setSeleccionado(enc);
    setPestanaModal('areas');
  };

  return (
    <div className="page-wrapper">
      {/* Input invisible para cambio de foto */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCambiarFoto}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div className="page-hero">
        <div className="badge">Equipo Ministerial</div>
        <h1>Encargados de <span>Multimedia</span></h1>
        <p>
          Conoce a los siervos que hacen posible cada transmisión, fotografía, proyección e iluminación en la
          <strong> Iglesia Cristiana Josué de Santa Ana</strong>.
        </p>
      </div>

      <div className="container section">
        <div className="encargados-intro-banner">
          <div className="intro-badge">🤝 Nuestro Equipo de Servicio</div>
          <p>
            Cada tarjeta contiene la información general y un botón para abrir su <strong>ficha flotante completa</strong> con sus áreas de apoyo en la iglesia, datos personales, horarios de servicio y canales de contacto directo.
          </p>
        </div>

        <div className="card-grid enc-grid">
          {encargados.map(enc => {
            const tieneError = imagenFallo[enc.id];
            return (
              <div key={enc.id} className="card enc-card" onClick={() => abrirModal(enc)}>
                {/* Contenedor de Fotografía con Halo */}
                <div className="enc-foto-wrapper">
                  {!tieneError ? (
                    <img
                      src={enc.fotoDefault}
                      alt={enc.nombre}
                      className="enc-foto-img"
                      loading="lazy"
                      onError={() => setImagenFallo(prev => ({ ...prev, [enc.id]: true }))}
                    />
                  ) : (
                    <div className="enc-avatar-fallback">{enc.avatar}</div>
                  )}

                  <button
                    type="button"
                    className="enc-foto-edit-mini"
                    title="Actualizar foto de esta persona"
                    onClick={(e) => abrirSelectorFoto(enc.id, e)}
                  >
                    📷
                  </button>
                </div>

                <div className="badge enc-area-badge">
                  <span>{enc.icon}</span> {enc.area}
                </div>

                <h3 className="enc-nombre">{enc.nombre}</h3>
                <p className="enc-rol">{enc.rol}</p>
                <p className="enc-desc">{enc.descripcion}</p>

                {/* Resumen de áreas clave */}
                <div className="enc-areas-mini-list">
                  <span className="mini-list-title">Áreas de apoyo:</span>
                  <div className="enc-areas-chips">
                    {enc.areasDondeSirve.slice(0, 3).map((a, idx) => (
                      <span key={idx} className="enc-chip">
                        {a.icono} {a.nombre}
                      </span>
                    ))}
                    {enc.areasDondeSirve.length > 3 && (
                      <span className="enc-chip enc-chip-more">
                        +{enc.areasDondeSirve.length - 3} más
                      </span>
                    )}
                  </div>
                </div>

                {/* Botón flotante para abrir la ventana con info completa */}
                <button
                  type="button"
                  className="btn-ver-perfil"
                  onClick={(e) => {
                    e.stopPropagation();
                    abrirModal(enc);
                  }}
                >
                  <span>👤</span> Ver Perfil & Áreas de Servicio →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* VENTANA FLOTANTE / MODAL DE INFORMACIÓN PERSONAL Y ÁREAS  */}
      {/* ======================================================== */}
      {seleccionado && (
        <div className="perfil-overlay" onClick={() => setSeleccionado(null)}>
          <div className="perfil-modal" onClick={e => e.stopPropagation()}>
            {/* Botón cerrar */}
            <button
              type="button"
              className="perfil-close"
              onClick={() => setSeleccionado(null)}
              title="Cerrar ventana"
            >
              ✕
            </button>

            {/* Encabezado con Foto y Datos Principales */}
            <div className="perfil-header">
              <div className="perfil-foto-container">
                {!imagenFallo[seleccionado.id] ? (
                  <img
                    src={seleccionado.fotoDefault}
                    alt={seleccionado.nombre}
                    className="perfil-foto-lg"
                    onError={() => setImagenFallo(prev => ({ ...prev, [seleccionado.id]: true }))}
                  />
                ) : (
                  <div className="perfil-avatar-fallback">{seleccionado.avatar}</div>
                )}
                <button
                  type="button"
                  className="btn-cambiar-foto-modal"
                  onClick={() => abrirSelectorFoto(seleccionado.id)}
                  title="Subir fotografía personalizada"
                >
                  📷 Cambiar Foto
                </button>
              </div>

              <div className="perfil-header-info">
                <div className="badge">{seleccionado.icon} {seleccionado.area}</div>
                <h2 className="perfil-nombre">{seleccionado.nombre}</h2>
                <p className="perfil-rol-destacado">{seleccionado.rol}</p>
                <div className="perfil-meta-pills">
                  <span>⏱️ <strong>{seleccionado.tiempoEnMinisterio}</strong> sirviendo</span>
                  <span>📍 ICJ Santa Ana</span>
                </div>
              </div>
            </div>

            {/* Navegación por Pestañas dentro del Modal */}
            <div className="perfil-tabs">
              <button
                type="button"
                className={`perfil-tab-btn ${pestanaModal === 'areas' ? 'active' : ''}`}
                onClick={() => setPestanaModal('areas')}
              >
                🗂️ Áreas de Servicio ({seleccionado.areasDondeSirve.length})
              </button>
              <button
                type="button"
                className={`perfil-tab-btn ${pestanaModal === 'personal' ? 'active' : ''}`}
                onClick={() => setPestanaModal('personal')}
              >
                👤 Datos Personales
              </button>
              <button
                type="button"
                className={`perfil-tab-btn ${pestanaModal === 'herramientas' ? 'active' : ''}`}
                onClick={() => setPestanaModal('herramientas')}
              >
                ⚙️ Equipos & Herramientas
              </button>
              <button
                type="button"
                className={`perfil-tab-btn ${pestanaModal === 'contacto' ? 'active' : ''}`}
                onClick={() => setPestanaModal('contacto')}
              >
                📬 Contacto Directo
              </button>
            </div>

            {/* Contenido según la pestaña activa */}
            <div className="perfil-body">
              {/* PESTAÑA 1: ÁREAS DONDE SIRVE */}
              {pestanaModal === 'areas' && (
                <div className="tab-content fade-in">
                  <div className="section-intro-text">
                    <h4>Funciones y responsabilidades en el ministerio:</h4>
                    <p>Conoce las diferentes labores y áreas donde apoya activamente en cada culto o evento:</p>
                  </div>

                  <div className="areas-grid-modal">
                    {seleccionado.areasDondeSirve.map((area, idx) => (
                      <div
                        key={idx}
                        className={`area-card-modal ${area.destacada ? 'destacada' : ''}`}
                      >
                        <div className="area-card-header">
                          <span className="area-card-icon">{area.icono}</span>
                          <div>
                            <h4 className="area-card-title">{area.nombre}</h4>
                            <span className="area-card-rol">{area.rolEnArea}</span>
                          </div>
                          {area.destacada && (
                            <span className="badge badge-destacada">Área Principal</span>
                          )}
                        </div>
                        <p className="area-card-desc">{area.descripcion}</p>
                      </div>
                    ))}
                  </div>

                  <div className="perfil-horarios-box">
                    <h4>📅 Horarios y Disponibilidad de Servicio:</h4>
                    <p>{seleccionado.disponibilidad}</p>
                  </div>
                </div>
              )}

              {/* PESTAÑA 2: DATOS PERSONALES */}
              {pestanaModal === 'personal' && (
                <div className="tab-content fade-in">
                  <div className="ficha-personal-grid">
                    <div className="ficha-item">
                      <span className="ficha-icon">🎂</span>
                      <div>
                        <span className="ficha-label">Fecha de Cumpleaños</span>
                        <strong className="ficha-val">{seleccionado.cumpleanos}</strong>
                      </div>
                    </div>

                    <div className="ficha-item">
                      <span className="ficha-icon">🎓</span>
                      <div>
                        <span className="ficha-label">Profesión / Vocación</span>
                        <strong className="ficha-val">{seleccionado.profesion}</strong>
                      </div>
                    </div>

                    <div className="ficha-item">
                      <span className="ficha-icon">⏱️</span>
                      <div>
                        <span className="ficha-label">Tiempo en el Ministerio</span>
                        <strong className="ficha-val">{seleccionado.tiempoEnMinisterio}</strong>
                      </div>
                    </div>

                    <div className="ficha-item">
                      <span className="ficha-icon">📍</span>
                      <div>
                        <span className="ficha-label">Sede de Servicio</span>
                        <strong className="ficha-val">Iglesia Cristiana Josué, Santa Ana</strong>
                      </div>
                    </div>
                  </div>

                  {/* Pasatiempos */}
                  <div className="perfil-hobbies-section">
                    <h4>🎨 Pasatiempos & Gustos Personales:</h4>
                    <div className="hobbies-chips">
                      {seleccionado.hobbies.map((hob, i) => (
                        <span key={i} className="hobby-chip">✨ {hob}</span>
                      ))}
                    </div>
                  </div>

                  {/* Versículo Favorito */}
                  <div className="perfil-versiculo-box">
                    <h4>📖 Versículo Lema:</h4>
                    <blockquote>"{seleccionado.versiculoFavorito}"</blockquote>
                  </div>

                  {/* Frase personal */}
                  <div className="perfil-frase-box">
                    <h4>💬 Reflexión sobre el Servicio:</h4>
                    <p>"{seleccionado.frase}"</p>
                  </div>
                </div>
              )}

              {/* PESTAÑA 3: EQUIPOS Y HERRAMIENTAS */}
              {pestanaModal === 'herramientas' && (
                <div className="tab-content fade-in">
                  <div className="section-intro-text">
                    <h4>Sistemas, software y hardware que domina:</h4>
                    <p>Tecnologías que utiliza en cabina, cámaras y plataforma para el desarrollo de cada transmisión:</p>
                  </div>

                  <div className="herramientas-tags-list">
                    {seleccionado.herramientas.map((h, idx) => (
                      <div key={idx} className="herramienta-card">
                        <span className="tool-icon">🛠️</span>
                        <span className="tool-name">{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="disponibilidad-summary-card">
                    <h4>🎯 Resumen de Compromiso Técnico:</h4>
                    <p>
                      Encargado del correcto funcionamiento, configuración previa al culto (Soundcheck / Streamcheck) y respuesta rápida ante cualquier eventualidad durante la transmisión en vivo.
                    </p>
                  </div>
                </div>
              )}

              {/* PESTAÑA 4: CONTACTO DIRECTO */}
              {pestanaModal === 'contacto' && (
                <div className="tab-content fade-in">
                  <div className="section-intro-text">
                    <h4>Comunícate con {seleccionado.nombre}:</h4>
                    <p>¿Tienes dudas sobre los turnos, archivos de alabanzas o fotos de los cultos? Puedes escribirle directamente:</p>
                  </div>

                  <div className="contacto-acciones-grid">
                    <a
                      href={`https://wa.me/${seleccionado.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${seleccionado.nombre}, te contacto desde la web del Ministerio Multimedia ICJ Santa Ana.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-contacto-modal whatsapp"
                    >
                      <span className="btn-icon">💬</span>
                      <div>
                        <strong>Escribir por WhatsApp</strong>
                        <span>{seleccionado.telefono}</span>
                      </div>
                    </a>

                    <a
                      href={`mailto:${seleccionado.correo}?subject=${encodeURIComponent('Consulta Ministerio Multimedia ICJ')}`}
                      className="btn-contacto-modal email"
                    >
                      <span className="btn-icon">✉️</span>
                      <div>
                        <strong>Enviar Correo Electrónico</strong>
                        <span>{seleccionado.correo}</span>
                      </div>
                    </a>
                  </div>

                  <div className="contacto-nota-box">
                    <span>📌 Nota:</span> La información de contacto es para fines ministeriales, coordinación del equipo de servidores y enlaces de actividades de la Iglesia Cristiana Josué.
                  </div>
                </div>
              )}
            </div>

            {/* Pie del modal */}
            <div className="perfil-footer">
              <span className="perfil-footer-text">Ministerio de Multimedia • ICJ Santa Ana</span>
              <button
                type="button"
                className="btn-cerrar-modal-bottom"
                onClick={() => setSeleccionado(null)}
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncargadosMultimedia;
