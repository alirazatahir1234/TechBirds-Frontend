import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, Mail, ExternalLink } from 'lucide-react';
import { userAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userData, articlesData] = await Promise.all([
          userAPI.getUserById(id),
          userAPI.getArticlesByUser(id, 1, 12),
        ]);

        setUser(userData);
        setArticles(articlesData.articles || articlesData);
        setHasMore((articlesData.articles || articlesData).length === 12);
        setPage(1);
      } catch (err) {
        setError('Failed to load user. Please try again later.');
        console.error('Error fetching user data:', err);
        
        // Mock data for development
        setUser({
          id: parseInt(id),
          firstName: "Sarah",
          lastName: "Chen",
          fullName: "Sarah Chen",
          bio: "Senior Technology Reporter covering AI, startups, and emerging technologies. Previously worked at TechCrunch and Wired. Based in San Francisco.",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
          email: "sarah.chen@techbirds.com",
          specialization: "AI & Machine Learning",
          website: "https://sarahchen.dev",
          twitter: "https://twitter.com/sarahchen",
          linkedin: "https://linkedin.com/in/sarahchen",
          role: "Editor",
          status: "Active",
          createdAt: new Date(2023, 0, 15).toISOString(),
          articleCount: 45,
          totalViews: 250000
        });
        
        setArticles([
          {
            id: 1,
            title: "Revolutionary AI breakthrough changes everything",
            excerpt: "Scientists discover new approach to artificial intelligence that could transform the industry.",
            imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
            category: "AI",
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            readTime: 5,
            views: 12500
          },
          // Add more mock articles...
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const loadMoreArticles = async () => {
    try {
      const nextPage = page + 1;
      const newArticles = await userAPI.getArticlesByUser(id, nextPage, 12);
      const articleList = newArticles.articles || newArticles;
      
      setArticles(prev => [...prev, ...articleList]);
      setPage(nextPage);
      setHasMore(articleList.length === 12);
    } catch (err) {
      console.error('Error loading more articles:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="flex items-center mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full mr-6"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded mb-2 w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'User not found'}</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <img
            src={user.avatar}
            alt={user.fullName || `${user.firstName} ${user.lastName}`}
            className="w-24 h-24 rounded-full mr-0 md:mr-6 mb-4 md:mb-0 object-cover"
          />
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.fullName || `${user.firstName} ${user.lastName}`}
            </h1>
            {user.specialization && (
              <p className="text-lg font-medium text-red-600 mb-2">
                {user.specialization}
              </p>
            )}
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              {user.bio}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <User size={16} className="mr-1" />
                <span>{user.articleCount} articles</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>Member since {formatDistanceToNow(new Date(user.createdAt || user.joinedAt), { addSuffix: true })}</span>
              </div>
              {user.totalViews && (
                <div>
                  <span>{user.totalViews.toLocaleString()} total views</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-2 mt-4 md:mt-0">
            {user.email && (
              <a
                href={`mailto:${user.email}`}
                className="flex items-center text-gray-600 hover:text-tech-green transition-colors duration-200"
              >
                <Mail size={16} className="mr-2" />
                Contact
              </a>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-tech-green transition-colors duration-200"
              >
                <ExternalLink size={16} className="mr-2" />
                Website
              </a>
            )}
            {user.twitter && (
              <a
                href={user.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-tech-green transition-colors duration-200"
              >
                <ExternalLink size={16} className="mr-2" />
                Twitter
              </a>
            )}
            {user.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-tech-green transition-colors duration-200"
              >
                <ExternalLink size={16} className="mr-2" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Articles by {user.fullName || `${user.firstName} ${user.lastName}`}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <UserArticleCard key={article.id} article={article} />
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
    </div>
  );
};

// User Article Card Component
const UserArticleCard = ({ article }) => {
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
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
            </div>
            {article.views && (
              <span>{article.views.toLocaleString()} views</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UserPage;
