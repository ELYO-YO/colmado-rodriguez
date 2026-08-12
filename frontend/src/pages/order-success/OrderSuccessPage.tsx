import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  checkmarkCircleOutline,
  homeOutline,
  receiptOutline,
} from 'ionicons/icons';

import {
  useHistory,
  useParams,
} from 'react-router-dom';

import './OrderSuccessPage.css';

interface RouteParams {
  id: string;
}

function OrderSuccessPage() {
  const history = useHistory();

  const { id } = useParams<RouteParams>();

  return (
    <IonPage>
      <IonContent fullscreen>

        <div className="order-success-page">

          {/* Icono de éxito */}
          <div className="success-icon">
            <IonIcon
              icon={checkmarkCircleOutline}
            />
          </div>

          {/* Título */}
          <h1>
            ¡Pedido realizado!
          </h1>

          <p className="success-message">
            Tu pedido ha sido recibido correctamente.
          </p>

          {/* Número real del pedido */}
          <div className="order-number">

            <span>
              Número de pedido
            </span>

            <strong>
              #{id}
            </strong>

          </div>

          <p className="delivery-message">
            Pronto nos pondremos en contacto contigo
            para confirmar los detalles de la entrega.
          </p>

          {/* Ver pedido */}
          <button
            className="order-detail-button"
            onClick={() =>
              history.push(`/pedidos/${id}`)
            }
          >
            <IonIcon icon={receiptOutline} />

            Ver mi pedido
          </button>

          {/* Volver al inicio */}
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