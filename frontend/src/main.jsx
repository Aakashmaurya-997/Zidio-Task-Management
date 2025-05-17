import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import process from 'process'; // ✅ keep this one

// 🛠️ Setup global polyfills for Vite + simple-peer
if (typeof globalThis.process === 'undefined') {
  globalThis.process = process;
}

if (typeof globalThis.Buffer === 'undefined') {
  import('buffer').then(({ Buffer }) => {
    globalThis.Buffer = Buffer;
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
