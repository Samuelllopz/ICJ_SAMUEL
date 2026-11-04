// ===== Gallery Hook - Supabase + LocalStorage fallback + Canvas compression =====
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export interface Album {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
  coverUrl?: string;
  photoCount?: number;
}

export interface ImageMeta {
  id: string;
  name: string;
  addedAt: number;
}

export interface GalleryImage extends ImageMeta {
  dataUrl: string;
}

const ALBUMS_KEY = 'icj-gallery-albums';
const albumImgsKey = (id: string) => `icj-imgs-${id}`;
const imgDataKey  = (id: string) => `icj-img-${id}`;

// ── Compress image via Canvas ────────────────────────────────
export async function compressImage(file: File, maxPx = 1200, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = ev => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width: w, height: h } = img;
        if (w > maxPx || h > maxPx) {
          if (w >= h) { h = Math.round(h * maxPx / w); w = maxPx; }
          else { w = Math.round(w * maxPx / h); h = maxPx; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// ── Storage helpers ──────────────────────────────────────────
function safeGet<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
}

function safeSet(key: string, value: unknown): boolean {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}

// ── Synchronous LocalStorage API ─────────────────────────────

export function getAlbums(): Album[] {
  return safeGet<Album[]>(ALBUMS_KEY, [])
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function saveAlbum(album: Album): boolean {
  const list = safeGet<Album[]>(ALBUMS_KEY, []).filter(a => a.id !== album.id);
  return safeSet(ALBUMS_KEY, [...list, album].sort((a, b) => b.date.localeCompare(a.date)));
}

export function deleteAlbumData(albumId: string): void {
  const metas = safeGet<ImageMeta[]>(albumImgsKey(albumId), []);
  metas.forEach(m => localStorage.removeItem(imgDataKey(m.id)));
  localStorage.removeItem(albumImgsKey(albumId));
  const updated = safeGet<Album[]>(ALBUMS_KEY, []).filter(a => a.id !== albumId);
  safeSet(ALBUMS_KEY, updated);
}

export function getAlbumImageMetas(albumId: string): ImageMeta[] {
  return safeGet<ImageMeta[]>(albumImgsKey(albumId), []);
}

export function getAlbumImages(albumId: string): GalleryImage[] {
  return getAlbumImageMetas(albumId).map(m => ({
    ...m,
    dataUrl: localStorage.getItem(imgDataKey(m.id)) || '',
  }));
}

export function getFirstNImages(albumId: string, n: number): GalleryImage[] {
  const metas = getAlbumImageMetas(albumId).slice(0, n);
  return metas.map(m => ({
    ...m,
    dataUrl: localStorage.getItem(imgDataKey(m.id)) || '',
  }));
}

export async function addImagesToAlbum(
  albumId: string,
  files: File[],
  onProgress?: (done: number, total: number) => void
): Promise<{ added: number; failed: number }> {
  const metas = safeGet<ImageMeta[]>(albumImgsKey(albumId), []);
  let added = 0; let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(i, files.length);
    try {
      const dataUrl = await compressImage(file);
      const id = `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      if (!safeSet(imgDataKey(id), dataUrl)) { failed++; break; } // storage full
      metas.push({ id, name: file.name, addedAt: Date.now() });
      added++;
    } catch { failed++; }
  }

  safeSet(albumImgsKey(albumId), metas);
  onProgress?.(files.length, files.length);
  return { added, failed };
}

export function deleteImageFromAlbum(albumId: string, imgId: string): void {
  const metas = safeGet<ImageMeta[]>(albumImgsKey(albumId), []).filter(m => m.id !== imgId);
  safeSet(albumImgsKey(albumId), metas);
  localStorage.removeItem(imgDataKey(imgId));
}

// ── Asynchronous Supabase + LocalStorage Hybrid API ───────────

export async function fetchAlbumsAsync(): Promise<{ albums: Album[]; fromSupabase: boolean }> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('galeria_albumes')
        .select('*')
        .order('fecha', { ascending: false });

      if (!error && Array.isArray(data)) {
        const albums: Album[] = data.map((row: any) => ({
          id: String(row.id),
          title: String(row.titulo || 'Servicio'),
          date: String(row.fecha),
          createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
          coverUrl: row.portada_url || undefined,
        }));

        // Actualizar caché local
        safeSet(ALBUMS_KEY, albums);
        return { albums, fromSupabase: true };
      }
    } catch (e) {
      console.warn('Error al consultar álbumes en Supabase, recurriendo a local:', e);
    }
  }

  return { albums: getAlbums(), fromSupabase: false };
}

export async function saveAlbumAsync(album: Album): Promise<boolean> {
  saveAlbum(album);

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('galeria_albumes')
        .upsert({
          id: album.id,
          titulo: album.title,
          fecha: album.date,
          portada_url: album.coverUrl || null,
        });
    } catch (e) {
      console.warn('Error guardando álbum en Supabase:', e);
    }
  }

  return true;
}

export async function deleteAlbumAsync(albumId: string): Promise<void> {
  deleteAlbumData(albumId);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('galeria_fotos').delete().eq('album_id', albumId);
      await supabase.from('galeria_albumes').delete().eq('id', albumId);
    } catch (e) {
      console.warn('Error eliminando álbum en Supabase:', e);
    }
  }
}

export async function fetchAlbumImagesAsync(albumId: string): Promise<GalleryImage[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('galeria_fotos')
        .select('*')
        .eq('album_id', albumId)
        .order('created_at', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => ({
          id: String(row.id),
          name: String(row.nombre || 'foto.jpg'),
          addedAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
          dataUrl: String(row.data_url || ''),
        }));
      }
    } catch (e) {
      console.warn('Error cargando fotos de Supabase, usando respaldo local:', e);
    }
  }

  return getAlbumImages(albumId);
}

export async function addImagesToAlbumAsync(
  albumId: string,
  files: File[],
  onProgress?: (done: number, total: number) => void
): Promise<{ added: number; failed: number }> {
  let added = 0;
  let failed = 0;
  const metas = safeGet<ImageMeta[]>(albumImgsKey(albumId), []);
  let firstDataUrl = '';

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(i, files.length);

    try {
      const dataUrl = await compressImage(file, 1200, 0.78);
      if (!firstDataUrl) firstDataUrl = dataUrl;
      const imgId = `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      // Guardar en Supabase si está disponible
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase
            .from('galeria_fotos')
            .upsert({
              id: imgId,
              album_id: albumId,
              nombre: file.name,
              data_url: dataUrl,
            });
          if (error) {
            console.warn('Error guardando foto en Supabase:', error);
          }
        } catch (supaErr) {
          console.warn('Excepción guardando en Supabase:', supaErr);
        }
      }

      // Guardar también en respaldo local si cabe
      safeSet(imgDataKey(imgId), dataUrl);
      metas.push({ id: imgId, name: file.name, addedAt: Date.now() });
      added++;
    } catch (err) {
      console.error('Error procesando imagen:', err);
      failed++;
    }
  }

  safeSet(albumImgsKey(albumId), metas);

  // Si tenemos primera foto, actualizar portada del álbum
  if (firstDataUrl) {
    const albums = getAlbums();
    const target = albums.find(a => a.id === albumId);
    if (target && !target.coverUrl) {
      target.coverUrl = firstDataUrl;
      await saveAlbumAsync(target);
    }
  }

  onProgress?.(files.length, files.length);
  return { added, failed };
}

