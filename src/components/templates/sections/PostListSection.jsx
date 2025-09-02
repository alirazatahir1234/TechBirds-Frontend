import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * PostListSection for displaying posts in a vertical list format
 */
const PostListSection = ({
  title,
  subtitle,
  posts = [],
  layout = 'standard', // 'standard', 'compact', 'featured'
  showImage = true,
  showExcerpt = true,
  showAuthor = true,
  showDate = true,
  showReadTime = true,
  showCategory = true,
  limit = 5,
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
    <section className={`post-list-section mb-12 ${className}`}>
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
      
      <div className="space-y-6">
        {displayPosts.map((post, index) => {
          // Featured layout: First post is larger
          if (layout === 'featured' && index === 0) {
            return (
              <div key={post.id} className="post-card featured bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
                <Link to={`/article/${post.id}`} className="block md:flex">
                  {showImage && post.imageUrl && (
                    <div className="md:w-2/5 relative pb-[50%] md:pb-0 bg-gray-200 overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="absolute top-0 left-0 w-full h-full md:relative md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6 md:w-3/5">
                    {showCategory && post.category && (
                      <span className="inline-block px-3 py-1 bg-tech-green text-white text-xs font-medium rounded mb-3">
                        {post.category}
                      </span>
                    )}
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-tech-green transition-colors duration-200">
                      {post.title}
                    </h3>
                    
                    {showExcerpt && post.excerpt && (
                      <p className="text-gray-600 mb-4">
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
            );
          }
          
          // Compact layout
          if (layout === 'compact') {
            return (
              <div key={post.id} className="post-card compact group">
                <Link to={`/article/${post.id}`} className="flex items-center">
                  {showImage && post.imageUrl && (
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded overflow-hidden mr-4">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      {showCategory && post.category && (
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded mr-2">
                          {post.category}
                        </span>
                      )}
                      
                      {showDate && post.publishedAt && (
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-base font-medium text-gray-900 group-hover:text-tech-green transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              </div>
            );
          }
          
          // Standard layout (default)
          return (
            <div key={post.id} className="post-card standard group">
              <Link to={`/article/${post.id}`} className="block md:flex">
                {showImage && post.imageUrl && (
                  <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-48 md:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className={`${showImage ? 'md:w-2/3' : 'w-full'}`}>
                  <div className="flex items-center mb-2">
                    {showCategory && post.category && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded mr-2">
                        {post.category}
                      </span>
                    )}
                  </div>
                  
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
          );
        })}
      </div>
    </section>
  );
};

PostListSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  posts: PropTypes.array.isRequired,
  layout: PropTypes.oneOf(['standard', 'compact', 'featured']),
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

export default PostListSection;
