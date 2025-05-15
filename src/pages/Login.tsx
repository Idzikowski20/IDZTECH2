import React from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/utils/themeContext';
import { useAuth } from '@/utils/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  
  // If user is already logged in, redirect to admin
  if (user && !loading) {
    return <Navigate to="/admin" replace />;
  }
  
  return (
    <div className={theme === 'light' ? "min-h-screen bg-white" : "min-h-screen bg-premium-dark"}>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-[80vh] flex items-center justify-center py-32">
        <div className={`max-w-md w-full ${theme === 'light' ? "bg-white" : "bg-black"} p-6 md:p-8 rounded-xl border ${theme === 'light' ? "border-gray-200" : "border-gray-700"} shadow-lg`}>
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-premium-gradient flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
          </div>
          
          <LoginForm onSuccess={() => navigate('/admin')} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;