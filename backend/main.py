"""
FastAPI Backend for Network Traffic Anomaly Detection
"""
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
import numpy as np
import pandas as pd
import joblib
from pathlib import Path
import json
from datetime import datetime

from model_utils import ModelPredictor, load_models
from preprocessing import preprocess_input, validate_features

app = FastAPI(
    title="Network Traffic Anomaly Detection API",
    description="API for predicting network traffic anomalies using ML models",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model predictor
predictor: Optional[ModelPredictor] = None

@app.on_event("startup")
async def startup_event():
    """Load models on startup"""
    global predictor
    try:
        predictor = load_models()
        print("Models loaded successfully!")
    except Exception as e:
        print(f"Error loading models: {e}")
        raise

# Request/Response Models
class TrafficFeatures(BaseModel):
    """Network traffic features for prediction"""
    # Note: This is a flexible model that accepts any numeric features
    # The actual feature names will be validated against the model's expected features
    features: Dict[str, float] = Field(..., description="Dictionary of feature names and values")

    class Config:
        schema_extra = {
            "example": {
                "features": {
                    "Flow Duration": 123456.0,
                    "Total Fwd Packets": 10.0,
                    "Total Backward Packets": 5.0,
                    # ... more features
                }
            }
        }

class PredictionRequest(BaseModel):
    """Request model for prediction"""
    features: Dict[str, float] = Field(..., description="Network traffic features")
    model_type: str = Field(default="knn", description="Model to use: 'knn' or 'logistic_regression'")

    @validator("model_type")
    def validate_model_type(cls, v):
        if v not in ["knn", "logistic_regression"]:
            raise ValueError("model_type must be 'knn' or 'logistic_regression'")
        return v

class PredictionResponse(BaseModel):
    """Response model for prediction"""
    prediction: int = Field(..., description="0 = Normal, 1 = Attack")
    probability: float = Field(..., description="Probability of being an attack (0-1)")
    model_used: str = Field(..., description="Model used for prediction")
    confidence: str = Field(..., description="Confidence level: High, Medium, Low")
    timestamp: str = Field(..., description="Prediction timestamp")

class BatchPredictionRequest(BaseModel):
    """Request model for batch predictions"""
    data: List[Dict[str, float]] = Field(..., description="List of feature dictionaries")
    model_type: str = Field(default="knn", description="Model to use")

class BatchPredictionResponse(BaseModel):
    """Response model for batch predictions"""
    predictions: List[int]
    probabilities: List[float]
    model_used: str
    total_count: int
    attack_count: int
    normal_count: int

class ModelInfoResponse(BaseModel):
    """Response model for model information"""
    model_type: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    num_features: int
    feature_names: List[str]

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    models_loaded: bool
    timestamp: str

# Routes
@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint"""
    return {
        "message": "Network Traffic Anomaly Detection API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if predictor is not None else "unhealthy",
        models_loaded=predictor is not None,
        timestamp=datetime.now().isoformat()
    )

@app.get("/api/models/info", response_model=Dict[str, ModelInfoResponse])
async def get_model_info():
    """Get information about available models"""
    if predictor is None:
        raise HTTPException(status_code=503, detail="Models not loaded")
    
    return predictor.get_model_info()

@app.get("/api/models/features", response_model=Dict[str, Any])
async def get_feature_names():
    """Get list of required feature names"""
    if predictor is None:
        raise HTTPException(status_code=503, detail="Models not loaded")
    
    return {
        "feature_names": predictor.feature_names,
        "num_features": len(predictor.feature_names),
        "example": {name: 0.0 for name in predictor.feature_names[:10]}
    }

@app.post("/api/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """Single prediction endpoint"""
    if predictor is None:
        raise HTTPException(status_code=503, detail="Models not loaded")
    
    try:
        # Preprocess and validate input
        features_array = preprocess_input(request.features, predictor.feature_names)
        
        # Make prediction
        prediction, probability = predictor.predict(
            features_array, 
            model_type=request.model_type
        )
        
        # Determine confidence
        if probability > 0.8 or probability < 0.2:
            confidence = "High"
        elif probability > 0.6 or probability < 0.4:
            confidence = "Medium"
        else:
            confidence = "Low"
        
        return PredictionResponse(
            prediction=int(prediction),
            probability=float(probability),
            model_used=request.model_type,
            confidence=confidence,
            timestamp=datetime.now().isoformat()
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/api/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(request: BatchPredictionRequest):
    """Batch prediction endpoint"""
    if predictor is None:
        raise HTTPException(status_code=503, detail="Models not loaded")
    
    try:
        predictions = []
        probabilities = []
        
        for features_dict in request.data:
            features_array = preprocess_input(features_dict, predictor.feature_names)
            pred, prob = predictor.predict(features_array, model_type=request.model_type)
            predictions.append(int(pred))
            probabilities.append(float(prob))
        
        attack_count = sum(predictions)
        normal_count = len(predictions) - attack_count
        
        return BatchPredictionResponse(
            predictions=predictions,
            probabilities=probabilities,
            model_used=request.model_type,
            total_count=len(predictions),
            attack_count=attack_count,
            normal_count=normal_count
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction error: {str(e)}")

@app.get("/api/stats", response_model=Dict[str, Any])
async def get_stats():
    """Get model statistics and metadata"""
    if predictor is None:
        raise HTTPException(status_code=503, detail="Models not loaded")
    
    return predictor.get_stats()

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}", "status_code": 500}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

