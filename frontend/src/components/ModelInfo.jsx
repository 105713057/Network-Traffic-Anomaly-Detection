import React from 'react'
import './ModelInfo.css'

const ModelInfo = ({ modelInfo }) => {
  if (!modelInfo) {
    return (
      <div className="card model-info">
        <h2>Model Information</h2>
        <p>Loading model information...</p>
      </div>
    )
  }

  const models = Object.keys(modelInfo)

  return (
    <div className="card model-info">
      <h2>Model Information</h2>
      
      <div className="models-list">
        {models.map((modelKey) => {
          const model = modelInfo[modelKey]
          return (
            <div key={modelKey} className="model-card">
              <h3>
                {model.model_type === 'knn' 
                  ? 'K-Nearest Neighbors (KNN)' 
                  : 'Logistic Regression'}
              </h3>
              
              <div className="model-metrics">
                <div className="metric">
                  <span className="metric-label">Accuracy:</span>
                  <span className="metric-value">
                    {(model.accuracy * 100).toFixed(2)}%
                  </span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Precision:</span>
                  <span className="metric-value">
                    {(model.precision * 100).toFixed(2)}%
                  </span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Recall:</span>
                  <span className="metric-value">
                    {(model.recall * 100).toFixed(2)}%
                  </span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">F1-Score:</span>
                  <span className="metric-value">
                    {(model.f1_score * 100).toFixed(2)}%
                  </span>
                </div>

                {model.k && (
                  <div className="metric">
                    <span className="metric-label">K Value:</span>
                    <span className="metric-value">{model.k}</span>
                  </div>
                )}
              </div>

              <div className="model-features">
                <p className="features-count">
                  <strong>{model.num_features}</strong> features
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="model-description">
        <h4>About the Models:</h4>
        <ul>
          <li>
            <strong>K-Nearest Neighbors (KNN):</strong> Classifies based on similarity to 
            k nearest neighbors in the training data.
          </li>
          <li>
            <strong>Logistic Regression:</strong> Uses a linear model with a logistic 
            function to predict binary classification.
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ModelInfo

