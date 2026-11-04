import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import './Alabanzas.css';

export interface Cancion {
  id: string | number;
  titulo: string;
  artista: string;
  tono: string;
  tiempo: string;
  categoria: 'Adoración' | 'Júbilo' | 'Especial';
  letra: string;
  esPersonalizada?: boolean;
}

const repertorioBase: Cancion[] = [
  {
    id: 'base-1',
    titulo: 'La Bondad de Dios',
    artista: 'Bethel Music / Jenn Johnson',
    tono: 'G (Sol Mayor)',
    tiempo: '68 BPM - 4/4',
    categoria: 'Adoración',
    letra: `[Verso 1]
Te amo, Dios
Tu misericordia nunca me falla
Todos mis días
He estado en Tus manos
Desde el momento en que despierto
Hasta que pongo mi cabeza a descansar
Cantaré de la bondad de Dios

[Coro]
Toda mi vida has sido fiel
Toda mi vida has sido tan, tan bueno
Con cada aliento que pueda respirar
Cantaré de la bondad de Dios

[Puente]
Tu bondad me sigue, me sigue a donde voy
Tu bondad me sigue, me sigue a donde voy
Con mi vida rindo honor, me entrego a Ti, Señor
Tu bondad me sigue, me sigue a donde voy`
  },
  {
    id: 'base-2',
    titulo: 'Grande y Fuerte',
    artista: 'Miel San Marcos',
    tono: 'Em (Mi Menor)',
    tiempo: '132 BPM - 4/4',
    categoria: 'Júbilo',
    letra: `[Intro]
Grande y fuerte es nuestro Dios
Grande y fuerte es nuestro Dios

[Verso]
Vestido en majestad
Coronado con poder
Digno de toda gloria
Grande y fuerte es nuestro Dios

[Coro]
Cantad al Señor un cántico nuevo
Porque ha hecho maravillas
Levantemos la voz con alegría
Grande y fuerte es nuestro Dios`
  },
  {
    id: 'base-3',
    titulo: 'Hermoso Nombre',
    artista: 'Hillsong Worship',
    tono: 'D (Re Mayor)',
    tiempo: '68 BPM - 4/4',
    categoria: 'Adoración',
    letra: `[Verso 1]
Tú fuiste el Verbo en el principio
Unigénito de Dios
El misterio de Tu gloria
Revelado en Su amor

[Coro]
Cuán hermoso Su nombre es
Cuán hermoso Su nombre es
El nombre de Jesús mi Rey
Cuán hermoso Su nombre es
Nada se iguala a Él
Cuán hermoso Su nombre es
El nombre de Jesús`
  }
];

const STORAGE_ALABANZAS_KEY = 'icj-alabanzas-repertorio';

