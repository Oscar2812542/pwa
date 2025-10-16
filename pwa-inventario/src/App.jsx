// src/App.jsx
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// 🧩 CARGA DIFERIDA DE PÁGINAS (Lazy Loading)
const InventarioGlobal = lazy(() => import('./pages/InventarioGlobal'));
const FormularioEntrada = lazy(() => import('./pages/FormularioEntrada'));
const FormularioSalida = lazy(() => import('./pages/FormularioSalida'));
const ReporteCaducidades = lazy(() => import('./pages/ReporteCaducidades'));
const ReporteHistorial = lazy(() => import('./pages/ReporteHistorial'));
const FormularioModificarEntrada = lazy(() => import('./pages/ModificarMovimiento'));

// 🌐 NAVBAR optimizado (mejor semántica y menor render)
const NavBar = () => (
  <nav
    style={{
      backgroundColor: '#6ea6beff',
      color: '#ffffff',
      textAlign: 'center',
      padding: '15px 10px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}
  >
    <NavLink to="/" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>
      Inventario Global
    </NavLink>
    <NavLink to="/entrada" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>
      Nueva Entrada
    </NavLink>
    <NavLink to="/salida" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>
      Nueva Salida
    </NavLink>
    <NavLink to="/informes" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>
      Trazabilidad / PDF
    </NavLink>
  </nav>
);

function App() {
  return (
    <BrowserRouter>
      <header>
        <h2 style={{ padding: '10px 20px', margin: 0, textAlign: 'center' }}>Pwa </h2>
        <NavBar />
      </header>

      <main style={{ padding: '20px' }}>
        {/* ⏳ Suspense mejora UX mientras carga los módulos */}
        <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando módulo...</div>}>
          <Routes>
            <Route path="/" element={<InventarioGlobal />} />
            <Route path="/entrada" element={<FormularioEntrada />} />
            <Route path="/salida" element={<FormularioSalida />} />
            <Route path="/caducidades" element={<ReporteCaducidades />} />
            <Route path="/informes" element={<ReporteHistorial />} />
            <Route path="/movimientos/modificar/:id" element={<FormularioModificarEntrada />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );

  
}

export default App;
