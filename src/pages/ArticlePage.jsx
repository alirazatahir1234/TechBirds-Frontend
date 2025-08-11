import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, Calendar, Share2, Bookmark, ArrowLeft } from 'lucide-react';
import { articleAPI, statsAPI } from '../services/api';
import { formatDistanceToNow, format } from 'date-fns';
import CommentSection from '../components/CommentSection';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const articleData = await articleAPI.getArticleById(id);
        setArticle(articleData);

        // Track article view
        await statsAPI.trackArticleView(id);

        // Fetch related articles
        if (articleData.categoryId || articleData.category) {
          const categoryId = articleData.categoryId || articleData.category;
          const related = await articleAPI.getArticlesByCategory(categoryId, 1, 4);
          setRelatedArticles(related.posts?.filter(a => a.id !== parseInt(id)) || related.filter(a => a.id !== parseInt(id)) || []);
        }
      } catch (err) {
        setError('Failed to load article. Please try again later.');
        console.error('Error fetching article:', err);
        
        // Mock article for development
        setArticle({
          id: parseInt(id),
          title: "OpenAI Launches Revolutionary GPT-5 with Advanced Reasoning Capabilities",
          content: `
            <p>In a groundbreaking announcement today, OpenAI unveiled GPT-5, their most advanced language model to date, featuring unprecedented capabilities in reasoning, problem-solving, and multi-modal understanding.</p>
            
            <h2>Key Features and Improvements</h2>
            <p>GPT-5 represents a significant leap forward in artificial intelligence, incorporating several breakthrough technologies:</p>
            
            <ul>
              <li><strong>Enhanced Reasoning:</strong> The model demonstrates remarkable improvements in logical reasoning and complex problem-solving tasks.</li>
              <li><strong>Multi-modal Capabilities:</strong> Native support for text, images, audio, and video processing in a unified framework.</li>
              <li><strong>Improved Accuracy:</strong> Reduced hallucinations and increased factual accuracy across all domains.</li>
              <li><strong>Better Context Understanding:</strong> Ability to maintain context across much longer conversations and documents.</li>
            </ul>
            
            <h2>Industry Impact</h2>
            <p>The release of GPT-5 is expected to have far-reaching implications across various industries. From healthcare and education to software development and creative industries, the enhanced capabilities promise to revolutionize how we interact with AI systems.</p>
            
            <blockquote>
              "GPT-5 represents not just an incremental improvement, but a fundamental advancement in how AI systems understand and interact with the world," said Sam Altman, CEO of OpenAI.
            </blockquote>
            
            <h2>Availability and Pricing</h2>
            <p>GPT-5 will be initially available to ChatGPT Plus subscribers and API developers in a limited beta program. General availability is expected in Q3 2025, with enterprise solutions rolling out shortly after.</p>
            
            <p>The pricing structure has been redesigned to be more accessible, with competitive rates for both individual users and enterprise customers. OpenAI has also announced new partnership programs for educational institutions and non-profit organizations.</p>
            
            <h2>Looking Forward</h2>
            <p>As AI continues to evolve at an unprecedented pace, GPT-5 sets a new benchmark for what's possible with large language models. The implications for productivity, creativity, and problem-solving are enormous, and we're only beginning to scratch the surface of what's possible.</p>
          `,
          excerpt: "The latest AI model promises unprecedented performance in complex problem-solving and multi-modal understanding.",
          imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
          category: "AI",
          author: { 
            name: "Sarah Chen", 
            id: 1,
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
            bio: "Senior Technology Reporter covering AI and emerging technologies"
          },
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          readTime: 5,
          views: 12500,
          tags: ["AI", "OpenAI", "GPT-5", "Machine Learning", "Technology"]
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Article not found'}</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-tech-green mb-6 transition-colors duration-200">
        <ArrowLeft size={20} className="mr-2" />
        Back to Home
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        <div className="mb-4">
          <Link 
            to={`/category/${article.category.toLowerCase()}`}
            className="category-tag"
          >
            {article.category}
          </Link>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>
        
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <div className="flex items-center">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <Link 
                  to={`/author/${article.author.id}`}
                  className="font-medium text-gray-900 hover:text-tech-green transition-colors duration-200"
                >
                  {article.author.name}
                </Link>
                {article.author.bio && (
                  <p className="text-sm text-gray-500">{article.author.bio}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{format(new Date(article.publishedAt), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{article.readTime} min read</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center text-gray-600 hover:text-tech-green transition-colors duration-200"
            >
              <Share2 size={18} className="mr-1" />
              Share
            </button>
            <button className="flex items-center text-gray-600 hover:text-tech-green transition-colors duration-200">
              <Bookmark size={18} className="mr-1" />
              Save
            </button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-8">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none mb-8">
        <div 
          dangerouslySetInnerHTML={{ __html: article.content }}
          className="article-content"
        />
      </article>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                to={`/search?q=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-green-500 hover:text-white transition-colors duration-200"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* User Bio */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-16 h-16 rounded-full mr-4 object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold mb-2">{article.author.name}</h3>
              <p className="text-gray-600 mb-3">{article.author.bio}</p>
              <Link
                to={`/author/${article.author.id}`}
                className="text-tech-green hover:text-green-700 font-medium"
              >
                View all articles by {article.author.name}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.slice(0, 4).map((relatedArticle) => (
              <Link
                key={relatedArticle.id}
                to={`/article/${relatedArticle.id}`}
                className="group block article-card"
              >
                <img
                  src={relatedArticle.imageUrl}
                  alt={relatedArticle.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <span className="category-tag mb-2">
                    {relatedArticle.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 group-hover:text-tech-green transition-colors duration-200 line-clamp-2">
                    {relatedArticle.title}
                  </h3>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span>{formatDistanceToNow(new Date(relatedArticle.publishedAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Comments Section */}
      {article && article.allowComments !== false && (
        <CommentSection articleId={parseInt(id)} />
      )}
    </div>
  );
};

export default ArticlePage;
