# Snippet Manager

A modern code snippet manager built with React, Vite, Tailwind CSS, Shadcn/UI, and Express.js.

## Features

- 📝 Save and organize code snippets in one secure location
- ✨ Beautiful syntax highlighting for multiple programming languages
- 🔄 Share snippets easily with teammates or the community
- 🏷️ Organize snippets with custom tags
- ⚡️ Fast development with Vite
- 🎨 Modern UI with Tailwind CSS and Shadcn/UI
- 📱 Fully responsive design
- 🔒 TypeScript for type safety
- 📨 Contact form with email integration
- 🛡️ Secure backend with rate limiting and sanitization

## Snippet Management

- Create, edit, and delete code snippets
- Organize snippets with custom tags
- Beautiful syntax highlighting for multiple programming languages
- Securely store and manage code snippets

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with the following:
   ```
   PORT=3001
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your-app-password
   ```
4. Start development servers:
   ```bash
   npm run dev
   ```
   - Frontend will be available at http://localhost:3000
   - Backend API will be available at http://localhost:3001

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
  ├── backend/       # Express.js backend server
  ├── components/    # Reusable UI components
  │   ├── layout/   # Layout components (Header, Footer, etc.)
  │   └── ui/       # UI components from Shadcn/UI
  ├── pages/        # Page components
  ├── lib/          # Utility functions and schemas
  ├── App.tsx       # Main App component with routing
  └── index.css     # Global styles
```

## Pages

### Landing Page
- Clean, modern design with Tailwind CSS
- Responsive header with navigation
- Hero section with prominent call-to-action
- Feature cards highlighting key functionality
- Accessible footer with essential links

### About Page
- Overview of the Snippet Manager's purpose
- Mission statement and team information
- Key statistics and testimonials
- Consistent design with the landing page

### Contact Page
- User-friendly contact form with email integration
- Fields for name, email, subject, and message
- Secure form submission with rate limiting
- Input validation and sanitization
- Built with Shadcn/UI Form components

### Get Started Page
- Step-by-step guide for new users
- Interactive how-to sections
- Frequently asked questions
- Quick-start call-to-action buttons

## Navigation

- Responsive navigation header across all pages
- Mobile-friendly hamburger menu
- Seamless routing between pages using React Router
- Consistent layout and styling throughout

## Available Scripts

- `npm run dev` - Start both frontend and backend development servers
- `npm run dev:frontend` - Start frontend development server on port 3000
- `npm run dev:backend` - Start backend development server on port 3001
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
