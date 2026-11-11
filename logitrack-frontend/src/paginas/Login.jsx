import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

/** Formulario de inicio de sesión: usa el endpoint de login de security-service a través del gateway. */
export default function Login() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const ubicacion = useLocation();
  const [usuarioOEmail, setUsuarioOEmail] = useState('');
  const [clave, setClave] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) {
    return <Navigate to="/envios" replace />;
  }

  const enviar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      await login(usuarioOEmail.trim(), clave);
      navigate(ubicacion.state?.desde ?? '/envios', { replace: true });
    } catch {
      setEnviando(false);
    }
  };

  return (
    <div className="login">
      <form className="tarjeta login-tarjeta" onSubmit={enviar}>
        <h1>
          <img src="/logitrack.svg" alt="" width="36" height="36" /> LogiTrack
        </h1>
        <p className="tenue">Gestión y seguimiento de envíos</p>
        <label>
          Usuario o email
          <input value={usuarioOEmail} onChange={(e) => setUsuarioOEmail(e.target.value)} autoComplete="username" required autoFocus />
        </label>
        <label>
          Contraseña
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} autoComplete="current-password" required />
        </label>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>
        <p className="tenue pie-login">
          ¿No tenés cuenta? <Link to="/registro">Crear una cuenta de cliente</Link>
        </p>
      </form>
    </div>
  );
}
