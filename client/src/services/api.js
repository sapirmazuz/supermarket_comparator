//  מכיל קריאות fetch/axios לשרת: מוצרים, משתמשים, השוואה, תגובות.

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // כתובת השרת שלך
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
