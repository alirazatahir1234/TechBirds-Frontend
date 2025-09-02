import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * PostGridSection for displaying posts in a grid layout
 */
const PostGridSection = ({
  title,
  subtitle,
  posts = [],
  columns = 2, // 2, 3, or 4
  showImage = true,
  showExcerpt = true,
  showAuthor = true,
  showDate = true,
  showReadTime = false,
  showCategory = true,
  limit = 6,
  categoryFilter = null,
  tagFilter = null,
  sortBy = 'date', // 'date', 'title', 'popularity'
  showViewMore = false,
  viewMoreLink = '/latest',
  viewMoreText = 'View All',
  className = '',
}) => {
  // Filter posts if category or tag filter is provided
  let displayPosts = [...posts];
  
  if (categoryFilter) {
    displayPosts = displayPosts.filter(post => 
      post.category?.toLowerCase() === categoryFilter.toLowerCase() || 
      post.categoryId === categoryFilter
    );
  }
  
  if (tagFilter) {
    displayPosts = displayPosts.filter(post => 
      post.tags?.some(tag => tag.toLowerCase() === tagFilter.toLowerCase())
    );
  }
  
  // Sort posts based on sortBy prop
  if (sortBy === 'date') {
    displayPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  } else if (sortBy === 'title') {
    displayPosts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === 'popularity') {
    displayPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
  }
  
  // Limit the number of posts to display
  displayPosts = displayPosts.slice(0, limit);
  
  return (
    <section className={`post-grid-section mb-12 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
          {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
        </div>
        
        {showViewMore && (
          <Link to={viewMoreLink} className="text-tech-green hover:text-green-600 font-medium">
            {viewMoreText}
          </Link>
        )}
      </div>
      
      <div className={`grid gap-6 ${
        columns === 4 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          : columns === 3 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 md:grid-cols-2'
      }`}>
        {displayPosts.map(post => (
          <div key={post.id} className="post-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
            <Link to={`/article/${post.id}`}>
              {showImage && post.imageUrl && (
                <div className="relative pb-[60%] bg-gray-200 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-4">
                {showCategory && post.category && (
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded mb-2">
                    {post.category}
                  </span>
                )}
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-tech-green transition-colors duration-200">
                  {post.title}
                </h3>
                
                {showExcerpt && post.excerpt && (
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex items-center text-sm text-gray-500">
                  {showAuthor && post.author && (
                    <>
                      <User size={14} className="mr-1" />
                      <span className="mr-4">{post.author.name}</span>
                    </>
                  )}
                  
                  {showDate && post.publishedAt && (
                    <>
                      <Clock size={14} className="mr-1" />
                      <span className="mr-4">{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
                    </>
                  )}
                  
                  {showReadTime && post.readTime && (
                    <span>{post.readTime} min read</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

PostGridSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  posts: PropTypes.array.isRequired,
  columns: PropTypes.oneOf([2, 3, 4]),
  showImage: PropTypes.bool,
  showExcerpt: PropTypes.bool,
  showAuthor: PropTypes.bool,
  showDate: PropTypes.bool,
  showReadTime: PropTypes.bool,
  showCategory: PropTypes.bool,
  limit: PropTypes.number,
  categoryFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tagFilter: PropTypes.string,
  sortBy: PropTypes.oneOf(['date', 'title', 'popularity']),
  showViewMore: PropTypes.bool,
  viewMoreLink: PropTypes.string,
  viewMoreText: PropTypes.string,
  className: PropTypes.string
};

export default PostGridSection;
