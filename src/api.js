import axios from "axios";

const API = axios.create({
  baseURL: "https://waggy-backend-rhf8.onrender.com/api",
});

// 🔹 Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Auto refresh on 401
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        if (!refresh) throw new Error("No refresh token");

        const res = await axios.post(
          "https://waggy-backend-rhf8.onrender.com/api/token/refresh/",
          { refresh }
        );

        const newAccess = res.data.access;

        localStorage.setItem("token", newAccess);

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return API(originalRequest);

      } catch (err) {
        // ❌ refresh failed → logout
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;