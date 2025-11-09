import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health')
  return response.data
}

// Get model information
export const getModelInfo = async () => {
  const response = await api.get('/api/models/info')
  return response.data
}

// Get feature names
export const getFeatureNames = async () => {
  const response = await api.get('/api/models/features')
  return response.data
}

// Single prediction
export const predict = async (features, modelType = 'knn') => {
  const response = await api.post('/api/predict', {
    features,
    model_type: modelType,
  })
  return response.data
}

// Batch prediction
export const predictBatch = async (data, modelType = 'knn') => {
  const response = await api.post('/api/predict/batch', {
    data,
    model_type: modelType,
  })
  return response.data
}

// Get statistics
export const getStats = async () => {
  const response = await api.get('/api/stats')
  return response.data
}

export default api

