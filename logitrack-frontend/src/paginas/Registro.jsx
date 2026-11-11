import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { registrarCliente } from '../api/auth';
import { avisar } from '../notificaciones/avisos';

/** Alta de una cuenta CLIENTE. Después de crearla, inicia sesión con esos datos. */
export default function Registro() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ username: '', email: '', password: '' });
  const [enviando, setEnviando] = useState(false);

  if (usuario) {
    return <Navigate to="/envios" replace />;
  }

  const campo = (nombre) => ({
    name: nombre,
    value: datos[nombre],
    onChange: (e) => setDatos((actual) => ({ ...actual, [nombre]: e.target.value })),
  });

  const enviar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      await registrarCliente({ ...datos, username: datos.username.trim(), email: datos.email.trim() });
      avisar('Cuenta creada', 'exito');
      await login(datos.username.trim(), datos.password);
      navigate('/envios', { replace: true });
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
        <p className="tenue">Crear una cuenta de cliente</p>
        <label>
          Usuario
          <input {...campo('username')} autoComplete="username" required minLength={3} maxLength={80} autoFocus />
        </label>
        <label>
          Email
          <input type="email" {...campo('email')} autoComplete="email" required />
        </label>
        <label>
          Contraseña
          <input type="password" {...campo('password')} autoComplete="new-password" required minLength={8} maxLength={72} />
        </label>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Creando…' : 'Crear cuenta'}
        </button>
        <p className="tenue pie-login">
          ¿Ya tenés cuenta? <Link to="/login">Ingresar</Link>
        </p>
      </form>
    </div>
  );
}
