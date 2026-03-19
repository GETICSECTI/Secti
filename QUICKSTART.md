# SECTI Frontend - Quick Start Guide

This guide will help you get started with the SECTI frontend application.

## Quick Start

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Demo Login
Navigate to `/login` and use any email and password to sign in. The demo mode accepts any credentials.

Example:
- Email: `admin@secti.com`
- Password: `password123`

## Project Overview

### Public Routes (No Authentication Required)
- **Home** (`/`) - Landing page with SECTI information
- **About** (`/about`) - About SECTI page
- **Login** (`/login`) - Authentication page
- **404** (`/*`) - Not found page

### Private Routes (Authentication Required)
- **Dashboard** (`/dashboard`) - Main admin dashboard
- **Settings** (`/settings`) - User settings

## Architecture

### Authentication Flow
1. User enters credentials on login page
2. `authService.login()` validates credentials (mock implementation)
3. JWT token and user data stored in localStorage
4. User redirected to `/dashboard`
5. `AuthProvider` manages global authentication state
6. Route guards protect private routes
7. Logout clears token and redirects to login

### Key Components

**Contexts**
- `AuthContext` - Authentication state context
- `AuthProvider` - Authentication provider component
- `useAuth` - Hook to access authentication state

**Guards**
- `PrivateRoute` - Protects routes requiring authentication
- `PublicRoute` - Redirects authenticated users (e.g., from login to dashboard)

**Layouts**
- `PublicLayout` - Layout for public pages (Home, About, Login)
- `PrivateLayout` - Layout for authenticated pages (Dashboard, Settings)

**Services**
- `authService` - Handles login, logout, token storage, and validation

## Development Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## API Integration

To connect to your backend API:

### 1. Set Environment Variables

Create a `.env` file:
```env
VITE_API_URL=https://your-api.com/api
VITE_AUTH_URL=https://your-api.com/auth
```

### 2. Update Authentication Service

Edit `src/services/authService.ts`:

```typescript
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    throw new Error('Invalid credentials');
  }
  
  return await response.json();
}
```

### 3. Add Authorization Headers

For authenticated API calls:
```typescript
const token = authService.getToken();
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

## Production Deployment

### Build
```bash
npm run build
```

The production build will be in the `dist/` directory.

### Deployment Options
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist/` folder
- **Static Server**: Serve `dist/` with any web server

### Environment Variables
Set environment variables in your hosting platform:
- `VITE_API_URL`
- `VITE_AUTH_URL`

## Security Best Practices

Before deploying to production:

1. **Use httpOnly Cookies**: Replace localStorage with httpOnly cookies for token storage
2. **Enable HTTPS**: Always use HTTPS in production
3. **Implement CSRF Protection**: Add CSRF tokens for state-changing operations
4. **Add CSP Headers**: Implement Content Security Policy
5. **Validate JWT Tokens**: Verify signature and expiration on the backend
6. **Input Sanitization**: Sanitize all user inputs

## File Structure

```
/
├── src/
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx    # Auth context definition
│   │   ├── AuthProvider.tsx   # Auth provider component
│   │   ├── useAuth.ts         # useAuth hook
│   │   └── index.ts           # Barrel export
│   │
│   ├── guards/             # Route guards
│   │   ├── PrivateRoute.tsx   # Protected route guard
│   │   └── PublicRoute.tsx    # Public route guard
│   │
│   ├── layouts/            # Layout components
│   │   ├── PrivateLayout.tsx  # Layout for authenticated pages
│   │   └── PublicLayout.tsx   # Layout for public pages
│   │
│   ├── pages/              # Page components
│   │   ├── public/            # Public pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Erro404.tsx
│   │   └── private/           # Protected pages
│   │       ├── DashboardPage.tsx
│   │       └── SettingsPage.tsx
│   │
│   ├── services/           # API services
│   │   └── authService.ts     # Authentication service
│   │
│   ├── types/              # TypeScript types
│   │   └── auth.ts            # Auth-related types
│   │
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
│
├── public/                 # Static assets
├── .env.example            # Environment variables template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
└── README.md               # Documentation
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
kill -9 $(lsof -ti:5173)

# Or use a different port
npm run dev -- --port 3000
```

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npm run build
```

## Support

For issues or questions about this project, please refer to the main README.md or contact the SECTI development team.
