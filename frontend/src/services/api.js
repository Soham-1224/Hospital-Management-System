import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// Doctors
export const getAllDoctors = () => api.get('/doctors');
export const getDoctorById = (id) => api.get(`/doctors/${id}`);
export const getDoctorByUserId = (userId) => api.get(`/doctors/user/${userId}`);
export const searchDoctors = (spec) => api.get(`/doctors/search?specialization=${spec}`);
export const updateDoctor = (id, data) => api.put(`/doctors/${id}`, data);

// Patients
export const getAllPatients = () => api.get('/patients');
export const getPatientById = (id) => api.get(`/patients/${id}`);
export const getPatientByUserId = (userId) => api.get(`/patients/user/${userId}`);
export const updatePatient = (id, data) => api.put(`/patients/${id}`, data);

// Appointments
export const bookAppointment = (data) => api.post('/appointments/book', data);
export const getPatientAppointments = (id) => api.get(`/appointments/patient/${id}`);
export const getDoctorAppointments = (id) => api.get(`/appointments/doctor/${id}`);
export const getAllAppointments = () => api.get('/appointments/all');
export const updateAppointmentStatus = (id, status) => api.put(`/appointments/${id}/status`, { status });
export const addAppointmentNotes = (id, notes) => api.put(`/appointments/${id}/notes`, { notes });
export const cancelAppointment = (id) => api.delete(`/appointments/${id}/cancel`);

// Admin
export const getAdminStats = () => api.get('/admin/stats');

// AI
export const analyzeSymptoms = (symptoms) => api.post('/ai/analyze-symptoms', { symptoms });

export default api;
