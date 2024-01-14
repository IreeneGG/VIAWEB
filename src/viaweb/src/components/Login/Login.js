import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { useToken } from './TokenContext'; // Importa useToken desde tu contexto

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setAuthToken } = useToken(); // Obtén la función setAuthToken del contexto

  const handleLogin = async () => {
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      console.log("Datos de autenticación enviados:", username, password);
      const response = await axios.post('/api/auth/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log("response.status:", response.status);
      console.log("TOKEN:", response.data.access_token)
      if (response.status === 200) {
        // Almacena el token en el contexto utilizando setAuthToken
        setAuthToken(response.data.access_token);

        // Almacena el token JWT en el almacenamiento local
        localStorage.setItem('token', response.data.access_token);

        onLogin();
        navigate('/home');
        console.log('INICIO DE SESIÓN EXITOSO', response.data);
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
    }
  };

  const handleRegister = async () => {
    try {
      const userData = {
        username: username,
        password: password,
      };
      console.log("Datos de registro enviados:", username, password);
      const response = await axios.post('/api/auth/register', userData);

      if (response.status === 200) {
        //aqui
      }
    } catch (error) {
      console.error('Error de registro:', error);
    }
  };

  return (
    <div>
      <h1 className="main-title">VIAWEB</h1>
      <div className="auth-container">
        <h2>Autenticación</h2>
        <form>
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="button" onClick={handleLogin}>Iniciar Sesión</button>
          <button type="button" onClick={handleRegister}>Registrarse</button>
        </form>
      </div>
    </div>

  );
};

export default Login;
