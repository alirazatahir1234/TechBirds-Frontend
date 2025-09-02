import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Clock, User, Filter } from 'lucide-react';
import { searchAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sortBy: searchParams.get('sortBy') || 'relevance',
  });

  const categories = ['AI', 'Startups', 'Venture', 'Security', 'Apps', 'Hardware', 'Transportation'];
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'latest', label: 'Latest' },
    { value: 'popular', label: 'Most Popular' },
  ];

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery, 1, true);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery, pageNum = 1, reset = false) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const results = await searchAPI.searchArticles(searchQuery, pageNum, 12);
      const articleList = results.posts || results.data || results;
      
      if (reset) {
        setArticles(articleList);
        setPage(1);
      } else {
        setArticles(prev => [...prev, ...articleList]);
      }
      
      setTotalResults(results.total || articleList.length);
      setHasMore(articleList.length === 12);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to search articles. Please try again.');
      
      // Mock search results for development
      const mockResults = [
        {
          id: 1,
          title: "AI Revolution: How Machine Learning is Transforming Industries",
          excerpt: "Explore the latest developments in artificial intelligence and their impact on various sectors.",
          imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
          category: "AI",
          author: { name: "Sarah Chen", id: 1 },
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          readTime: 5,
        },
        {
          id: 2,
          title: "Startup Funding Reaches Record Highs in Q3 2025",
          excerpt: "Venture capital investments surge as investors show renewed confidence in emerging technologies.",
          imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop",
          category: "Startups",
          author: { name: "Mike Rodriguez", id: 2 },
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          readTime: 7,
        },
      ];
      
      if (reset) {
        setArticles(mockResults);
        setTotalResults(mockResults.length);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('q', query.trim());
      if (filters.category) newSearchParams.set('category', filters.category);
      if (filters.sortBy !== 'relevance') newSearchParams.set('sortBy', filters.sortBy);
      
      setSearchParams(newSearchParams);
      performSearch(query.trim(), 1, true);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    const currentQuery = searchParams.get('q');
    if (currentQuery) {
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('q', currentQuery);
      if (newFilters.category) newSearchParams.set('category', newFilters.category);
      if (newFilters.sortBy !== 'relevance') newSearchParams.set('sortBy', newFilters.sortBy);
      
      setSearchParams(newSearchParams);
      performSearch(currentQuery, 1, true);
    }
  };

  const loadMoreResults = () => {
    const currentQuery = searchParams.get('q');
    if (currentQuery) {
      performSearch(currentQuery, page + 1, false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Articles</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search for articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-green focus:border-transparent text-lg"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-tech-green"
            >
              <Search size={24} />
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center">
            <Filter size={16} className="mr-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 mr-3">Filters:</span>
          </div>
          
          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-green focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>

          {/* Sort Filter */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-green focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search Results Info */}
        {searchParams.get('q') && (
          <div className="text-gray-600 mb-6">
            {loading ? (
              <p>Searching...</p>
            ) : (
              <p>
                {totalResults > 0 ? (
                  <>
                    Found {totalResults.toLocaleString()} result{totalResults !== 1 ? 's' : ''} for "{searchParams.get('q')}"
                    {filters.category && ` in ${filters.category}`}
                  </>
                ) : searchParams.get('q') ? (
                  <>No results found for "{searchParams.get('q')}"</>
                ) : null}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Search Results */}
      {articles.length > 0 && (
        <div className="space-y-6 mb-8">
          {articles.map((article) => (
            <SearchResultCard key={article.id} article={article} query={searchParams.get('q')} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && articles.length > 0 && (
        <div className="text-center">
          <button
            onClick={loadMoreResults}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Results'}
          </button>
        </div>
      )}

      {/* No Results State */}
      {!loading && articles.length === 0 && searchParams.get('q') && (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or removing filters to see more results.
          </p>
          <Link to="/" className="btn-primary">
            Browse All Articles
          </Link>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => performSearch(searchParams.get('q'), 1, true)}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

// Search Result Card Component
const SearchResultCard = ({ article, query }) => {
  const highlightText = (text, searchQuery) => {
    if (!searchQuery) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Link to={`/article/${article.id}`} className="group block">
      <div className="article-card">
        <div className="md:flex">
          <div className="md:w-1/4">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-48 md:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-6 md:w-3/4">
            <span className="category-tag mb-3">
              {article.category}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-tech-green transition-colors duration-200">
              {highlightText(article.title, query)}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {highlightText(article.excerpt, query)}
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

export default SearchPage;
