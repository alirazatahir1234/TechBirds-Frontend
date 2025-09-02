import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PageTemplate from '../components/templates/PageTemplate';

/**
 * DynamicPage component for rendering pages with dynamic layouts
 */
const DynamicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch page data
        const pageData = await api.getPageBySlug(slug);
        
        // If no page is found, throw an error
        if (!pageData) {
          throw new Error('Page not found');
        }
        
        // Process page data
        if (!pageData.sections) {
          pageData.sections = [];
        }
        
        // For each section that requires post data, fetch the necessary posts
        for (let section of pageData.sections) {
          if (['hero', 'featured-posts', 'post-grid', 'post-list'].includes(section.type)) {
            if (!section.props.posts || section.props.posts.length === 0) {
              // Fetch posts if they aren't included in the response
              if (section.props.postIds) {
                try {
                  const posts = await Promise.all(
                    section.props.postIds.map(id => api.getPostById(id))
                  );
                  section.props.posts = posts.filter(Boolean);
                } catch (postError) {
                  console.warn('Could not fetch posts by IDs:', postError);
                  section.props.posts = [];
                }
              } else {
                // Default fetch latest posts
                try {
                  const latestPosts = await api.getPosts(1, section.props.limit || 10);
                  section.props.posts = latestPosts.posts || latestPosts || [];
                } catch (postError) {
                  console.warn('Could not fetch latest posts:', postError);
                  section.props.posts = [];
                }
              }
            }
          } else if (section.type === 'category' && section.props.categoryId) {
            // Fetch category posts
            if (!section.props.posts || section.props.posts.length === 0) {
              try {
                const categoryPosts = await api.getPostsByCategory(
                  section.props.categoryId,
                  1,
                  section.props.limit || 10
                );
                section.props.posts = categoryPosts.posts || categoryPosts || [];
              } catch (categoryError) {
                console.warn('Could not fetch category posts:', categoryError);
                section.props.posts = [];
              }
            }
          } else if (section.type === 'sidebar') {
            // Process sidebar widgets
            for (let widget of section.props.widgets || []) {
              if (widget.type === 'trending' && (!widget.posts || widget.posts.length === 0)) {
                try {
                  const trendingPosts = await api.getTrendingArticles(widget.limit || 5);
                  widget.posts = trendingPosts.posts || trendingPosts || [];
                } catch (trendingError) {
                  console.warn('Could not fetch trending posts:', trendingError);
                  widget.posts = [];
                }
              } else if (widget.type === 'categories' && (!widget.categories || widget.categories.length === 0)) {
                try {
                  const categories = await api.getCategories();
                  widget.categories = categories || [];
                } catch (categoriesError) {
                  console.warn('Could not fetch categories:', categoriesError);
                  widget.categories = [];
                }
              } else if (widget.type === 'tags' && (!widget.tags || widget.tags.length === 0)) {
                try {
                  const tags = await api.getTags();
                  widget.tags = tags || [];
                } catch (tagsError) {
                  console.warn('Could not fetch tags:', tagsError);
                  widget.tags = [];
                }
              }
            }
          }
        }
        
        setPage(pageData);
      } catch (err) {
        console.error('Error fetching page:', err);
        setError(err.message || 'Failed to load page');
        
        // If it's a 404 error, navigate to the NotFound page
        if (err.response?.status === 404) {
          navigate('/not-found', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchPage();
    }
  }, [slug, navigate]);
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-6 w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !page) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-red-600 mb-6">{error || 'Page not found'}</p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="btn-primary"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <PageTemplate 
      template={page.template || 'default'}
      sections={page.sections || []}
    />
  );
};

export default DynamicPage;
