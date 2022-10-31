import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthProvider";

import CharitiesIndexGrid from './components/charities/CharitiesIndexGrid';

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
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
    </AuthProvider>
  </React.StrictMode>
);