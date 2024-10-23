import { createBrowserRouter } from 'react-router-dom';

import { ErrorBoundary, NotFound } from './pages/errors';
import { Layout } from './pages/Layout';

import { Home } from './pages/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Home />,
        children: [
          { path: '/chat', element: <div>Chat</div> },
          { path: '/inbox', element: <div>Inbox</div> },
        ],
      },
      // { path: '/safe-tx', element: <SafeTx /> },
      // {
      //   path: '/tools',
      //   element: <ToolsLayout />,
      //   children: [
      //     { path: '/tools', element: <ToolsHome /> },
      //     { path: '/tools/exchange', element: <ExchangeTools /> },
      //     { path: '/tools/evmdev', element: <EvmDevTools /> },
      //     { path: '*', element: <NotFound /> },
      //   ],
      // },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
