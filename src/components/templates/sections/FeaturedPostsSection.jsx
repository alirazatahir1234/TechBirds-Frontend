import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Clock, User, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * FeaturedPostsSection for displaying a curated selection of posts
 */
const FeaturedPostsSection = ({
  title,
  subtitle,
  posts = [],
  layout = 'default', // 'default', 'horizontal', 'carousel'
  showImage = true,
  showExcerpt = true,
  showAuthor = true,
  showDate = true,
  showReadTime = true,
  showCategory = true,
  showTags = false,
  limit = 3,
  className = '',
  showViewMore = false,
  viewMoreLink = '/featured',
  viewMoreText = 'View All Featured'
}) => {
  const displayPosts = posts.slice(0, limit);
  
  return (
    <section className={`featured-posts-section mb-12 ${className}`}>
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
      
      {/* Default Layout */}
      {layout === 'default' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayPosts.map((post, index) => (
            <Link 
              key={post.id} 
              to={`/article/${post.id}`} 
              className="featured-post group block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {showImage && post.imageUrl && (
                <div className="relative pb-[60%] bg-gray-200 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-5">
                {showCategory && post.category && (
                  <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs font-medium rounded mb-3">
                    {post.category}
                  </span>
                )}
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-tech-green transition-colors duration-200">
                  {post.title}
                </h3>
                
                {showExcerpt && post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center text-sm text-gray-500">
                  {showAuthor && post.author && (
                    <div className="flex items-center mr-4 mb-2">
                      <User size={14} className="mr-1" />
                      <span>{post.author.name}</span>
                    </div>
                  )}
                  
                  {showDate && post.publishedAt && (
                    <div className="flex items-center mr-4 mb-2">
                      <Clock size={14} className="mr-1" />
                      <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
                    </div>
                  )}
                  
                  {showReadTime && post.readTime && (
                    <div className="mb-2">
                      <span>{post.readTime} min read</span>
                    </div>
                  )}
                </div>
                
                {showTags && post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        <Tag size={10} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* Horizontal Layout */}
      {layout === 'horizontal' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {displayPosts.map((post, index) => (
            <Link 
              key={post.id} 
              to={`/article/${post.id}`} 
              className={`
                featured-post group flex flex-col md:flex-row 
                ${index !== displayPosts.length - 1 ? 'border-b border-gray-200' : ''}
              `}
            >
              {showImage && post.imageUrl && (
                <div className="md:w-1/4 relative pb-[60%] md:pb-0 bg-gray-200">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="absolute top-0 left-0 w-full h-full md:relative md:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-5 md:w-3/4">
                <div className="flex items-center mb-2">
                  {showCategory && post.category && (
                    <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs font-medium rounded mr-2">
                      {post.category}
                    </span>
                  )}
                  
                  {showDate && post.publishedAt && (
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
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
                    <div className="flex items-center mr-4">
                      <User size={14} className="mr-1" />
                      <span>{post.author.name}</span>
                    </div>
                  )}
                  
                  {showReadTime && post.readTime && (
                    <span>{post.readTime} min read</span>
                  )}
                </div>
                
                {showTags && post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        <Tag size={10} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

FeaturedPostsSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  posts: PropTypes.array.isRequired,
  layout: PropTypes.oneOf(['default', 'horizontal', 'carousel']),
  showImage: PropTypes.bool,
  showExcerpt: PropTypes.bool,
  showAuthor: PropTypes.bool,
  showDate: PropTypes.bool,
  showReadTime: PropTypes.bool,
  showCategory: PropTypes.bool,
  showTags: PropTypes.bool,
  limit: PropTypes.number,
  className: PropTypes.string,
  showViewMore: PropTypes.bool,
  viewMoreLink: PropTypes.string,
  viewMoreText: PropTypes.string
};

export default FeaturedPostsSection;
