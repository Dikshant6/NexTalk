const AUTH_URL = `${import.meta.env.VITE_API_URL}/auth`;

async function request(endpoint, options = {}) {
    const response = await fetch(`${AUTH_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || data.error || "Something went wrong")
    }
    return data;
}

export const authService = {
    register: (userData) => request("/register", {
        method: "POST",
        body: JSON.stringify(userData),
    }),

    login: (credentials) => request("/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    }),

    getMe: () => request("/me"),

    logout: () => request("/logout", {
        method: "GET",
    })
}