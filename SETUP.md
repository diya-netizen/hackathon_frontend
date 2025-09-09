# Frontend Setup Guide

This Next.js frontend application is designed to connect to a NestJS backend for authentication and user management.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- A running NestJS backend (see backend setup below)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Backend API Configuration
   NEST_API=http://localhost:3001
   
   # Next.js Configuration
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # Environment
   NODE_ENV=development
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Backend Connection

The frontend expects a NestJS backend with the following endpoints:

### Authentication Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `GET /auth/profile` - Get user profile
- `POST /auth/logout` - User logout

### Expected Response Format

**Login/Register Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Error Response:**
```json
{
  "formError": "Error message",
  "fieldErrors": {
    "email": ["Invalid email format"],
    "password": ["Password too short"]
  }
}
```

## Backend Setup (NestJS)

If you need to set up the backend, here's a basic structure:

1. **Create a new NestJS project:**
   ```bash
   npm i -g @nestjs/cli
   nest new backend
   cd backend
   ```

2. **Install required dependencies:**
   ```bash
   npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs
   npm install -D @types/passport-jwt @types/bcryptjs
   ```

3. **Create auth module with login endpoint:**
   ```typescript
   // src/auth/auth.controller.ts
   @Controller('auth')
   export class AuthController {
     @Post('login')
     async login(@Body() loginDto: LoginDto) {
       // Implement login logic
       return { token: 'jwt-token', user: userData };
     }
   }
   ```

4. **Start the backend:**
   ```bash
   npm run start:dev
   ```

## Troubleshooting

### Common Issues

1. **"Backend service is not configured"**
   - Check that `NEST_API` is set in your `.env.local` file
   - Ensure the backend is running on the specified port

2. **"Unable to connect to authentication service"**
   - Verify the backend is running
   - Check the backend URL in environment variables
   - Ensure CORS is properly configured on the backend

3. **CSRF token errors**
   - Clear browser cookies and refresh
   - Check that the CSRF endpoint is working

### CORS Configuration

If you encounter CORS issues, ensure your backend has proper CORS configuration:

```typescript
// In your NestJS main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

## Development

- **Frontend runs on:** http://localhost:3000
- **Backend runs on:** http://localhost:3001 (configurable)
- **API routes:** `/api/*` (Next.js API routes)
- **Backend routes:** `/auth/*` (NestJS endpoints)

## Production Deployment

1. **Build the frontend:**
   ```bash
   npm run build
   npm start
   ```

2. **Set production environment variables:**
   ```env
   NEST_API=https://your-backend-domain.com
   NODE_ENV=production
   NEXTAUTH_URL=https://your-frontend-domain.com
   ```

3. **Ensure HTTPS in production** for secure cookie handling
