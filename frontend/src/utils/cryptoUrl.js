import CryptoJS from 'crypto-js';

// Kunci rahasia enkripsi (Simpan di .env: VITE_URL_SECRET_KEY)
const SECRET_KEY = import.meta.env.VITE_URL_SECRET_KEY || 'digimarket-secret-key-2026';

// Enkripsi object/string menjadi URL Safe Token
export const encryptParam = (data) => {
  try {
    const jsonString = typeof data === 'object' ? JSON.stringify(data) : String(data);
    const ciphertext = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    // Mengubah karakter non-URL-safe agar aman di URL
    return encodeURIComponent(ciphertext);
  } catch (error) {
    console.error("Encryption Error:", error);
    return '';
  }
};

// Dekripsi token dari URL kembali ke data asli
export const decryptParam = (encryptedToken) => {
  try {
    if (!encryptedToken) return null;
    const decodedToken = decodeURIComponent(encryptedToken);
    const bytes = CryptoJS.AES.decrypt(decodedToken, SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    
    try {
      return JSON.parse(decryptedText); // Jika berbentuk object
    } catch {
      return decryptedText; // Jika string biasa
    }
  } catch (error) {
    console.error("Decryption Error:", error);
    return null;
  }
};