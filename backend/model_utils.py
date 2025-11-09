"""
Model utilities for loading and using trained models
"""
import joblib
import numpy as np
from pathlib import Path
import json
from typing import Optional, Tuple, Dict, Any, List

class ModelPredictor:
    """Wrapper class for model prediction"""
    
    def __init__(self, model_dir: Path):
        self.model_dir = model_dir
        self.logistic_regression = None
        self.knn = None
        self.scaler = None
        self.feature_names = []
        self.metadata = {}
        
    def load(self):
        """Load models and scaler"""
        # Load scaler
        scaler_path = self.model_dir / "scaler.pkl"
        if not scaler_path.exists():
            raise FileNotFoundError(f"Scaler not found at {scaler_path}")
        self.scaler = joblib.load(scaler_path)
        
        # Load models
        lr_path = self.model_dir / "logistic_regression.pkl"
        knn_path = self.model_dir / "knn.pkl"
        
        if not lr_path.exists():
            raise FileNotFoundError(f"Logistic Regression model not found at {lr_path}")
        if not knn_path.exists():
            raise FileNotFoundError(f"KNN model not found at {knn_path}")
        
        self.logistic_regression = joblib.load(lr_path)
        self.knn = joblib.load(knn_path)
        
        # Load metadata
        metadata_path = self.model_dir / "model_metadata.json"
        if metadata_path.exists():
            with open(metadata_path, 'r') as f:
                self.metadata = json.load(f)
            self.feature_names = self.metadata.get("feature_names", [])
        else:
            # If metadata doesn't exist, try to infer from model
            # This is a fallback - ideally metadata should exist
            raise FileNotFoundError(f"Model metadata not found at {metadata_path}")
    
    def predict(self, features: np.ndarray, model_type: str = "knn") -> Tuple[int, float]:
        """
        Make prediction
        
        Args:
            features: Preprocessed feature array
            model_type: 'knn' or 'logistic_regression'
        
        Returns:
            Tuple of (prediction, probability)
            prediction: 0 (normal) or 1 (attack)
            probability: Probability of attack (0-1)
        """
        if self.scaler is None or self.logistic_regression is None or self.knn is None:
            raise ValueError("Models not loaded")
        
        # Scale features
        features_scaled = self.scaler.transform(features.reshape(1, -1))
        
        # Select model
        if model_type == "knn":
            model = self.knn
        elif model_type == "logistic_regression":
            model = self.logistic_regression
        else:
            raise ValueError(f"Unknown model type: {model_type}")
        
        # Predict
        prediction = model.predict(features_scaled)[0]
        
        # Get probability
        if hasattr(model, "predict_proba"):
            probability = model.predict_proba(features_scaled)[0][1]  # Probability of class 1 (attack)
        else:
            # For models without predict_proba, use decision function or default
            probability = 0.5 if prediction == 1 else 0.5
        
        return int(prediction), float(probability)
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about models"""
        info = {}
        
        if "logistic_regression" in self.metadata:
            lr_meta = self.metadata["logistic_regression"]
            info["logistic_regression"] = {
                "model_type": "logistic_regression",
                "accuracy": float(lr_meta.get("accuracy", 0.0)),
                "precision": float(lr_meta.get("precision", 0.0)),
                "recall": float(lr_meta.get("recall", 0.0)),
                "f1_score": float(lr_meta.get("f1_score", 0.0)),
                "num_features": len(self.feature_names),
                "feature_names": self.feature_names
            }
        
        if "knn" in self.metadata:
            knn_meta = self.metadata["knn"]
            info["knn"] = {
                "model_type": "knn",
                "accuracy": float(knn_meta.get("accuracy", 0.0)),
                "precision": float(knn_meta.get("precision", 0.0)),
                "recall": float(knn_meta.get("recall", 0.0)),
                "f1_score": float(knn_meta.get("f1_score", 0.0)),
                "num_features": len(self.feature_names),
                "feature_names": self.feature_names,
                "k": int(knn_meta.get("k", 3))
            }
        
        return info
    
    def get_stats(self) -> Dict[str, Any]:
        """Get statistics and metadata"""
        return {
            "metadata": self.metadata,
            "num_features": len(self.feature_names),
            "models_loaded": {
                "logistic_regression": self.logistic_regression is not None,
                "knn": self.knn is not None,
                "scaler": self.scaler is not None
            }
        }

def load_models(model_dir: Optional[Path] = None) -> ModelPredictor:
    """
    Load models from the model directory
    
    Args:
        model_dir: Path to model directory. If None, uses default location.
    
    Returns:
        ModelPredictor instance
    """
    if model_dir is None:
        # Default to cyberai/outputs/models
        model_dir = Path(__file__).parent / "cyberai" / "outputs" / "models"
    
    predictor = ModelPredictor(model_dir)
    predictor.load()
    
    return predictor

