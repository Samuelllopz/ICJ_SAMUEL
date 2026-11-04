import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  type Album,
  type GalleryImage,
  fetchAlbumsAsync,
  saveAlbumAsync,
  deleteAlbumAsync,
  fetchAlbumImagesAsync,
  addImagesToAlbumAsync,
  deleteImageAsync,
  getFirstNImages,
  detectDateFromFiles,
  groupFilesByDate,
  formatDateEs,
  getStorageInfo,
  formatBytes
} from '../hooks/useGallery';
import './GaleriaServicios.css';

const GaleriaServicios: React.FC = () => {
  const { isAdmin } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [activeAlbumImages, setActiveAlbumImages] = useState<GalleryImage[]>([]);
  const [cargando, setCargando] = useState(false);
  const [usandoSupabase, setUsandoSupabase] = useState(false);

  // Modal de carga / creación
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [modeGrouping, setModeGrouping] = useState<'auto' | 'manual'>('auto');
  const [manualTitle, setManualTitle] = useState('');
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');

  // Lightbox
  const [lightboxImg, setLightboxImg] = useState<GalleryImage | null>(null);

  // Storage
  const [storage, setStorage] = useState({ usedBytes: 0, percent: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshData = async () => {
    setCargando(true);
    const result = await fetchAlbumsAsync();
    setAlbums(result.albums);
    setUsandoSupabase(result.fromSupabase);
    setStorage(getStorageInfo());

    if (activeAlbumId) {
      const imgs = await fetchAlbumImagesAsync(activeAlbumId);
      setActiveAlbumImages(imgs);
    }
    setCargando(false);
  };

  useEffect(() => {
    refreshData();
  }, [activeAlbumId]);

  const handleOpenAlbum = async (albumId: string) => {
    setActiveAlbumId(albumId);
    setCargando(true);
    const imgs = await fetchAlbumImagesAsync(albumId);
    setActiveAlbumImages(imgs);
    setCargando(false);
  };

  const handleBackToAlbums = () => {
    setActiveAlbumId(null);
    setActiveAlbumImages([]);
    refreshData();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      // Detección automática de fecha
      const detected = detectDateFromFiles(filesArray);
      setManualDate(detected);
      setManualTitle(`Servicio ${formatDateEs(detected)}`);
      setShowUploadModal(true);
    }
  };

  const handleProcessUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);

    try {
      if (modeGrouping === 'auto') {
        // Separa automáticamente los archivos por fecha (metadatos del archivo)
        const groups = groupFilesByDate(selectedFiles);
        const dates = Object.keys(groups);

        for (let i = 0; i < dates.length; i++) {
          const dateStr = dates[i];
          const filesInDate = groups[dateStr];
          setProgressText(`Agrupando paquete ${i + 1} de ${dates.length} (${dateStr})...`);

          let existingAlbum = albums.find(a => a.date === dateStr);
          let targetAlbumId = existingAlbum?.id;

          if (!targetAlbumId) {
            targetAlbumId = `album-${dateStr}-${Date.now()}`;
            const newAlbum: Album = {
              id: targetAlbumId,
              title: `Servicio ${formatDateEs(dateStr)}`,
              date: dateStr,
              createdAt: Date.now()
            };
            await saveAlbumAsync(newAlbum);
          }

          await addImagesToAlbumAsync(targetAlbumId, filesInDate, (done, total) => {
            setProgressText(`Optimizando y subiendo ${done} de ${total} fotos de ${dateStr}...`);
          });
        }
      } else {
        // Agrupación manual definida por el usuario
        setProgressText(`Creando paquete de imágenes para ${manualDate}...`);
        let existingAlbum = albums.find(a => a.date === manualDate);
        let targetAlbumId = existingAlbum?.id;

        if (!targetAlbumId) {
          targetAlbumId = `album-${manualDate}-${Date.now()}`;
          const newAlbum: Album = {
            id: targetAlbumId,
            title: manualTitle.trim() || `Servicio ${manualDate}`,
            date: manualDate,
            createdAt: Date.now()
          };
          await saveAlbumAsync(newAlbum);
        }

        await addImagesToAlbumAsync(targetAlbumId, selectedFiles, (done, total) => {
          setProgressText(`Optimizando y subiendo ${done} de ${total} fotos...`);
        });
      }

      // Finalizado
      setSelectedFiles([]);
      setShowUploadModal(false);
      await refreshData();
    } catch (err) {
      console.error(err);
      alert('Hubo un inconveniente al procesar las fotos. Por favor inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
      setProgressText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteAlbum = async (albumId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`¿Seguro que deseas eliminar el paquete "${title}" y todas sus fotos?`)) {
      await deleteAlbumAsync(albumId);
      if (activeAlbumId === albumId) {
        handleBackToAlbums();
      } else {
        await refreshData();
      }
    }
  };

  const handleDeletePhoto = async (imgId: string) => {
    if (!activeAlbumId) return;
    if (window.confirm('¿Deseas eliminar esta fotografía?')) {
      await deleteImageAsync(activeAlbumId, imgId);
      const updated = await fetchAlbumImagesAsync(activeAlbumId);
      setActiveAlbumImages(updated);
      setStorage(getStorageInfo());
      if (lightboxImg?.id === imgId) setLightboxImg(null);
    }
  };

  const currentAlbum = albums.find(a => a.id === activeAlbumId);

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="badge">Fototeca Multimedia</div>
        <h1>Fotos de los <span>Servicios</span></h1>
        <p>Carga fotos de cámaras, organízalas en paquetes automáticamente por fecha o crea álbumes manuales.</p>

        {/* Indicador de Estado de Conexión */}
        <div className="db-status-container" style={{ margin: '10px 0 16px' }}>
          {usandoSupabase ? (
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              🟢 Sincronizado con Supabase Cloud
            </span>
          ) : (
            <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
              🟡 Modo Local (LocalStorage)
            </span>
          )}
        </div>

        {isAdmin ? (
          <div className="galeria-hero-actions">
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFilesSelected}
              style={{ display: 'none' }}
              id="galeria-upload-input"
            />
            <label htmlFor="galeria-upload-input" className="btn-primary galeria-btn-upload">
              📤 Cargar Nuevas Fotos
            </label>
          </div>
        ) : (
          <div className="user-view-chip" style={{ margin: '14px 0 6px' }}>
            <span>👤 Modo Usuario: Navegación y descarga activa. (Accede como Admin para subir o eliminar fotos)</span>
          </div>
        )}

        <div className="storage-status-chip">
          <span>💾 Almacenamiento local utilizado: {formatBytes(storage.usedBytes)} ({storage.percent}%)</span>
        </div>
      </div>

      <div className="container section">
        {/* VISTA 1: DETALLE DE UN ÁLBUM SELECCIONADO */}
        {activeAlbumId && currentAlbum ? (
          <div className="album-detail-view">
            <div className="album-detail-header">
              <button
                type="button"
                className="btn-outline btn-back"
                onClick={handleBackToAlbums}
              >
                ← Volver a Álbumes
              </button>

              <div className="album-detail-info">
                <h2>{currentAlbum.title}</h2>
                <div className="album-detail-meta">
                  <span>📅 {formatDateEs(currentAlbum.date)}</span>
                  <span>•</span>
                  <span>📸 {activeAlbumImages.length} fotos</span>
                </div>
              </div>

              {isAdmin && (
                <div className="album-detail-actions">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setIsProcessing(true);
                        await addImagesToAlbumAsync(activeAlbumId, Array.from(e.target.files), (done, total) => {
                          setProgressText(`Agregando ${done} de ${total} fotos...`);
                        });
                        setIsProcessing(false);
                        setProgressText('');
                        const updated = await fetchAlbumImagesAsync(activeAlbumId);
                        setActiveAlbumImages(updated);
                        setStorage(getStorageInfo());
                      }
                    }}
                    style={{ display: 'none' }}
                    id="album-add-more-input"
                  />
                  <label htmlFor="album-add-more-input" className="btn-primary">
                    + Agregar Fotos a este Álbum
                  </label>
                </div>
              )}
            </div>

            {cargando ? (
              <div className="empty-state">
                <div className="icon">⏳</div>
                <h3>Cargando fotografías...</h3>
              </div>
            ) : activeAlbumImages.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🖼️</div>
                <h3>No hay fotos en este álbum todavía</h3>
                <p>Usa el botón de arriba para subir fotos a este paquete.</p>
              </div>
            ) : (
              <div className="photos-grid">
                {activeAlbumImages.map(img => (
                  <div key={img.id} className="photo-card" onClick={() => setLightboxImg(img)}>
                    <img src={img.dataUrl} alt={img.name} loading="lazy" />
                    {isAdmin && (
                      <button
                        type="button"
                        className="photo-btn-delete"
                        title="Eliminar foto"
                        onClick={(e) => { e.stopPropagation(); handleDeletePhoto(img.id); }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* VISTA 2: LISTA DE ÁLBUMES / PAQUETES POR FECHA */
          <div className="albums-list-view">
            <div className="section-header">
              <div>
                <h2 className="section-title">Paquetes por <span>Fecha de Servicio</span></h2>
                <p className="section-subtitle">Selecciona una fecha para ver todas las capturas registradas.</p>
              </div>
            </div>

            {cargando ? (
              <div className="empty-state">
                <div className="icon">⏳</div>
                <h3>Consultando álbumes...</h3>
              </div>
            ) : albums.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📁</div>
                <h3>Aún no se han cargado paquetes de fotografías</h3>
                <p>Presiona el botón "Cargar Nuevas Fotos" para subir imágenes de los servicios.</p>
              </div>
            ) : (
              <div className="albums-grid">
                {albums.map(album => {
                  const previewImgs = album.coverUrl
                    ? [{ id: 'cover', name: 'cover', addedAt: 0, dataUrl: album.coverUrl }]
                    : getFirstNImages(album.id, 3);

                  return (
                    <div
                      key={album.id}
                      className="album-card"
                      onClick={() => handleOpenAlbum(album.id)}
                    >
                      <div className="album-preview-strip">
                        {previewImgs.length > 0 ? (
                          previewImgs.map((img, idx) => (
                            <div key={idx} className="preview-mini-img">
                              <img src={img.dataUrl} alt="miniatura" />
                            </div>
                          ))
                        ) : (
                          <div className="empty-preview-icon">🖼️</div>
                        )}
                      </div>

                      <div className="album-card-body">
                        <span className="badge">{album.date}</span>
                        <h3>{album.title}</h3>
                        <p className="album-date-text">{formatDateEs(album.date)}</p>

                        <div className="album-card-footer">
                          <span className="btn-link">Ver fotos →</span>
                          {isAdmin && (
                            <button
                              type="button"
                              className="album-btn-delete"
                              title="Eliminar paquete"
                              onClick={(e) => handleDeleteAlbum(album.id, album.title, e)}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL DE ORGANIZACIÓN / CARGA DE FOTOS                    */}
      {/* ======================================================== */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => !isProcessing && setShowUploadModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📦 Organizar Fotos Seleccionadas</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => !isProcessing && setShowUploadModal(false)}
                disabled={isProcessing}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-info-text">
                Has seleccionado <strong>{selectedFiles.length} fotografías</strong>. ¿Cómo deseas organizarlas?
              </p>

              <div className="grouping-options">
                <label className={`group-option-card ${modeGrouping === 'auto' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="modeGrouping"
                    value="auto"
                    checked={modeGrouping === 'auto'}
                    onChange={() => setModeGrouping('auto')}
                  />
                  <div>
                    <h4>⚡ Paquetes Automáticos por Fecha</h4>
                    <p>Agrupa las fotos en álbumes separados según el día en que fueron capturadas o creadas.</p>
                  </div>
                </label>

                <label className={`group-option-card ${modeGrouping === 'manual' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="modeGrouping"
                    value="manual"
                    checked={modeGrouping === 'manual'}
                    onChange={() => setModeGrouping('manual')}
                  />
                  <div>
                    <h4>🎯 Asignar a un Solo Paquete Personalizado</h4>
                    <p>Guarda todas las fotos en un solo álbum con nombre y fecha que tú elijas.</p>
                  </div>
                </label>
              </div>

              {modeGrouping === 'manual' && (
                <div className="manual-inputs-box">
                  <div className="form-group">
                    <label>Título del Álbum / Servicio</label>
                    <input
                      type="text"
                      className="form-input"
                      value={manualTitle}
                      onChange={e => setManualTitle(e.target.value)}
                      placeholder="Ej: Culto Dominical 10:00 AM"
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha del Servicio</label>
                    <input
                      type="date"
                      className="form-input"
                      value={manualDate}
                      onChange={e => setManualDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="processing-indicator">
                  <div className="spinner"></div>
                  <p>{progressText || 'Optimizando fotografías y guardando...'}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setShowUploadModal(false)}
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleProcessUpload}
                disabled={isProcessing}
              >
                {isProcessing ? 'Procesando...' : 'Guardar y Organizar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LIGHTBOX DE VISUALIZACIÓN EN PANTALLA COMPLETA           */}
      {/* ======================================================== */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <div className="lightbox-container" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setLightboxImg(null)}
            >
              ✕
            </button>
            <img src={lightboxImg.dataUrl} alt={lightboxImg.name} className="lightbox-image" />
            <div className="lightbox-bar">
              <span className="lightbox-name">{lightboxImg.name}</span>
              <a
                href={lightboxImg.dataUrl}
                download={lightboxImg.name || 'foto-servicio.jpg'}
                className="btn-primary lightbox-download"
              >
                📥 Descargar Foto
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriaServicios;
