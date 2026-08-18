import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  personOutline,
} from 'ionicons/icons';

import {
  getProfile,
  loginUser,
} from '../../services/authService';

import './LoginPage.css';

function LoginPage() {
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const handleLogin = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!username.trim() || !password) {
      setError(
        'Completa el usuario y la contraseña.'
      );
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 1. Iniciar sesión
      const response = await loginUser({
        username: username.trim(),
        password,
      });

      // 2. Guardar los tokens
      localStorage.setItem(
        'accessToken',
        response.access
      );

      localStorage.setItem(
        'refreshToken',
        response.refresh
      );

      localStorage.setItem(
        'username',
        username.trim()
      );

      // 3. Obtener el perfil del usuario
      const profile = await getProfile();

      console.log(
        'USUARIO AUTENTICADO:',
        profile
      );

      console.log(
        'ROL:',
        profile.role
      );

      // 4. Redirección según el rol
      if (
        profile.role === 'admin' ||
        profile.role === 'employee'
      ) {
        history.replace('/dashboard');
      } else {
        history.replace('/');
      }

    } catch (error) {
      console.error(
        'Error iniciando sesión:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo iniciar sesión.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="login-page">

          <div className="login-container">

            <div className="login-header">
  <img
    src="/images/logo/logo-colmado-rodriguez.png"
    alt="Colmado Rodríguez"
    className="login-logo"
  />

  <h1>Inicia sesión</h1>

  <p>
    Ingresa tus credenciales para continuar
  </p>
</div>

            <form
              className="login-form"
              onSubmit={handleLogin}
            >

              <div className="login-field">
                <label htmlFor="username">
                  Usuario
                </label>

                <div className="login-input">
                  <IonIcon
                    icon={personOutline}
                  />

                  <input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(event) =>
                      setUsername(
                        event.target.value
                      )
                    }
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="password">
                  Contraseña
                </label>

                <div className="login-input">
                  <IonIcon
                    icon={lockClosedOutline}
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="login-password-button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? 'Ocultar contraseña'
                        : 'Mostrar contraseña'
                    }
                  >
                    <IonIcon
                      icon={
                        showPassword
                          ? eyeOffOutline
                          : eyeOutline
                      }
                    />
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading
                  ? 'Iniciando sesión...'
                  : 'Iniciar sesión'}
              </button>

            </form>

            <div className="login-register">
              <span>
                ¿No tienes una cuenta?
              </span>

              <button
                type="button"
                onClick={() =>
                  history.push('/registro')
                }
              >
                Crear cuenta
              </button>
            </div>

          </div>

        </div>
      </IonContent>
    </IonPage>
  );
}

export default LoginPage;