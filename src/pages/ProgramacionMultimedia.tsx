import React, { useState, useEffect, useRef } from 'react';
import readXlsxFile from 'read-excel-file/browser';
import { useAuth } from '../context/AuthContext';
import './ProgramacionMultimedia.css';

const PROGRAMACION_IMG_KEY = 'icj-programacion-foto';
const PROGRAMACION_EXCEL_KEY = 'icj-programacion-excel-data';
const PROGRAMACION_EXCEL_NAME_KEY = 'icj-programacion-excel-name';
const PROGRAMACION_EXCEL_RAW_KEY = 'icj-programacion-excel-raw';
const LINK_OFICIAL = 'https://acortar.link/L95EAY';

interface ExcelDataState {
  sheetName: string;
  rows: (string | number)[][];
  fileName: string;
}

const ProgramacionMultimedia: React.FC = () => {
  const { isAdmin } = useAuth();

  // Modo de visualización: 'excel' | 'imagen'
  const [formatoActivo, setFormatoActivo] = useState<'excel' | 'imagen'>('excel');

  // Estado Excel
  const [excelData, setExcelData] = useState<ExcelDataState | null>(null);
  const [busquedaExcel, setBusquedaExcel] = useState('');
  const [excelRawBase64, setExcelRawBase64] = useState<string | null>(null);

  // Estado Imagen
  const [fotoProgramacion, setFotoProgramacion] = useState<string | null>(null);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);

  // Referencias a inputs de archivo
  const fileInputFotoRef = useRef<HTMLInputElement>(null);
  const fileInputExcelRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cargar imagen guardada
    const savedImg = localStorage.getItem(PROGRAMACION_IMG_KEY);
    if (savedImg) setFotoProgramacion(savedImg);

    // Cargar datos de Excel guardados
    try {
      const savedExcelJson = localStorage.getItem(PROGRAMACION_EXCEL_KEY);
      const savedExcelName = localStorage.getItem(PROGRAMACION_EXCEL_NAME_KEY);
      const savedExcelRaw = localStorage.getItem(PROGRAMACION_EXCEL_RAW_KEY);
      if (savedExcelJson) {
        const rows = JSON.parse(savedExcelJson);
        setExcelData({
          sheetName: 'Programación',
          rows,
          fileName: savedExcelName || 'Programacion_Multimedia.xlsx',
        });
      }
      if (savedExcelRaw) {
        setExcelRawBase64(savedExcelRaw);
      }
    } catch {
      // fallback
    }
  }, []);

  // Manejo de carga de archivo Excel (.xlsx)
  const handleSubirExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileName = file.name;

      try {
        const rawRows = await readXlsxFile(file);

        // Convertir celdas a string/number y filtrar filas vacías
        const cleanRows: (string | number)[][] = [];
        for (const row of rawRows) {
          if (Array.isArray(row) && row.some(c => c !== null && c !== undefined && c !== '')) {
            const rowValues = row.map(cell => {
              if (cell === null || cell === undefined) return '';
              if (cell instanceof Date) {
                return cell.toLocaleDateString('es-ES');
              }
              return String(cell);
            });
            cleanRows.push(rowValues);
          }
        }

        const newState: ExcelDataState = {
          sheetName: 'Programación de Servicios',
          rows: cleanRows,
          fileName,
        };

        setExcelData(newState);
        setFormatoActivo('excel');

        // Guardar tabla estructurada
        try {
          localStorage.setItem(PROGRAMACION_EXCEL_KEY, JSON.stringify(cleanRows));
          localStorage.setItem(PROGRAMACION_EXCEL_NAME_KEY, fileName);
        } catch {
          console.warn('Almacenamiento lleno para tabla Excel.');
        }

        // Guardar base64 para descarga directa
        const readerBase64 = new FileReader();
        readerBase64.onload = () => {
          const b64 = readerBase64.result as string;
          setExcelRawBase64(b64);
          try {
            localStorage.setItem(PROGRAMACION_EXCEL_RAW_KEY, b64);
          } catch {
            // almacenamiento seguro
          }
        };
        readerBase64.readAsDataURL(file);

      } catch (err) {
        console.error(err);
        alert('Error al procesar el archivo Excel. Asegúrate de que sea un archivo .xlsx válido.');
      }
    }
  };

  // Descargar el archivo Excel cargado
  const handleDescargarExcel = () => {
    if (excelRawBase64) {
      const link = document.createElement('a');
      link.href = excelRawBase64;
      link.download = excelData?.fileName || 'Programacion_Multimedia.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('El archivo no está disponible para descarga directa. Consulta la tabla o el enlace oficial.');
    }
  };

  const handleEliminarExcel = () => {
    if (window.confirm('¿Deseas quitar la hoja de Excel actual de la programación?')) {
      setExcelData(null);
      setExcelRawBase64(null);
      localStorage.removeItem(PROGRAMACION_EXCEL_KEY);
      localStorage.removeItem(PROGRAMACION_EXCEL_NAME_KEY);
      localStorage.removeItem(PROGRAMACION_EXCEL_RAW_KEY);
      if (fileInputExcelRef.current) fileInputExcelRef.current.value = '';
    }
  };

  // Manejo de carga de foto
  const handleSubirFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFotoProgramacion(result);
        setFormatoActivo('imagen');
        try {
          localStorage.setItem(PROGRAMACION_IMG_KEY, result);
        } catch {
          console.warn('Espacio limitado para guardar imagen completa.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEliminarFoto = () => {
    if (window.confirm('¿Deseas quitar la imagen actual de la programación?')) {
      setFotoProgramacion(null);
      localStorage.removeItem(PROGRAMACION_IMG_KEY);
      if (fileInputFotoRef.current) fileInputFotoRef.current.value = '';
    }
  };

  // Filtrado de filas en la tabla Excel
  const rowsFiltradas = excelData ? excelData.rows.filter((r, idx) => {
    if (idx === 0) return true; // Siempre mostrar cabecera
    if (!busquedaExcel.trim()) return true;
    return r.some(c => String(c).toLowerCase().includes(busquedaExcel.toLowerCase()));
  }) : [];

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="badge">Calendario & Asignaciones</div>
        <h1>Programación de <span>Multimedia</span></h1>
        <p>
          Consulta los turnos del equipo cargando la hoja de cálculo de Excel (.xlsx), la imagen oficial o accediendo al enlace en la nube.
        </p>

        {/* Botón destacado al enlace oficial */}
        <div className="prog-hero-action">
          <a
            href={LINK_OFICIAL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-link-oficial"
          >
            📋 Ver Programación Oficial en Línea (Hoja en Vivo) ↗
          </a>
        </div>
      </div>

      <div className="container section">
        {/* BANNER DEL ENLACE OFICIAL */}
        <div className="link-banner-card">
          <div className="link-banner-info">
            <span className="badge">Sincronización en la Nube</span>
            <h3>Hoja Oficial de Turnos y Roles</h3>
            <p>
              El documento oficial se mantiene actualizado en la nube. Enlace directo:{' '}
              <a href={LINK_OFICIAL} target="_blank" rel="noopener noreferrer" className="link-url-text">
                {LINK_OFICIAL}
              </a>
            </p>
          </div>
          <a
            href={LINK_OFICIAL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline btn-open-link"
          >
            Abrir en Línea ↗
          </a>
        </div>

        {/* SELECTOR DE PESTAÑAS: EXCEL vs IMAGEN */}
        <div className="prog-tabs-bar">
          <button
            type="button"
            className={`prog-tab-btn ${formatoActivo === 'excel' ? 'active' : ''}`}
            onClick={() => setFormatoActivo('excel')}
          >
            📊 Hoja de Cálculo Excel {excelData ? `(${excelData.fileName})` : ''}
          </button>
          <button
            type="button"
            className={`prog-tab-btn ${formatoActivo === 'imagen' ? 'active' : ''}`}
            onClick={() => setFormatoActivo('imagen')}
          >
            🖼️ Imagen del Rol de Turnos {fotoProgramacion ? '✓' : ''}
          </button>
        </div>

        {/* ======================================================== */}
        {/* PESTAÑA 1: VISOR DE EXCEL                                */}
        {/* ======================================================== */}
        {formatoActivo === 'excel' && (
          <div className="excel-prog-section">
            <div className="excel-prog-header">
              <div>
                <h2 className="section-title">
                  Hoja de Turnos <span>Excel</span>
                </h2>
                <p className="section-subtitle">
                  {excelData
                    ? `Archivo: ${excelData.fileName} • ${excelData.rows.length} filas leídas`
                    : 'Puedes subir el archivo .xlsx de la programación para visualizar la tabla interactiva.'}
                </p>
              </div>

              <div className="excel-prog-actions">
                {isAdmin ? (
                  <>
                    <input
                      type="file"
                      accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      ref={fileInputExcelRef}
                      onChange={handleSubirExcel}
                      style={{ display: 'none' }}
                      id="input-excel-programacion"
                    />
                    <label htmlFor="input-excel-programacion" className="btn-primary btn-subir-archivo">
                      📤 {excelData ? 'Reemplazar Excel' : 'Cargar Archivo Excel (.xlsx)'}
                    </label>

                    {excelData && (
                      <button
                        type="button"
                        onClick={handleEliminarExcel}
                        className="btn-outline btn-quitar-foto"
                        title="Quitar archivo Excel"
                      >
                        Quitar
                      </button>
                    )}
                  </>
                ) : (
                  <div className="user-view-chip">
                    <span>👤 Modo Usuario (Solo lectura y descarga de Excel)</span>
                  </div>
                )}

                {excelData && (
                  <button
                    type="button"
                    onClick={handleDescargarExcel}
                    className="btn-outline btn-descargar-excel"
                    title="Descargar archivo Excel a tu equipo"
                  >
                    📥 Descargar Excel (.xlsx)
                  </button>
                )}
              </div>
            </div>

            {excelData && excelData.rows.length > 0 ? (
              <div className="excel-viewer-card">
                {/* Buscador dentro del Excel */}
                <div className="excel-search-bar">
                  <input
                    type="text"
                    placeholder="🔍 Filtrar por nombre de encargado, fecha o área..."
                    value={busquedaExcel}
                    onChange={(e) => setBusquedaExcel(e.target.value)}
                    className="excel-search-input"
                  />
                  {busquedaExcel && (
                    <span className="excel-search-count">
                      Mostrando {rowsFiltradas.length} fila(s)
                    </span>
                  )}
                </div>

                <div className="excel-table-scroll">
                  <table className="excel-rendered-table">
                    <thead>
                      {rowsFiltradas.length > 0 && (
                        <tr>
                          {rowsFiltradas[0].map((cell, colIdx) => (
                            <th key={colIdx}>{cell !== undefined && cell !== null ? String(cell) : ''}</th>
                          ))}
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {rowsFiltradas.slice(1).map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {rowsFiltradas[0].map((_, colIdx) => {
                            const val = row[colIdx];
                            return (
                              <td key={colIdx}>
                                {val !== undefined && val !== null ? String(val) : ''}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div
                className="excel-placeholder"
                onClick={() => isAdmin && fileInputExcelRef.current?.click()}
              >
                <span className="placeholder-icon">📊</span>
                <h3>Aún no se ha cargado una hoja de Excel</h3>
                <p>
                  {isAdmin
                    ? 'Haz clic aquí o en el botón superior para subir el archivo .xlsx con la programación.'
                    : 'Puedes consultar el enlace oficial de la programación en la nube o consultar la pestaña de afiche.'}
                </p>
                {isAdmin && (
                  <span className="btn-link" style={{ marginTop: 12 }}>+ Seleccionar archivo Excel (.xlsx)</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PESTAÑA 2: VISOR DE IMAGEN                               */}
        {/* ======================================================== */}
        {formatoActivo === 'imagen' && (
          <div className="foto-prog-section">
            <div className="foto-prog-header">
              <div>
                <h2 className="section-title">Foto de la <span>Programación</span></h2>
                <p className="section-subtitle">
                  Visualiza el afiche gráfico del rol o sube una imagen actualizada de la semana.
                </p>
              </div>

              <div className="foto-prog-actions">
                {isAdmin ? (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputFotoRef}
                      onChange={handleSubirFoto}
                      style={{ display: 'none' }}
                      id="input-foto-programacion"
                    />
                    <label htmlFor="input-foto-programacion" className="btn-primary btn-subir-foto">
                      📷 {fotoProgramacion ? 'Cambiar Imagen' : 'Cargar Foto de Programación'}
                    </label>

                    {fotoProgramacion && (
                      <button
                        type="button"
                        onClick={handleEliminarFoto}
                        className="btn-outline btn-quitar-foto"
                        title="Quitar foto actual"
                      >
                        Quitar
                      </button>
                    )}
                  </>
                ) : (
                  <div className="user-view-chip">
                    <span>👤 Modo Usuario: Clic en la foto para ampliar a pantalla completa</span>
                  </div>
                )}
              </div>
            </div>

            {/* Visualizador de imagen o placeholder */}
            <div className="foto-prog-viewer">
              {fotoProgramacion ? (
                <div className="foto-container" onClick={() => setLightboxAbierto(true)}>
                  <img src={fotoProgramacion} alt="Programación de Multimedia" />
                  <div className="foto-hover-hint">
                    <span>🔍 Clic para ampliar a pantalla completa</span>
                  </div>
                </div>
              ) : (
                <div
                  className="foto-placeholder"
                  onClick={() => isAdmin && fileInputFotoRef.current?.click()}
                >
                  <span className="placeholder-icon">📅</span>
                  <h3>Aún no has cargado la foto de la programación</h3>
                  <p>
                    {isAdmin
                      ? 'Haz clic aquí para subir una imagen o captura de la programación de los servicios.'
                      : 'El administrador aún no ha cargado una foto de la programación. Puedes consultar la pestaña de Excel.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX FOTO COMPLETA */}
      {lightboxAbierto && fotoProgramacion && (
        <div className="lightbox-overlay" onClick={() => setLightboxAbierto(false)}>
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setLightboxAbierto(false)}
          >
            ✕
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={fotoProgramacion} alt="Programación ampliada" />
            <div className="lightbox-caption">
              <span>Programación de Multimedia - ICJ Santa Ana</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramacionMultimedia;
