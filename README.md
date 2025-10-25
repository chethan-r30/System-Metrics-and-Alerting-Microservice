# System-Metrics-and-Alerting-Microservice


## 🚀 Installation & Setup

### Prerequisites

Ensure you have these installed on your system:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (v6 or higher) - Comes with Node.js
- **MongoDB** - Local installation OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository


### Step 2: Backend Setup

Navigate to the backend directory and install dependencies:

cd backend

Core dependencies:

npm install express mongoose dotenv cors bcryptjs jsonwebtoken

System monitoring:

npm install systeminformation node-schedule

**Create `backend/.env` file:**
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codexray-observability
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development

### Step 3: Frontend Setup

Navigate back to root, then set up frontend:

cd ..

Create React app (if not already created):

npx create-react-app frontend

cd frontend

UI and visualization libraries:

npm install axios recharts

Tailwind CSS:

npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p

Icons:
npm install lucide-react

Development dependencies:
npm install --save-dev nodemon


## 📋 About the Project

System Metrics and Alerting Microservice is a full-stack observability and security platform designed for the CodeXray Intern Evaluation Project. It demonstrates proficiency in data structures, algorithms, secure coding, and modern web development practices.

### Core Features

**🔍 Phase 1: Log Analyzer**
- Parse log files efficiently with regex patterns
- Count log levels using HashMap for O(1) lookup
- Identify top 5 most frequent errors
- Store logs in MongoDB with indexing

**🔐 Phase 2: Security & Authentication**
- Secure password hashing with bcrypt (12 salt rounds)
- JWT token-based authentication
- In-memory session management using HashMap
- Protected API endpoints with middleware
- `/register`, `/login`, `/validate-session`, `/logout`

**📈 Phase 3: Metrics & Alerting**
- Real-time CPU and memory monitoring (every 5 seconds)
- Automatic metric collection using systeminformation
- Configurable threshold-based alerting
  - CPU: Warning 70%, Critical 85%
  - Memory: Warning 75%, Critical 90%
- MongoDB storage with efficient indexing
- Historical metric tracking

**📊 Phase 4: Reporting API**
- Secure `/api/summary` endpoint (token-protected)
- Total alerts generated
- Breakdown by type (CPU/Memory)
- Last N alert timestamps
- Average metric values for last 10 readings
- System health status monitoring

**🎨 Bonus: Web Dashboard**
- Modern Tailwind CSS responsive UI
- Real-time metric visualization with Recharts
- Interactive alert management panel
- Configurable threshold settings
- Log analysis visualization
- Auto-refresh every 5 seconds
- Clean, professional interface

### Tech Stack

**Backend:**
- Node.js & Express.js 5.x
- MongoDB with Mongoose ODM
- JWT & bcrypt for authentication
- systeminformation for system metrics
- node-schedule for task scheduling

**Frontend:**
- React 18+ with Hooks
- Tailwind CSS 3.4 for styling
- Recharts for data visualization
- Axios for HTTP requests
- Lucide React for icons

**DevOps:**
- Nodemon for hot-reloading
- Concurrently for running multiple processes
