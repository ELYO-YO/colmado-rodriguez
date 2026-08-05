import {
  IonApp,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

function App() {
  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Colmado Rodríguez</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>¡Bienvenido a Colmado Rodríguez! 🏪</h1>
        <p>Tu colmado de siempre, ahora en tu celular.</p>
      </IonContent>
    </IonApp>
  );
}

export default App;