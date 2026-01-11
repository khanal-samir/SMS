# AGENTS.md - Development Guidelines for AI Agents

This document provides comprehensive guidelines for AI agents working on the SMS (Student Management System) codebase. Follow these conventions and commands to maintain consistency and quality.

## Build/Lint/Test Commands

### Monorepo Commands (Root Level)

```bash
# Build all apps and packages
pnpm build

# Start development servers for all apps
pnpm dev

# Run linting across all packages
pnpm lint

# Run type checking across all packages
pnpm check-types

# Format code with Prettier
pnpm format
```

### Web App Commands (apps/web/)

```bash
# Development server (with Turbopack)
cd apps/web && pnpm dev

# Build production bundle
cd apps/web && pnpm build

# Start production server
cd apps/web && pnpm start

# Lint with strict error limits
cd apps/web && pnpm lint

# Type checking
cd apps/web && pnpm check-types
```

### API Commands (apps/api/)

```bash
# Development server with watch mode
cd apps/api && pnpm dev

# Build production bundle
cd apps/api && pnpm build

# Start production server
cd apps/api && pnpm start

# Lint backend code
cd apps/api && pnpm lint

# Type checking
cd apps/api && pnpm check-types

# Database commands
cd apps/api && pnpm db:migrate    # Run pending migrations
cd apps/api && pnpm db:deploy     # Deploy migrations to production
cd apps/api && pnpm db:studio     # Open Prisma Studio
cd apps/api && pnpm db:reset      # Reset database (development only)
```

### Testing Commands

#### Backend Testing (Jest)

```bash
# Run all tests
cd apps/api && pnpm test

# Run tests in watch mode
cd apps/api && pnpm test:watch

# Run tests with coverage
cd apps/api && pnpm test:cov

# Run end-to-end tests
cd apps/api && pnpm test:e2e

# Run a single test file
cd apps/api && pnpm test -- src/path/to/file.spec.ts

# Run tests with debugging
cd apps/api && pnpm test:debug

# Run tests matching a pattern
cd apps/api && pnpm test -- --testNamePattern="should create user"
```

#### Single Test Execution Examples

```bash
# Run specific test file
cd apps/api && npx jest src/auth/auth.service.spec.ts

# Run specific test by name pattern
cd apps/api && npx jest --testNamePattern="User registration"

# Run tests for a specific module
cd apps/api && npx jest src/user/

# Debug specific test
cd apps/api && npx jest --inspect-brk src/auth/auth.service.spec.ts
```

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode**: Always enabled with `noUncheckedIndexedAccess: true`
- **Target**: ES2022
- **Module resolution**: NodeNext for backend, Bundler for frontend
- **Path aliases**: Use `@/*` for web app imports
- **Declaration files**: Generated for all packages

### Import Organization

```typescript
// 1. React imports
import React from 'react'

// 2. Third-party libraries (alphabetical)
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

// 3. Local imports (alphabetical, grouped by type)
// - Components
import { Button } from '@/components/ui/button'
// - APIs
import { authApi } from '@/api/auth.api'
// - Hooks
import { useAuthStore } from '@/store/auth.store'
// - Utils/Lib
import { cn } from '@/lib/utils'
import { QUERY_KEYS } from '@/lib/query-keys'

// 4. Types (at end, with type keyword)
import type { User, LoginDto } from '@repo/schemas'
```

### Naming Conventions

#### Components

```typescript
// PascalCase for component names
function UserProfile() { /* ... */ }
function LoginForm() { /* ... */ }

// camelCase for instances and hooks
const userProfile = <UserProfile />
const { data: userData } = useUserQuery()
```

#### Files and Directories

```
components/
├── ui/           # Base UI components (button.tsx, input.tsx)
├── form/         # Form components (login-form.tsx)
└── auth/         # Feature components

hooks/
├── useAuth.ts   # Multiple related hooks in one file
└── useUser.ts

api/
├── auth.api.ts  # API functions grouped by domain
└── user.api.ts

store/
└── auth.store.ts # Zustand stores
```

#### Variables and Functions

```typescript
// camelCase for variables and functions
const userData = { /* ... */ }
const handleSubmit = () => { /* ... */ }

// PascalCase for types and interfaces
type User = { /* ... */ }
interface LoginFormProps = { /* ... */ }

// UPPER_SNAKE_CASE for constants
const QUERY_KEYS = { /* ... */ } as const
const API_TIMEOUT = 15000
```

### React Patterns

