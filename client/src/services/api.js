const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();

  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred during API request.');
  }

  return data;
};

// Convenience API methods
export const api = {
  // Auth
  register: (userData) =>
    apiCall('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) =>
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => apiCall('/auth/me'),

  // Surveys
  getMySurveys: () => apiCall('/surveys/my'),
  createSurvey: (surveyData) =>
    apiCall('/surveys', { method: 'POST', body: JSON.stringify(surveyData) }),
  getSurveyById: (id) => apiCall(`/surveys/${id}`),
  updateSurvey: (id, surveyData) =>
    apiCall(`/surveys/${id}`, { method: 'PUT', body: JSON.stringify(surveyData) }),
  updateSurveyStatus: (id, status) =>
    apiCall(`/surveys/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteSurvey: (id) => apiCall(`/surveys/${id}`, { method: 'DELETE' }),

  // Responses
  submitResponse: (responseData) =>
    apiCall('/responses', { method: 'POST', body: JSON.stringify(responseData) }),
  getSurveyResponses: (surveyId) => apiCall(`/responses/survey/${surveyId}`),

  // Analytics
  getSurveyAnalytics: (surveyId) => apiCall(`/analytics/${surveyId}`),
};
