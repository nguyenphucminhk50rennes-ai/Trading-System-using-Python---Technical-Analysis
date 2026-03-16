# TA Application - Trading Analysis Platform

A full-stack trading analysis application built with FastAPI backend and React + TypeScript frontend. This platform provides stock analysis, technical indicators, and trading strategy evaluation.

## Project Structure

```
TA_Application/
├── app/                             # Backend - FastAPI Application
│   ├── __init__.py                 # App initialization
│   ├── controllers/                 # API endpoints/routes
│   │   ├── health_controller.py    # Health check endpoints
│   │   └── stock_controller.py     # Stock data endpoints
│   ├── models/                      # Pydantic models
│   │   └── stock_model.py          # Stock data models
│   ├── services/                    # Business logic
│   │   ├── stock_service.py        # Stock data service
│   │   ├── indicator_service.py    # Technical indicators
│   │   └── new_stock_service.py    # New stock analysis
│   ├── utils/                       # Utility functions
│   │   ├── logger.py               # Logging configuration
│   │   └── data_downloader.py      # Market data download
│   └── config/                      # Configuration
│       └── settings.py              # Application settings
├── ui/                              # Frontend - React + TypeScript + Vite
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── BestStrategy.tsx
│   │   │   ├── ExecutiveSummary.tsx
│   │   │   ├── TradingHistory.tsx
│   │   │   ├── TradingResults.tsx
│   │   │   └── ui/                 # shadcn/ui components
│   │   ├── pages/                   # Page components
│   │   │   ├── Index.tsx
│   │   │   └── NotFound.tsx
│   │   ├── services/                # API services
│   │   │   └── trading.api.ts      # Backend API client
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── context/                 # React context
│   │   ├── lib/                     # Utility functions
│   │   └── main.tsx                 # Application entry point
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript configuration
│   └── tailwind.config.ts           # Tailwind CSS configuration
├── main.py                          # Backend entry point
├── requirements.txt                 # Python dependencies
└── README.md                        # This file
```

## Features

### Backend (FastAPI)
- **Stock Data Analysis**: Fetch and analyze stock market data using yfinance
- **Technical Indicators**: Calculate various technical indicators (SMA, EMA, RSI, MACD, etc.)
- **RESTful API**: Clean, modern API with auto-generated documentation
- **Swagger/OpenAPI**: Interactive API documentation at `/docs`
- **Structured Architecture**: Clean separation of concerns with controllers, services, models, and utilities
- **Type Safety**: Pydantic models for data validation
- **Scalable Design**: Service layer for business logic, util layer for helpers

### Frontend (React + TypeScript)
- **Modern UI**: Built with React 18 and TypeScript for type safety
- **Component Library**: shadcn/ui components with Radix UI
- **Responsive Design**: Tailwind CSS for responsive, modern styling
- **Real-time Data**: Connected to backend API for live stock data
- **Interactive Charts**: Visualize trading strategies and historical data
- **State Management**: React Context API for application state
- **Development Tools**: Vite for fast development, Vitest for testing

## Requirements

### Backend
- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Frontend
- Node.js 16+ or Bun
- npm, yarn, or bun package manager

### Dependencies

**Backend:**
- FastAPI >= 0.109.0
- Uvicorn >= 0.27.0
- Pydantic >= 2.5.0
- yfinance >= 0.2.32
- pandas >= 2.1.0
- matplotlib >= 3.8.0
- scikit-learn >= 1.3.0

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

## Installation

### Backend Setup

1. **Create and activate a Python virtual environment:**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

2. **Install Python dependencies:**

```bash
pip install -r requirements.txt
```

### Frontend Setup

1. **Navigate to the UI directory:**

```bash
cd ui
```

2. **Install Node dependencies:**

```bash
# Using npm
npm install

# Or using Bun (faster)
bun install

# Or using yarn
yarn install
```

## Running the Application

### Running the Backend

**Option 1: Direct Python execution**
```bash
python main.py
```

**Option 2: Using Uvicorn directly (with auto-reload)**
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: **http://localhost:8000**

#### Backend API Documentation
Once running, access the interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Running the Frontend

1. **Navigate to the UI directory:**
```bash
cd ui
```

2. **Start the development server:**

```bash
# Using npm
npm run dev

# Using Bun
bun run dev

# Using yarn
yarn dev
```

The frontend will be available at: **http://localhost:5173** (or the port shown in terminal)

### Running Both Frontend and Backend

**In separate terminals:**

**Terminal 1 - Backend:**
```bash
# From project root
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd ui
npm run dev
```

The full application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Development

### Backend Development

**Project Architecture:**
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contains business logic and data operations
- **Models**: Define data structures with Pydantic for type safety
- **Utils**: Provide helper functions (logging, data downloading)
- **Config**: Centralized settings and configuration

**Key endpoints:**
- `GET /health` - Health check
- `GET /` - Welcome message
- Stock analysis endpoints (see Swagger UI for full list)

### Frontend Development

**Key directories:**
- **components**: Reusable React components with TypeScript
- **pages**: Full page components
- **services**: API communication layer
- **hooks**: Custom React hooks
- **context**: Application state management
- **lib**: Utility functions and helpers

**Available npm scripts:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build with development mode
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
```

**Testing:**
```bash
cd ui
npm run test:watch
```

## Building for Production

### Backend
The backend is production-ready once dependencies are installed. Deploy the Python application with:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
Build the frontend for production:
```bash
cd ui
npm run build
```

The optimized build files will be in the `ui/dist` directory.

## API Integration

The frontend communicates with the backend through the API service layer. See [ui/src/services/trading.api.ts](ui/src/services/trading.api.ts) for API integration examples.

## License

MIT
