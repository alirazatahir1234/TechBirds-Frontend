import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import AuthorPage from './pages/AuthorPage';
import SearchPage from './pages/SearchPage';
import UserPage from './pages/UserPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import PostsList from './pages/admin/posts/PostsList';
import PostForm from './pages/admin/posts/PostForm';
import PagesList from './pages/admin/pages/PagesList';
import PageForm from './pages/admin/pages/PageForm';
import CategoriesManager from './pages/admin/categories/CategoriesManager';
import UsersManager from './pages/admin/users/UsersManager';
import CreateUser from './pages/admin/users/CreateUser';
import UserRoles from './pages/admin/users/UserRoles';
import AuthorsManager from './pages/admin/authors/AuthorsManager';
import CreateAuthor from './pages/admin/authors/CreateAuthor';
import AuthorRoles from './pages/admin/authors/AuthorRoles';
import MediaLibrary from './pages/admin/media/MediaLibrary';
import CommentsManager from './pages/admin/comments/CommentsManager';
import PendingComments from './pages/admin/comments/PendingComments';
import SpamComments from './pages/admin/comments/SpamComments';
import NewsletterManager from './pages/admin/newsletter/NewsletterManager';
import Analytics from './pages/admin/operations/Analytics';
import SystemHealth from './pages/admin/operations/SystemHealth';
import FileManager from './pages/admin/operations/FileManager';
import AdminDebug from './pages/admin/AdminDebug';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import DynamicPage from './pages/DynamicPage';
import TestTemplatePage from './pages/TestTemplatePage';
import DynamicPagesList from './pages/admin/dynamicpages/DynamicPagesList';
import DynamicPageForm from './pages/admin/dynamicpages/DynamicPageForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Header />
            <HomePage />
            <Footer />
          </>
        } />
        <Route path="/article/:slug" element={
          <>
            <Header />
            <ArticlePage />
            <Footer />
          </>
        } />
        <Route path="/category/:slug" element={
          <>
            <Header />
            <CategoryPage />
            <Footer />
          </>
        } />
        <Route path="/author/:id" element={
          <>
            <Header />
            <AuthorPage />
            <Footer />
          </>
        } />
        <Route path="/search" element={
          <>
            <Header />
            <SearchPage />
            <Footer />
          </>
        } />
        <Route path="/user/:id" element={
          <>
            <Header />
            <UserPage />
            <Footer />
          </>
        } />

        {/* Admin Routes (wrapped in AdminAuthProvider) */}
        <Route path="/admin" element={
          <AdminAuthProvider>
            <AdminLayout />
          </AdminAuthProvider>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="register" element={<AdminRegister />} />
          <Route path="posts" element={<PostsList />} />
          <Route path="posts/new" element={<PostForm />} />
          <Route path="posts/edit/:id" element={<PostForm />} />
          <Route path="pages" element={<PagesList />} />
          <Route path="pages/new" element={<PageForm />} />
          <Route path="pages/edit/:id" element={<PageForm />} />
          <Route path="categories" element={<CategoriesManager />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="users/new" element={<CreateUser />} />
          <Route path="users/roles" element={<UserRoles />} />
          <Route path="authors" element={<AuthorsManager />} />
          <Route path="authors/new" element={<CreateAuthor />} />
          <Route path="authors/roles" element={<AuthorRoles />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="comments" element={<CommentsManager />} />
          <Route path="comments/pending" element={<PendingComments />} />
          <Route path="comments/spam" element={<SpamComments />} />
          <Route path="newsletter" element={<NewsletterManager />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="system-health" element={<SystemHealth />} />
          <Route path="file-manager" element={<FileManager />} />
          <Route path="debug" element={<AdminDebug />} />
          <Route path="dynamic-pages" element={<DynamicPagesList />} />
          <Route path="dynamic-pages/new" element={<DynamicPageForm />} />
          <Route path="dynamic-pages/edit/:id" element={<DynamicPageForm />} />
        </Route>

        {/* Dynamic Pages Routes */}
        <Route path="/page/:slug" element={
          <>
            <Header />
            <DynamicPage />
            <Footer />
          </>
        } />
        
        {/* Template Demo Route */}
        <Route path="/template-demo" element={
          <>
            <Header />
            <TestTemplatePage />
            <Footer />
          </>
        } />

        {/* 404 Route */}
        <Route path="*" element={
          <>
            <Header />
            <NotFoundPage />
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;