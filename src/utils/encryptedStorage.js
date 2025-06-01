import { EncryptStorage } from 'encrypt-storage';

const secretKey = import.meta.env.VITE_SECRET_KEY_LOCALSTORAGE
export const encryptedStorage = new EncryptStorage(secretKey, {
  storageType: 'localStorage',
});