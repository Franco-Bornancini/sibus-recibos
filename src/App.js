import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Init from "./pages/Init";
import AdminInit from './modules/gerente/pages/initG';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Init />} />
        <Route path="/administrador" element={<AdminInit />} />
      </Routes>
    </Router>
  );
}

export default App;