const Alabanzas: React.FC = () => {
  const { isAdmin } = useAuth();
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [usandoSupabase, setUsandoSupabase] = useState(false);

  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');
  const [cancionSeleccionada, setCancionSeleccionada] = useState<Cancion | null>(null);
  const [copiado, setCopiado] = useState(false);

  // Modal para agregar nueva alabanza
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevaCancion, setNuevaCancion] = useState({
    titulo: '',
    artista: '',
    tono: 'G (Sol Mayor)',
    tiempo: '70 BPM - 4/4',
    categoria: 'Adoración' as 'Adoración' | 'Júbilo' | 'Especial',
    letra: ''
  });

  // Modal para MODIFICAR alabanza existente
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [cancionEnEdicion, setCancionEnEdicion] = useState<Cancion | null>(null);

  // Cargar canciones (primero Supabase, con fallback a localStorage)
  const cargarCanciones = async () => {
    setCargando(true);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('alabanzas')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapeadas: Cancion[] = data.map((item: any) => ({
            id: item.id,
            titulo: item.titulo,
            artista: item.artista || 'Autor Desconocido',
            tono: item.tono || 'G (Sol Mayor)',
            tiempo: item.tiempo || '4/4',
            categoria: item.categoria || 'Adoración',
            letra: item.letra,
            esPersonalizada: true
          }));

          setCanciones(mapeadas);
          setCancionSeleccionada(mapeadas[0]);
          setUsandoSupabase(true);
          setCargando(false);
          return;
        }
      } catch (err) {
        console.warn('Error conectando a Supabase, usando respaldo local:', err);
      }
    }

    // Fallback a LocalStorage o repertorioBase
    try {
      const saved = localStorage.getItem(STORAGE_ALABANZAS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCanciones(parsed);
          setCancionSeleccionada(parsed[0]);
          setCargando(false);
          return;
        }
      }
    } catch {
      // fallback
    }

    setCanciones(repertorioBase);
    setCancionSeleccionada(repertorioBase[0]);
    setCargando(false);
  };

  useEffect(() => {
    cargarCanciones();
  }, []);

  const cancionesFiltradas = canciones.filter(c => {
    const coincideTexto = c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                          c.artista.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCat = filtroCategoria === 'Todas' || c.categoria === filtroCategoria;
    return coincideTexto && coincideCat;
  });

  const copiarLetra = () => {
    if (!cancionSeleccionada) return;
    navigator.clipboard.writeText(cancionSeleccionada.letra);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Función para descargar en archivo .txt
  const descargarTxt = (cancion: Cancion) => {
    const contenido = `=====================================================
ALABANZA: ${cancion.titulo.toUpperCase()}
ARTISTA / AUTOR: ${cancion.artista}
CATEGORÍA: ${cancion.categoria}
TONO SUGERIDO: ${cancion.tono}
MÉTRICA / BPM: ${cancion.tiempo}
MINISTERIO DE MULTIMEDIA - ICJ SANTA ANA
=====================================================

${cancion.letra.trim()}
`;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = cancion.titulo.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, '_');
    link.href = url;
    link.download = `${safeTitle}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Descargar todo el repertorio en un solo archivo .txt
  const descargarRepertorioCompleto = () => {
    let contenido = `=====================================================
REPOSITORIO GENERAL DE ALABANZAS
MINISTERIO DE MULTIMEDIA & PROYECCIÓN - ICJ SANTA ANA
Total de temas: ${canciones.length}
=====================================================\n\n`;

    canciones.forEach((c, idx) => {
      contenido += `-----------------------------------------------------\n`;
      contenido += `#${idx + 1} - ${c.titulo.toUpperCase()} (${c.artista})\n`;
      contenido += `Categoría: ${c.categoria} | Tono: ${c.tono} | Tiempo: ${c.tiempo}\n`;
      contenido += `-----------------------------------------------------\n\n`;
      contenido += `${c.letra.trim()}\n\n\n`;
    });

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Repertorio_Alabanzas_ICJ_Santa_Ana.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGuardarNuevaCancion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaCancion.titulo.trim() || !nuevaCancion.letra.trim()) {
      alert('Por favor completa al menos el título y la letra de la canción.');
      return;
    }

    const payload = {
      titulo: nuevaCancion.titulo.trim(),
      artista: nuevaCancion.artista.trim() || 'Autor / Banda Local',
      tono: nuevaCancion.tono.trim() || 'C (Do Mayor)',
      tiempo: nuevaCancion.tiempo.trim() || '4/4',
      categoria: nuevaCancion.categoria,
      letra: nuevaCancion.letra.trim()
    };

    if (usandoSupabase) {
      try {
        const { data, error } = await supabase
          .from('alabanzas')
          .insert([payload])
          .select();

        if (error) {
          alert('Error al guardar en Supabase: ' + error.message);
          return;
        }

        if (data && data[0]) {
          const guardada: Cancion = {
            id: data[0].id,
            ...payload,
            esPersonalizada: true
          };
          const actualizado = [guardada, ...canciones];
          setCanciones(actualizado);
          setCancionSeleccionada(guardada);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // LocalStorage
      const localCancion: Cancion = {
        id: `local-${Date.now()}`,
        ...payload,
        esPersonalizada: true
      };
      const actualizado = [localCancion, ...canciones];
      setCanciones(actualizado);
      setCancionSeleccionada(localCancion);
      localStorage.setItem(STORAGE_ALABANZAS_KEY, JSON.stringify(actualizado));
    }

    setModalAbierto(false);
    setNuevaCancion({
      titulo: '',
      artista: '',
      tono: 'G (Sol Mayor)',
      tiempo: '70 BPM - 4/4',
      categoria: 'Adoración',
      letra: ''
    });
  };

  // Abrir modal de edición con los datos cargados
  const handleAbrirEditar = (cancion: Cancion) => {
    setCancionEnEdicion({ ...cancion });
    setModalEditarAbierto(true);
  };

  // Guardar los cambios de la edición
  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancionEnEdicion) return;

    if (!cancionEnEdicion.titulo.trim() || !cancionEnEdicion.letra.trim()) {
      alert('El título y la letra son obligatorios.');
      return;
    }

    const payload = {
      titulo: cancionEnEdicion.titulo.trim(),
      artista: cancionEnEdicion.artista.trim() || 'Autor / Banda Local',
      tono: cancionEnEdicion.tono.trim() || 'C (Do Mayor)',
      tiempo: cancionEnEdicion.tiempo.trim() || '4/4',
      categoria: cancionEnEdicion.categoria,
      letra: cancionEnEdicion.letra.trim()
    };

    if (usandoSupabase && typeof cancionEnEdicion.id === 'string' && !cancionEnEdicion.id.startsWith('base-')) {
      try {
        const { error } = await supabase
          .from('alabanzas')
          .update(payload)
          .eq('id', cancionEnEdicion.id);

        if (error) {
          alert('Error al modificar en Supabase: ' + error.message);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    const actualizadas = canciones.map(c => {
      if (c.id === cancionEnEdicion.id) {
        return {
          ...cancionEnEdicion,
          ...payload
        };
      }
      return c;
    });

    setCanciones(actualizadas);
    setCancionSeleccionada(cancionEnEdicion);
    if (!usandoSupabase) {
      localStorage.setItem(STORAGE_ALABANZAS_KEY, JSON.stringify(actualizadas));
    }
    setModalEditarAbierto(false);
    setCancionEnEdicion(null);
  };

  const handleEliminarCancion = async (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Deseas eliminar esta alabanza del repertorio?')) {
      if (usandoSupabase && typeof id === 'string' && !id.startsWith('base-')) {
        try {
          const { error } = await supabase
            .from('alabanzas')
            .delete()
            .eq('id', id);

          if (error) {
            alert('Error al eliminar en Supabase: ' + error.message);
            return;
          }
        } catch (err) {
          console.error(err);
        }
      }

      const filtrado = canciones.filter(c => c.id !== id);
      setCanciones(filtrado);
      if (!usandoSupabase) {
        localStorage.setItem(STORAGE_ALABANZAS_KEY, JSON.stringify(filtrado));
      }
      if (cancionSeleccionada?.id === id) {
        setCancionSeleccionada(filtrado[0] || null);
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="badge">Ministerio de Música & Proyección</div>
        <h1>Repertorio de <span>Alabanzas</span></h1>
        <p>Banco de canciones para proyección en templos y streaming. Conectado a la base de datos en la nube.</p>

        <div style={{ marginTop: 12 }}>
          {usandoSupabase ? (
            <span className="badge" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>
              🟢 Conectado a Supabase (PostgreSQL en la nube)
            </span>
          ) : (
            <span className="badge" style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#facc15' }}>
              🟡 Modo Local (LocalStorage)
            </span>
          )}
        </div>

        <div className="alabanzas-hero-actions">
          {isAdmin ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setModalAbierto(true)}
            >
              ➕ Agregar Nueva Alabanza
            </button>
          ) : (
            <div className="user-view-chip">
              <span>👤 Modo Usuario: Navega y descarga letras en .txt (Inicia como Admin para agregar/modificar)</span>
            </div>
          )}
          <button
            type="button"
            className="btn-outline"
            onClick={descargarRepertorioCompleto}
            title="Descargar todas las alabanzas en un solo archivo"
          >
            📥 Descargar Todo el Repertorio (.txt)
          </button>
        </div>
      </div>

      <div className="container section">
        {cargando ? (
          <div className="empty-state">
            <p>Cargando alabanzas desde la base de datos...</p>
          </div>
        ) : (
          <div className="alabanzas-layout">
            {/* Columna Izquierda: Buscador, filtros y lista */}
            <aside className="alabanzas-sidebar">
              {isAdmin && (
                <div className="sidebar-header-box">
                  <button
                    type="button"
                    className="btn-add-quick"
                    onClick={() => setModalAbierto(true)}
                  >
                    + Nueva Canción
                  </button>
                </div>
              )}

              <div className="alabanzas-search-box">
                <input
                  type="text"
                  placeholder="🔍 Buscar por título o artista..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="alabanzas-input"
                />
              </div>

              <div className="alabanzas-cats">
                {['Todas', 'Adoración', 'Júbilo', 'Especial'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFiltroCategoria(cat)}
                    className={`cat-pill ${filtroCategoria === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="alabanzas-lista">
                {cancionesFiltradas.map(c => (
                  <div
                    key={c.id}
                    className={`cancion-item ${cancionSeleccionada?.id === c.id ? 'active' : ''}`}
                    onClick={() => setCancionSeleccionada(c)}
                  >
                    <div className="cancion-item-header">
                      <h4>{c.titulo}</h4>
                      <span className="cancion-badge-cat">{c.categoria}</span>
                    </div>
                    <p className="cancion-item-artista">{c.artista}</p>
                    <div className="cancion-item-meta">
                      <span>Tono: {c.tono}</span>
                      <span>•</span>
                      <span>{c.tiempo}</span>
                    </div>

                    {isAdmin && (
                      <div className="cancion-item-actions">
                        <button
                          type="button"
                          className="cancion-action-btn edit"
                          title="Modificar alabanza"
                          onClick={(e) => { e.stopPropagation(); handleAbrirEditar(c); }}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="cancion-action-btn delete"
                          title="Eliminar del repertorio"
                          onClick={(e) => handleEliminarCancion(c.id, e)}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {cancionesFiltradas.length === 0 && (
                  <div className="empty-state" style={{ padding: '30px 10px' }}>
                    <p>No se encontraron alabanzas.</p>
                  </div>
                )}
              </div>
            </aside>

            {/* Columna Derecha: Vista previa y opciones */}
            <main className="alabanzas-preview">
              {cancionSeleccionada ? (
                <div className="preview-card">
                  <div className="preview-header">
                    <div>
                      <span className="badge">{cancionSeleccionada.categoria}</span>
                      <h2 className="preview-title">{cancionSeleccionada.titulo}</h2>
                      <p className="preview-subtitle">{cancionSeleccionada.artista}</p>
                    </div>

                    <div className="preview-actions">
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleAbrirEditar(cancionSeleccionada)}
                          className="btn-edit-lyrics"
                          title="Modificar los datos o la letra de esta alabanza"
                        >
                          ✏️ Modificar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => descargarTxt(cancionSeleccionada)}
                        className="btn-download-txt"
                        title="Descargar letra en archivo .txt"
                      >
                        📥 Descargar .txt
                      </button>
                      <button
                        type="button"
                        onClick={copiarLetra}
                        className="btn-copy-lyrics"
                        title="Copiar letra para software de proyección"
                      >
                        {copiado ? '✓ Copiado' : '📋 Copiar Letra'}
                      </button>
                    </div>
                  </div>

                  <div className="preview-meta-bar">
                    <div className="meta-box">
                      <span className="meta-label">Tono sugerido:</span>
                      <span className="meta-val">{cancionSeleccionada.tono}</span>
                    </div>
                    <div className="meta-box">
                      <span className="meta-label">Tiempo / Métrica:</span>
                      <span className="meta-val">{cancionSeleccionada.tiempo}</span>
                    </div>
                    <div className="meta-box">
                      <span className="meta-label">Uso Proyección:</span>
                      <span className="meta-val">Fondo oscuro / Texto blanco</span>
                    </div>
                  </div>

                  <div className="lyrics-container">
                    <div className="lyrics-header-row">
                      <h3 className="lyrics-heading">Guía de Diapositivas / Letra Oficial:</h3>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button
                          type="button"
                          onClick={() => descargarTxt(cancionSeleccionada)}
                          className="btn-txt-link"
                        >
                          📄 Guardar {cancionSeleccionada.titulo}.txt
                        </button>
                      </div>
                    </div>
                    <pre className="lyrics-text">{cancionSeleccionada.letra}</pre>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>Selecciona una alabanza del listado o agrega una nueva.</p>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* MODAL 1: AGREGAR NUEVA ALABANZA */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-card modal-alabanza" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Agregar Nueva Alabanza</h3>
              <button type="button" className="modal-close" onClick={() => setModalAbierto(false)}>✕</button>
            </div>
            <p className="modal-desc">
              Ingresa los datos y las letras de la canción para tenerla disponible en la proyección y descarga.
            </p>

            <form onSubmit={handleGuardarNuevaCancion} className="form-nueva-alabanza">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Título de la Canción *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cuan Grande es Dios"
                    value={nuevaCancion.titulo}
                    onChange={(e) => setNuevaCancion({ ...nuevaCancion, titulo: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Artista / Banda / Autor</label>
                  <input
                    type="text"
                    placeholder="Ej. En Espiritu y en Verdad"
                    value={nuevaCancion.artista}
                    onChange={(e) => setNuevaCancion({ ...nuevaCancion, artista: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Tono</label>
                  <input
                    type="text"
                    placeholder="Ej. G (Sol Mayor)"
                    value={nuevaCancion.tono}
                    onChange={(e) => setNuevaCancion({ ...nuevaCancion, tono: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Tiempo / Métrica</label>
                  <input
                    type="text"
                    placeholder="Ej. 72 BPM - 4/4"
                    value={nuevaCancion.tiempo}
                    onChange={(e) => setNuevaCancion({ ...nuevaCancion, tiempo: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={nuevaCancion.categoria}
                    onChange={(e) => setNuevaCancion({ ...nuevaCancion, categoria: e.target.value as any })}
                  >
                    <option value="Adoración">Adoración</option>
                    <option value="Júbilo">Júbilo</option>
                    <option value="Especial">Especial</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Letra Completa (Estrofas, Coros, Puente) *</label>
                <textarea
                  required
                  rows={8}
                  placeholder={`[Verso 1]\nEscribe aquí la primera estrofa...\n\n[Coro]\nEscribe aquí el coro...`}
                  value={nuevaCancion.letra}
                  onChange={(e) => setNuevaCancion({ ...nuevaCancion, letra: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Guardar Alabanza en Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MODIFICAR / EDITAR ALABANZA EXISTENTE */}
      {modalEditarAbierto && cancionEnEdicion && (
        <div className="modal-overlay" onClick={() => setModalEditarAbierto(false)}>
          <div className="modal-card modal-alabanza" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Modificar Alabanza</h3>
              <button type="button" className="modal-close" onClick={() => setModalEditarAbierto(false)}>✕</button>
            </div>
            <p className="modal-desc">
              Edita cualquier parámetro musical, categoría o estrofas de <strong>{cancionEnEdicion.titulo}</strong>.
            </p>

            <form onSubmit={handleGuardarEdicion} className="form-nueva-alabanza">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Título de la Canción *</label>
                  <input
                    type="text"
                    required
                    value={cancionEnEdicion.titulo}
                    onChange={(e) => setCancionEnEdicion({ ...cancionEnEdicion, titulo: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Artista / Banda / Autor</label>
                  <input
                    type="text"
                    value={cancionEnEdicion.artista}
                    onChange={(e) => setCancionEnEdicion({ ...cancionEnEdicion, artista: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Tono</label>
                  <input
                    type="text"
                    value={cancionEnEdicion.tono}
                    onChange={(e) => setCancionEnEdicion({ ...cancionEnEdicion, tono: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Tiempo / Métrica</label>
                  <input
                    type="text"
                    value={cancionEnEdicion.tiempo}
                    onChange={(e) => setCancionEnEdicion({ ...cancionEnEdicion, tiempo: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={cancionEnEdicion.categoria}
                    onChange={(e) => setCancionEnEdicion({ ...cancionEnEdicion, categoria: e.target.value as any })}
                  >
                    <option value="Adoración">Adoración</option>
                    <option value="Júbilo">Júbilo</option>
                    <option value="Especial">Especial</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Letra Completa (Estrofas, Coros, Puente) *</label>
                <textarea
                  required
                  rows={9}
                  value={cancionEnEdicion.letra}
                  onChange={(e) => setCancionEnEdicion({ ...cancionEnEdicion, letra: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setModalEditarAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Guardar Modificaciones
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alabanzas;
