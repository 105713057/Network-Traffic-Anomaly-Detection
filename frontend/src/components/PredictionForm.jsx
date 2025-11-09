import React, { useState, useEffect } from 'react'
import './PredictionForm.css'
import { predict } from '../services/api'

const PredictionForm = ({ featureNames, onPrediction, onError, loading, setLoading }) => {
  const [features, setFeatures] = useState({})
  const [modelType, setModelType] = useState('knn')
  const [errors, setErrors] = useState({})
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Initialize features with default values
  useEffect(() => {
    if (featureNames && featureNames.length > 0) {
      const initialFeatures = {}
      featureNames.forEach(name => {
        initialFeatures[name] = 0
      })
      setFeatures(initialFeatures)
    }
  }, [featureNames])

  const handleFeatureChange = (name, value) => {
    const numValue = parseFloat(value) || 0
    setFeatures(prev => ({
      ...prev,
      [name]: numValue
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Check if all required features are present
    if (featureNames && featureNames.length > 0) {
      featureNames.forEach(name => {
        if (!(name in features)) {
          newErrors[name] = 'This feature is required'
        } else {
          const value = features[name]
          if (isNaN(value) || !isFinite(value)) {
            newErrors[name] = 'Must be a valid number'
          }
        }
      })
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      onError('Please fix the errors in the form')
      return
    }
    
    setLoading(true)
    try {
      const result = await predict(features, modelType)
      onPrediction(result)
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Prediction failed'
      onError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    const resetFeatures = {}
    featureNames?.forEach(name => {
      resetFeatures[name] = 0
    })
    setFeatures(resetFeatures)
    setErrors({})
    onPrediction(null)
  }

  const handleQuickFill = () => {
    // Fill with sample values (normal traffic pattern)
    const sampleFeatures = {}
    featureNames?.forEach((name, index) => {
      // Generate reasonable sample values based on feature name
      if (name.toLowerCase().includes('duration')) {
        sampleFeatures[name] = Math.random() * 100000 + 1000
      } else if (name.toLowerCase().includes('packet')) {
        sampleFeatures[name] = Math.random() * 100 + 10
      } else if (name.toLowerCase().includes('byte')) {
        sampleFeatures[name] = Math.random() * 10000 + 100
      } else {
        sampleFeatures[name] = Math.random() * 100
      }
    })
    setFeatures(sampleFeatures)
  }

  // Group features for better UX (show first 10 by default, rest in advanced)
  const displayedFeatures = showAdvanced 
    ? featureNames 
    : (featureNames || []).slice(0, 10)

  if (!featureNames || featureNames.length === 0) {
    return (
      <div className="card">
        <h2>Prediction Form</h2>
        <p>Loading feature names...</p>
      </div>
    )
  }

  return (
    <div className="card prediction-form">
      <h2>Network Traffic Analysis</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="modelType">Model Type:</label>
          <select
            id="modelType"
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
            disabled={loading}
          >
            <option value="knn">K-Nearest Neighbors (KNN)</option>
            <option value="logistic_regression">Logistic Regression</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleQuickFill} disabled={loading} className="btn-secondary">
            Fill Sample Data
          </button>
          <button type="button" onClick={handleReset} disabled={loading} className="btn-secondary">
            Reset
          </button>
        </div>

        <div className="features-section">
          <h3>Network Traffic Features ({featureNames.length} total)</h3>
          
          <div className="features-grid">
            {displayedFeatures.map((name) => (
              <div key={name} className="feature-input">
                <label htmlFor={name}>
                  {name}
                  {errors[name] && <span className="error-text"> *</span>}
                </label>
                <input
                  type="number"
                  id={name}
                  value={features[name] || ''}
                  onChange={(e) => handleFeatureChange(name, e.target.value)}
                  disabled={loading}
                  className={errors[name] ? 'error' : ''}
                  step="any"
                />
                {errors[name] && (
                  <span className="error-message">{errors[name]}</span>
                )}
              </div>
            ))}
          </div>

          {featureNames.length > 10 && (
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="btn-toggle"
            >
              {showAdvanced ? '▲ Show Less' : '▼ Show All Features'}
            </button>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading || Object.keys(errors).length > 0}
          className="btn-primary"
        >
          {loading ? 'Analyzing...' : 'Predict Anomaly'}
        </button>
      </form>
    </div>
  )
}

export default PredictionForm

