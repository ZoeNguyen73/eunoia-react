import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";

import { AuthProvider } from './context/AuthProvider';
import { CartProvider } from './context/CartProvider';

import CharitiesIndexGrid from './components/charities/CharitiesIndexGrid';
import LoginForm from './components/forms/login-form/LoginForm';
import LogOut from './components/logout/LogOut';
import SignUpForm from './components/forms/signup-form/SignUpForm';
import Activation from './components/activation/Activation';
import RequestActivationEmail from './components/activation/RequestActivationEmail';
import OrganizationRegisterForm from './components/forms/organizations-form/OrganizationRegisterForm';
import AdminPageLayout from './components/admin-pages/page-layout/AdminPageLayout';
import ListingPage from './components/listings/ListingPage';
import Cart from './components/cart/Cart';
import Typography from '@mui/material/Typography';
import Homepage from './components/homepage/Homepage';

import './index.css';
import App from './App';

const theme = createTheme({
  palette: {
    primary: { main: '#154726' },
    secondary: { main: '#F1753F' },
  },
  typography: {
    fontFamily: 'Nunito Sans',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ThemeProvider theme={theme}>
          <StyledEngineProvider injectFirst>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<App />}>
                  <Route path='cart' element={<Cart />} />
                  <Route path='listings' element={<ListingPage />} />
                  <Route path='register' element={<SignUpForm />} />
                  <Route path='login' element={<LoginForm />} />
                  <Route path='logout' element={<LogOut />} />
                  <Route path='charities' element={<CharitiesIndexGrid />} />
                  <Route path='admin' element={<AdminPageLayout />} />
                  <Route
                    path='users/activate/:activationToken'
                    element={<Activation />}
                  />
                  <Route
                    path='request-activation-email'
                    element={<RequestActivationEmail />}
                  />
                  <Route path='organizations/register' element={<OrganizationRegisterForm />} />
                  <Route path='' element={<Homepage />} />
                  <Route path='eunoia-react' element={<Homepage />} />
                  <Route
                    path='*'
                    element={
                      <main style={{ padding: '1rem' }}>
                        <Typography variant='h4' color='var(--color2)'>There's nothing here!</Typography>
                      </main>
                    }
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          </StyledEngineProvider>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);