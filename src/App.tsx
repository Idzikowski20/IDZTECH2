
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Services from './pages/Services';
import Admin from './pages/Admin';
import Login from './pages/Login';
import SanityAuth from './components/SanityAuth';
import AdminLayout from './components/AdminLayout';
import NotFound from './pages/NotFound';
import { SanityAuthProvider } from './utils/SanityAuthProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import AdminStudio from './pages/AdminStudio';
import AdminStats from './pages/AdminStats';

function App() {
  const [showToast, setShowToast] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (showToast) {
      toast({
        title: 'Witaj!',
        description: 'Ta strona jest wciąż w budowie. Dziękujemy za cierpliwość!',
        action: (
          <ToastAction altText="Zamknij" onClick={() => setShowToast(false)}>
            Zamknij
          </ToastAction>
        ),
      });
      setShowToast(false);
    }
  }, [showToast, toast]);

  return (
    <>
      <SanityAuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/o-nas" element={<About />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/uslugi" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<SanityAuth />} />
            <Route path="/admin" element={<AdminLayout><Admin /></AdminLayout>} />
            <Route path="/admin/stats" element={<AdminLayout><AdminStats /></AdminLayout>} />
            <Route path="/admin/studio/*" element={<AdminStudio />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </Router>
        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </SanityAuthProvider>
    </>
  );
}

export default App;
