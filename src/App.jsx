import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import UserPage from './pages/UserPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Components
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import PostsList from './pages/admin/posts/PostsList';
import PostForm from './pages/admin/posts/PostForm';
import PagesList from './pages/admin/pages/PagesList';
import PageForm from './pages/admin/pages/PageForm';
import CategoriesManager from './pages/admin/categories/CategoriesManager';
import UsersManager from './pages/admin/users/UsersManager';
import CreateUser from './pages/admin/users/CreateUser';
import EditUser from './pages/admin/users/EditUser';
import UserRoles from './pages/admin/users/UserRoles';
import NewsletterManager from './pages/admin/newsletter/NewsletterManager';
import CommentsManager from './pages/admin/comments/CommentsManager';
import PendingComments from './pages/admin/comments/PendingComments';
import SpamComments from './pages/admin/comments/SpamComments';
import Analytics from './pages/admin/operations/Analytics';
import MediaLibrary from './pages/admin/media/MediaLibrary';

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
            <Route path="/author/:id" element={<><Header /><UserPage /><Footer /></>} />
            <Route path="/user/:id" element={<><Header /><UserPage /><Footer /></>} />
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

              {/* Pages Management */}
              <Route path="pages" element={<PagesList />} />
              <Route path="pages/create" element={<PageForm />} />
              <Route path="pages/:id/edit" element={<PageForm />} />
              
              {/* Categories Management */}
              <Route path="categories" element={<CategoriesManager />} />
              <Route path="tags" element={<div>Tags Management - Coming Soon</div>} />
              
              {/* Users Management (Primary Routes) */}
              <Route path="users" element={<UsersManager />} />
              <Route path="users/create" element={<CreateUser />} />
              <Route path="users/:id/edit" element={<EditUser />} />
              <Route path="users/roles" element={<UserRoles />} />
              
              {/* Authors Management (Backward Compatibility) */}
              <Route path="authors" element={<UsersManager />} />
              <Route path="authors/create" element={<CreateUser />} />
              <Route path="authors/:id/edit" element={<EditUser />} />
              <Route path="authors/roles" element={<UserRoles />} />
              
              {/* Comments Management */}
              <Route path="comments" element={<CommentsManager />} />
              <Route path="comments/pending" element={<PendingComments />} />
              <Route path="comments/spam" element={<SpamComments />} />
              
              {/* Operations */}
              <Route path="analytics" element={<Analytics />} />
              <Route path="media" element={<MediaLibrary />} />
              
              {/* Newsletter Management */}
              <Route path="newsletter" element={<NewsletterManager />} />
              
              {/* Other Admin Routes */}
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
