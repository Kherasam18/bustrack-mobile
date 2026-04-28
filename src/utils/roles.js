// src/utils/roles.js — Role constants matching the backend PostgreSQL ENUM exactly.
// Used throughout the mobile app for auth routing, conditional UI, and permission checks.

export const ROLES = Object.freeze({
  DRIVER: 'DRIVER',
  PARENT: 'PARENT',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
});
