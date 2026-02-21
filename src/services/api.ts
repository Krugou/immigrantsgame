// src/services/api.ts

export const isBackendAvailable = () => {
  return process.env.NEXT_PUBLIC_BACKEND_AVAILABLE === 'true';
};
