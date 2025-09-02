import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { TrendingUp, Calendar } from 'lucide-react';

/**
 * SidebarSection component for displaying sidebar widgets
 */
const SidebarSection = ({
  widgets = [],
  className = '',
}) => {
  return (
    <div className={`sidebar-section space-y-8 ${className}`}>
      {widgets.map((widget, index) => {
        switch (widget.type) {
          case 'trending':
            return (
              <TrendingWidget 
                key={`widget-${index}`}
                title={widget.title || 'Trending Now'}
                posts={widget.posts || []}
                limit={widget.limit || 5}
              />
            );
            
          case 'categories':
            return (
              <CategoriesWidget 
                key={`widget-${index}`}
                title={widget.title || 'Categories'}
                categories={widget.categories || []}
              />
            );
            
          case 'newsletter':
            return (
              <NewsletterWidget 
                key={`widget-${index}`}
                title={widget.title || 'Stay Updated'}
                description={widget.description || 'Get the latest tech news delivered to your inbox'}
                buttonText={widget.buttonText || 'Subscribe Now'}
                buttonLink={widget.buttonLink || '/newsletter'}
              />
            );
            
          case 'tags':
            return (
              <TagsWidget 
                key={`widget-${index}`}
                title={widget.title || 'Popular Tags'}
                tags={widget.tags || []}
              />
            );
            
          case 'calendar':
            return (
              <CalendarWidget 
                key={`widget-${index}`}
                title={widget.title || 'Event Calendar'}
                events={widget.events || []}
              />
            );
            
          case 'custom':
            return (
              <CustomWidget 
                key={`widget-${index}`}
                title={widget.title || ''}
                content={widget.content || ''}
              />
            );
            
          default:
            return null;
        }
      })}
    </div>
  );
};

// Trending Posts Widget
const TrendingWidget = ({ title, posts, limit }) => {
  const displayPosts = posts.slice(0, limit);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <TrendingUp className="text-tech-green mr-2" size={20} />
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {displayPosts.map((post, index) => (
          <Link 
            key={post.id} 
            to={`/article/${post.id}`} 
            className="group flex items-start space-x-3"
          >
            <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 group-hover:text-tech-green transition-colors duration-200 line-clamp-2">
                {post.title}
              </h4>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <span className="mr-2">{post.category}</span>
                {post.publishedAt && (
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Categories Widget
const CategoriesWidget = ({ title, categories }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-2">
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/category/${category.slug || category.name.toLowerCase()}`}
            className="flex items-center justify-between py-2 hover:text-tech-green transition-colors duration-200"
          >
            <span className="text-gray-900">{category.name}</span>
            {category.count !== undefined && (
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                {category.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

// Newsletter Widget
const NewsletterWidget = ({ title, description, buttonText, buttonLink }) => {
  return (
    <div className="bg-green-500 text-white rounded-lg p-6">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm mb-4 opacity-90">
        {description}
      </p>
      <Link to={buttonLink} className="btn-secondary block text-center">
        {buttonText}
      </Link>
    </div>
  );
};

// Tags Widget
const TagsWidget = ({ title, tags }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Link
            key={tag.id || tag.name}
            to={`/tag/${tag.slug || tag.name.toLowerCase()}`}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-green-500 hover:text-white transition-colors duration-200"
          >
            {tag.name}
            {tag.count !== undefined && ` (${tag.count})`}
          </Link>
        ))}
      </div>
    </div>
  );
};

// Calendar Widget
const CalendarWidget = ({ title, events }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Calendar className="text-tech-green mr-2" size={20} />
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {events.map(event => (
          <div key={event.id} className="border-l-4 border-green-500 pl-3">
            <h4 className="font-medium text-gray-900">{event.title}</h4>
            <p className="text-sm text-gray-500 mt-1">{event.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom Content Widget
const CustomWidget = ({ title, content }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {title && <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>}
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};

SidebarSection.propTypes = {
  widgets: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['trending', 'categories', 'newsletter', 'tags', 'calendar', 'custom']).isRequired,
      title: PropTypes.string,
      posts: PropTypes.array,
      categories: PropTypes.array,
      tags: PropTypes.array,
      events: PropTypes.array,
      description: PropTypes.string,
      buttonText: PropTypes.string,
      buttonLink: PropTypes.string,
      content: PropTypes.string,
      limit: PropTypes.number
    })
  ),
  className: PropTypes.string
};

export default SidebarSection;
