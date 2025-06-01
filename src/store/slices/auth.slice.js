export const createAuthSlice = (set) => (
  {
    userInfo: null,
    setUserInfo: (userInfo) => set({ userInfo }),
    logout: async () => {
      // ล้าง user และ localStorage ถ้ามี
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({ userInfo: null});
    }
  }
)