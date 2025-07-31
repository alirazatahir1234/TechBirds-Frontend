# TechBirds Frontend - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context
This is a React.js frontend application for TechBirds, a tech news website similar to TechCrunch. The application uses:

- **React 19.1.1** (Latest version)
- **Vite** for build tooling
- **React Router DOM** for navigation
- **Axios** for API calls to .NET 9 backend
- **Lucide React** for icons
- **Tailwind CSS** for styling
- **Headless UI** for accessible components

## Architecture Guidelines
- Use functional components with hooks
- Implement responsive design following TechCrunch's layout patterns
- Create reusable components for articles, navigation, and UI elements
- Use proper error handling for API calls
- Implement loading states for better UX
- Follow modern React patterns and best practices

## API Integration
- Backend is built with .NET 9
- Use Axios for all HTTP requests
- Implement proper error handling and loading states
- Create a dedicated API service layer
- Use environment variables for API endpoints

## Design Guidelines
- Follow TechCrunch's visual design principles
- Use a modern, clean layout with proper typography
- Implement dark/light theme support
- Ensure mobile-first responsive design
- Use proper spacing and visual hierarchy

## Component Structure
- Keep components focused and single-purpose
- Use proper prop types and validation
- Implement proper state management
- Create custom hooks for reusable logic
- Follow consistent naming conventions
