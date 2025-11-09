import React, { useMemo } from 'react'
import Plot from 'react-plotly.js'
import './PlotlyVisualization.css'

const PlotlyVisualization = ({ predictionResult, predictionHistory, modelInfo }) => {
  const scatterData = useMemo(() => {
    if (!predictionResult) {
      return []
    }

    return [
      {
        x: [predictionResult.probability * 100],
        y: [predictionResult.prediction],
        mode: 'markers',
        type: 'scatter',
        name: 'Current Prediction',
        marker: {
          size: 20,
          color: predictionResult.prediction === 1 ? '#f44336' : '#4caf50',
        },
      },
    ]
  }, [predictionResult])

  const historyData = useMemo(() => {
    if (predictionHistory.length === 0) {
      return []
    }

    return [
      {
        x: predictionHistory.map((_, index) => index + 1),
        y: predictionHistory.map(p => p.probability * 100),
        mode: 'lines+markers',
        type: 'scatter',
        name: 'Attack Probability',
        line: {
          color: '#4a9eff',
          width: 2,
        },
        marker: {
          size: 8,
          color: predictionHistory.map(p => p.prediction === 1 ? '#f44336' : '#4caf50'),
        },
      },
    ]
  }, [predictionHistory])

  const modelComparisonData = useMemo(() => {
    if (!modelInfo) {
      return []
    }

    const models = Object.keys(modelInfo)
    return [
      {
        x: models.map(m => m === 'knn' ? 'KNN' : 'Logistic Regression'),
        y: models.map(m => (modelInfo[m]?.f1_score || 0) * 100),
        type: 'bar',
        name: 'F1 Score',
        marker: {
          color: '#4a9eff',
        },
      },
      {
        x: models.map(m => m === 'knn' ? 'KNN' : 'Logistic Regression'),
        y: models.map(m => (modelInfo[m]?.accuracy || 0) * 100),
        type: 'bar',
        name: 'Accuracy',
        marker: {
          color: '#4a9eff',
          opacity: 0.7,
        },
      },
    ]
  }, [modelInfo])

  const pieData = useMemo(() => {
    if (!predictionResult) {
      return []
    }

    return [
      {
        values: [
          predictionResult.prediction === 0 ? 100 : 0,
          predictionResult.prediction === 1 ? 100 : 0,
        ],
        labels: ['Normal Traffic', 'Attack Detected'],
        type: 'pie',
        marker: {
          colors: ['#4caf50', '#f44336'],
          line: {
            color: '#1a1a1a',
            width: 2,
          },
        },
        textfont: {
          color: '#ffffff',
          size: 12,
        },
        textposition: 'inside',
      },
    ]
  }, [predictionResult])

  const layout = {
    autosize: true,
    margin: { l: 60, r: 30, t: 40, b: 60 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: {
      family: 'Arial, sans-serif',
      size: 11,
      color: '#e0e0e0',
    },
    xaxis: {
      gridcolor: '#2a2a2a',
      linecolor: '#3a3a3a',
      zerolinecolor: '#3a3a3a',
      showgrid: true,
    },
    yaxis: {
      gridcolor: '#2a2a2a',
      linecolor: '#3a3a3a',
      zerolinecolor: '#3a3a3a',
      showgrid: true,
    },
  }

  return (
    <div className="plotly-container">
      <div className="charts-grid">
        {predictionResult && (
          <>
            <div className="chart-item">
              <h3>Prediction Probability (Scatter Plot)</h3>
              <div className="chart-wrapper">
                <Plot
                  data={scatterData}
                  layout={{
                    ...layout,
                    title: {
                      text: 'Current Prediction Probability',
                      font: { color: '#ffffff', size: 13 },
                      x: 0.5,
                      xanchor: 'center',
                    },
                    xaxis: { 
                      ...layout.xaxis,
                      title: { text: 'Attack Probability (%)', font: { color: '#e0e0e0', size: 11 } },
                      range: [-5, 105],
                      fixedrange: true,
                    },
                    yaxis: { 
                      ...layout.yaxis,
                      title: { text: 'Prediction', font: { color: '#e0e0e0', size: 11 } },
                      tickvals: [0, 1],
                      ticktext: ['Normal', 'Attack'],
                      range: [-0.2, 1.2],
                      fixedrange: true,
                    },
                    height: 280,
                    width: '100%',
                  }}
                  style={{ width: '100%', height: '100%' }}
                  config={{ responsive: true, displayModeBar: false }}
                />
              </div>
            </div>

            <div className="chart-item">
              <h3>Classification Result (Pie Chart)</h3>
              <div className="chart-wrapper">
                <Plot
                  data={pieData}
                  layout={{
                    ...layout,
                    title: {
                      text: 'Traffic Classification',
                      font: { color: '#ffffff', size: 13 },
                      x: 0.5,
                      xanchor: 'center',
                    },
                    showlegend: true,
                    legend: {
                      font: { color: '#e0e0e0', size: 11 },
                      bgcolor: 'transparent',
                      x: 1.05,
                      y: 0.5,
                      xanchor: 'left',
                    },
                    height: 280,
                    width: '100%',
                    margin: { l: 20, r: 100, t: 40, b: 20 },
                  }}
                  style={{ width: '100%', height: '100%' }}
                  config={{ responsive: true, displayModeBar: false }}
                />
              </div>
            </div>
          </>
        )}

        {historyData.length > 0 && (
          <div className="chart-item full-width">
            <h3>Prediction History Timeline</h3>
            <div className="chart-wrapper">
              <Plot
                data={historyData}
                  layout={{
                    ...layout,
                    title: {
                      text: 'Attack Probability Over Time',
                      font: { color: '#ffffff', size: 13 },
                      x: 0.5,
                      xanchor: 'center',
                    },
                    xaxis: { 
                      ...layout.xaxis,
                      title: { text: 'Prediction Number', font: { color: '#e0e0e0', size: 11 } },
                    },
                    yaxis: { 
                      ...layout.yaxis,
                      title: { text: 'Attack Probability (%)', font: { color: '#e0e0e0', size: 11 } },
                      range: [-5, 105],
                    },
                    height: 350,
                    width: '100%',
                  }}
                  style={{ width: '100%', height: '100%' }}
                  config={{ responsive: true, displayModeBar: true, displaylogo: false }}
              />
            </div>
          </div>
        )}

        {modelComparisonData.length > 0 && (
          <div className="chart-item full-width">
            <h3>Model Performance Comparison</h3>
            <div className="chart-wrapper">
              <Plot
                data={modelComparisonData}
                  layout={{
                    ...layout,
                    title: {
                      text: 'Model Metrics Comparison',
                      font: { color: '#ffffff', size: 13 },
                      x: 0.5,
                      xanchor: 'center',
                    },
                    xaxis: { 
                      ...layout.xaxis,
                      title: { text: 'Model Type', font: { color: '#e0e0e0', size: 11 } },
                    },
                    yaxis: { 
                      ...layout.yaxis,
                      title: { text: 'Score (%)', font: { color: '#e0e0e0', size: 11 } },
                      range: [-5, 105],
                    },
                    showlegend: true,
                    legend: {
                      font: { color: '#e0e0e0', size: 11 },
                      bgcolor: 'transparent',
                    },
                    barmode: 'group',
                    height: 350,
                    width: '100%',
                  }}
                  style={{ width: '100%', height: '100%' }}
                  config={{ responsive: true, displayModeBar: true, displaylogo: false }}
              />
            </div>
          </div>
        )}

        {!predictionResult && (
          <div className="no-data">
            <p>Make a prediction to see visualizations</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlotlyVisualization

