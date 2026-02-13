import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Health check function
export const checkApiHealth = async () => {
  try {
    await api.get('/posts')
    return true
  } catch (error) {
    throw new Error('API is not available')
  }
}

// Posts API
export const postsApi = {
  // GET /posts
  list: () => api.get('/posts'),
  
  // POST /posts
  create: (data) => api.post('/posts', data),
  
  // GET /posts/{postId}
  get: (postId) => api.get(`/posts/${postId}`),
  
  // PATCH /posts/{postId}
  update: (postId, data) => api.patch(`/posts/${postId}`, data),
  
  // DELETE /posts/{postId}
  delete: (postId) => api.delete(`/posts/${postId}`)
}

// Comments API
export const commentsApi = {
  // GET /posts/{postId}/comments
  list: (postId) => api.get(`/posts/${postId}/comments`),
  
  // POST /posts/{postId}/comments
  create: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  
  // GET /posts/{postId}/comments/{commentId}
  get: (postId, commentId) => api.get(`/posts/${postId}/comments/${commentId}`),
  
  // PATCH /posts/{postId}/comments/{commentId}
  update: (postId, commentId, data) => api.patch(`/posts/${postId}/comments/${commentId}`, data),
  
  // DELETE /posts/{postId}/comments/{commentId}
  delete: (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}`)
}

// Likes API
export const likesApi = {
  // POST /posts/{postId}/likes
  like: (postId, data) => api.post(`/posts/${postId}/likes`, data),
  
  // DELETE /posts/{postId}/likes
  unlike: (postId, data) => api.delete(`/posts/${postId}/likes`, { data })
}

// Error handler for API responses
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.message || 'An error occurred'
  } else if (error.request) {
    return 'Network error: Unable to reach the server'
  } else {
    return 'An unexpected error occurred'
  }
}