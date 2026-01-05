// client/src/App.jsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import UserAccount from './pages/userAccount';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerRegister from './pages/sellerRegister';
import AdminRegister from './pages/adminRegister';
import Categories from './pages/categories';

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Route Component (for auth pages when already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Wrapper component that uses AuthContext
const AppRoutes = () => {
  const { loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes location={location}>
      {/* Public auth pages - only accessible when NOT logged in */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      <Route path="/seller-register" element={
        <PublicRoute>
          <SellerRegister />
        </PublicRoute>
      } />
      
      <Route path="/admin-register" element={
        <PublicRoute>
          <AdminRegister />
        </PublicRoute>
      } />

      {/* Protected routes - only accessible when logged in */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/product/:id" element={
        <ProtectedRoute>
          <Layout>
            <ProductDetails />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/cart" element={
        <ProtectedRoute>
          <Layout>
            <Cart />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/useraccount" element={
        <ProtectedRoute>
          <Layout>
            <UserAccount />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/categories" element={
        <ProtectedRoute>
          <Layout>
            <Categories />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Auth callback route (if using OAuth) */}
      <Route path="/auth/callback" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Completing authentication...</p>
          </div>
        </div>
      } />

      {/* 404 Page - Protected since it's part of the app */}
      <Route path="*" element={
        <ProtectedRoute>
          <Layout>
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
              <p className="text-gray-600 mb-8 text-center">
                The page you're looking for doesn't exist or you don't have permission to access it.
              </p>
              <a 
                href="/" 
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Go Back Home
              </a>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <AppRoutes />
        </Suspense>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;