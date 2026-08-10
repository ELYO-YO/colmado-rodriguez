import { useEffect, useState } from 'react';
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
} from 'ionicons/icons';

import './ProfilePage.css';

function ProfilePage() {
  const history = useHistory();

  const [username, setUsername] = useState('Usuario');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      history.replace('/login');
      return;
    }

    const savedUsername = localStorage.getItem('username');

    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');

    history.replace('/login');
  };

  return (
    <IonPage>
      <IonContent fullscreen>

        <div className="profile-page">

          <header className="profile-header">
            <button
              className="profile-back"
              onClick={() => history.goBack()}
              aria-label="Volver"
            >
              <IonIcon icon={arrowBackOutline} />
            </button>

            <h1>Mi perfil</h1>
          </header>

          <section className="profile-card">

            <div className="profile-avatar">
              <IonIcon icon={personCircleOutline} />
            </div>

            <h2>{username}</h2>

            <span>
              Cliente de Colmado Rodríguez
            </span>

          </section>

          <section className="profile-options">

            <button
              onClick={() => history.push('/pedidos')}
            >
              <div className="profile-option-icon">
                <IonIcon icon={receiptOutline} />
              </div>

              <div>
                <strong>Mis pedidos</strong>
                <span>
                  Consulta tu historial de compras
                </span>
              </div>
            </button>

            <button
              className="logout-option"
              onClick={handleLogout}
            >
              <div className="profile-option-icon">
                <IonIcon icon={logOutOutline} />
              </div>

              <div>
                <strong>Cerrar sesión</strong>
                <span>Salir de tu cuenta</span>
              </div>
            </button>

          </section>

        </div>

      </IonContent>
    </IonPage>
  );
}

export default ProfilePage;