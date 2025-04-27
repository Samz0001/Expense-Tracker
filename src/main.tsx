import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import  {BrowserRouter} from 'react-router-dom'
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <App />
    </AuthProvider>
   </BrowserRouter>
  </React.StrictMode>
);
