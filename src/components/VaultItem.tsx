'use client';

import { useState } from 'react';
import { DecryptedVaultItem } from '@/types';
import { Eye, EyeOff, Copy, Edit2, Trash2, Check, AlertCircle } from 'lucide-react';

interface VaultItemProps {
  item: DecryptedVaultItem;
  onEdit: (item: DecryptedVaultItem) => void;
  onDelete: (id: string) => void;
}

export default function VaultItem({ item, onEdit, onDelete }: VaultItemProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const handleCopy = async () => {
    // Copy password
    await navigator.clipboard.writeText(item.password);
    setCopied(true);
    setTimeLeft(15);

    // timer
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdown);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    // Clear clipboard after 15 seconds
    setTimeout(async () => {
      try {
        // if clipboard still contains this password
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText === item.password) {
          // replace by empty string
          await navigator.clipboard.writeText('');
          console.log('Clipboard cleared for security');
        }
      } catch (error) {
        console.log('Auto-clear completed');
      }
      setCopied(false);
      setTimeLeft(null);
    }, 15000);
  };

  const handleDelete = () => {
    if (confirm(`Delete "${item.title}"?`)) {
      onDelete(item._id!);
    }
  };

  return (
    <>
    <div className="bg-white dark:bg-gray-900/70 p-4 rounded-lg shadow border dark:border-gray-700 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{item.username}</p>
          {item.url && (
            
            <a  href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              {item.url}
            </a>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 transition-colors"
            aria-label="Edit"
            title="Edit item"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 transition-colors"
            aria-label="Delete"
            title="Delete item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 items-center mb-2">
        <input
          type={showPassword ? 'text' : 'password'}
          value={item.password}
          readOnly
          className="flex-1 px-3 py-1 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-sm font-mono text-gray-900 dark:text-white focus:outline-none"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
        <button
          onClick={handleCopy}
          disabled={copied}
          className={`px-3 py-1 rounded transition-colors ${
            copied
              ? 'bg-green-600 dark:bg-green-500 text-white cursor-not-allowed'
              : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
          }`}
          aria-label="Copy password"
          title={copied ? `Clearing in ${timeLeft}s` : 'Copy password (auto-clears in 15s)'}
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>

      {/* Auto-clear warning message */}
      {copied && timeLeft !== null && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded text-xs text-orange-700 dark:text-orange-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            Password copied! Auto-clearing in <span className="font-bold">{timeLeft}s</span> for security.
          </span>
        </div>
      )}

      {item.notes && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span className="font-medium">Notes:</span> {item.notes}
        </p>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        Created: {item.createdAt && new Date(item.createdAt).toLocaleDateString()}
      </p>
    </div>
    </>
  );
}