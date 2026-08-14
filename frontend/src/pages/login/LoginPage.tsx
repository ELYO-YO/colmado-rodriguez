import { useState, type FormEvent } from 'react';
import { useHistory } from 'react-router-dom';

import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  personOutline,
  lockClosedOutline,
  arrowBackOutline,
} from 'ionicons/icons';

import {
  loginUser,
} from '../../services/authService';

import './LoginPage.css';


function LoginPage() {
  const history = useHistory();

  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState('');


  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');

    if (
      !username.trim() ||
      !password.trim()
    ) {
      setError(
        'Completa usuario y contraseña.'
      );

      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response =
        await loginUser({
          username: username.trim(),
          password,
        });

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

      history.replace('/');

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
      setIsLoading(false);
    }
  };


  return (
    <IonPage>

      <IonContent fullscreen>

        <div className="login-page">

          <button
            type="button"
            className="login-back"
            onClick={() =>
              history.goBack()
            }
            aria-label="Volver"
          >
            <IonIcon
              icon={arrowBackOutline}
            />
          </button>


          <div className="login-card">

            <img
              className="login-logo"
              src="/images/logo/logo-colmado-rodriguez.png"
              alt="Colmado Rodríguez"
            />


            <div className="login-heading">

              <h1>
                Bienvenido
              </h1>

              <p>
                Inicia sesión para continuar
                con tus pedidos.
              </p>

            </div>


            <form
              className="login-form"
              onSubmit={handleSubmit}
            >

              <label>

                Usuario

                <div className="login-input">

                  <IonIcon
                    icon={personOutline}
                  />

                  <input
                    type="text"
                    placeholder="Tu usuario"
                    value={username}
                    onChange={(event) =>
                      setUsername(
                        event.target.value
                      )
                    }
                    autoComplete="username"
                  />

                </div>

              </label>


              <label>

                Contraseña

                <div className="login-input">

                  <IonIcon
                    icon={lockClosedOutline}
                  />

                  <input
                    type="password"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    autoComplete="current-password"
                  />

                </div>

              </label>


              {error && (

                <p className="login-error">
                  {error}
                </p>

              )}


              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >

                {isLoading
                  ? 'Iniciando sesión...'
                  : 'Iniciar sesión'}

              </button>


              <div className="login-register">

                <span>
                  ¿No tienes una cuenta?
                </span>

                <button
                  type="button"
                  onClick={() =>
                    history.push(
                      '/registro'
                    )
                  }
                >
                  Regístrate
                </button>

              </div>

            </form>

          </div>

        </div>

      </IonContent>

    </IonPage>
  );
}


export default LoginPage;