export function getAppBaseUrl(): string {
  // 1. Check environment variables (process.env.APP_URL or import.meta.env.VITE_APP_URL)
  const envUrl = 
    (typeof process !== 'undefined' && process.env && process.env.APP_URL) ||
    (typeof process !== 'undefined' && process.env && process.env.VITE_APP_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_APP_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.APP_URL);

  if (envUrl && typeof envUrl === 'string' && envUrl.trim() && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.trim().replace(/\/$/, '');
  }

  // 2. Check browser location if NOT running on localhost
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const origin = window.location.origin;
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return origin.replace(/\/$/, '');
    }
  }

  // 3. Default fallback for development preview environment
  return 'https://ais-dev-pgw6p22matpwpq3qeqijvp-514008090755.us-east1.run.app';
}
