# AirBed - Airbnb Clone Web Application

A modern, full-featured Airbnb-like web application built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Authentication System**: Login/signup with JWT token management
- **Property Management**: Browse, search, and filter properties
- **Booking System**: Complete booking flow with calendar integration
- **User Dashboard**: Comprehensive dashboard for guests and hosts
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern UI**: Clean, accessible design with Tailwind CSS
- **State Management**: Redux Toolkit for efficient state management
- **Performance Optimized**: Lazy loading, code splitting, and optimizations

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Headless UI
- **State Management**: Redux Toolkit, RTK Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form, Zod validation
- **Testing**: Vitest, React Testing Library
- **Build Tool**: Vite
- **Deployment**: Docker, Nginx

## 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker
npm run docker:build
npm run docker:run
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── layout/         # Layout components
│   ├── common/         # Common components
│   ├── property/       # Property components
│   └── booking/        # Booking components
├── pages/              # Page components
├── store/              # Redux store configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

## 🎨 Design System

Built with Tailwind CSS featuring:
- Consistent color palette with primary red theme
- Responsive typography using Inter font
- Reusable UI components with variants
- Mobile-first responsive design
- Accessibility-focused components

## 🚀 Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Images and components loaded on demand
- **Bundle Optimization**: Vendor chunks and tree shaking
- **Responsive Images**: Optimized images for different screen sizes
- **Caching**: Aggressive caching for static assets

## 🔒 Security Features

- JWT token-based authentication
- Protected routes with authentication checks
- Input validation with Zod schemas
- XSS protection headers
- Secure environment variable handling

## 📱 Responsive Breakpoints

- **xs**: 475px and up
- **sm**: 640px and up
- **md**: 768px and up
- **lg**: 1024px and up
- **xl**: 1280px and up
- **2xl**: 1536px and up

## 🧭 Available Routes

- **Public**: Home (`/`), Search (`/search`), Property Details (`/property/:id`)
- **Auth**: Login (`/login`), Signup (`/signup`)
- **Protected**: Dashboard (`/dashboard`), Profile (`/profile`), Bookings (`/bookings`)

## 📊 State Management

Redux Toolkit slices:
- **Auth**: User authentication and profile state
- **Property**: Property data, search filters, and results
- **Booking**: Booking management and status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.