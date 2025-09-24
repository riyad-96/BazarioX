import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ContextProvider from './contexts/ContextProvider.jsx';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Auth from './pages/auth/Auth.jsx';
import Profile from './pages/Profile.jsx';
import Calculator from './components/calculator/Calculator.jsx';
import Today from './components/today/Today.jsx';
import Month from './components/month/Month.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import Account from './pages/Account.jsx';
import FeedbackAndFeature from './pages/FeedbackAndFeature.jsx';
import Dashboard from './admin/Dashboard/Dashboard.jsx';
import ProtectedDashboardRoute from './admin/Dashboard/ProtectedDashboardRoute.jsx';
import ProfileProtectedRoute from './Routes/ProfileProtectedRoute.jsx';
import ProfileIndex from './components/profile/ProfileIndex.jsx';
import AuthProtectedRoute from './Routes/AuthProtectedRoute.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx'

const router = createBrowserRouter([
  {
    path: '',
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
        element: (
          <AuthProtectedRoute>
            <Auth />
          </AuthProtectedRoute>
        ),
        children: [
          {
            path: 'log-in',
            element: <Login />,
          },
          {
            path: 'create-account',
            element: <Signup />,
          },
          {
            path: 'reset-password',
            element: <ResetPassword />,
          },
        ],
      },
      {
        path: 'profile',
        element: (
          <ProfileProtectedRoute>
            <Profile />
          </ProfileProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <ProfileIndex />,
          },
          {
            path: 'account',
            element: <Account />,
          },
          {
            path: 'feedback',
            element: <FeedbackAndFeature />,
          },
        ],
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedDashboardRoute>
            <Dashboard />
          </ProtectedDashboardRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <RouterProvider router={router} />
  </ContextProvider>,
);
