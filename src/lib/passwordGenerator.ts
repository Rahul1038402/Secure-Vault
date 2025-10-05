import { PasswordGeneratorOptions } from '@/types';

const UPPERCASE = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghjkmnpqrstuvwxyz';
const NUMBERS = '23456789';
const SYMBOLS = '!@#$%^&*-_=+';

const UPPERCASE_ALL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_ALL = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS_ALL = '0123456789';

export function generatePassword(options: PasswordGeneratorOptions): string {
  let charset = '';
  let requiredChars = '';

  if (options.includeUppercase) {
    const upper = options.excludeSimilar ? UPPERCASE : UPPERCASE_ALL;
    charset += upper;
    requiredChars += upper[Math.floor(Math.random() * upper.length)];
  }

  if (options.includeLowercase) {
    const lower = options.excludeSimilar ? LOWERCASE : LOWERCASE_ALL;
    charset += lower;
    requiredChars += lower[Math.floor(Math.random() * lower.length)];
  }

  if (options.includeNumbers) {
    const nums = options.excludeSimilar ? NUMBERS : NUMBERS_ALL;
    charset += nums;
    requiredChars += nums[Math.floor(Math.random() * nums.length)];
  }

  if (options.includeSymbols) {
    charset += SYMBOLS;
    requiredChars += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  }

  if (charset === '') {
    throw new Error('At least one character type must be selected');
  }

  let password = requiredChars;
  const remainingLength = options.length - requiredChars.length;

  for (let i = 0; i < remainingLength; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

export const defaultOptions: PasswordGeneratorOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: true,
};