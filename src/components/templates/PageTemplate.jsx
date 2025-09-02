import React from 'react';
import PropTypes from 'prop-types';

// Dynamic content sections that can be arranged in different templates
import HeroSection from './sections/HeroSection';
import PostGridSection from './sections/PostGridSection';
import FeaturedPostsSection from './sections/FeaturedPostsSection';
import PostListSection from './sections/PostListSection';
import CategorySection from './sections/CategorySection';
import SidebarSection from './sections/SidebarSection';

/**
 * PageTemplate component for rendering dynamic page layouts
 * This is the core component for the WordPress-like CMS functionality
 */
const PageTemplate = ({ template, sections = [] }) => {
  // Render different layouts based on template type
  switch (template) {
    case 'homepage':
      return (
        <div className="page-template homepage-template">
          {/* Hero section at the top */}
          {sections.filter(section => section.type === 'hero').map((section, index) => (
            <HeroSection 
              key={`hero-${index}`} 
              {...section.props} 
            />
          ))}
          
          {/* Main content area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Main content - 2/3 width */}
            <div className="lg:col-span-2">
              {sections.filter(section => 
                ['featured-posts', 'post-grid', 'post-list', 'category'].includes(section.type)
              ).map((section, index) => {
                switch(section.type) {
                  case 'featured-posts':
                    return <FeaturedPostsSection key={`section-${index}`} {...section.props} />;
                  case 'post-grid':
                    return <PostGridSection key={`section-${index}`} {...section.props} />;
                  case 'post-list':
                    return <PostListSection key={`section-${index}`} {...section.props} />;
                  case 'category':
                    return <CategorySection key={`section-${index}`} {...section.props} />;
                  default:
                    return null;
                }
              })}
            </div>
            
            {/* Sidebar - 1/3 width */}
            <div className="lg:col-span-1">
              {sections.filter(section => section.type === 'sidebar').map((section, index) => (
                <SidebarSection 
                  key={`sidebar-${index}`} 
                  {...section.props} 
                />
              ))}
            </div>
          </div>
        </div>
      );
      
    case 'full-width':
      return (
        <div className="page-template full-width-template">
          {sections.map((section, index) => {
            switch(section.type) {
              case 'hero':
                return <HeroSection key={`section-${index}`} {...section.props} />;
              case 'featured-posts':
                return <FeaturedPostsSection key={`section-${index}`} {...section.props} />;
              case 'post-grid':
                return <PostGridSection key={`section-${index}`} {...section.props} />;
              case 'post-list':
                return <PostListSection key={`section-${index}`} {...section.props} />;
              case 'category':
                return <CategorySection key={`section-${index}`} {...section.props} />;
              default:
                return null;
            }
          })}
        </div>
      );
    
    case 'two-column':
      return (
        <div className="page-template two-column-template max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="md:col-span-1">
              {sections
                .filter(section => section.column === 'left')
                .map((section, index) => {
                  switch(section.type) {
                    case 'featured-posts':
                      return <FeaturedPostsSection key={`section-${index}`} {...section.props} />;
                    case 'post-grid':
                      return <PostGridSection key={`section-${index}`} {...section.props} />;
                    case 'post-list':
                      return <PostListSection key={`section-${index}`} {...section.props} />;
                    case 'category':
                      return <CategorySection key={`section-${index}`} {...section.props} />;
                    default:
                      return null;
                  }
                })}
            </div>
            
            {/* Right Column */}
            <div className="md:col-span-1">
              {sections
                .filter(section => section.column === 'right')
                .map((section, index) => {
                  switch(section.type) {
                    case 'featured-posts':
                      return <FeaturedPostsSection key={`section-${index}`} {...section.props} />;
                    case 'post-grid':
                      return <PostGridSection key={`section-${index}`} {...section.props} />;
                    case 'post-list':
                      return <PostListSection key={`section-${index}`} {...section.props} />;
                    case 'category':
                      return <CategorySection key={`section-${index}`} {...section.props} />;
                    default:
                      return null;
                  }
                })}
            </div>
          </div>
        </div>
      );
      
    // Add more template types as needed
      
    default:
      return (
        <div className="page-template default-template max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {sections.map((section, index) => {
            switch(section.type) {
              case 'hero':
                return <HeroSection key={`section-${index}`} {...section.props} />;
              case 'featured-posts':
                return <FeaturedPostsSection key={`section-${index}`} {...section.props} />;
              case 'post-grid':
                return <PostGridSection key={`section-${index}`} {...section.props} />;
              case 'post-list':
                return <PostListSection key={`section-${index}`} {...section.props} />;
              case 'category':
                return <CategorySection key={`section-${index}`} {...section.props} />;
              case 'sidebar':
                return <SidebarSection key={`section-${index}`} {...section.props} />;
              default:
                return null;
            }
          })}
        </div>
      );
  }
};

PageTemplate.propTypes = {
  template: PropTypes.oneOf(['homepage', 'full-width', 'two-column', 'default']).isRequired,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf([
        'hero', 
        'featured-posts', 
        'post-grid', 
        'post-list', 
        'category', 
        'sidebar'
      ]).isRequired,
      props: PropTypes.object,
      column: PropTypes.oneOf(['left', 'right']) // For multi-column templates
    })
  )
};

export default PageTemplate;
