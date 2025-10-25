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

Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Icons
npm install lucide-react

Development dependencies
npm install --save-dev nodemon