export async function deleteImageAsync(albumId: string, imgId: string): Promise<void> {
  deleteImageFromAlbum(albumId, imgId);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('galeria_fotos').delete().eq('id', imgId);
    } catch (e) {
      console.warn('Error eliminando foto en Supabase:', e);
    }
  }
}

// ── Utilities ────────────────────────────────────────────────

export function detectDateFromFiles(files: File[]): string {
  if (!files.length) return today();
  const freq: Record<string, number> = {};
  files.forEach(f => {
    const d = new Date(f.lastModified);
    const k = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    freq[k] = (freq[k] || 0) + 1;
  });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

export function groupFilesByDate(files: File[]): Record<string, File[]> {
  const groups: Record<string, File[]> = {};
  files.forEach(f => {
    const d = new Date(f.lastModified);
    const k = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (!groups[k]) groups[k] = [];
    groups[k].push(f);
  });
  return groups;
}

export function getAlbumByDate(date: string): Album | undefined {
  return getAlbums().find(a => a.date === date);
}

export function formatDateEs(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function getStorageInfo(): { usedBytes: number; percent: number } {
  let used = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)!;
    if (k.startsWith('icj-')) used += (localStorage.getItem(k) || '').length;
  }
  const LIMIT = 5 * 1024 * 1024;
  return { usedBytes: used, percent: Math.min(100, Math.round((used / LIMIT) * 100)) };
}

export function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function pad(n: number): string { return String(n).padStart(2, '0'); }
