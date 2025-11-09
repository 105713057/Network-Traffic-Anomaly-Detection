import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const ChartJSVisualization = ({ predictionResult, predictionHistory, modelInfo }) => {
  // Prepare data for charts
  const predictionData = useMemo(() => {
    if (!predictionResult) {
      return {
        labels: ['Normal', 'Attack'],
        values: [0, 0],
      }
    }
    
    return {
      labels: ['Normal', 'Attack'],
      values: [
        predictionResult.prediction === 0 ? 1 : 0,
        predictionResult.prediction === 1 ? 1 : 0,
      ],
    }
  }, [predictionResult])

  const historyData = useMemo(() => {
    if (predictionHistory.length === 0) {
      return {
        labels: [],
        probabilities: [],
        predictions: [],
      }
    }

    return {
      labels: predictionHistory.map((_, index) => `Prediction ${index + 1}`),
      probabilities: predictionHistory.map(p => p.probability * 100),
      predictions: predictionHistory.map(p => p.prediction),
    }
  }, [predictionHistory])

  const modelComparisonData = useMemo(() => {
    if (!modelInfo) {
      return null
    }

    const models = Object.keys(modelInfo)
    return {
      labels: models.map(m => m === 'knn' ? 'KNN' : 'Logistic Regression'),
      f1Scores: models.map(m => modelInfo[m]?.f1_score || 0),
      accuracies: models.map(m => modelInfo[m]?.accuracy || 0),
    }
  }, [modelInfo])

  // Doughnut chart for current prediction
  const doughnutData = {
    labels: ['Normal Traffic', 'Attack Detected'],
    datasets: [
      {
        label: 'Prediction',
        data: [
          predictionData.values[0] * 100,
          predictionData.values[1] * 100,
        ],
        backgroundColor: ['#4caf50', '#f44336'],
        borderColor: ['#4caf50', '#f44336'],
        borderWidth: 2,
      },
    ],
  }

  // Line chart for prediction history
  const lineData = {
    labels: historyData.labels,
    datasets: [
      {
        label: 'Attack Probability (%)',
        data: historyData.probabilities,
        borderColor: '#4a9eff',
        backgroundColor: 'rgba(74, 158, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Bar chart for model comparison
  const barData = modelComparisonData ? {
    labels: modelComparisonData.labels,
    datasets: [
      {
        label: 'F1 Score',
        data: modelComparisonData.f1Scores,
        backgroundColor: 'rgba(74, 158, 255, 0.8)',
        borderColor: 'rgba(74, 158, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Accuracy',
        data: modelComparisonData.accuracies,
        backgroundColor: 'rgba(74, 158, 255, 0.6)',
        borderColor: 'rgba(74, 158, 255, 0.8)',
        borderWidth: 1,
      },
    ],
  } : null

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e0e0e0',
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: true,
        font: {
          size: 13,
          color: '#ffffff',
        },
        color: '#ffffff',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#a0a0a0',
          font: {
            size: 10,
          },
        },
        grid: {
          color: '#2a2a2a',
        },
      },
      y: {
        ticks: {
          color: '#a0a0a0',
          font: {
            size: 10,
          },
        },
        grid: {
          color: '#2a2a2a',
        },
      },
    },
  }

  return (
    <div className="chartjs-container">
      <div className="charts-grid">
        <div className="chart-item">
          <h3>Current Prediction (Doughnut Chart)</h3>
          <div className="chart-wrapper">
            <Doughnut data={doughnutData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  ...chartOptions.plugins.title,
                  text: 'Traffic Classification',
                },
              },
            }} />
          </div>
        </div>

        {historyData.labels.length > 0 && (
          <div className="chart-item">
            <h3>Prediction History (Line Chart)</h3>
            <div className="chart-wrapper">
              <Line data={lineData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'Attack Probability Over Time',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: function(value) {
                        return value + '%'
                      },
                    },
                  },
                },
              }} />
            </div>
          </div>
        )}

        {barData && (
          <div className="chart-item full-width">
            <h3>Model Performance Comparison (Bar Chart)</h3>
            <div className="chart-wrapper">
              <Bar data={barData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'Model Metrics Comparison',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                      callback: function(value) {
                        return (value * 100).toFixed(0) + '%'
                      },
                    },
                  },
                },
              }} />
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

export default ChartJSVisualization

