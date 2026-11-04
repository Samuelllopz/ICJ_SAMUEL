import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Inicio from './pages/Inicio';
import EncargadosMultimedia from './pages/EncargadosMultimedia';
import ProgramacionMultimedia from './pages/ProgramacionMultimedia';
import Camara from './pages/areas/Camara';
import FotosYLuces from './pages/areas/FotosYLuces';
import Transmision from './pages/areas/Transmision';
import Proyeccion from './pages/areas/Proyeccion';
import Alabanzas from './pages/Alabanzas';
import GaleriaServicios from './pages/GaleriaServicios';
import Consejos from './pages/Consejos';
import Recursos from './pages/Recursos';
import Contacto from './pages/Contacto';
import AcercaDe from './pages/AcercaDe';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/encargados" element={<EncargadosMultimedia />} />
            <Route path="/programacion" element={<ProgramacionMultimedia />} />
            
            {/* Áreas individuales */}
            <Route path="/areas" element={<Navigate to="/areas/camara" replace />} />
            <Route path="/areas/camara" element={<Camara />} />
            <Route path="/areas/fotos-y-luces" element={<FotosYLuces />} />
            <Route path="/areas/transmision" element={<Transmision />} />
            <Route path="/areas/proyeccion" element={<Proyeccion />} />
            
            {/* Redirección para compatibilidad previa */}
            <Route path="/areas/transmision-y-proyeccion" element={<Navigate to="/areas/transmision" replace />} />

            {/* Nuevo apartado de Alabanzas */}
            <Route path="/alabanzas" element={<Alabanzas />} />

            {/* Galería con carga y separación por fechas */}
            <Route path="/galeria" element={<GaleriaServicios />} />

            <Route path="/consejos" element={<Consejos />} />
            <Route path="/recursos" element={<Recursos />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/acerca-de" element={<AcercaDe />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
