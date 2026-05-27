import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './style.css';

const root = document.getElementById('app');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
