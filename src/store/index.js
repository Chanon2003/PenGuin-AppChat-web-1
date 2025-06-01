// store/index.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice } from "./slices/auth.slice";
import { encryptedStorage } from "@/utils/encryptedStorage";
import { createChatSlice } from "./slices/chat-slice";

export const useAppStore = create(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createChatSlice(...a),
    }),
    {
      name: 'secure-app',
      storage: {
        getItem: encryptedStorage.getItem.bind(encryptedStorage),
        setItem: encryptedStorage.setItem.bind(encryptedStorage),
        removeItem: encryptedStorage.removeItem.bind(encryptedStorage),
      },
      partialize: (state) => ({
        userInfo: state.userInfo,
      }),
    }
  ),
);

useAppStore.clearStorage = async () => {
  // ลบจาก encryptedStorage โดยใช้ key เดียวกับใน persist name
  await encryptedStorage.removeItem('secure-app');
};

