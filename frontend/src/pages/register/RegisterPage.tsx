import { useState, type FormEvent } from 'react';
import { useHistory } from 'react-router-dom';

import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  arrowBackOutline,
  personOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';

import './RegisterPage.css';


interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}


function RegisterPage() {
  const history = useHistory();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password ||
      !passwordConfirm
    ) {
      setError(
        'Completa todos los campos.'
      );

      return;
    }

    if (password !== passwordConfirm) {
      setError(
        'Las contraseñas no coinciden.'
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'http://127.0.0.1:8000/api/auth/register/',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            password,
            password_confirm: passwordConfirm,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          'Error registrando usuario:',
          data
        );

        if (data.username) {
          setError(
            'Ese nombre de usuario ya está registrado.'
          );

          return;
        }

        if (data.email) {
          setError(
            'Ese correo electrónico no es válido.'
          );

          return;
        }

        if (data.password_confirm) {
          setError(
            data.password_confirm[0]
          );

          return;
        }

        setError(
          'No se pudo crear la cuenta.'
        );

        return;
      }

      const user =
        data as RegisterResponse;

      console.log(
        'Usuario registrado:',
        user
      );

      history.replace('/login');

    } catch (error) {
      console.error(error);

      setError(
        'No se pudo conectar con el servidor.'
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <IonPage>

      <IonContent fullscreen>

        <div className="register-page">

          <div className="register-container">

            <button
              type="button"
              className="register-back"
              onClick={() =>
                history.goBack()
              }
              aria-label="Volver"
            >
              <IonIcon
                icon={arrowBackOutline}
              />
            </button>


            <div className="register-brand">

              <img
                src="/images/logo/logo-colmado-rodriguez.png"
                alt="Colmado Rodríguez"
              />

              <h1>
                Crea tu cuenta
              </h1>

              <p>
                Regístrate para realizar tus
                pedidos y consultar tus compras.
              </p>

            </div>


            <form
              className="register-form"
              onSubmit={handleSubmit}
            >

              <div className="register-name-grid">

                <label>

                  Nombre

                  <div className="register-input">

                    <IonIcon
                      icon={personOutline}
                    />

                    <input
                      type="text"
                      placeholder="Nombre"
                      value={firstName}
                      onChange={(event) =>
                        setFirstName(
                          event.target.value
                        )
                      }
                    />

                  </div>

                </label>


                <label>

                  Apellido

                  <div className="register-input">

                    <IonIcon
                      icon={personOutline}
                    />

                    <input
                      type="text"
                      placeholder="Apellido"
                      value={lastName}
                      onChange={(event) =>
                        setLastName(
                          event.target.value
                        )
                      }
                    />

                  </div>

                </label>

              </div>


              <label>

                Nombre de usuario

                <div className="register-input">

                  <IonIcon
                    icon={personOutline}
                  />

                  <input
                    type="text"
                    placeholder="Como quieres que te llamemos?"
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

                Correo electrónico

                <div className="register-input">

                  <IonIcon
                    icon={mailOutline}
                  />

                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    autoComplete="email"
                  />

                </div>

              </label>


              <label>

                Contraseña

                <div className="register-input">

                  <IonIcon
                    icon={lockClosedOutline}
                  />

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Crea una contraseña"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    aria-label="Mostrar contraseña"
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

              </label>


              <label>

                Confirmar contraseña

                <div className="register-input">

                  <IonIcon
                    icon={lockClosedOutline}
                  />

                  <input
                    type={
                      showPasswordConfirm
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Repite la contraseña"
                    value={passwordConfirm}
                    onChange={(event) =>
                      setPasswordConfirm(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPasswordConfirm(
                        (current) => !current
                      )
                    }
                    aria-label="Mostrar contraseña"
                  >
                    <IonIcon
                      icon={
                        showPasswordConfirm
                          ? eyeOffOutline
                          : eyeOutline
                      }
                    />
                  </button>

                </div>

              </label>


              {error && (
                <div className="register-error">
                  {error}
                </div>
              )}


              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >
                {loading
                  ? 'Creando cuenta...'
                  : 'Crear cuenta'}
              </button>


              <div className="register-login">

                <span>
                  ¿Ya tienes una cuenta?
                </span>

                <button
                  type="button"
                  onClick={() =>
                    history.push('/login')
                  }
                >
                  Iniciar sesión
                </button>

              </div>

            </form>

          </div>

        </div>

      </IonContent>

    </IonPage>
  );
}


export default RegisterPage;