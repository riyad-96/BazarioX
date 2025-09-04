import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ContextProvider from './contexts/ContextProvider.jsx';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import Profile from './pages/Profile.jsx';
import Calculator from './components/calculator/Calculator.jsx';
import Today from './components/today/Today.jsx';
import Month from './components/month/Month.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
        children: [
          {
            index: true,
            element: <Calculator />,
          },
          {
            path: 'today',
            element: <Today />,
          },
          {
            path: 'monthly',
            element: <Month />,
          },
        ],
      },
      {
        path: 'auth',
        element: <Auth />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </StrictMode>,
);
