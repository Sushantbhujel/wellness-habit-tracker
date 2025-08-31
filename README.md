# Wellness & Habit Tracker

A comprehensive web application for students to track and monitor their wellness habits, set goals, and visualize their progress. Built with React, Node.js, Express, MongoDB, and Tailwind CSS.

## Features

### 🎯 Core Features
- **User Authentication** - Secure login/registration with role-based access (Student, Teacher, Mentor)
- **Habit Management** - Create, edit, delete, and track daily habits across multiple categories
- **Goal Setting** - Set short-term and long-term goals with progress tracking
- **Progress Analytics** - Visualize your progress with charts and statistics
- **Dashboard** - Overview of your wellness journey with quick actions
- **Profile Management** - Update personal information and preferences

### 🎨 User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme** - Toggle between themes for better user experience
- **Modern UI** - Beautiful interface built with Tailwind CSS
- **Real-time Updates** - Instant feedback and notifications

### 📊 Analytics & Tracking
- **Progress Visualization** - Charts and graphs for habit trends
- **Streak Tracking** - Monitor your consistency with habit streaks
- **Category Performance** - See how you're doing across different wellness areas
- **Data Export** - Export your progress data as CSV or PDF

### 🔧 Technical Features
- **CRUD Operations** - Full Create, Read, Update, Delete functionality
- **MongoDB Integration** - Robust data storage with MongoDB
- **JWT Authentication** - Secure token-based authentication
- **API Integration** - RESTful API with Express.js
- **Form Validation** - Client and server-side validation

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Toast notifications
- **Recharts** - Chart library for data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## Project Structure

```
wellness-habit-tracker/
├── backend/                 # Backend API
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config.env          # Environment variables
│   └── server.js           # Express server
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── index.html          # HTML template
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wellness-habit-tracker
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Create environment file
   cp config.env.example config.env
   
   # Edit config.env with your settings
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/wellness-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in config.env
   ```

5. **Run the application**
   ```bash
   # From root directory
   npm run dev
   
   # Or run separately:
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create new habit
- `GET /api/habits/:id` - Get specific habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/toggle` - Toggle habit status

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `GET /api/goals/:id` - Get specific goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `PUT /api/goals/:id/progress` - Update goal progress

### Progress
- `GET /api/progress` - Get progress entries
- `POST /api/progress` - Log progress
- `GET /api/progress/:id` - Get specific progress entry
- `PUT /api/progress/:id` - Update progress entry
- `DELETE /api/progress/:id` - Delete progress entry

## Usage

### For Students
1. **Register/Login** - Create an account or sign in
2. **Set Up Profile** - Add personal information and fitness goals
3. **Create Habits** - Add habits you want to track (study, exercise, sleep, etc.)
4. **Set Goals** - Define short-term and long-term goals
5. **Track Progress** - Log your daily progress for each habit
6. **View Analytics** - Monitor your progress with charts and statistics

### For Teachers/Mentors
1. **Register with Teacher/Mentor Role** - Get elevated access
2. **View Student Progress** - Monitor student wellness journeys
3. **Provide Guidance** - Use the platform to support student wellness

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

### Available Scripts

**Root Directory:**
- `npm run dev` - Start both frontend and backend in development mode
- `npm run install-all` - Install dependencies for all packages
- `npm run build` - Build the frontend for production

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style
- Use ESLint for code linting
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful commit messages

## Deployment

### Backend Deployment
1. Set up environment variables for production
2. Use a process manager like PM2
3. Set up MongoDB Atlas or production MongoDB
4. Configure CORS for your domain

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting service
3. Update API base URL for production

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Authors

- **Sushank Timilsena**
- **Sushant Bhujel**

## Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB for the flexible database
- All contributors and supporters

## Support

For support, email support@wellness-tracker.com or create an issue in the repository.

---

**Happy Wellness Tracking! 🌟**
# wellness-habit-tracker
