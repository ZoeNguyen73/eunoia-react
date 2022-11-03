import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";

import { AuthProvider } from "./context/AuthProvider";

import CharitiesIndexGrid from './components/charities/CharitiesIndexGrid';
import LoginForm from './components/forms/login-form/LoginForm';
import LogOut from './components/logout/LogOut';
import SignUpForm from './components/forms/signup-form/SignUpForm';
import Activation from './components/activation/Activation';
import RequestActivationEmail from './components/activation/RequestActivationEmail';
import OrganizationRegisterForm from './components/forms/organizations-form/OrganizationRegisterForm';

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
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<App />}>
                <Route path='register' element={<SignUpForm />} />
                <Route path='login' element={<LoginForm />} />
                <Route path='logout' element={<LogOut />} />
                <Route path='charities' element={<CharitiesIndexGrid />} />
                <Route
                  path='users/activate/:activationToken'
                  element={<Activation />}
                />
                <Route
                  path='request-activation-email'
                  element={<RequestActivationEmail />}
                />
                <Route path='organizations/register' element={<OrganizationRegisterForm />} />
                <Route
                  path='*'
                  element={
                    <main style={{ padding: '1rem' }}>
                      <p style={{ color: 'white' }}>There's nothing here!</p>
                    </main>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </StyledEngineProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);