import {
  IonApp,
  IonRouterOutlet,
} from '@ionic/react';

import {
  IonReactRouter,
} from '@ionic/react-router';

import {
  Route,
} from 'react-router-dom';

import {
  CartProvider,
} from './context/CartContext';

import HomePage from './pages/home/HomePage';

import ProductDetailPage from './pages/product/ProductDetailPage';

import CheckoutPage from './pages/checkout/CheckoutPage';

import OrderSuccessPage from './pages/order-success/OrderSuccessPage';

import LoginPage from './pages/login/LoginPage';

import RegisterPage from './pages/register/RegisterPage';

import ProfilePage from './pages/profile/ProfilePage';

import OrdersPage from './pages/orders/OrdersPage';

import OrderDetailPage from './pages/orders/OrderDetailPage';

import OrderManagementPage from './pages/order-management/OrderManagementPage';

import OrderManagementDetailPage from './pages/order-management-detail/OrderManagementDetailPage';

import DashboardPage from './pages/dashboard/DashboardPage';

import AddProductPage from './pages/product-management/AddProductPage';

import OfferManagementPage from './pages/offer-management/OfferManagementPage';

import ProductManagementPage from './pages/product-management-list/ProductManagementPage';

import EditProductPage from './pages/product-edit/EditProductPage';

import CategoryManagementPage from './pages/category-management/CategoryManagementPage';

import UserManagementPage from './pages/user-management/UserManagementPage';

import EmployeeProductConsultationPage from './pages/employee-product-consultation/EmployeeProductConsultationPage';


function App() {
  return (
    <IonApp>
      <CartProvider>
        <IonReactRouter>
          <IonRouterOutlet>

            {/* =====================================
                HOME
            ====================================== */}

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


            {/* =====================================
                PRODUCTOS CLIENTE
            ====================================== */}

            <Route
              exact
              path="/producto/:id"
              component={ProductDetailPage}
            />


            {/* =====================================
                CHECKOUT
            ====================================== */}

            <Route
              exact
              path="/checkout"
              component={CheckoutPage}
            />

            <Route
              exact
              path="/pedido-realizado/:id"
              component={OrderSuccessPage}
            />


            {/* =====================================
                AUTENTICACIÓN
            ====================================== */}

            <Route
              exact
              path="/login"
              component={LoginPage}
            />

            <Route
              exact
              path="/registro"
              component={RegisterPage}
            />

            <Route
              exact
              path="/perfil"
              component={ProfilePage}
            />


            {/* =====================================
                PEDIDOS DEL CLIENTE
            ====================================== */}

            <Route
              exact
              path="/pedidos"
              component={OrdersPage}
            />

            <Route
              exact
              path="/pedidos/:id"
              component={OrderDetailPage}
            />


            {/* =====================================
                GESTIÓN DE PEDIDOS
                ADMIN / EMPLEADO
            ====================================== */}

            <Route
              exact
              path="/gestion-pedidos"
              component={OrderManagementPage}
            />

            <Route
              exact
              path="/gestion-pedidos/:id"
              component={OrderManagementDetailPage}
            />


            {/* =====================================
                DASHBOARD
            ====================================== */}

            <Route
              exact
              path="/dashboard"
              component={DashboardPage}
            />


            {/* =====================================
                CONSULTA DE PRODUCTOS EMPLEADO
                Poner antes de rutas dinámicas
            ====================================== */}

            <Route
              exact
              path="/dashboard/productos/consulta"
              component={EmployeeProductConsultationPage}
            />


            {/* =====================================
                PRODUCTOS ADMIN
            ====================================== */}

            <Route
              exact
              path="/dashboard/productos/nuevo"
              component={AddProductPage}
            />

            <Route
              exact
              path="/dashboard/productos"
              component={ProductManagementPage}
            />

            <Route
              exact
              path="/dashboard/productos/:id/editar"
              component={EditProductPage}
            />


            {/* =====================================
                OFERTAS
            ====================================== */}

            <Route
              exact
              path="/dashboard/ofertas"
              component={OfferManagementPage}
            />


            {/* =====================================
                CATEGORÍAS
            ====================================== */}

            <Route
              exact
              path="/dashboard/categorias"
              component={CategoryManagementPage}
            />


            {/* =====================================
                USUARIOS
            ====================================== */}

            <Route
              exact
              path="/dashboard/usuarios"
              component={UserManagementPage}
            />

          </IonRouterOutlet>
        </IonReactRouter>
      </CartProvider>
    </IonApp>
  );
}

export default App;