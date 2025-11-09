import React, { useState, useEffect } from 'react'
import './Visualizations.css'
import ChartJSVisualization from './charts/ChartJSVisualization'
import PlotlyVisualization from './charts/PlotlyVisualization'
import D3Visualization from './charts/D3Visualization'

const Visualizations = ({ predictionResult, modelInfo }) => {
  const [activeTab, setActiveTab] = useState('chartjs')
  const [predictionHistory, setPredictionHistory] = useState([])

  useEffect(() => {
    if (predictionResult) {
      setPredictionHistory(prev => [...prev, predictionResult])
    }
  }, [predictionResult])

  const tabs = [
    { id: 'chartjs', name: 'Standard Charts'},
    { id: 'plotly', name: 'Interactive Charts'},
    { id: 'd3', name: 'Custom Visualizations'},
  ]

  return (
    <div className="card visualizations">
      <h2>Data Visualizations</h2>
      
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="visualization-content">
        {activeTab === 'chartjs' && (
          <ChartJSVisualization 
            predictionResult={predictionResult}
            predictionHistory={predictionHistory}
            modelInfo={modelInfo}
          />
        )}
        
        {activeTab === 'plotly' && (
          <PlotlyVisualization 
            predictionResult={predictionResult}
            predictionHistory={predictionHistory}
            modelInfo={modelInfo}
          />
        )}
        
        {activeTab === 'd3' && (
          <D3Visualization 
            predictionResult={predictionResult}
            predictionHistory={predictionHistory}
            modelInfo={modelInfo}
          />
        )}
      </div>
    </div>
  )
}

export default Visualizations

