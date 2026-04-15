/**
 * Базовый URL API. В dev обходим Vite proxy и обращаемся к backend напрямую,
 * т.к. proxy может перехватываться (например, Cursor) и возвращать 401.
 */
export const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? 'http://127.0.0.1:3004' : 'https://resume-ai-reviewer.onrender.com')
