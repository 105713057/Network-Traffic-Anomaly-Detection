import React from 'react'
import './PredictionResult.css'

const PredictionResult = ({ result }) => {
  if (!result) return null

  const isAttack = result.prediction === 1
  const probability = result.probability
  const confidence = result.confidence

  const getConfidenceColor = (conf) => {
    switch (conf) {
      case 'High':
        return '#4caf50'
      case 'Medium':
        return '#ff9800'
      case 'Low':
        return '#f44336'
      default:
        return '#666'
    }
  }

  const getStatusText = () => {
    return isAttack ? 'ATTACK DETECTED' : 'NORMAL TRAFFIC'
  }

  const getStatusColor = () => {
    return isAttack ? '#f44336' : '#4caf50'
  }

  return (
    <div className="card prediction-result">
      <h2>Prediction Result</h2>
      
      <div className="result-main">
        <div className="status-badge" style={{ backgroundColor: getStatusColor() }}>
          <span className="status-text">{getStatusText()}</span>
        </div>

        <div className="result-details">
          <div className="detail-item">
            <span className="detail-label">Probability:</span>
            <span className="detail-value">
              {(probability * 100).toFixed(2)}%
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Confidence:</span>
            <span 
              className="detail-value confidence-badge"
              style={{ color: getConfidenceColor(confidence) }}
            >
              {confidence}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Model Used:</span>
            <span className="detail-value">
              {result.model_used === 'knn' ? 'K-Nearest Neighbors' : 'Logistic Regression'}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Timestamp:</span>
            <span className="detail-value">
              {new Date(result.timestamp).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="probability-bar">
          <div className="probability-label">
            <span>Normal</span>
            <span>Attack</span>
          </div>
          <div className="probability-track">
            <div 
              className="probability-fill"
              style={{ 
                width: `${probability * 100}%`,
                backgroundColor: isAttack ? '#f44336' : '#4caf50'
              }}
            />
          </div>
        </div>

        {isAttack && (
          <div className="alert-box">
            <strong>Security Alert:</strong> This network traffic pattern has been identified as potentially malicious. 
            Please review the traffic details and take appropriate security measures.
          </div>
        )}
      </div>
    </div>
  )
}

export default PredictionResult

