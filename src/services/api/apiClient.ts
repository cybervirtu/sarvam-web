export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * A wrapper around the native fetch API to ensure credentials are included
 * in every request for HTTP-only cookie sessions.
 */
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    return fetch(url, {
        ...options,
        // Critical: this tells the browser to send cookies with cross-origin requests
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
};
