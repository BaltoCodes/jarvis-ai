import React, { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthNavigate } from './AuthNavigate.jsx';

const router = createBrowserRouter(
  [
    {
      element: <AuthNavigate />,
      children: [
        { path: '/', element: <App /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const RootApp = () => {
  const [googleKey, setGoogleKey] = useState(null);
  const urlProd = "https://jarvis-ai.eu"
  const urlDev = "http://127.0.0.1:5000"
  useEffect(() => {
    const loginAndFetchKey = async () => {
      try {
        const loginRes = await fetch(urlProd + '/api/login', {
          method: 'POST',
        });
        const loginData = await loginRes.json();
        localStorage.setItem('token', loginData.token);

        const token = loginData.token;
        const keyRes = await fetch(urlProd + '/api/secure-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const keyData = await keyRes.json();
        setGoogleKey(keyData.key);
      } catch (err) {
        console.error('Erreur lors de la récupération de la clé Google:', err);
      }
    };

    loginAndFetchKey();
  }, []);

  if (!googleKey) return null; // ou un spinner

  return (
    <StrictMode>
      <GoogleOAuthProvider clientId={googleKey}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RootApp />);
