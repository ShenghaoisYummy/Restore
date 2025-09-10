# Restore - Full-Stack E-Commerce Application

A modern e-commerce web application built with .NET 9 Web API backend and React TypeScript frontend, featuring a complete shopping experience with product catalog, shopping cart, user authentication, payment processing, and order management.

## 🚀 Live Demo

- **Frontend**: [https://restore-austin.azurewebsites.net](https://restore-austin.azurewebsites.net)
- **API**: Deployed on Azure App Service
- 
## Preview

<img width="1460" height="756" alt="Screenshot 2025-09-10 at 13 23 16" src="https://github.com/user-attachments/assets/27476470-ca1d-4efb-9ea3-db690f537515" />

## 🛠️ Tech Stack

### Backend (.NET 9 Web API)
- **Framework**: ASP.NET Core 9.0
- **Database**: SQL Server with Entity Framework Core
- **Authentication**: ASP.NET Core Identity with JWT
- **Payment Processing**: Stripe.NET SDK
- **ORM**: Entity Framework Core 9.0
- **Architecture**: Clean Architecture with Repository Pattern

### Frontend (React TypeScript)
- **Framework**: React 19 with TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: RTK Query
- **Build Tool**: Vite
- **Styling**: Emotion (CSS-in-JS)

### DevOps & Deployment
- **Containerization**: Docker with SQL Server container
- **Cloud Platform**: Microsoft Azure
- **CI/CD**: GitHub Actions
- **Database**: SQL Server (Azure SQL Database in production)

## ✨ Key Features

### 🛍️ E-Commerce Functionality
- **Product Catalog**: Browse products with search, filtering, and sorting
- **Shopping Cart**: Add/remove items, quantity management, persistent cart
- **User Authentication**: Registration, login, JWT-based auth
- **Payment Processing**: Secure payments via Stripe integration
- **Order Management**: Order history, order details, order tracking
- **Responsive Design**: Mobile-friendly interface

### 🎯 Advanced Features
- **Pagination**: Server-side pagination for product listings
- **Search & Filters**: Real-time product search with brand/type filters
- **Theme Support**: Light/dark mode toggle
- **Form Validation**: Client-side validation with Zod schemas
- **Error Handling**: Global error handling and user feedback
- **Loading States**: Skeleton loading and progress indicators

## 🏗️ Project Structure

```
Restore/
├── API/                          # .NET 9 Web API Backend
│   ├── Controllers/             # API Controllers
│   │   ├── ProductsController.cs
│   │   ├── BasketController.cs
│   │   ├── OrdersController.cs
│   │   ├── PaymentsController.cs
│   │   └── AccountController.cs
│   ├── Data/                    # Database Context & Migrations
│   ├── Entities/               # Domain Models
│   ├── DTOs/                   # Data Transfer Objects
│   ├── Services/               # Business Logic Services
│   ├── Middleware/             # Custom Middleware
│   └── Extensions/             # Extension Methods
├── client/                      # React TypeScript Frontend
│   ├── src/
│   │   ├── features/           # Feature-based Components
│   │   │   ├── catalog/        # Product catalog
│   │   │   ├── basket/         # Shopping cart
│   │   │   ├── account/        # Authentication
│   │   │   ├── orders/         # Order management
│   │   │   └── checkout/       # Payment & checkout
│   │   ├── app/                # App configuration
│   │   │   ├── layout/         # Layout components
│   │   │   ├── store/          # Redux store
│   │   │   └── models/         # TypeScript interfaces
│   │   └── lib/                # Utilities & hooks
├── docker-compose.yml          # Development database
└── .github/workflows/          # GitHub Actions CI/CD
```

## 🚀 Getting Started

### Prerequisites
- **.NET 9 SDK**
- **Node.js** (v18 or higher)
- **Docker** (for local development database)
- **SQL Server** (for production)
- **Stripe Account** (for payment processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Restore
   ```

2. **Set up the database**
   ```bash
   docker-compose up -d
   ```

3. **Configure the API**
   ```bash
   cd API
   # Update connection string in appsettings.json
   # Add Stripe configuration
   dotnet restore
   dotnet ef database update
   dotnet run
   ```

4. **Set up the client**
   ```bash
   cd client
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: `https://localhost:5173`
   - API: `https://localhost:5001`

## 🔧 Configuration

### Environment Variables
- `DefaultConnection`: SQL Server connection string
- `Stripe:PublishableKey`: Stripe publishable key
- `Stripe:SecretKey`: Stripe secret key

### Database Setup
The application uses SQL Server with Entity Framework Core migrations. The database is automatically seeded with sample products on first run.

## 📱 API Endpoints

### Products
- `GET /api/products` - Get paginated products with filtering
- `GET /api/products/{id}` - Get product by ID

### Basket
- `GET /api/basket` - Get current user's basket
- `POST /api/basket` - Add item to basket
- `DELETE /api/basket/{productId}` - Remove item from basket

### Orders
- `GET /api/orders` - Get user's order history
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details

### Payments
- `POST /api/payments` - Create payment intent
- `POST /api/payments/webhook` - Stripe webhook handler

### Account
- `POST /api/account/register` - User registration
- `POST /api/account/login` - User login
- `GET /api/account/currentUser` - Get current user info

## 🧪 Testing

```bash
# Run API tests
cd API
dotnet test

# Run client tests (if available)
cd client
npm test
```

## 🚀 Deployment

The application is configured for Azure deployment with:
- Azure App Service for hosting
- Azure SQL Database for data storage
- GitHub Actions for CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📈 Skills Demonstrated

This project showcases proficiency in:
- **Full-Stack Development**: End-to-end application development
- **Modern Web Technologies**: React, TypeScript, .NET 9
- **Database Design**: Entity Framework, SQL Server
- **API Development**: RESTful APIs, authentication, authorization
- **Payment Integration**: Stripe payment processing
- **State Management**: Redux Toolkit, RTK Query
- **UI/UX Design**: Material-UI, responsive design
- **DevOps**: Docker, GitHub Actions CI/CD, Azure deployment
- **Security**: JWT authentication, secure payment handling

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Built with ❤️ using .NET 9 and React*
