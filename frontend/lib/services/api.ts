import axios from 'axios';
import { store } from '../redux/store';

const API = axios.create({ baseURL: 'http://localhost:3001/api/v1' });

API.interceptors.request.use(config => {
  const state = store.getState();
  const token = state.auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials: any) => API.post('/auth/login', credentials);
export const signup = (data: any) => API.post('/auth/signup', data);
export const analyzePr = (data: any) => API.post('/ai-agent/analyze-pr', data);