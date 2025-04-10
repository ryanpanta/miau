import axios from 'axios';

export const API_URL = 'https://miau-webapi-prod-a7dzg4acfnh0gphk.brazilsouth-01.azurewebsites.net/api/';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
