import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';

import { CartProvider } from './context/CartContext';

import HomePage from './pages/home/HomePage';
import ProductDetailPage from './pages/product/ProductDetailPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrderSuccessPage from './pages/order-success/OrderSuccessPage';


function App() {
  return (
    <IonApp>
      <CartProvider>
        <IonReactRouter>
          <IonRouterOutlet>

            <Route
              exact
              path="/"
              component={HomePage}
            />

            <Route
              exact
              path="/home"
              component={HomePage}
            />

            <Route
              exact
              path="/producto/:id"
              component={ProductDetailPage}
            />

            <Route path="/checkout" component={CheckoutPage} />

            <Route
             exact
             path="/pedido-realizado"
             component={OrderSuccessPage}
            />

          </IonRouterOutlet>
        </IonReactRouter>
      </CartProvider>
    </IonApp>
  );
}

export default App;