export interface VaultItem {
  _id?: string;
  userId: string;
  title: string;
  username: string;
  password: string; // Encrypted
  url?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DecryptedVaultItem {
  _id?: string;
  title: string;
  username: string;
  password: string; // Decrypted
  url?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

export interface User {
  _id?: string;
  email: string;
  password: string; // Hashed
  createdAt?: Date;
}