import { createRoot } from 'react-dom/client';
import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import ContextProvider from './contexts/ContextProvider.jsx';

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
import ProfileProtectedRoute from './Routes/ProfileProtectedRoute.jsx';
import ProfileIndex from './components/profile/ProfileIndex.jsx';
import AuthProtectedRoute from './Routes/AuthProtectedRoute.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';

const Admin = lazy(() => import('./admin/Admin.jsx'));
import AdminProtectedRoute from './admin/AdminProtectedRoute.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import Dashboard from './admin/pages/Dashboard.jsx';
import Feedbacks from './admin/pages/Feedbacks.jsx';
import FeatureRequests from './admin/pages/FeatureRequests.jsx';
import Reports from './admin/pages/Reports.jsx';

const router = createBrowserRouter([
  {
    path: '',
    element: (
      <ContextProvider>
        <App />
      </ContextProvider>
    ),
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
        path: 'admin',
        element: (
          <AdminProtectedRoute>
            <Admin />
          </AdminProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'feedbacks',
            element: <Feedbacks />,
          },
          {
            path: 'feature-requests',
            element: <FeatureRequests />,
          },
          {
            path: 'reports',
            element: <Reports />,
          },
        ],
      },
    ],
    errorElement: <PageNotFound />,
  },
]);

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
