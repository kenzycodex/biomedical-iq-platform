import axios from 'axios';
import useLocalStorage from '../hooks/useLocalStorage'; // Import the custom hook

// API URL
const API_URL = import.meta.env.VITE_API_URL;

// Setup Axios Instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom hook for managing tokens in local storage
const useTokenStorage = () => {
  const [accessToken, setAccessToken] = useLocalStorage('access_token', null);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', null);

  return {
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
  };
};

// Function to refresh the access token
const refreshToken = async () => {
  const { refreshToken, setAccessToken } = useTokenStorage();
  try {
    if (!refreshToken) {
      throw new Error('No refresh token available. Redirecting to login...');
    }

    const response = await fetch(`${API_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();

    if (response.ok) {
      setAccessToken(data.access_token);
      console.log('Access token refreshed successfully');
      return data.access_token;
    } else {
      throw new Error(data.error || 'Token refresh failed');
    }
  } catch (error) {
    console.error('Error occurred while refreshing token:', error);
    // Clear tokens and redirect to login on failure
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }
};

// Add request interceptor to include access token
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useTokenStorage();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        if (newToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Failed to refresh token, redirecting to login...');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Service for user login
export const login = async (credentials) => {
  const { setAccessToken, setRefreshToken } = useTokenStorage();
  try {
    const response = await api.post('/login', credentials);
    const { access_token, refresh_token, user } = response.data;

    // Store the new tokens in local storage
    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    return { access_token, refresh_token, user };
  } catch (error) {
    console.error('Login failed:', error);
    throw error.response?.data || { error: 'Login failed' };
  }
};

// Service to fetch the user profile
export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error.response?.data || { error: 'Failed to fetch user profile' };
  }
};

// Example API call: Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/update_profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    if (error.response?.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    }
    throw error.response?.data || { error: 'Failed to update user profile' };
  }
};

// Service for user registration
export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Registration failed' };
  }
};

// Service for 2FA verification
export const verify2FA = async (email, verificationCode) => {
  const { setAccessToken, setRefreshToken } = useTokenStorage();
  try {
    const response = await api.post('/verify', {
      email,
      verification_code: verificationCode,
    });
    setAccessToken(response.data.access_token);
    setRefreshToken(response.data.refresh_token);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: '2FA verification failed' };
  }
};

// Service for user logout
export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Remove tokens from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// Service for password reset
export const resetPassword = async (identifier) => {
  try {
    const response = await api.post('/reset_password', { identifier });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Password reset request failed' };
  }
};

// Service to confirm password reset
export const confirmReset = async (resetData) => {
  try {
    const response = await api.post('/confirm_reset', resetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Password reset confirmation failed' };
  }
};

// Service to toggle MFA
export const toggleMFA = async (enableMFA) => {
  try {
    const response = await api.post('/mfa/toggle', { enable_mfa: enableMFA });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to toggle MFA' };
  }
};

// Service to fetch user activity
export const getUserActivity = async () => {
  try {
    const response = await api.get('/activity');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch user activity' };
  }
};

// Service to check password strength
export const checkPasswordStrength = async (password) => {
  try {
    const response = await api.post('/password/strength', { password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to check password strength' };
  }
};

export default api;