# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack e-commerce application called "Restore" with a .NET 9 Web API backend and React TypeScript frontend. The application features product catalog, shopping cart, user authentication, Stripe payment processing, and order management.

## Development Commands

### API (.NET 9)
- Start API server: `cd API && dotnet run`
- Run database migrations: `cd API && dotnet ef database update`
- Run tests: `cd API && dotnet test`
- Build: `cd API && dotnet build`

### Client (React TypeScript)
- Start development server: `cd client && npm run dev`
- Build for production: `cd client && npm run build`
- Lint code: `cd client && npm run lint`
- Preview production build: `cd client && npm run preview`

### Database (Development)
- Start SQL Server container: `docker-compose up -d`
- Stop containers: `docker-compose down`

## Architecture Overview

### Backend Architecture
- **Framework**: ASP.NET Core 9.0 Web API with Clean Architecture principles
- **Database**: Entity Framework Core with SQL Server, using Repository Pattern via DbContext
- **Authentication**: ASP.NET Core Identity with JWT tokens and cookie-based auth
- **API Structure**: Controller-based with `BaseApiController` as base class
- **Middleware**: Custom `ExceptionMiddleware` for global error handling
- **Services**: Scoped services like `PaymentsService` for business logic
- **Database Context**: `StoreContext` inherits from `IdentityDbContext<User>`

### Frontend Architecture
- **State Management**: Redux Toolkit with RTK Query for API calls
- **API Layer**: Centralized `baseApi.ts` with error handling and loading states
- **Feature-based Structure**: Each domain (catalog, basket, account, orders, checkout) has its own folder with components, API slice, and types
- **Component Library**: Material-UI (MUI) with custom theming support
- **Form Handling**: React Hook Form with Zod validation schemas
- **Routing**: React Router DOM with authentication guards

### Key Architectural Patterns
- **Frontend**: Feature-based folder structure with RTK Query slices for each domain
- **Backend**: Controller-Service pattern with Entity Framework as data layer
- **API Communication**: RESTful endpoints with centralized error handling
- **Authentication**: Cookie-based sessions with Identity API endpoints at `/api/login`, `/api/register`
- **Payment Processing**: Stripe integration with webhook handling

## Database Setup

The application requires SQL Server. For development:
1. Run `docker-compose up -d` to start SQL Server container
2. Connection string uses `DefaultConnection` from appsettings.json
3. Database is auto-seeded via `DbInitializer.InitDb()` on startup
4. Default password for containerized SQL Server: `Password123!`

## Key Configuration

### API Configuration
- **CORS**: Configured for `https://localhost:5173` (dev) and production Azure URL
- **Identity**: Email required, with Member/Admin roles pre-seeded
- **Stripe**: Requires `Stripe:PublishableKey` and `Stripe:SecretKey` in configuration
- **Database**: Uses SQL Server with connection string in `appsettings.json`

### Frontend Configuration  
- **API Base URL**: Set via `VITE_API_URL` environment variable
- **Development URL**: `https://localhost:5173`
- **API URL**: `https://localhost:5001`

## Common Development Tasks

### Adding New API Endpoint
1. Create/update controller inheriting from `BaseApiController`
2. Add corresponding RTK Query API slice in appropriate feature folder
3. Update Redux store configuration to include new API slice

### Database Changes
1. Modify entities in `API/Entities/`
2. Add migration: `cd API && dotnet ef migrations add MigrationName`
3. Update database: `cd API && dotnet ef database update`

### Frontend Feature Development
1. Create feature folder under `client/src/features/`
2. Add API slice with RTK Query for server communication
3. Create components and integrate with Redux store
4. Add route configuration in `client/src/routes/Routes.tsx`

## Important Files

### Backend Key Files
- `API/Program.cs`: Application configuration and dependency injection
- `API/Data/StoreContext.cs`: Entity Framework database context
- `API/Controllers/`: API controllers for each domain
- `API/Services/PaymentsService.cs`: Stripe payment processing logic

### Frontend Key Files
- `client/src/app/store/store.ts`: Redux store configuration
- `client/src/app/API/baseApi.ts`: Centralized API configuration with error handling
- `client/src/features/`: Feature-based components and API slices
- `client/src/app/layout/App.tsx`: Main application component

## Testing Strategy
- Backend: Uses standard .NET testing framework (run with `dotnet test`)
- Frontend: Configured for testing but tests may need to be implemented