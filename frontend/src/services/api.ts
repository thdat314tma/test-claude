import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ BOOKS API ============
export const booksAPI = {
  getAll: () => api.get('/books'),
  getAvailable: () => api.get('/books/available'),
  getById: (id: string) => api.get(`/books/${id}`),
  add: (book: any) => api.post('/books', book),
  delete: (id: string) => api.delete(`/books/${id}`),
  searchByTitle: (query: string) => api.get(`/books/search/title/${query}`),
  searchByAuthor: (query: string) => api.get(`/books/search/author/${query}`),
  searchByCategory: (query: string) => api.get(`/books/search/category/${query}`),
};

// ============ USERS API ============
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  register: (user: any) => api.post('/users', user),
  delete: (id: string) => api.delete(`/users/${id}`),
  getBorrows: (id: string) => api.get(`/users/${id}/borrows`),
  getActiveBorrows: (id: string) => api.get(`/users/${id}/active-borrows`),
};

// ============ BORROWS API ============
export const borrowsAPI = {
  getAll: () => api.get('/borrows'),
  getActive: () => api.get('/borrows/active'),
  getOverdue: () => api.get('/borrows/overdue'),
  borrow: (data: { userId: string; bookId: string; borrowDays?: number }) =>
    api.post('/borrows', data),
  return: (id: string) => api.post(`/borrows/${id}/return`),
};

// ============ STATISTICS API ============
export const statisticsAPI = {
  get: () => api.get('/statistics'),
};

export default api;
