import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import AuthorPage from './pages/AuthorPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Components
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import PostsList from './pages/admin/posts/PostsList';
import PostForm from './pages/admin/posts/PostForm';
import CategoriesManager from './pages/admin/categories/CategoriesManager';
import NewsletterManager from './pages/admin/newsletter/NewsletterManager';
import CommentsManager from './pages/admin/comments/CommentsManager';

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Header /><HomePage /><Footer /></>} />
            <Route path="/article/:id" element={<><Header /><ArticlePage /><Footer /></>} />
            <Route path="/category/:slug" element={<><Header /><CategoryPage /><Footer /></>} />
            <Route path="/author/:id" element={<><Header /><AuthorPage /><Footer /></>} />
            <Route path="/search" element={<><Header /><SearchPage /><Footer /></>} />
            
            {/* Admin Authentication Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            
            {/* Admin Panel Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              
              {/* Posts Management */}
              <Route path="posts" element={<PostsList />} />
              <Route path="posts/create" element={<PostForm />} />
              <Route path="posts/:id/edit" element={<PostForm />} />
              
              {/* Categories Management */}
              <Route path="categories" element={<CategoriesManager />} />
              <Route path="tags" element={<div>Tags Management - Coming Soon</div>} />
              
              {/* Comments Management */}
              <Route path="comments" element={<CommentsManager />} />
              
              {/* Newsletter Management */}
              <Route path="newsletter" element={<NewsletterManager />} />
              
              {/* Other Admin Routes */}
              <Route path="authors" element={<div>Authors Management - Coming Soon</div>} />
              <Route path="settings" element={<div>Settings - Coming Soon</div>} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<><Header /><NotFoundPage /><Footer /></>} />
          </Routes>
        </div>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
