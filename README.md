# FastAPI Application

A structured FastAPI application with proper folder organization and Swagger documentation.

## Project Structure

```
TA_Application/
├── app/
│   ├── __init__.py
│   ├── controllers/          # API endpoints/routes
│   │   ├── __init__.py
│   │   ├── health_controller.py
│   │   └── item_controller.py
│   ├── models/              # Pydantic models
│   │   ├── __init__.py
│   │   └── item.py
│   ├── services/            # Business logic
│   │   ├── __init__.py
│   │   └── item_service.py
│   ├── utils/               # Utility functions
│   │   ├── __init__.py
│   │   └── logger.py
│   └── config/              # Configuration
│       ├── __init__.py
│       └── settings.py
├── main.py                  # Application entry point
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Features

- **FastAPI Framework**: Modern, fast web framework for building APIs
- **Swagger/OpenAPI Documentation**: Auto-generated interactive API documentation
- **Structured Architecture**: Separation of concerns with controllers, services, models, and utils
- **Pydantic Models**: Type-safe data validation
- **Configuration Management**: Centralized settings configuration

## Requirements

- Python 3.8+
- Dependencies listed in `requirements.txt`

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application
D
### Method 1: Direct Python Execution
```bash
python main.py
```

### Method 2: Using Uvicorn
```bash
python -m uvicorn main:app --reload
```

The application will start at `http://localhost:8000`

## API Documentation

Once the application is running, access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Health Check
- `GET /health` - Check application health status
- `GET /` - Welcome message

### Items
- `GET /items/` - Get all items
- `GET /items/{item_id}` - Get a specific item
- `POST /items/` - Create a new item
- `DELETE /items/{item_id}` - Delete an item

## Example Usage

### Create an Item
```bash
curl -X POST "http://localhost:8000/items/" \
  -H "Content-Type: application/json" \
  -d '{"name": "Product A", "description": "A great product", "price": 29.99}'
```

### Get All Items
```bash
curl "http://localhost:8000/items/"
```

### Health Check
```bash
curl "http://localhost:8000/health"
```

## Development

### Project Architecture

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and data operations
- **Models**: Define data structures with Pydantic
- **Utils**: Provide helper functions and utilities
- **Config**: Manage application settings

## License

MIT
