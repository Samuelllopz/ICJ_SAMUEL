import React, { useState, useEffect, useRef } from 'react';
import readXlsxFile, { readSheet } from 'read-excel-file/browser';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import './ProgramacionMultimedia.css';

const PROGRAMACION_IMG_KEY = 'icj-programacion-foto';
const PROGRAMACION_EXCEL_KEY = 'icj-programacion-excel-data';
const PROGRAMACION_EXCEL_NAME_KEY = 'icj-programacion-excel-name';
const PROGRAMACION_EXCEL_RAW_KEY = 'icj-programacion-excel-raw';
const PROGRAMACION_EXCEL_HOJAS_KEY = 'icj-programacion-excel-hojas';
const LINK_OFICIAL = 'https://acortar.link/L95EAY';

interface SheetTab {
  sheetName: string;
  rows: (string | number)[][];
}

interface ExcelDataState {
  sheetName: string;
  rows: (string | number)[][];
  fileName: string;
  hojas?: SheetTab[];
}

// Función auxiliar para comprimir imagen de programación antes de subir
async function comprimirFoto(file: File, maxPx = 1600, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = ev => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width: w, height: h } = img;
        if (w > maxPx || h > maxPx) {
          if (w >= h) {
            h = Math.round((h * maxPx) / w);
            w = maxPx;
          } else {
            w = Math.round((w * maxPx) / h);
            h = maxPx;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(ev.target?.result as string);
        }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Función universal inteligente para parsear cualquier archivo Excel (.xlsx)
async function parsearExcelCompleto(file: File): Promise<{
  hojas: SheetTab[];
  filasPrincipales: (string | number)[][];
  hojaPrincipalNombre: string;
}> {
  const hojas: SheetTab[] = [];

  // Intento 1: Leer todas las hojas del libro con readXlsxFile
  try {
    const rawResult: any = await readXlsxFile(file);

    if (Array.isArray(rawResult) && rawResult.length > 0) {
      for (const item of rawResult) {
        // En read-excel-file v9, cada hoja es { sheet: string, data: Row[] }
        if (item && typeof item === 'object' && 'data' in item && Array.isArray(item.data)) {
          const sName = String(item.sheet || 'Hoja');
          const cleanRows: (string | number)[][] = [];

          for (const row of item.data) {
            if (Array.isArray(row) && row.some(c => c !== null && c !== undefined && String(c).trim() !== '')) {
              const rowVals = row.map(cell => {
                if (cell === null || cell === undefined) return '';
                if (cell instanceof Date) return cell.toLocaleDateString('es-ES');
                return String(cell).trim();
              });
              cleanRows.push(rowVals);
            }
          }

          if (cleanRows.length > 0) {
            hojas.push({ sheetName: sName, rows: cleanRows });
          }
        } else if (Array.isArray(item)) {
          // Si por compatibilidad de versión devolvió directamente un array de filas
          const row = item;
          if (row.some(c => c !== null && c !== undefined && String(c).trim() !== '')) {
            const rowVals = row.map(cell => {
              if (cell === null || cell === undefined) return '';
              if (cell instanceof Date) return cell.toLocaleDateString('es-ES');
              return String(cell).trim();
            });
            if (hojas.length === 0) hojas.push({ sheetName: 'Hoja 1', rows: [] });
            hojas[0].rows.push(rowVals);
          }
        }
      }
    }
  } catch (err) {
    console.warn('readXlsxFile inicial falló o requiere lectura por hoja:', err);
  }

  // Intento 2: Si no encontró filas con readXlsxFile, intentar con readSheet
  if (hojas.length === 0) {
    try {
      const sheetRows: any = await readSheet(file);
      if (Array.isArray(sheetRows) && sheetRows.length > 0) {
        const cleanRows: (string | number)[][] = [];
        for (const row of sheetRows) {
          if (Array.isArray(row) && row.some(c => c !== null && c !== undefined && String(c).trim() !== '')) {
            cleanRows.push(
              row.map(cell =>
                cell instanceof Date ? cell.toLocaleDateString('es-ES') : String(cell ?? '').trim()
              )
            );
          }
        }
        if (cleanRows.length > 0) {
          hojas.push({ sheetName: 'Hoja 1', rows: cleanRows });
        }
      }
    } catch (sheetErr) {
      console.warn('readSheet intento falló:', sheetErr);
    }
  }

  const primeraConDatos = hojas.find(h => h.rows.length > 0) || hojas[0];
  const filasPrincipales = primeraConDatos ? primeraConDatos.rows : [];
  const hojaPrincipalNombre = primeraConDatos ? primeraConDatos.sheetName : 'Programación';

  return { hojas, filasPrincipales, hojaPrincipalNombre };
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

  // Estado de sincronización en la nube
  const [usandoSupabase, setUsandoSupabase] = useState(false);
  const [cargandoNube, setCargandoNube] = useState(false);
  const [guardandoEnNube, setGuardandoEnNube] = useState(false);

  // Referencias a inputs de archivo
  const fileInputFotoRef = useRef<HTMLInputElement>(null);
  const fileInputExcelRef = useRef<HTMLInputElement>(null);

  // Cargar programación (primero de Supabase Cloud, luego fallback local)
  const cargarProgramacion = async () => {
    setCargandoNube(true);

    // 1. Intentar cargar desde Supabase Cloud
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('programacion_multimedia')
          .select('*')
          .eq('id', 'actual')
          .maybeSingle();

        if (!error && data) {
          setUsandoSupabase(true);

          // Cargar datos de Excel desde Supabase
          if (data.excel_filas && Array.isArray(data.excel_filas) && data.excel_filas.length > 0) {
            setExcelData({
              sheetName: data.excel_nombre ? `Hoja Principal` : 'Programación',
              rows: data.excel_filas,
              fileName: data.excel_nombre || 'Programacion_Multimedia.xlsx',
            });
            try {
              localStorage.setItem(PROGRAMACION_EXCEL_KEY, JSON.stringify(data.excel_filas));
              if (data.excel_nombre) localStorage.setItem(PROGRAMACION_EXCEL_NAME_KEY, data.excel_nombre);
            } catch {
              // sin problemas
            }
          }

          if (data.excel_raw) {
            setExcelRawBase64(data.excel_raw);
            try {
              localStorage.setItem(PROGRAMACION_EXCEL_RAW_KEY, data.excel_raw);
            } catch {
              // sin problemas
            }
          }

          // Cargar foto afiche desde Supabase
          if (data.foto_url) {
            setFotoProgramacion(data.foto_url);
            try {
              localStorage.setItem(PROGRAMACION_IMG_KEY, data.foto_url);
            } catch {
              // sin problemas
            }
          }

          setCargandoNube(false);
          return;
        } else if (!error && !data) {
          // La tabla existe pero aún no tiene fila creada
          setUsandoSupabase(true);
        }
      } catch (err) {
        console.warn('Error conectando a Supabase para programación:', err);
      }
    }

    // 2. Fallback a LocalStorage si está offline
    try {
      const savedImg = localStorage.getItem(PROGRAMACION_IMG_KEY);
      if (savedImg) setFotoProgramacion(savedImg);

      const savedExcelJson = localStorage.getItem(PROGRAMACION_EXCEL_KEY);
      const savedExcelName = localStorage.getItem(PROGRAMACION_EXCEL_NAME_KEY);
      const savedExcelRaw = localStorage.getItem(PROGRAMACION_EXCEL_RAW_KEY);
      const savedHojas = localStorage.getItem(PROGRAMACION_EXCEL_HOJAS_KEY);

      if (savedExcelJson) {
        const rows = JSON.parse(savedExcelJson);
        const hojas = savedHojas ? JSON.parse(savedHojas) : undefined;
        setExcelData({
          sheetName: 'Programación',
          rows,
          fileName: savedExcelName || 'Programacion_Multimedia.xlsx',
          hojas,
        });
      }
      if (savedExcelRaw) {
        setExcelRawBase64(savedExcelRaw);
      }
    } catch {
      // fallback
    }

    setCargandoNube(false);
  };

  useEffect(() => {
    cargarProgramacion();
  }, []);

  // Manejo de carga de archivo Excel (.xlsx) con extractor multihonja
  const handleSubirExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileName = file.name;
      setGuardandoEnNube(true);

      try {
        const { hojas, filasPrincipales, hojaPrincipalNombre } = await parsearExcelCompleto(file);

        if (filasPrincipales.length === 0) {
          alert(
            `El archivo "${fileName}" se abrió correctamente, pero no se detectaron filas con texto en sus celdas. Asegúrate de que el archivo contenga datos en sus hojas de cálculo.`
          );
        }

        const newState: ExcelDataState = {
          sheetName: hojaPrincipalNombre,
          rows: filasPrincipales,
          fileName,
          hojas: hojas.length > 1 ? hojas : undefined,
        };

        setExcelData(newState);
        setFormatoActivo('excel');

        // Guardar tabla estructurada localmente
        try {
          localStorage.setItem(PROGRAMACION_EXCEL_KEY, JSON.stringify(filasPrincipales));
          localStorage.setItem(PROGRAMACION_EXCEL_NAME_KEY, fileName);
          if (hojas.length > 1) {
            localStorage.setItem(PROGRAMACION_EXCEL_HOJAS_KEY, JSON.stringify(hojas));
          }
        } catch {
          console.warn('Almacenamiento lleno para tabla Excel local.');
        }

        // Obtener Base64 para descarga y almacenamiento en Supabase
        const readerBase64 = new FileReader();
        readerBase64.onload = async () => {
          const b64 = readerBase64.result as string;
          setExcelRawBase64(b64);
          try {
            localStorage.setItem(PROGRAMACION_EXCEL_RAW_KEY, b64);
          } catch {
            // almacenamiento seguro
          }

          // Guardar en la Nube de Supabase
          if (isSupabaseConfigured) {
            try {
              const { error } = await supabase.from('programacion_multimedia').upsert({
                id: 'actual',
                excel_nombre: fileName,
                excel_filas: filasPrincipales,
                excel_raw: b64,
                updated_at: new Date().toISOString(),
              });

              if (!error) {
                setUsandoSupabase(true);
                alert(
                  `✅ ¡Hoja de Excel guardada con éxito en la nube! Se leyeron ${filasPrincipales.length} filas${
                    hojas.length > 1 ? ` distribuidas en ${hojas.length} pestañas` : ''
                  }. Ya es visible en todas las computadoras y teléfonos.`
                );
              } else {
                console.warn('Detalle al subir Excel a Supabase:', error);
                alert('Aviso: El Excel se guardó localmente. Si aún no creaste la tabla en Supabase, ejecuta el script SQL.');
              }
            } catch (supaErr) {
              console.warn('Error en Supabase:', supaErr);
            }
          }
          setGuardandoEnNube(false);
        };
        readerBase64.readAsDataURL(file);
      } catch (err) {
        console.error('Error al procesar Excel:', err);
        alert('Error al leer el archivo Excel. Asegúrate de que sea un archivo .xlsx válido.');
        setGuardandoEnNube(false);
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

  // Eliminar Excel
  const handleEliminarExcel = async () => {
    if (
      window.confirm(
        '¿Deseas quitar la hoja de Excel actual de la programación? Se eliminará de la nube para todos los dispositivos.'
      )
    ) {
      setExcelData(null);
      setExcelRawBase64(null);
      localStorage.removeItem(PROGRAMACION_EXCEL_KEY);
      localStorage.removeItem(PROGRAMACION_EXCEL_NAME_KEY);
      localStorage.removeItem(PROGRAMACION_EXCEL_RAW_KEY);
      localStorage.removeItem(PROGRAMACION_EXCEL_HOJAS_KEY);
      if (fileInputExcelRef.current) fileInputExcelRef.current.value = '';

      if (isSupabaseConfigured) {
        try {
          await supabase
            .from('programacion_multimedia')
            .update({
              excel_nombre: null,
              excel_filas: null,
              excel_raw: null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', 'actual');
        } catch (err) {
          console.warn('Error al limpiar Excel en Supabase:', err);
        }
      }
    }
  };

  // Manejo de carga de foto con compresión y guardado en la nube
  const handleSubirFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGuardandoEnNube(true);

      try {
        const compressedDataUrl = await comprimirFoto(file, 1600, 0.82);
        setFotoProgramacion(compressedDataUrl);
        setFormatoActivo('imagen');

        try {
          localStorage.setItem(PROGRAMACION_IMG_KEY, compressedDataUrl);
        } catch {
          console.warn('Espacio limitado para guardar imagen completa localmente.');
        }

        // Guardar en la Nube de Supabase
        if (isSupabaseConfigured) {
          try {
            const { error } = await supabase.from('programacion_multimedia').upsert({
              id: 'actual',
              foto_url: compressedDataUrl,
              updated_at: new Date().toISOString(),
            });

            if (!error) {
              setUsandoSupabase(true);
              alert('✅ ¡Foto de la programación guardada con éxito en la nube! Ya se ve en todos los dispositivos.');
            } else {
              console.warn('Detalle al subir foto a Supabase:', error);
            }
          } catch (supaErr) {
            console.warn('Error al guardar foto en Supabase:', supaErr);
          }
        }
      } catch (err) {
        console.error('Error al procesar la foto:', err);
        alert('Hubo un inconveniente al cargar la fotografía.');
      } finally {
        setGuardandoEnNube(false);
      }
    }
  };

  // Eliminar Foto
  const handleEliminarFoto = async () => {
    if (window.confirm('¿Deseas quitar la imagen actual de la programación? Se quitará de la nube para todos.')) {
      setFotoProgramacion(null);
      localStorage.removeItem(PROGRAMACION_IMG_KEY);
      if (fileInputFotoRef.current) fileInputFotoRef.current.value = '';

      if (isSupabaseConfigured) {
        try {
          await supabase
            .from('programacion_multimedia')
            .update({
              foto_url: null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', 'actual');
        } catch (err) {
          console.warn('Error al limpiar foto en Supabase:', err);
        }
      }
    }
  };

  // Filtrado de filas en la tabla Excel
  const rowsFiltradas = excelData
    ? excelData.rows.filter((r, idx) => {
        if (idx === 0) return true; // Siempre mostrar cabecera
        if (!busquedaExcel.trim()) return true;
        return r.some(c => String(c).toLowerCase().includes(busquedaExcel.toLowerCase()));
      })
    : [];

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="badge">Calendario & Asignaciones</div>
        <h1>Programación de <span>Multimedia</span></h1>
        <p>
          Consulta los turnos del equipo cargando la hoja de cálculo de Excel (.xlsx), la imagen oficial o accediendo al enlace en la nube.
        </p>

        {/* Indicador de Estado Cloud vs Local */}
        <div className="db-status-container" style={{ margin: '12px 0 16px' }}>
          {usandoSupabase ? (
            <span
              className="badge"
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                fontSize: '0.82rem',
              }}
            >
              🟢 Sincronizado en Supabase Cloud (Visible en todas las computadoras)
            </span>
          ) : (
            <span
              className="badge"
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                fontSize: '0.82rem',
              }}
            >
              🟡 Modo Local (LocalStorage)
            </span>
          )}
          {guardandoEnNube && (
            <span className="badge" style={{ marginLeft: 8, background: 'var(--accent-dim)', color: 'var(--accent)' }}>
              ⏳ Guardando en la nube...
            </span>
          )}
        </div>

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
        {/* Banner Informativo con Enlace Oficial */}
        <div className="link-banner-card">
          <div className="link-banner-icon">📊</div>
          <div className="link-banner-info">
            <h3>Hoja Oficial de Roles en Google Sheets</h3>
            <p>
              El rol semanal oficial y dinámico se mantiene en Google Drive. Puedes abrir la hoja en vivo en cualquier momento para ver las últimas actualizaciones realizadas por el liderazgo.
            </p>
          </div>
          <a
            href={LINK_OFICIAL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline btn-open-link"
          >
            Abrir Enlace Oficial ↗
          </a>
        </div>

        {/* Selector de Pestaña: Excel vs Imagen */}
        <div className="formato-tabs-bar">
          <button
            type="button"
            className={`tab-btn ${formatoActivo === 'excel' ? 'active' : ''}`}
            onClick={() => setFormatoActivo('excel')}
          >
            📑 Tabla Interactiva de Excel (.xlsx)
          </button>
          <button
            type="button"
            className={`tab-btn ${formatoActivo === 'imagen' ? 'active' : ''}`}
            onClick={() => setFormatoActivo('imagen')}
          >
            📷 Foto / Afiche de Programación
          </button>
        </div>

        {cargandoNube && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
            ⏳ Consultando programación actualizada desde la nube...
          </div>
        )}

        {/* ======================================================== */}
        {/* PESTAÑA 1: VISOR INTERACTIVO DE EXCEL                    */}
        {/* ======================================================== */}
        {formatoActivo === 'excel' && (
          <div className="excel-prog-section">
            <div className="excel-prog-header">
              <div>
                <h2 className="section-title">
                  Hoja de <span>Programación Excel</span>
                </h2>
                <p className="section-subtitle">
                  {excelData
                    ? `Archivo: ${excelData.fileName} • ${excelData.rows.length} filas leídas ${
                        excelData.sheetName ? `(${excelData.sheetName})` : ''
                      }`
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
                        title="Quitar archivo Excel de la nube"
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

            {/* Selector de pestañas / hojas si el libro tiene más de una */}
            {excelData && excelData.hojas && excelData.hojas.length > 1 && (
              <div className="excel-sheets-selector">
                <span className="sheets-label">📑 Pestañas del libro:</span>
                {excelData.hojas.map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`sheet-tab-chip ${excelData.sheetName === h.sheetName ? 'active' : ''}`}
                    onClick={() => {
                      setExcelData({
                        ...excelData,
                        sheetName: h.sheetName,
                        rows: h.rows,
                      });
                    }}
                  >
                    {h.sheetName} ({h.rows.length} filas)
                  </button>
                ))}
              </div>
            )}

            {excelData && excelData.rows.length > 0 ? (
              <div className="excel-viewer-card">
                {/* Buscador dentro del Excel */}
                <div className="excel-search-bar">
                  <input
                    type="text"
                    placeholder="🔍 Filtrar por nombre de encargado, fecha o área..."
                    value={busquedaExcel}
                    onChange={e => setBusquedaExcel(e.target.value)}
                    className="excel-search-input"
                  />
                  {busquedaExcel && (
                    <span className="excel-search-count">
                      Mostrando {rowsFiltradas.length} fila(s)
                    </span>
                  )}
                  {busquedaExcel && (
                    <button
                      type="button"
                      className="btn-link"
                      onClick={() => setBusquedaExcel('')}
                    >
                      Limpiar filtro
                    </button>
                  )}
                </div>

                {/* Tabla de Excel con scroll horizontal responsivo */}
                <div className="table-responsive-container">
                  <table className="excel-table">
                    <thead>
                      <tr>
                        {excelData.rows[0].map((headerCell, idx) => (
                          <th key={idx}>{String(headerCell)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rowsFiltradas.slice(1).map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {row.map((cell, colIdx) => (
                            <td key={colIdx}>{String(cell)}</td>
                          ))}
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
                <h3>Aún no se ha cargado una hoja de Excel con filas</h3>
                <p>
                  {isAdmin
                    ? 'Haz clic aquí o en el botón superior para subir el archivo .xlsx con la programación.'
                    : 'Puedes consultar el enlace oficial de la programación en la nube o consultar la pestaña de afiche.'}
                </p>
                {isAdmin && (
                  <span className="btn-link" style={{ marginTop: 12 }}>
                    + Seleccionar archivo Excel (.xlsx)
                  </span>
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
                        title="Quitar foto actual de la nube"
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
        <div className="prog-lightbox-overlay" onClick={() => setLightboxAbierto(false)}>
          <div className="prog-lightbox-container" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="prog-lightbox-close"
              onClick={() => setLightboxAbierto(false)}
            >
              ✕
            </button>
            <img src={fotoProgramacion} alt="Programación completa" className="prog-lightbox-img" />
            <div className="prog-lightbox-footer">
              <span>Programación Multimedia • ICJ Santa Ana</span>
              <a
                href={fotoProgramacion}
                download="Programacion_Multimedia.jpg"
                className="btn-primary"
              >
                📥 Descargar Afiche
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramacionMultimedia;
