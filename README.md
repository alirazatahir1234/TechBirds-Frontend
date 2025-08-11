# TechBirds Frontend

A modern React.js frontend application for TechBirds - a technology news website similar to TechCrunch. Built with the latest React 19.1.1 and designed to connect seamlessly with a .NET 9 backend API.

## 🚀 Features

- **Modern React 19.1.1** with latest hooks and features
- **Responsive Design** optimized for all devices
- **TechCrunch-inspired UI** with clean, professional layout
- **Real-time Search** with advanced filtering
- **Category-based Navigation** for easy content discovery
- **Author Profiles** with detailed article listings
- **Newsletter Integration** for user engagement
- **API Integration** ready for .NET 9 backend
- **Performance Optimized** with Vite build tool
- **SEO Friendly** with proper meta tags and structure

## 🛠️ Tech Stack

- **React 19.1.1** - UI Framework
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library
- **date-fns** - Date manipulation
- **Headless UI** - Accessible UI components

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- .NET 9 backend API (optional for development)

## ⚡ Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd techbirds-frontend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Update API endpoint in .env file
   VITE_API_BASE_URL=https://localhost:7001/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   └── Footer.jsx      # Site footer
├── pages/              # Page components
│   ├── HomePage.jsx    # Homepage with featured articles
│   ├── ArticlePage.jsx # Individual article view
│   ├── CategoryPage.jsx# Category-filtered articles
│   ├── AuthorPage.jsx  # Author profile and articles
│   ├── SearchPage.jsx  # Search results
│   └── NotFoundPage.jsx# 404 error page
├── services/           # API service layer
│   └── api.js         # Axios configuration and API calls
├── App.jsx            # Main app component with routing
├── main.jsx           # React app entry point
└── index.css          # Global styles and Tailwind imports
```

## 🔌 API Integration

The application is designed to work with a .NET 9 backend API. The API service layer (`src/services/api.js`) includes:

### Article Endpoints
- `GET /api/posts` - Get paginated posts/articles
- `GET /api/posts/featured` - Get featured posts/articles
- `GET /api/posts/{id}` - Get post/article by ID
- `GET /api/posts?categoryId={category}` - Get posts/articles by category
- `GET /api/posts?search={query}` - Search posts/articles

### Category Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/categories/{slug}` - Get category by slug

### Author Endpoints
- `GET /api/authors` - Get all authors
- `GET /api/authors/{id}` - Get author by ID
- `GET /api/authors/{id}/articles` - Get articles by author

### Newsletter Endpoints
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter

## 🎨 Design System

The application follows TechCrunch's design principles:

### Colors
- Primary Green: `#30d158` (tech-green)
- Dark Gray: `#1a1a1a` (tech-dark)
- Medium Gray: `#2c2c2e` (tech-gray)
- Light Gray: `#f2f2f7` (tech-light-gray)

### Typography
- Font Family: Inter (Google Fonts)
- Headings: 600 weight
- Body: 400 weight
- Small text: 300 weight

### Components
- Article cards with hover effects
- Category tags with brand colors
- Responsive navigation
- Search functionality
- Newsletter signup forms

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Deploy to Custom Server
1. Build the project
2. Copy `dist` folder to your web server
3. Configure web server for SPA routing

## 🔒 Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=https://your-api-url.com/api

# Application Configuration
VITE_APP_NAME=TechBirds
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=false
```

## 🧪 Development with Mock Data

The application includes mock data for development when the backend API is not available. This allows you to:

- Test UI components
- Develop frontend features independently
- Demo the application without backend dependencies

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔍 SEO Optimization

- Semantic HTML structure
- Proper heading hierarchy
- Meta tags for articles
- Open Graph integration
- Structured data for articles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ using React 19.1.1 and modern web technologies.
