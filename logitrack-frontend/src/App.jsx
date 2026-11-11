import { Navigate, Route, Routes } from 'react-router-dom';
import RutaPrivada from './auth/RutaPrivada';
import { PERMISOS } from './auth/roles';
import Layout from './componentes/Layout';
import EnvioDetalle from './paginas/EnvioDetalle';
import EnvioNuevo from './paginas/EnvioNuevo';
import Envios from './paginas/Envios';
import Login from './paginas/Login';
import NoEncontrada from './paginas/NoEncontrada';
import RepartidorForm from './paginas/RepartidorForm';
import Registro from './paginas/Registro';
import Repartidores from './paginas/Repartidores';

/**
 * Rutas de la app. Todo lo que está adentro de RutaPrivada pide sesión; las que tienen roles,
 * además piden uno de esos roles.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route element={<RutaPrivada />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/envios" replace />} />
          <Route path="/envios" element={<Envios />} />
          <Route element={<RutaPrivada roles={PERMISOS.crearEnvio} />}>
            <Route path="/envios/nuevo" element={<EnvioNuevo />} />
          </Route>
          <Route path="/envios/:id" element={<EnvioDetalle />} />
          <Route element={<RutaPrivada roles={PERMISOS.verRepartidores} />}>
            <Route path="/repartidores" element={<Repartidores />} />
          </Route>
          <Route element={<RutaPrivada roles={PERMISOS.gestionarRepartidores} />}>
            <Route path="/repartidores/nuevo" element={<RepartidorForm />} />
            <Route path="/repartidores/:id/editar" element={<RepartidorForm />} />
          </Route>
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Route>
    </Routes>
  );
}
