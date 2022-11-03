import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";

import { AuthProvider } from "./context/AuthProvider";

import CharitiesIndexGrid from './components/charities/CharitiesIndexGrid';

import './index.css';
import App from './App';

const theme = createTheme({
  palette: {
    primary: { main: '#48416c' },
    secondary: { main: '#edc18d' },
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
              <Route path="/" element={<App />}>
                <Route path="charities" element={<CharitiesIndexGrid />} />
                <Route
                  path="*"
                  element={
                    <main style={{ padding: "1rem" }}>
                      <p style={{ color: "white" }}>There's nothing here!</p>
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