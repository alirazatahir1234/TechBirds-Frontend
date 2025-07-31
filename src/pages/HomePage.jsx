import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, ExternalLink, TrendingUp } from 'lucide-react';
import { articleAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { displayConnectionStatus } from '../utils/backend-test';

const HomePage = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setLoading(true);
        
        // Test backend connection first
        await displayConnectionStatus();
        
        const [featured, latest, trending] = await Promise.all([
          articleAPI.getFeaturedArticles(),
          articleAPI.getArticles(1, 20),
          articleAPI.getTrendingArticles(10),
        ]);

        setFeaturedArticles(featured);
        setLatestArticles(latest.articles || latest);
        setTrendingArticles(trending);
      } catch (err) {
        setError('Failed to load articles. Please try again later.');
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  // Mock data for development when API is not available
  const mockFeaturedArticles = [
    {
      id: 1,
      title: "OpenAI Launches Revolutionary GPT-5 with Advanced Reasoning Capabilities",
      excerpt: "The latest AI model promises unprecedented performance in complex problem-solving and multi-modal understanding.",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
      category: "AI",
      author: { name: "Sarah Chen", id: 1 },
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      readTime: 5,
    },
    {
      id: 2,
      title: "Tesla Unveils Next-Generation Autonomous Vehicle Platform",
      excerpt: "The electric vehicle giant announces breakthrough technology that could revolutionize self-driving cars.",
      imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=500&fit=crop",
      category: "Transportation",
      author: { name: "Mike Rodriguez", id: 2 },
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      readTime: 7,
    }
  ];

  const mockLatestArticles = [
    {
      id: 3,
      title: "Startup Secures $50M Series B to Revolutionize Healthcare AI",
      excerpt: "MedTech startup plans to use the funding to expand their AI-powered diagnostic platform.",
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      category: "Startups",
      author: { name: "Jessica Wong", id: 3 },
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      readTime: 4,
    },
    {
      id: 4,
      title: "Cybersecurity Firm Discovers Major Vulnerability in Popular IoT Devices",
      excerpt: "Security researchers reveal critical flaws that could affect millions of smart home devices.",
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
      category: "Security",
      author: { name: "Alex Thompson", id: 4 },
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      readTime: 6,
    },
    {
      id: 5,
      title: "Apple Announces Revolutionary AR Glasses at WWDC 2025",
      excerpt: "The tech giant unveils its long-awaited augmented reality device with breakthrough features.",
      imageUrl: "https://images.unsplash.com/photo-1592659762303-90081d34b277?w=400&h=250&fit=crop",
      category: "Hardware",
      author: { name: "David Kim", id: 5 },
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      readTime: 8,
    },
  ];

  // Use mock data if API data is not available
  const displayFeatured = featuredArticles.length > 0 ? featuredArticles.slice(0, 2) : mockFeaturedArticles;
  const displayLatest = latestArticles.length > 0 ? latestArticles.slice(0, 10) : mockLatestArticles;
  const displayTrending = trendingArticles.length > 0 ? trendingArticles.slice(0, 5) : mockLatestArticles.slice(0, 5);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Featured Articles Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayFeatured.map((article, index) => (
            <FeaturedArticleCard key={article.id} article={article} isPrimary={index === 0} />
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Articles - Main Column */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
            <Link to="/latest" className="text-tech-green hover:text-green-600 font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-6">
            {displayLatest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Trending Articles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-4">
              <TrendingUp className="text-tech-green mr-2" size={20} />
              <h3 className="text-lg font-bold text-gray-900">Trending</h3>
            </div>
            
            <div className="space-y-4">
              {displayTrending.map((article, index) => (
                <TrendingArticleCard key={article.id} article={article} rank={index + 1} />
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-green-500 text-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
            <p className="text-sm mb-4 opacity-90">
              Get the latest tech news delivered to your inbox
            </p>
            <Link to="/newsletter" className="btn-secondary block text-center">
              Subscribe Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Featured Article Card Component
const FeaturedArticleCard = ({ article, isPrimary }) => {
  return (
    <Link to={`/article/${article.id}`} className="group block">
      <div className={`hero-article ${isPrimary ? 'h-96' : 'h-80'} bg-gray-200 rounded-lg overflow-hidden`}>
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="overlay"></div>
        <div className="content">
          <span className="category-tag mb-3">
            {article.category}
          </span>
          <h2 className={`font-bold mb-2 group-hover:text-tech-green transition-colors duration-200 ${
            isPrimary ? 'text-2xl' : 'text-xl'
          }`}>
            {article.title}
          </h2>
          <p className="text-gray-300 mb-3 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center text-sm text-gray-300">
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

// Regular Article Card Component
const ArticleCard = ({ article }) => {
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

// Trending Article Card Component
const TrendingArticleCard = ({ article, rank }) => {
  return (
    <Link to={`/article/${article.id}`} className="group flex items-start space-x-3">
      <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 group-hover:text-tech-green transition-colors duration-200 line-clamp-2">
          {article.title}
        </h4>
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <span className="mr-2">{article.category}</span>
          <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
        </div>
      </div>
    </Link>
  );
};

export default HomePage;
