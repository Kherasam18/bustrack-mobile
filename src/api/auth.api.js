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

// Request a password-reset OTP for a parent account
export async function forgotPasswordSendOTP({ phone, school_id }) {
  const response = await api.post('/api/auth/parent/forgot-password', {
    phone: String(phone).trim(),
    school_id,
  });
  return response.data.data;
}

// Verify the OTP and receive a short-lived reset token
export async function forgotPasswordVerifyOTP({ phone, school_id, otp }) {
  const response = await api.post('/api/auth/parent/forgot-password/verify', {
    phone: String(phone).trim(),
    school_id,
    otp: String(otp).trim(),
  });
  return response.data.data;
}

// Reset the parent password using a valid reset token
export async function forgotPasswordReset({ reset_token, new_password }) {
  const response = await api.post('/api/auth/parent/forgot-password/reset', {
    reset_token,
    new_password,
  });
  return response.data.data;
}

// Register the device FCM token with the backend
export async function registerFcmTokenApi({ fcm_token }) {
  try {
    const response = await api.post('/api/users/register-fcm-token', {
      fcm_token,
    });
    return response.data.data;
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    throw new Error(message);
  }
}

// Change the authenticated driver's password
export async function changeDriverPassword({ current_password, new_password }) {
  try {
    const response = await api.post('/api/auth/driver/change-password', {
      current_password,
      new_password,
    });
    return response.data.data;
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    throw new Error(message);
  }
}
