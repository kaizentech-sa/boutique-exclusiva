import axios from 'axios';
import { API_CONFIG } from '../shop/utils/constants';

// Debug logging

// Create axios instance with secure configuration
// All API calls now go through WordPress backend which handles WooCommerce authentication
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // Send cookies with requests (needed for WordPress auth)
  headers: { 
    'Content-Type': 'application/json',
    'X-API-Key': API_CONFIG.API_KEY, // API key for WordPress endpoint authentication
  },
});

// Request interceptor - Add user ID header if available (fallback for auth)
apiClient.interceptors.request.use((config) => {
  // Add user ID header if user is stored in localStorage (fallback for cross-domain auth)
  try {
    const storedUser = localStorage.getItem('oracle_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user && user.id) {
        config.headers['X-User-ID'] = user.id.toString();
      }
    }
  } catch (err) {
    // Ignore errors parsing user data
  }
  
  return config;
});

export async function apiGet(url, params = {}) { return (await apiClient.get(url, { params })).data; }
export async function apiGetWithHeaders(url, params = {}) {
  const response = await apiClient.get(url, { params });
  return { data: response.data, headers: response.headers };
}
export async function apiPost(url, data, params = {}) { return (await apiClient.post(url, data, { params })).data; }
export async function apiPut(url, data, params = {}) { return (await apiClient.put(url, data, { params })).data; }



