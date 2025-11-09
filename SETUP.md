# Quick Setup Guide

This guide will help you quickly set up and run the Network Traffic Anomaly Detection web application.

## Prerequisites Check

Before starting, ensure you have:
- Python 3.10 or later installed
- Node.js 18+ and npm installed
- Git installed (if cloning from repository)

## Step-by-Step Setup

### Step 1: Clone/Download the Project

```bash
# If using git
git clone <repository-url>
cd Network-Traffic-Anomaly-Detection

# Or extract the project folder if downloaded as ZIP
```

### Step 2: Set Up Python Backend

1. **Create virtual environment**:

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
   pip install -r requirements.txt
   # Or install backend dependencies separately
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

3. **Download and Setup AI Models** (REQUIRED):

   **Important**: The trained models are not included in the repository. You must download them separately.

   **Step 1**: Download the compressed model files from the Google Drive link:
   - [Download Models from Google Drive](https://drive.google.com/drive/folders/YOUR_DRIVE_LINK_HERE) *(Replace with your actual drive link)*
   
   **Step 2**: Extract the downloaded archive (ZIP file)
   
   **Step 3**: Place the extracted model files into the following directory:
   ```
   backend/cyberai/outputs/models/
   ```
   
   **Step 4**: Verify that the following files are present in `backend/cyberai/outputs/models/`:
   - `logistic_regression.pkl`
   - `knn.pkl`
   - `scaler.pkl`
   - `model_metadata.json`

   **Alternative**: If you prefer to train the models yourself instead of downloading:
   ```bash
   cd backend/cyberai
   python train_model_fast.py  # Fast training (10-15 minutes)
   # OR
   python train_model.py       # Full training (30-60 minutes)
   cd ../..
   ```

4. **Start the backend server**:

   ```bash
   cd backend
   python main.py
   ```

   The API will be available at `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`

### Step 3: Set Up React Frontend

1. **Open a new terminal** (keep the backend running)

2. **Install Node.js dependencies**:

   ```bash
   cd frontend
   npm install
   ```

3. **Start the frontend development server**:

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

### Step 4: Access the Application

1. Open your browser and navigate to: `http://localhost:3000`
2. You should see the Network Traffic Anomaly Detection interface
3. The model information should load automatically
4. Start making predictions!

## Troubleshooting

### Backend Issues

**Problem**: Models not found
- **Solution**: 
  - Ensure you've downloaded the models from the Google Drive link
  - Check that models exist in `backend/cyberai/outputs/models/`
  - Verify all required files are present: `logistic_regression.pkl`, `knn.pkl`, `scaler.pkl`, `model_metadata.json`
  - If you prefer to train models yourself, run `python train_model.py` in `backend/cyberai/` directory

**Problem**: Port 8000 already in use
- **Solution**: Change the port in `backend/main.py` (line 256) or kill the process using port 8000

**Problem**: Import errors
- **Solution**: Ensure you're in the virtual environment and all dependencies are installed

### Frontend Issues

**Problem**: Cannot connect to API
- **Solution**: Ensure the backend is running on `http://localhost:8000`

**Problem**: Port 3000 already in use
- **Solution**: Vite will automatically use the next available port, or change it in `frontend/vite.config.js`

**Problem**: npm install fails
- **Solution**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

### Data Issues

**Problem**: Dataset not found
- **Solution**: Ensure the processed datasets exist in `backend/cyberai/data/processed/`
- If missing, run the data cleaning notebooks:
  - `backend/cyberai/notebooks/10_clean_basic.ipynb`
  - `backend/cyberai/notebooks/11_clean_cicids.ipynb`

## Running in Production

### Backend Production

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend Production Build

```bash
cd frontend
npm run build
# Serve the dist/ folder with a web server like nginx or serve
```

## Next Steps

1. Verify both servers are running
2. Test the API at `http://localhost:8000/docs`
3. Test the frontend at `http://localhost:3000`
4. Make a test prediction
5. Explore the visualizations

## Need Help?

- Check the main `README.md` for detailed documentation
- Review API documentation at `http://localhost:8000/docs`
- Check console logs for error messages

---

**Note**: Make sure both the backend and frontend servers are running simultaneously for the application to work properly.

