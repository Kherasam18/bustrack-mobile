// src/api/auth.api.js — Authentication API service for BusTrack Mobile.
// Handles school code lookup and driver login. More functions will be
// added in Phases 9c (parent login) and 9d (password recovery flow).

import api from './axios';

// Resolve a school code to its UUID and display info (public endpoint)
export async function getSchoolByCode(code) {
  const normalised = String(code).trim().toUpperCase();
  const response = await api.get(`/api/schools/by-code/${normalised}`);
  return response.data.data.school;
}

// Authenticate a driver with employee ID and password
export async function driverLogin({ employee_id, password, school_id }) {
  const response = await api.post('/api/auth/driver/login', {
    employee_id: String(employee_id).trim(),
    password,
    school_id,
  });
  return response.data.data;
}

// Authenticate a parent with phone number and password
export async function parentLogin({ phone, password, school_id }) {
  const response = await api.post('/api/auth/parent/login', {
    phone: String(phone).trim(),
    password,
    school_id,
  });
  return response.data.data;
}
