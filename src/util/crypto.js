import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY; // Replace with a secure, unique key

// Encrypt function
export const encryptParam = (param) => {
  return CryptoJS.AES.encrypt(param, SECRET_KEY).toString();
};

// Decrypt function
export const decryptParam = (encryptedParam) => {
  const bytes = CryptoJS.AES.decrypt(encryptedParam, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
