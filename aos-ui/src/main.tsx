import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ArweaveWalletKit } from 'arweave-wallet-kit';
import { ConfigProvider, theme } from 'antd';

import { router } from './router';

import './globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ArweaveWalletKit>
      <ConfigProvider
        theme={
          {
            // algorithm: theme.defaultAlgorithm,
            token: {
              colorPrimary: '#fa541c',
            },
          }
        }
        prefixCls="aos"
      >
        <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
      </ConfigProvider>
    </ArweaveWalletKit>
  </React.StrictMode>
);
