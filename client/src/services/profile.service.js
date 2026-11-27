const PROFILE_URL = `${import.meta.env.VITE_API_URL}/profile`;

async function request(endpoint, options = {}) {
  const response = await fetch(`${PROFILE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }

  return data;
}

export const profileService = {
  getProfile: () => request("/me"),

  updateProfile: (profileData) =>
    request("/me", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    }),
};
