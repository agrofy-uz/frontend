import axios from 'axios';

import { getCurrentLocale } from '../lib/language';
import { localStorageHelper } from '../lib/localStorage';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/${getCurrentLocale()}/api/v1`,
});

api.interceptors.request.use(config => {
  const token = localStorageHelper.get<string>('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      localStorageHelper.remove('access_token');
      localStorageHelper.remove('refresh_token');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
