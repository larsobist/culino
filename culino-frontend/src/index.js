import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

// Wrap your app component with the Router component
const app = (
  <Router>
    <App />
  </Router>
);

const rootElement = document.getElementById('root');
// Use ReactDOM.createRoot().render() to render the app
ReactDOM.createRoot(rootElement).render(app);
