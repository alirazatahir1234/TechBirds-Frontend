import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';

/**
 * CategorySection for displaying posts by category
 */
const CategorySection = ({
  title,
  subtitle,
  categoryId = null,
  categorySlug = null,
  categoryName = null,
  posts = [],
  layout = 'grid', // 'grid', 'list', 'featured'
  columns = 2,
  limit = 4,
  showViewMore = true,
  showHeader = true,
  className = '',
}) => {
  // If categorySlug is not provided, create it from categoryName
  const slug = categorySlug || (categoryName ? categoryName.toLowerCase().replace(/\s+/g, '-') : '');
  
  // Limit the number of posts to display
  const displayPosts = posts.slice(0, limit);
  
  return (
    <section className={`category-section mb-12 ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {title || categoryName || 'Category'}
            </h2>
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
          
          {showViewMore && slug && (
            <Link 
              to={`/category/${slug}`}
              className="text-tech-green hover:text-green-600 font-medium flex items-center"
            >
              More <ArrowRight size={16} className="ml-1" />
            </Link>
          )}
        </div>
      )}
      
      {/* Featured Layout */}
      {layout === 'featured' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayPosts.map((post, index) => {
            // First post is displayed prominently
            if (index === 0) {
              return (
                <div key={post.id} className="md:col-span-2 row-span-2">
                  <Link 
                    to={`/article/${post.id}`}
                    className="block group h-full"
                  >
                    <div className="h-full relative bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <span className="inline-block px-3 py-1 bg-tech-green text-white text-xs font-medium rounded mb-3">
                          {post.category || categoryName}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-green-300 transition-colors duration-200">
                          {post.title}
                        </h3>
                        <p className="text-gray-200 mb-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center text-sm text-gray-300">
                          <span className="mr-4">{post.author?.name}</span>
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }
            
            // Other posts are displayed in a smaller format
            return (
              <div key={post.id}>
                <Link 
                  to={`/article/${post.id}`}
                  className="block group"
                >
                  <div className="relative bg-gray-200 rounded-lg overflow-hidden pb-[60%]">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="absolute w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-bold mb-1 group-hover:text-green-300 transition-colors duration-200">
                        {post.title}
                      </h3>
                      <div className="text-sm text-gray-300">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Grid Layout */}
      {layout === 'grid' && (
        <div className={`grid gap-6 ${
          columns === 4 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : columns === 3 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 md:grid-cols-2'
        }`}>
          {displayPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/article/${post.id}`}
              className="block group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="relative pb-[60%] bg-gray-200 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-tech-green transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</span>
                  <span className="text-tech-green font-medium">Read More</span>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Add "View All" Card */}
          {showViewMore && slug && (
            <Link 
              to={`/category/${slug}`}
              className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 border-dashed rounded-lg p-6 text-gray-500 hover:bg-gray-100 hover:text-tech-green transition-colors duration-200"
            >
              <Plus size={30} className="mb-2" />
              <span className="font-medium">View All</span>
              <span className="text-sm">{categoryName || 'Posts'}</span>
            </Link>
          )}
        </div>
      )}
      
      {/* List Layout */}
      {layout === 'list' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {displayPosts.map((post, index) => (
            <Link 
              key={post.id} 
              to={`/article/${post.id}`}
              className={`
                block group p-4 flex items-center
                ${index !== displayPosts.length - 1 ? 'border-b border-gray-200' : ''}
              `}
            >
              <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden mr-4 flex-shrink-0">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-tech-green transition-colors duration-200">
                  {post.title}
                </h3>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
          
          {/* View More Link */}
          {showViewMore && slug && (
            <Link 
              to={`/category/${slug}`}
              className="block p-4 text-center text-tech-green hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              View All {categoryName || 'Posts'} <ArrowRight size={16} className="inline ml-1" />
            </Link>
          )}
        </div>
      )}
    </section>
  );
};

CategorySection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  categorySlug: PropTypes.string,
  categoryName: PropTypes.string,
  posts: PropTypes.array.isRequired,
  layout: PropTypes.oneOf(['grid', 'list', 'featured']),
  columns: PropTypes.oneOf([2, 3, 4]),
  limit: PropTypes.number,
  showViewMore: PropTypes.bool,
  showHeader: PropTypes.bool,
  className: PropTypes.string,
};

export default CategorySection;
