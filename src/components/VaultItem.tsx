'use client';

import { useState } from 'react';
import { DecryptedVaultItem } from '@/types';
import { Eye, EyeOff, Copy, Edit2, Trash2, Check } from 'lucide-react';

interface VaultItemProps {
  item: DecryptedVaultItem;
  onEdit: (item: DecryptedVaultItem) => void;
  onDelete: (id: string) => void;
}

export default function VaultItem({ item, onEdit, onDelete }: VaultItemProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(item.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 15000);
  };

  const handleDelete = () => {
    if (confirm(`Delete "${item.title}"?`)) {
      onDelete(item._id!);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900/70 p-4 rounded-lg shadow border dark:border-gray-700 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{item.username}</p>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {item.url}
            </a>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1"
            aria-label="Edit"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
            aria-label="Delete"
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
          className="flex-1 px-3 py-1 border dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-sm font-mono text-gray-900 dark:text-white"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          aria-label="Toggle password visibility"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
        <button
          onClick={handleCopy}
          className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          aria-label="Copy password"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>

      {item.notes && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span className="font-medium">Notes:</span> {item.notes}
        </p>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        {item.createdAt && new Date(item.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}