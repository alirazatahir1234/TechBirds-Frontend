import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * HeroSection for displaying featured posts in a hero banner
 */
const HeroSection = ({ 
  title,
  subtitle,
  posts = [],
  layout = 'standard', // 'standard', 'large', 'split'
  showExcerpt = true,
  showAuthor = true,
  showDate = true,
  showReadTime = false,
  maxPosts = 2,
  className = '',
}) => {
  const displayPosts = posts.slice(0, maxPosts);
  
  return (
    <section className={`hero-section ${className}`}>
      {(title || subtitle) && (
        <div className="section-header max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
          {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className={`grid gap-8 ${
          layout === 'split' 
            ? 'grid-cols-1 lg:grid-cols-2' 
            : displayPosts.length > 1 
              ? 'grid-cols-1 lg:grid-cols-2' 
              : 'grid-cols-1'
        }`}>
          {displayPosts.map((post, index) => (
            <Link to={`/article/${post.id}`} key={post.id} className="group block">
              <div className={`hero-article bg-gray-200 rounded-lg overflow-hidden relative ${
                layout === 'large' && index === 0 
                  ? 'h-96 lg:col-span-2' 
                  : layout === 'split' && index === 0
                    ? 'h-96'
                    : 'h-80'
              }`}>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  {post.category && (
                    <span className="inline-block px-3 py-1 bg-tech-green text-white text-sm font-medium rounded-md mb-3">
                      {post.category}
                    </span>
                  )}
                  <h3 className={`font-bold mb-2 group-hover:text-tech-green transition-colors duration-200 ${
                    layout === 'large' && index === 0 ? 'text-3xl' : 'text-2xl'
                  }`}>
                    {post.title}
                  </h3>
                  
                  {showExcerpt && post.excerpt && (
                    <p className="text-gray-300 mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-300">
                    {showAuthor && post.author && (
                      <>
                        <User size={14} className="mr-1" />
                        <span className="mr-4">{post.author.name}</span>
                      </>
                    )}
                    
                    {showDate && post.publishedAt && (
                      <>
                        <Clock size={14} className="mr-1" />
                        <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
                      </>
                    )}
                    
                    {showReadTime && post.readTime && (
                      <span className="ml-4">{post.readTime} min read</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

HeroSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  posts: PropTypes.array.isRequired,
  layout: PropTypes.oneOf(['standard', 'large', 'split']),
  showExcerpt: PropTypes.bool,
  showAuthor: PropTypes.bool,
  showDate: PropTypes.bool,
  showReadTime: PropTypes.bool,
  maxPosts: PropTypes.number,
  className: PropTypes.string
};

export default HeroSection;