#### Component Structure

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'default' | 'destructive' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { Button }
```

#### Hooks Usage

```typescript
// Custom hooks for API calls
export const useLogin = () => {
  const { setUser, setLoading } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (credentials: LoginDto) => authApi.login(credentials),
    onMutate: () => setLoading(true),
    onSuccess: (response) => {
      if (!response.data) return
      setUser(response.data)
      router.push('/dashboard')
    },
    onSettled: () => setLoading(false),
  })
}
```

### API Patterns

#### API Client Structure

```typescript
// Group related endpoints
export const authApi = {
  login: async (credentials: LoginDto): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.post('/auth/login', credentials)
    return data
  },

  register: async (userData: CreateUserDto): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.post('/auth/register', userData)
    return data
  },
}
```

#### Error Handling

```typescript
// API layer - throw/reject with descriptive messages
export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onError: (error) => {
      // Handle API errors (401, 500, etc.)
      toast.error(error.message || 'Login failed')
    },
  })
}

// Component layer - graceful degradation
function LoginForm() {
  const loginMutation = useLogin()

  const handleSubmit = (data: LoginDto) => {
    loginMutation.mutate(data, {
      onError: () => {
        // Additional UI-specific error handling
      },
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {loginMutation.isError && (
        <div className="text-destructive">Login failed. Please try again.</div>
      )}
    </form>
  )
}
```

### State Management

#### Zustand Store Pattern

```typescript
// auth.store.ts
interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  clearUser: () => set({ user: null, isLoading: false }),
}))
```

#### React Query Keys

```typescript
// lib/query-keys.ts
export const QUERY_KEYS = {
  USER: 'user',
  USERS: 'users',
  TEACHERS: 'teachers',
  PENDING_TEACHERS: 'pending-teachers',
} as const

// Usage in hooks
const { data: user } = useQuery({
  queryKey: [QUERY_KEYS.USER],
  queryFn: userApi.getCurrentUser,
})
```

### Styling Guidelines

#### Tailwind CSS

```tsx
// Use semantic class names with design system
;<button
  className={cn(
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium',
    'bg-primary text-primary-foreground hover:bg-primary/90',
    'disabled:pointer-events-none disabled:opacity-50',
    className,
  )}
  {...props}
/>

// Prefer utility classes over arbitrary values
// ✅ Good
className = 'h-9 px-4'

// ❌ Avoid
className = 'h-[36px] px-[16px]'
```

#### CSS Variables and Theming

```css
/* Use CSS custom properties for theming */
:root {
  --primary: hsl(221.2 83.2% 53.3%);
  --primary-foreground: hsl(210 40% 98%);
}

.dark {
  --primary: hsl(217.2 91.2% 59.8%);
  --primary-foreground: hsl(222.2 84% 4.9%);
}
```

### Testing Patterns

#### Unit Tests (Jest)

```typescript
// auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService
  let mockUserRepository: MockType<Repository<User>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useFactory: jest.fn(() => ({
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          })),
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    mockUserRepository = module.get(getRepositoryToken(User))
  })

  it('should validate user credentials', async () => {
    // Test implementation
  })
})
```

#### Component Tests (React Testing Library)

```tsx
// Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Button className="custom">Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toHaveClass('custom')
  })
})
```

### File Organization Principles

#### Feature-Based Structure (Frontend)

```
apps/web/
├── app/                 # Next.js app router
│   ├── (auth)/         # Route groups
│   ├── admin/
│   ├── student/
│   └── teacher/
├── components/         # Reusable components
│   ├── ui/            # Base components
│   ├── form/          # Form components
│   └── auth/          # Auth-specific components
├── hooks/             # Custom hooks
├── api/               # API functions
├── store/             # Zustand stores
└── lib/               # Utilities
```

#### Module-Based Structure (Backend)

```
apps/api/
├── src/
│   ├── app/           # Application setup
│   ├── auth/          # Auth module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── dto/
│   ├── user/          # User module
│   └── shared/        # Shared utilities
└── test/              # E2E tests
```

### Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WEB_URL=http://localhost:3000

# Backend (.env)
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="15m"
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### Commit Message Conventions

```bash
# Format: type(scope): description
feat(auth): add Google OAuth login
fix(user): resolve password reset email issue
refactor(api): simplify user validation logic
test(auth): add unit tests for JWT service
docs(readme): update API documentation
```

### Pre-commit Hooks

- **ESLint**: Catches linting errors before commit
- **TypeScript**: Ensures type safety
- **Prettier**: Formats code automatically
- **Tests**: Runs test suite (when implemented)

### Performance Considerations

- Use `React.memo()` for expensive components
- Implement proper loading states
- Use `useMemo()` and `useCallback()` for expensive computations
- Optimize bundle size with dynamic imports
- Implement proper error boundaries

### Security Best Practices

- Never log sensitive data (passwords, tokens)
- Validate all inputs with Zod schemas
- Use HTTPS in production
- Implement proper CORS policies
- Sanitize user inputs
- Use environment variables for secrets
- Implement rate limiting on API endpoints</content>
  <parameter name="filePath">/home/samir/Documents/Projects/sms/AGENTS.md
