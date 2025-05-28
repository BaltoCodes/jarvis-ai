import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthNavigate } from './AuthNavigate.jsx'



const login = async () => {
  const res = await fetch('http://localhost:5000/api/login', { method: 'POST' });
  const data = await res.json();
  localStorage.setItem('token', data.token);
};

const fetchSecureData = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/secure-data', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await res.json();
  return data.key
};

await login();
const GOOGLE_KEY = await fetchSecureData();

const router = createBrowserRouter(
  [
    {element: <AuthNavigate />,
      children : [
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


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_KEY}>
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
    </StrictMode>
);