# Network Traffic Anomaly Detection - Web Application

A comprehensive web application for network traffic classification and anomaly detection using machine learning models. This application provides a user-friendly interface for analyzing network traffic patterns and detecting potential cyberattacks.

## 🎯 Project Overview

This project implements a full-stack web application that uses AI/ML models to classify network traffic and detect anomalies. The system analyzes network data features (packet size, timing, protocol information, etc.) to distinguish normal behavior from potentially malicious activity, supporting early detection of cyberattacks and improving network security.

### Features

- **AI-Powered Prediction**: Uses trained K-Nearest Neighbors (KNN) and Logistic Regression models for accurate anomaly detection
- **Interactive Web Interface**: Modern, responsive React.js frontend with intuitive user experience
- **Multiple Visualizations**: Three types of data visualization charts using Chart.js, Plotly.js, and D3.js
- **Real-time Analysis**: Fast API backend with efficient model execution
- **Comprehensive Error Handling**: Robust exception management and user-friendly error messages
- **Model Comparison**: Compare performance metrics between different models

## 📁 Project Structure

```
CYBERAI-Network-Traffic-Classification-for-Anomaly-Detection-project/
├── cyberai/                          # Original ML model code (Assignment 2)
│   ├── data/                        # Datasets
│   │   ├── raw/                     # Raw datasets
│   │   └── processed/               # Processed datasets
│   ├── notebooks/                   # Jupyter notebooks
│   ├── outputs/                     # Model outputs
│   │   ├── models/                  # Trained models (generated)
│   │   ├── figures/                 # Visualization figures
│   │   └── metrics/                 # Model metrics
│   ├── train_model.py               # Model training script
│   └── README.md                    # Original project README
├── backend/                         # FastAPI backend
│   ├── main.py                     # FastAPI application
│   ├── model_utils.py              # Model loading and prediction utilities
│   ├── preprocessing.py            # Data preprocessing utilities
│   └── requirements.txt            # Python dependencies
├── frontend/                        # React.js frontend
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── charts/            # Chart components (Chart.js, Plotly.js, D3.js)
│   │   │   ├── PredictionForm.jsx
│   │   │   ├── PredictionResult.jsx
│   │   │   ├── Visualizations.jsx
│   │   │   └── ModelInfo.jsx
│   │   ├── services/              # API service
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+** (for backend)
- **Node.js 18+** and **npm** (for frontend)
- **Virtual environment** (recommended for Python)

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd CYBERAI-Network-Traffic-Classification-for-Anomaly-Detection-project
```

#### 2. Backend Setup

1. **Create and activate virtual environment**:

   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # macOS/Linux
   python -m venv .venv
   source .venv/bin/activate
   ```

2. **Install Python dependencies**:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Train the models** (if not already trained):

   **Option A: Fast Training (Recommended - 10-15 minutes)** ⚡
   ```bash
   cd cyberai
   python train_model_fast.py
   ```
   Uses a sample of the data for faster training. Perfect for laptops without GPU.

   **Option B: Full Training (30-60 minutes)** 🕐
   ```bash
   cd cyberai
   python train_model.py
   ```
   Trains on the full dataset for maximum accuracy.

   This will generate the trained models in `cyberai/outputs/models/`:
   - `logistic_regression.pkl`
   - `knn.pkl`
   - `scaler.pkl`
   - `model_metadata.json`

4. **Start the FastAPI server**:

   ```bash
   cd ../backend
   python main.py
   ```

   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

#### 3. Frontend Setup

1. **Install Node.js dependencies**:

   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## 📖 Usage

### Using the Web Application

1. **Start both servers** (backend and frontend) as described above
2. **Open your browser** and navigate to `http://localhost:3000`
3. **View Model Information**: The model information panel shows the available models and their performance metrics
4. **Enter Network Traffic Features**: 
   - Use the prediction form to enter network traffic features
   - Click "Fill Sample Data" to populate with sample values
   - Or manually enter values for each feature
5. **Select Model Type**: Choose between KNN or Logistic Regression
6. **Make Prediction**: Click "Predict Anomaly" to analyze the traffic
7. **View Results**: 
   - See the prediction result (Normal/Attack) with probability and confidence
   - Explore visualizations in three different chart libraries
   - View prediction history timeline

### API Endpoints

