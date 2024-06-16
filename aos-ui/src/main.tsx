import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ArweaveWalletKit } from 'arweave-wallet-kit';

import { router } from './router';

import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ArweaveWalletKit>
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
    </ArweaveWalletKit>
  </React.StrictMode>
);
