'use client';

import { useState } from 'react';
import { generatePassword, defaultOptions } from '@/lib/passwordGenerator';
import { PasswordGeneratorOptions } from '@/types';
import { Copy, Check, RefreshCw } from 'lucide-react';

interface PasswordGeneratorProps {
  onUsePassword?: (password: string) => void;
}

export default function PasswordGenerator({
  onUsePassword,
}: PasswordGeneratorProps) {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState<PasswordGeneratorOptions>(defaultOptions);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    try {
      const newPassword = generatePassword(options);
      setPassword(newPassword);
      setCopied(false);
    } catch (error) {
      alert('Please select at least one character type');
    }
  };

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUse = () => {
    if (password && onUsePassword) {
      onUsePassword(password);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900/70 p-6 rounded-lg shadow-md text-gray-900 dark:text-white transition-colors">
      <h2 className="text-2xl mb-4">Password Generator</h2>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={password}
            readOnly
            placeholder="Generate a password"
            className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 font-mono text-gray-900 dark:text-white"
          />
          <button
            onClick={handleCopy}
            disabled={!password}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Length: {options.length}
        </label>
        <input
          type="range"
          min="8"
          max="32"
          value={options.length}
          onChange={(e) =>
            setOptions({ ...options, length: parseInt(e.target.value) })
          }
          className="w-full"
        />
      </div>

      <div className="space-y-2 mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeUppercase}
            onChange={(e) =>
              setOptions({ ...options, includeUppercase: e.target.checked })
            }
            className="mr-2"
          />
          <span>Uppercase (A-Z)</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeLowercase}
            onChange={(e) =>
              setOptions({ ...options, includeLowercase: e.target.checked })
            }
            className="mr-2"
          />
          <span>Lowercase (a-z)</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeNumbers}
            onChange={(e) =>
              setOptions({ ...options, includeNumbers: e.target.checked })
            }
            className="mr-2"
          />
          <span>Numbers (0-9)</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeSymbols}
            onChange={(e) =>
              setOptions({ ...options, includeSymbols: e.target.checked })
            }
            className="mr-2"
          />
          <span>Symbols (!@#$%^&*)</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.excludeSimilar}
            onChange={(e) =>
              setOptions({ ...options, excludeSimilar: e.target.checked })
            }
            className="mr-2"
          />
          <span>Exclude similar (I, l, 1, O, 0)</span>
        </label>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          className="flex-1 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Generate Password
        </button>
        {onUsePassword && (
          <button
            onClick={handleUse}
            disabled={!password}
            className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors"
          >
            Use This
          </button>
        )}
      </div>
    </div>
  );
}