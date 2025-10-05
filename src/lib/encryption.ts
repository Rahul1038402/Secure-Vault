import CryptoJS from 'crypto-js';

export function deriveKey(userPassword: string, email: string): string {
  return CryptoJS.PBKDF2(userPassword, email, {
    keySize: 256 / 32,
    iterations: 1000,
  }).toString();
}

export function encrypt(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString();
}

export function decrypt(encryptedData: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function encryptVaultItem(
  item: {
    title: string;
    username: string;
    password: string;
    url?: string;
    notes?: string;
  },
  key: string
) {
  return {
    title: encrypt(item.title, key),
    username: encrypt(item.username, key),
    password: encrypt(item.password, key),
    url: item.url ? encrypt(item.url, key) : undefined,
    notes: item.notes ? encrypt(item.notes, key) : undefined,
  };
}

export function decryptVaultItem(
  encryptedItem: {
    _id?: string;
    title: string;
    username: string;
    password: string;
    url?: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
  },
  key: string
) {
  return {
    _id: encryptedItem._id,
    title: decrypt(encryptedItem.title, key),
    username: decrypt(encryptedItem.username, key),
    password: decrypt(encryptedItem.password, key),
    url: encryptedItem.url ? decrypt(encryptedItem.url, key) : '',
    notes: encryptedItem.notes ? decrypt(encryptedItem.notes, key) : '',
    createdAt: encryptedItem.createdAt,
    updatedAt: encryptedItem.updatedAt,
  };
}