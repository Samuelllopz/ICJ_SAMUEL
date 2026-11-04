import React from 'react';
import { NavLink } from 'react-router-dom';
import './AreaSubNav.css';

export const areasList = [
  { to: '/areas/camara', label: '📷 Cámara' },
  { to: '/areas/fotos-y-luces', label: '💡 Fotos y Luces' },
  { to: '/areas/transmision', label: '📡 Transmisión' },
  { to: '/areas/proyeccion', label: '🖥️ Proyección' },
];

const AreaSubNav: React.FC = () => {
  return (
    <nav className="area-subnav" aria-label="Subnavegación de áreas">
      <div className="area-subnav-inner">
        {areasList.map(area => (
          <NavLink
            key={area.to}
            to={area.to}
            className={({ isActive }) =>
              isActive ? 'area-subnav-link active' : 'area-subnav-link'
            }
          >
            {area.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default AreaSubNav;
