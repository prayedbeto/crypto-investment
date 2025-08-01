import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Rutas adicionales para el futuro */}
            <Route path="/portfolio" element={<div className="p-8">Portfolio (en desarrollo)</div>} />
            <Route path="/market" element={<div className="p-8">Mercado (en desarrollo)</div>} />
            <Route path="/profile" element={<div className="p-8">Perfil (en desarrollo)</div>} />
            
            {/* Ruta 404 */}
            <Route path="*" element={<div className="p-8 text-center">Página no encontrada</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
