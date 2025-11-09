import React, { useState, useEffect } from 'react'
import './App.css'
import PredictionForm from './components/PredictionForm'
import PredictionResult from './components/PredictionResult'
import Visualizations from './components/Visualizations'
import ModelInfo from './components/ModelInfo'
import { getModelInfo, getFeatureNames } from './services/api'

function App() {
  const [predictionResult, setPredictionResult] = useState(null)
  const [modelInfo, setModelInfo] = useState(null)
  const [featureNames, setFeatureNames] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Load model info and feature names on mount
    const loadInitialData = async () => {
      try {
        const [info, features] = await Promise.all([
          getModelInfo(),
          getFeatureNames()
        ])
        setModelInfo(info)
        setFeatureNames(features.feature_names || [])
      } catch (err) {
        console.error('Error loading initial data:', err)
        setError('Failed to load model information')
      }
    }
    loadInitialData()
  }, [])

  const handlePrediction = (result) => {
    setPredictionResult(result)
    setError(null)
  }

  const handleError = (err) => {
    setError(err)
    setPredictionResult(null)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Network Traffic Anomaly Detection</h1>
        <p>AI-Powered Cybersecurity Analysis System</p>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-banner">
            <span>{error}</span>
          </div>
        )}

        <div className="container">
          <div className="left-panel">
            <ModelInfo modelInfo={modelInfo} />
            
            <PredictionForm
              featureNames={featureNames}
              onPrediction={handlePrediction}
              onError={handleError}
              loading={loading}
              setLoading={setLoading}
            />

            {predictionResult && (
              <PredictionResult result={predictionResult} />
            )}
          </div>

          <div className="right-panel">
            <Visualizations 
              predictionResult={predictionResult}
              modelInfo={modelInfo}
            />
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <p>Network Traffic Classification for Anomaly Detection</p>
      </footer>
    </div>
  )
}

export default App

