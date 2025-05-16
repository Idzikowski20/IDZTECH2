
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/utils/themeContext';
import { AuthProvider } from '@/utils/AuthContext';

import Index from './pages/Index';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';
import BlogPostEditor from './pages/BlogPostEditor';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/new-post" element={<BlogPostEditor />} />
            <Route path="/admin/edit-post/:slug" element={<BlogPostEditor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
