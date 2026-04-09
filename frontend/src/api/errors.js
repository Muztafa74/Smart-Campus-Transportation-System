/**
 * User-facing message from axios / API errors (network, validation, JSON body).
 */
export function getApiErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (!err) return fallback;

  const data = err.response?.data;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const first = data.errors[0];
    if (typeof first?.message === 'string' && first.message) return first.message;
  }

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message;
  }

  const code = err.code;
  if (code === 'ERR_NETWORK' || err.message === 'Network Error') {
    return "We can't reach the server right now. Check your connection or try again in a moment.";
  }

  if (code === 'ECONNABORTED') {
    return 'The request took too long. Please try again.';
  }

  const status = err.response?.status;
  if (status === 401) return 'Your session expired. Please sign in again.';
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return 'That resource was not found.';
  if (status === 409) return data?.message || 'This action conflicts with existing data.';
  if (status >= 500) return 'The server had a problem. Please try again later.';

  if (typeof err.message === 'string' && err.message && err.message !== 'Network Error') {
    return err.message;
  }

  return fallback;
}
