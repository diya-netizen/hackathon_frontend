# Quick Backend Setup

This guide will help you set up a minimal NestJS backend to connect with your frontend.

## 1. Create NestJS Project

```bash
# Install NestJS CLI globally
npm i -g @nestjs/cli

# Create new project
nest new backend
cd backend

# Install required dependencies
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs
npm install -D @types/passport-jwt @types/bcryptjs
```

## 2. Create Auth Module

### Create `src/auth/auth.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key', // Use environment variable in production
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

### Create `src/auth/auth.controller.ts`:
```typescript
import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      return { formError: 'Invalid email or password' };
    }
    
    const token = await this.authService.login(user);
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }

  @Post('register')
  async register(@Body() registerDto: { email: string; password: string; name?: string }) {
    const user = await this.authService.register(registerDto);
    const token = await this.authService.login(user);
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('logout')
  async logout() {
    // In a real app, you might want to blacklist the token
    return { message: 'Logged out successfully' };
  }
}
```

### Create `src/auth/auth.service.ts`:
```typescript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  // Mock user data - replace with database in production
  private users = [
    {
      id: 1,
      email: 'test@example.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
      name: 'Test User',
    },
  ];

  async validateUser(email: string, password: string): Promise<any> {
    const user = this.users.find(u => u.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(registerDto: { email: string; password: string; name?: string }) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = {
      id: this.users.length + 1,
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name || 'User',
    };
    this.users.push(newUser);
    const { password, ...result } = newUser;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

### Create `src/auth/jwt.strategy.ts`:
```typescript
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // Use environment variable in production
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

### Create `src/auth/jwt-auth.guard.ts`:
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

## 3. Update `src/app.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
})
export class AppModule {}
```

## 4. Update `src/main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  
  await app.listen(3001);
  console.log('Backend running on http://localhost:3001');
}
bootstrap();
```

## 5. Test the Backend

```bash
# Start the backend
npm run start:dev

# Test endpoints with curl or Postman:
# POST http://localhost:3001/auth/login
# Body: {"email": "test@example.com", "password": "password"}

# GET http://localhost:3001/auth/profile
# Header: Authorization: Bearer <token>
```

## 6. Connect Frontend

1. Create `.env.local` in your frontend project:
   ```env
   NEST_API=http://localhost:3001
   ```

2. Start your frontend: `npm run dev`

3. Navigate to `/users` to see the backend status

## Default Test User

- **Email:** test@example.com
- **Password:** password

## Next Steps

- Add database integration (TypeORM, Prisma, etc.)
- Implement proper user management
- Add password reset functionality
- Implement refresh tokens
- Add rate limiting and security measures
