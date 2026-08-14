import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import { useHistory } from 'react-router-dom';

import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  arrowBackOutline,
  personCircleOutline,
  receiptOutline,
  logOutOutline,
  createOutline,
  mailOutline,
  personOutline,
  closeOutline,
  saveOutline,
} from 'ionicons/icons';

import {
  getProfile,
  logoutUser,
  updateProfile,
  type UserProfile,
} from '../../services/authService';

import './ProfilePage.css';


function ProfilePage() {
  const history = useHistory();

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [isEditing, setIsEditing] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [formError, setFormError] =
    useState('');

  const [firstName, setFirstName] =
    useState('');

  const [lastName, setLastName] =
    useState('');

  const [username, setUsername] =
    useState('');

  const [email, setEmail] =
    useState('');


  /* =========================================
     CARGAR PERFIL
  ========================================= */

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);

        setFirstName(
          data.first_name ?? ''
        );

        setLastName(
          data.last_name ?? ''
        );

        setUsername(
          data.username ?? ''
        );

        setEmail(
          data.email ?? ''
        );
      })
      .catch((error) => {
        console.error(
          'Error cargando perfil:',
          error
        );

        if (
          error instanceof Error &&
          (
            error.message.includes('sesión') ||
            error.message.includes('iniciar sesión')
          )
        ) {
          logoutUser();

          history.replace('/login');

          return;
        }

        setError(
          'No se pudo cargar tu perfil.'
        );
      })
      .finally(() => {
        setLoading(false);
      });

  }, [history]);


  /* =========================================
     EDITAR
  ========================================= */

  const handleEdit = () => {
    if (!profile) {
      return;
    }

    setFirstName(
      profile.first_name ?? ''
    );

    setLastName(
      profile.last_name ?? ''
    );

    setUsername(
      profile.username ?? ''
    );

    setEmail(
      profile.email ?? ''
    );

    setFormError('');

    setIsEditing(true);
  };


  /* =========================================
     CANCELAR EDICIÓN
  ========================================= */

  const handleCancelEdit = () => {
    setFormError('');

    setIsEditing(false);
  };


  /* =========================================
     GUARDAR PERFIL
  ========================================= */

  const handleSaveProfile = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setFormError('');

    if (!username.trim()) {
      setFormError(
        'El nombre de usuario es obligatorio.'
      );

      return;
    }

    if (!email.trim()) {
      setFormError(
        'El correo electrónico es obligatorio.'
      );

      return;
    }

    try {
      setIsSaving(true);

      const updatedProfile =
        await updateProfile({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          username: username.trim(),
          email: email.trim(),
        });

      setProfile(
        updatedProfile
      );

      /*
       * Lo mantenemos actualizado
       * para cualquier parte vieja del
       * proyecto que todavía lea username
       * desde localStorage.
       */
      localStorage.setItem(
        'username',
        updatedProfile.username
      );

      setIsEditing(false);

    } catch (error) {
      console.error(
        'Error guardando perfil:',
        error
      );

      setFormError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el perfil.'
      );

    } finally {
      setIsSaving(false);
    }
  };


  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    logoutUser();

    history.replace('/login');
  };


  /* =========================================
     NOMBRE A MOSTRAR
  ========================================= */

  const displayName =
    profile?.first_name ||
    profile?.last_name
      ? `${profile?.first_name ?? ''} ${
          profile?.last_name ?? ''
        }`.trim()
      : profile?.username ??
        'Usuario';


  return (
    <IonPage>

      <IonContent fullscreen>

        <div className="profile-page">


          {/* =================================
              HEADER
          ================================= */}

          <header className="profile-header">

            <button
              type="button"
              className="profile-back"
              onClick={() =>
                history.goBack()
              }
              aria-label="Volver"
            >
              <IonIcon
                icon={arrowBackOutline}
              />
            </button>

            <h1>
              Mi perfil
            </h1>

          </header>


          {/* =================================
              CARGANDO
          ================================= */}

          {loading ? (

            <div className="profile-message">
              Cargando perfil...
            </div>

          ) : error ? (

            <div className="profile-message error">

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  history.push('/')
                }
              >
                Volver al inicio
              </button>

            </div>

          ) : profile ? (

            <>


              {/* =================================
                  TARJETA DE PERFIL
              ================================= */}

              <section className="profile-card">

                <div className="profile-avatar">

                  <IonIcon
                    icon={
                      personCircleOutline
                    }
                  />

                </div>

                <h2>
                  {displayName}
                </h2>

                <span className="profile-username">
                  @{profile.username}
                </span>

                <span className="profile-client-text">
                  Cliente de Colmado Rodríguez
                </span>

              </section>


              {/* =================================
                  DATOS
              ================================= */}

              <section className="profile-data-card">

                <div className="profile-data-header">

                  <div>

                    <h2>
                      Información personal
                    </h2>

                    <span>
                      Datos de tu cuenta
                    </span>

                  </div>

                  {!isEditing && (

                    <button
                      type="button"
                      className="profile-edit-button"
                      onClick={handleEdit}
                    >

                      <IonIcon
                        icon={createOutline}
                      />

                      Editar

                    </button>

                  )}

                </div>


                {!isEditing ? (

                  <div className="profile-data-list">


                    <div className="profile-data-item">

                      <div className="profile-data-icon">

                        <IonIcon
                          icon={personOutline}
                        />

                      </div>

                      <div>

                        <span>
                          Nombre
                        </span>

                        <strong>
                          {profile.first_name ||
                            'No especificado'}
                        </strong>

                      </div>

                    </div>


                    <div className="profile-data-item">

                      <div className="profile-data-icon">

                        <IonIcon
                          icon={personOutline}
                        />

                      </div>

                      <div>

                        <span>
                          Apellido
                        </span>

                        <strong>
                          {profile.last_name ||
                            'No especificado'}
                        </strong>

                      </div>

                    </div>


                    <div className="profile-data-item">

                      <div className="profile-data-icon">

                        <IonIcon
                          icon={personCircleOutline}
                        />

                      </div>

                      <div>

                        <span>
                          Usuario
                        </span>

                        <strong>
                          {profile.username}
                        </strong>

                      </div>

                    </div>


                    <div className="profile-data-item">

                      <div className="profile-data-icon">

                        <IonIcon
                          icon={mailOutline}
                        />

                      </div>

                      <div>

                        <span>
                          Correo
                        </span>

                        <strong>
                          {profile.email ||
                            'No especificado'}
                        </strong>

                      </div>

                    </div>


                  </div>

                ) : (

                  /* =================================
                     FORMULARIO EDITAR
                  ================================= */

                  <form
                    className="profile-edit-form"
                    onSubmit={
                      handleSaveProfile
                    }
                  >


                    <div className="profile-form-grid">


                      <label>

                        Nombre

                        <input
                          type="text"
                          value={firstName}
                          onChange={(event) =>
                            setFirstName(
                              event.target.value
                            )
                          }
                          placeholder="Nombre"
                        />

                      </label>


                      <label>

                        Apellido

                        <input
                          type="text"
                          value={lastName}
                          onChange={(event) =>
                            setLastName(
                              event.target.value
                            )
                          }
                          placeholder="Apellido"
                        />

                      </label>


                    </div>


                    <label>

                      Nombre de usuario

                      <input
                        type="text"
                        value={username}
                        onChange={(event) =>
                          setUsername(
                            event.target.value
                          )
                        }
                        placeholder="Usuario"
                      />

                    </label>


                    <label>

                      Correo electrónico

                      <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(
                            event.target.value
                          )
                        }
                        placeholder="correo@ejemplo.com"
                      />

                    </label>


                    {formError && (

                      <div className="profile-form-error">
                        {formError}
                      </div>

                    )}


                    <div className="profile-form-actions">


                      <button
                        type="button"
                        className="profile-cancel-button"
                        onClick={
                          handleCancelEdit
                        }
                        disabled={isSaving}
                      >

                        <IonIcon
                          icon={closeOutline}
                        />

                        Cancelar

                      </button>


                      <button
                        type="submit"
                        className="profile-save-button"
                        disabled={isSaving}
                      >

                        <IonIcon
                          icon={saveOutline}
                        />

                        {isSaving
                          ? 'Guardando...'
                          : 'Guardar cambios'}

                      </button>


                    </div>


                  </form>

                )}

              </section>


              {/* =================================
                  OPCIONES
              ================================= */}

              <section className="profile-options">


                <button
                  type="button"
                  onClick={() =>
                    history.push(
                      '/pedidos'
                    )
                  }
                >

                  <div className="profile-option-icon">

                    <IonIcon
                      icon={receiptOutline}
                    />

                  </div>

                  <div>

                    <strong>
                      Mis pedidos
                    </strong>

                    <span>
                      Consulta tu historial de compras
                    </span>

                  </div>

                </button>


                <button
                  type="button"
                  className="logout-option"
                  onClick={handleLogout}
                >

                  <div className="profile-option-icon">

                    <IonIcon
                      icon={logOutOutline}
                    />

                  </div>

                  <div>

                    <strong>
                      Cerrar sesión
                    </strong>

                    <span>
                      Salir de tu cuenta
                    </span>

                  </div>

                </button>


              </section>


            </>

          ) : null}


        </div>

      </IonContent>

    </IonPage>
  );
}


export default ProfilePage;