import React from 'react';
import PageTemplate from '../components/templates/PageTemplate';

/**
 * Demo page showing how to use the Dynamic Page system
 * This demonstrates different section types and layouts
 */
const TestTemplatePage = () => {
  // Example 1: Homepage Layout - Hero + Featured Posts + Categories + Sidebar
  const homepageExample = {
    template: 'homepage',
    sections: [
      {
        type: 'hero',
        props: {
          title: 'Welcome to TechBirds',
          subtitle: 'Your ultimate source for the latest technology news and insights',
          posts: [
            {
              id: 1,
              title: 'The Future of AI in 2025',
              excerpt: 'Exploring the latest developments in artificial intelligence...',
              imageUrl: 'https://via.placeholder.com/600x300/1f2937/ffffff?text=AI+Future',
              category: 'Artificial Intelligence',
              author: { name: 'John Doe' },
              publishedAt: '2024-01-15T10:00:00Z'
            },
            {
              id: 2,
              title: 'Blockchain Revolution Continues',
              excerpt: 'How blockchain technology is reshaping industries...',
              imageUrl: 'https://via.placeholder.com/600x300/059669/ffffff?text=Blockchain',
              category: 'Blockchain',
              author: { name: 'Jane Smith' },
              publishedAt: '2024-01-14T15:30:00Z'
            }
          ]
        }
      },
      {
        type: 'featured-posts',
        props: {
          title: 'Featured Stories',
          posts: [
            {
              id: 3,
              title: 'Quantum Computing Breakthrough',
              excerpt: 'Scientists achieve new milestone in quantum processing...',
              imageUrl: 'https://via.placeholder.com/400x200/7c3aed/ffffff?text=Quantum',
              category: 'Quantum Computing',
              author: { name: 'Dr. Sarah Wilson' },
              publishedAt: '2024-01-13T09:00:00Z'
            },
            {
              id: 4,
              title: 'Sustainable Tech Solutions',
              excerpt: 'Green technology innovations for a better future...',
              imageUrl: 'https://via.placeholder.com/400x200/16a34a/ffffff?text=Green+Tech',
              category: 'Green Technology',
              author: { name: 'Michael Green' },
              publishedAt: '2024-01-12T14:20:00Z'
            },
            {
              id: 5,
              title: 'Cloud Computing Trends',
              excerpt: 'The latest trends shaping cloud infrastructure...',
              imageUrl: 'https://via.placeholder.com/400x200/0ea5e9/ffffff?text=Cloud',
              category: 'Cloud Computing',
              author: { name: 'Lisa Chen' },
              publishedAt: '2024-01-11T11:45:00Z'
            },
            {
              id: 6,
              title: 'Cybersecurity in 2025',
              excerpt: 'New threats and protection strategies...',
              imageUrl: 'https://via.placeholder.com/400x200/dc2626/ffffff?text=Security',
              category: 'Cybersecurity',
              author: { name: 'Robert Kim' },
              publishedAt: '2024-01-10T16:30:00Z'
            }
          ]
        }
      },
      {
        type: 'category',
        props: {
          title: 'Mobile Technology',
          categoryId: 1,
          posts: [
            {
              id: 7,
              title: 'iPhone 16 Review',
              excerpt: 'Comprehensive review of Apple\'s latest flagship...',
              imageUrl: 'https://via.placeholder.com/300x150/374151/ffffff?text=iPhone+16',
              category: 'Mobile',
              author: { name: 'Tech Reviewer' },
              publishedAt: '2024-01-09T12:00:00Z'
            },
            {
              id: 8,
              title: 'Android 15 Features',
              excerpt: 'New features and improvements in Android 15...',
              imageUrl: 'https://via.placeholder.com/300x150/22c55e/ffffff?text=Android+15',
              category: 'Mobile',
              author: { name: 'Android Expert' },
              publishedAt: '2024-01-08T10:15:00Z'
            }
          ]
        }
      },
      {
        type: 'sidebar',
        props: {
          widgets: [
            {
              type: 'trending',
              title: 'Trending Now',
              posts: [
                {
                  id: 9,
                  title: 'Meta\'s New VR Headset',
                  imageUrl: 'https://via.placeholder.com/150x100/8b5cf6/ffffff?text=VR',
                  publishedAt: '2024-01-07T08:30:00Z'
                },
                {
                  id: 10,
                  title: 'Tesla Model Y Update',
                  imageUrl: 'https://via.placeholder.com/150x100/ef4444/ffffff?text=Tesla',
                  publishedAt: '2024-01-06T13:45:00Z'
                },
                {
                  id: 11,
                  title: 'SpaceX Mars Mission',
                  imageUrl: 'https://via.placeholder.com/150x100/f59e0b/ffffff?text=SpaceX',
                  publishedAt: '2024-01-05T17:20:00Z'
                }
              ]
            },
            {
              type: 'categories',
              title: 'Browse by Category',
              categories: [
                { id: 1, name: 'Artificial Intelligence', count: 15 },
                { id: 2, name: 'Blockchain', count: 8 },
                { id: 3, name: 'Mobile Technology', count: 12 },
                { id: 4, name: 'Cloud Computing', count: 6 },
                { id: 5, name: 'Cybersecurity', count: 10 }
              ]
            },
            {
              type: 'newsletter',
              title: 'Stay Updated',
              description: 'Get the latest tech news delivered to your inbox'
            }
          ]
        }
      }
    ]
  };

  // Example 2: Full Width Layout
  const fullWidthExample = {
    template: 'full-width',
    sections: [
      {
        type: 'hero',
        props: {
          title: 'Full Width Hero Section',
          subtitle: 'This layout uses the full width of the screen',
          posts: homepageExample.sections[0].props.posts
        }
      },
      {
        type: 'post-grid',
        props: {
          title: 'Latest Articles Grid',
          posts: homepageExample.sections[1].props.posts
        }
      }
    ]
  };

  // Example 3: Two Column Layout
  const twoColumnExample = {
    template: 'two-column',
    sections: [
      {
        type: 'featured-posts',
        column: 'left',
        props: {
          title: 'Left Column - Featured',
          posts: homepageExample.sections[1].props.posts.slice(0, 2)
        }
      },
      {
        type: 'post-list',
        column: 'right',
        props: {
          title: 'Right Column - Latest',
          posts: homepageExample.sections[1].props.posts.slice(2, 4)
        }
      }
    ]
  };

  const [currentExample, setCurrentExample] = React.useState('homepage');

  const examples = {
    homepage: homepageExample,
    fullwidth: fullWidthExample,
    twocolumn: twoColumnExample
  };

  const exampleNames = {
    homepage: 'Homepage Layout',
    fullwidth: 'Full Width Layout', 
    twocolumn: 'Two Column Layout'
  };

  return (
    <div>
      {/* Template Selector */}
      <div className="bg-gray-100 border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dynamic Template Demo</h1>
              <p className="text-sm text-gray-600 mt-1">
                See how different sections work together in various layouts
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Layout:</label>
              <select
                value={currentExample}
                onChange={(e) => setCurrentExample(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              >
                {Object.entries(exampleNames).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Current Example Info */}
      <div className="bg-blue-50 border-b border-blue-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-sm text-blue-800">
            <strong>Current Layout: {exampleNames[currentExample]}</strong>
            {currentExample === 'homepage' && (
              <span className="ml-2">- Hero section + 2/3 main content + 1/3 sidebar</span>
            )}
            {currentExample === 'fullwidth' && (
              <span className="ml-2">- All sections take full width</span>
            )}
            {currentExample === 'twocolumn' && (
              <span className="ml-2">- Content split between left and right columns</span>
            )}
          </div>
        </div>
      </div>

      {/* Render the selected template */}
      <PageTemplate 
        template={examples[currentExample].template}
        sections={examples[currentExample].sections}
      />

      {/* Implementation Guide */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">How to Create Dynamic Pages</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Choose a Template</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Homepage:</strong> Hero + main content + sidebar</li>
                  <li>• <strong>Full Width:</strong> Sections span full width</li>
                  <li>• <strong>Two Column:</strong> Split content layout</li>
                  <li>• <strong>Default:</strong> Simple vertical stack</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Add Sections</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Hero:</strong> Large banner with featured content</li>
                  <li>• <strong>Featured Posts:</strong> Highlighted articles</li>
                  <li>• <strong>Post Grid:</strong> Articles in grid layout</li>
                  <li>• <strong>Category:</strong> Posts from specific category</li>
                  <li>• <strong>Sidebar:</strong> Widgets and additional content</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">💡 Pro Tip:</h4>
              <p className="text-sm text-green-700">
                Go to <strong>Admin → Dynamic Pages → Add Dynamic Page</strong> to create your own custom pages 
                using these sections. You can mix and match different section types to create unique layouts!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTemplatePage;
