import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App';
import './app/App.css';
import reportWebVitals from './reportWebVitals';
import UserService from './app/service/user-service';
import { HelmetProvider } from 'react-helmet-async';

const container = document.getElementById('root')!;
const root = createRoot(container);

const onAuthenticatedCallback = () =>
  root.render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>
  );

UserService.initKeycloak(onAuthenticatedCallback);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
