/**
 * Main entry point for the renderer process
 *
 * Sets up the React root and renders the main App component.
 * The renderer process handles the UI for the Switch Software Controller application.
 */

import './assets/main.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
