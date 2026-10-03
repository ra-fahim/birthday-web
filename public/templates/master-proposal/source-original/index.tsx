import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initSiteConfigBridge } from './utils/siteConfig';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Inside the Studio the first render waits (max ~2.5s) for the user's content so
// the visitor never sees the template's default text flash before their own.
initSiteConfigBridge().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
