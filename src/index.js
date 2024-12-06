import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
import { HashRouter as Router } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AudioProvider>
  <Provider store={store}>
  <React.StrictMode>
  <Router>
    <App />
  </Router>
  </React.StrictMode>
  </Provider>
  </AudioProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