#### Health Check
- `GET /health` - Check API health status
- `GET /` - Root endpoint with API information

#### Model Information
- `GET /api/models/info` - Get information about available models
- `GET /api/models/features` - Get list of required feature names
- `GET /api/stats` - Get model statistics and metadata

#### Predictions
- `POST /api/predict` - Single prediction
  ```json
  {
    "features": {
      "Flow Duration": 123456.0,
      "Total Fwd Packets": 10.0,
      ...
    },
    "model_type": "knn"
    }
  }
  ```

- `POST /api/predict/batch` - Batch prediction
  ```json
  {
    "data": [
      {"feature1": 1.0, "feature2": 2.0, ...},
      {"feature1": 3.0, "feature2": 4.0, ...}
    ],
    "model_type": "knn"
  }
  ```

## 🎨 Features in Detail

### Frontend Features

1. **User Input Form**:
   - Form validation for all required features
   - Quick fill with sample data
   - Model selection (KNN or Logistic Regression)
   - Responsive design for mobile and desktop

2. **Data Visualizations**:
   - **Chart.js**: Doughnut chart, Line chart, Bar chart
   - **Plotly.js**: Scatter plot, Pie chart, Timeline chart
   - **D3.js**: Custom bar chart, pie chart, line chart
   - Real-time updates as predictions are made

3. **User Experience**:
   - Modern, gradient-based UI design
   - Smooth animations and transitions
   - Error handling with user-friendly messages
   - Loading states and progress indicators
   - Responsive layout for all screen sizes

### Backend Features

1. **FastAPI Server**:
   - RESTful API with proper HTTP methods
   - Automatic API documentation (Swagger/OpenAPI)
   - CORS middleware for frontend integration
   - Comprehensive error handling

2. **Model Integration**:
   - Efficient model loading and caching
   - Preprocessing and validation of input features
   - Support for multiple model types
   - Probability and confidence scoring

3. **Data Processing**:
   - Feature validation and normalization
   - Missing value handling
   - Type checking and conversion

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `frontend` directory (optional):

```env
VITE_API_URL=http://localhost:8000
```

### Model Configuration

Model parameters can be adjusted in `cyberai/train_model.py`:
- KNN k values: `[3, 5, 7]`
- Train/test split: `test_size=0.2`
- Random state: `random_state=42`

## 📊 Model Performance

The trained models achieve the following performance:

- **Logistic Regression**:
  - Accuracy: ~97%
  - Precision: ~96%
  - Recall: ~92%
  - F1-Score: ~94%

- **K-Nearest Neighbors (KNN, k=3)**:
  - Accuracy: ~100%
  - Precision: ~100%
  - Recall: ~100%
  - F1-Score: ~100%

*Note: Performance may vary based on the dataset used for training.*

## 🛠️ Development

### Running Tests

```bash
# Backend tests (if available)
cd backend
pytest

# Frontend tests (if available)
cd frontend
npm test
```

### Building for Production

```bash
# Frontend build
cd frontend
npm run build

# The built files will be in frontend/dist/
```

### Backend Production Deployment

```bash
# Using uvicorn with production settings
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📝 API Documentation

Full API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🐛 Troubleshooting

### Common Issues

1. **Models not found**:
   - Ensure you've run `train_model.py` to generate models
   - Check that models exist in `cyberai/outputs/models/`

2. **CORS errors**:
   - Verify CORS settings in `backend/main.py`
   - Ensure frontend URL is in allowed origins

3. **Feature validation errors**:
   - Check that all required features are provided
   - Ensure feature values are numeric and finite

4. **Port already in use**:
   - Change port in `backend/main.py` or `frontend/vite.config.js`
   - Kill the process using the port

## 🤝 Contributing

This is an assignment project. For questions or issues, please contact the project maintainers.

## 📄 License

This project is for educational purposes as part of Assignment 3.

## 👥 Authors

- Original ML Model: Assignment 2 Team
- Web Application: Assignment 3 Implementation

## 🙏 Acknowledgments

- CICIDS2017 dataset for network traffic data
- scikit-learn for machine learning models
- FastAPI for the backend framework
- React.js for the frontend framework
- Chart.js, Plotly.js, and D3.js for visualizations

---

**Note**: This application is designed for educational and demonstration purposes. For production use in cybersecurity, additional security measures, validation, and testing should be implemented.

