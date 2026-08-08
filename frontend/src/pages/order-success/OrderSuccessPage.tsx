import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { checkmarkCircleOutline, homeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import './OrderSuccessPage.css';

function OrderSuccessPage() {
  const history = useHistory();

  const orderNumber = `CR-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="order-success-page">

          <div className="success-icon">
            <IonIcon icon={checkmarkCircleOutline} />
          </div>

          <h1>¡Pedido realizado!</h1>

          <p className="success-message">
            Tu pedido ha sido recibido correctamente.
          </p>

          <div className="order-number">
            <span>Número de pedido</span>
            <strong>{orderNumber}</strong>
          </div>

          <p className="delivery-message">
            Pronto nos pondremos en contacto contigo
            para confirmar los detalles de la entrega.
          </p>

          <button
            className="home-button"
            onClick={() => history.push('/')}
          >
            <IonIcon icon={homeOutline} />
            Volver al inicio
          </button>

        </div>
      </IonContent>
    </IonPage>
  );
}

export default OrderSuccessPage;