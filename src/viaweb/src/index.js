import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { TokenProvider } from './components/Login/TokenContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TokenProvider>
    <App />
    </TokenProvider>
    
  </React.StrictMode>
);


reportWebVitals();
