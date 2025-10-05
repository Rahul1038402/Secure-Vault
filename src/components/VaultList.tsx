'use client';

import { DecryptedVaultItem } from '@/types';
import VaultItem from './VaultItem';
import { FolderOpen } from 'lucide-react';

interface VaultListProps {
  items: DecryptedVaultItem[];
  onEdit: (item: DecryptedVaultItem) => void;
  onDelete: (id: string) => void;
}

export default function VaultList({ items, onEdit, onDelete }: VaultListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900/70 rounded-lg shadow transition-colors">
        <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
        <p className="text-gray-500 dark:text-gray-400">No items yet. Add your first password!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <VaultItem
          key={item._id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}