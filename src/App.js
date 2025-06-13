import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Init from "./pages/Init";
import AdminInit from './modules/administrador/pages/initG';
import RecuperarContrasena from "./components/RecuperarContraseña";
import DownloadsReport from './modules/administrador/pages/DownloadsReport';
import AdminUsuarios  from './modules/administrador/pages/AdminUsuarios';
import ReclamosAdmin from './modules/administrador/pages/ReclamosAdmin';
import AdminLayout from './modules/administrador/pages/AdminLayout';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Init />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
        <Route path="/administrador" element={<AdminLayout />}>
          <Route index element={<AdminInit />} />
          <Route path="descargas" element={<DownloadsReport />} />
          <Route path="administrar_usuarios" element={<AdminUsuarios  />} />
          <Route path="reclamos" element={<ReclamosAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
