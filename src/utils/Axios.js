import SummaryApi from "@/common/SummaryApi";
import axios from "axios";

export const baseURL = import.meta.env.VITE_SERVER_URL;

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

// ===== Token Refresh Control =====
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// ===== Request Interceptor =====
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== Response Interceptor =====
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ เงื่อนไขที่ต้อง refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth")
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const newAccessToken = await refreshAccessToken(refreshToken);

          if (!newAccessToken) {
            throw new Error("No access token received");
          }

          localStorage.setItem("accessToken", newAccessToken);
          onRefreshed(newAccessToken); // แจ้งทุก subscriber
        } catch (err) {
          // ⛔️ refresh token ใช้ไม่ได้ → logout
          await useAppStore.getState().logout();
          await useAppStore.clearStorage();
          toast.error("Session expired. Please login again.");
          window.location.href = "/auth";
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      // ✅ ถ้าอยู่ระหว่าง refresh ให้รอ
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(Axios(originalRequest));
        });
      });
    }

    // ❌ เฉพาะกรณีที่ไม่เกี่ยวกับ 401 + refresh → ไม่ต้อง logout ทิ้ง
    return Promise.reject(error);
  }
);

// ===== Refresh Token Function =====
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await Axios({
      ...SummaryApi.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    });
    return response.data?.data?.accessToken;
  } catch (error) {
    console.log("Refresh token failed", error);
    return null;
  }
};

export default Axios;