import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, Grid, List } from 'lucide-react';
import { articleAPI, categoryAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const [categoryData, articlesData] = await Promise.all([
          categoryAPI.getCategoryBySlug(slug),
          articleAPI.getArticlesByCategory(slug, 1, 12),
        ]);

        setCategory(categoryData);
        setArticles(articlesData.posts || articlesData.data || articlesData);
        setHasMore((articlesData.posts || articlesData.data || articlesData).length === 12);
        setPage(1);
      } catch (err) {
        setError('Failed to load category. Please try again later.');
        
        // Mock data for development
        setCategory({
          name: slug.charAt(0).toUpperCase() + slug.slice(1),
          slug: slug,
          description: `Latest news and insights about ${slug}`,
          articleCount: 150
        });
        
        setArticles([
          {
            id: 1,
            title: "Revolutionary AI breakthrough changes everything",
            excerpt: "Scientists discover new approach to artificial intelligence that could transform the industry.",
            imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
            category: slug.charAt(0).toUpperCase() + slug.slice(1),
            author: { name: "Sarah Chen", id: 1 },
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            readTime: 5,
          },
          // Add more mock articles...
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryData();
    }
  }, [slug]);

  const loadMoreArticles = async () => {
    try {
      const nextPage = page + 1;
      const newArticles = await articleAPI.getArticlesByCategory(slug, nextPage, 12);
      const articleList = newArticles.posts || newArticles.data || newArticles;
      
      setArticles(prev => [...prev, ...articleList]);
      setPage(nextPage);
      setHasMore(articleList.length === 12);
    } catch (err) {
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Category not found'}</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-lg text-gray-600 mb-4">
            {category.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {category.articleCount || articles.length} articles
          </p>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              } transition-colors duration-200`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              } transition-colors duration-200`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Articles Grid/List */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-6'
      }`}>
        {articles.map((article) => (
          viewMode === 'grid' ? (
            <GridArticleCard key={article.id} article={article} />
          ) : (
            <ListArticleCard key={article.id} article={article} />
          )
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={loadMoreArticles}
            className="btn-primary"
          >
            Load More Articles
          </button>
        </div>
      )}
    </div>
  );
};

// Grid Article Card Component
const GridArticleCard = ({ article }) => {
  return (
    <Link to={`/article/${article.id}`} className="group block">
      <div className="article-card">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="p-6">
          <span className="category-tag mb-3">
            {article.category}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-tech-green transition-colors duration-200 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.excerpt}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <User size={14} className="mr-1" />
            <span className="mr-4">{article.author?.name}</span>
            <Clock size={14} className="mr-1" />
            <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// List Article Card Component
const ListArticleCard = ({ article }) => {
  return (
    <Link to={`/article/${article.id}`} className="group block">
      <div className="article-card">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-48 md:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <span className="category-tag mb-3">
              {article.category}
            </span>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-tech-green transition-colors duration-200">
              {article.title}
            </h3>
            <p className="text-gray-600 mb-3 line-clamp-2">
              {article.excerpt}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <User size={14} className="mr-1" />
              <span className="mr-4">{article.author?.name}</span>
              <Clock size={14} className="mr-1" />
              <span className="mr-4">{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
              <span>{article.readTime} min read</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryPage;
