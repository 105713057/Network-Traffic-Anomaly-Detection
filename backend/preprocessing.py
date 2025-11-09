"""
Data preprocessing utilities for API
"""
import numpy as np
from typing import Dict, List, Any

def validate_features(features: Dict[str, float], required_features: List[str]) -> None:
    """
    Validate that all required features are present
    
    Args:
        features: Dictionary of feature names and values
        required_features: List of required feature names
    
    Raises:
        ValueError: If features are missing or invalid
    """
    missing_features = set(required_features) - set(features.keys())
    if missing_features:
        raise ValueError(f"Missing required features: {list(missing_features)}")
    
    # Check for NaN or infinite values
    for name, value in features.items():
        if not isinstance(value, (int, float)):
            try:
                value = float(value)
            except (ValueError, TypeError):
                raise ValueError(f"Feature '{name}' must be numeric, got {type(value)}")
        
        if np.isnan(value) or np.isinf(value):
            raise ValueError(f"Feature '{name}' has invalid value: {value}")

def preprocess_input(features: Dict[str, float], required_features: List[str]) -> np.ndarray:
    """
    Preprocess input features for model prediction
    
    Args:
        features: Dictionary of feature names and values
        required_features: List of required feature names in correct order
    
    Returns:
        Numpy array of feature values in correct order
    
    Raises:
        ValueError: If features are invalid
    """
    # Validate features
    validate_features(features, required_features)
    
    # Convert to array in correct order
    feature_array = np.array([features[name] for name in required_features], dtype=np.float64)
    
    # Replace any remaining NaN or inf with 0 (shouldn't happen after validation, but safety check)
    feature_array = np.nan_to_num(feature_array, nan=0.0, posinf=0.0, neginf=0.0)
    
    return feature_array

def normalize_features(features: Dict[str, float]) -> Dict[str, float]:
    """
    Normalize feature values (optional preprocessing step)
    
    Args:
        features: Dictionary of feature names and values
    
    Returns:
        Normalized features dictionary
    """
    # This is a placeholder - actual normalization should be done by the scaler
    # But we can do basic checks here
    normalized = {}
    for name, value in features.items():
        # Ensure value is finite
        if np.isfinite(value):
            normalized[name] = float(value)
        else:
            normalized[name] = 0.0
    
    return normalized

