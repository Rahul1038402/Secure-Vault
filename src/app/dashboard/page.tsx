'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PasswordGenerator from '@/components/PasswordGenerator';
import VaultList from '@/components/VaultList';
import VaultForm from '@/components/VaultForm';
import SearchBar from '@/components/SearchBar';
import { DecryptedVaultItem, VaultItem } from '@/types';
import { deriveKey, encryptVaultItem, decryptVaultItem } from '@/lib/encryption';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [items, setItems] = useState<DecryptedVaultItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DecryptedVaultItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<DecryptedVaultItem | undefined>();
  const [loading, setLoading] = useState(true);
  const [encryptionKey, setEncryptionKey] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      const password = sessionStorage.getItem('userPassword');
      if (password) {
        const key = deriveKey(password, session.user.email);
        setEncryptionKey(key);
        fetchVaultItems(key);
      } else {
        router.push('/login');
      }
    }
  }, [session, router]);

  useEffect(() => {
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.url && item.url.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  const fetchVaultItems = async (key: string) => {
    try {
      const res = await fetch('/api/vault');
      const data = await res.json();

      if (res.ok) {
        const decrypted = data.items.map((item: VaultItem) =>
          decryptVaultItem(item, key)
        );
        setItems(decrypted);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (
    itemData: Omit<DecryptedVaultItem, '_id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const encrypted = encryptVaultItem(itemData, encryptionKey);

      const res = await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encrypted),
      });

      if (res.ok) {
        const data = await res.json();
        const decrypted = decryptVaultItem(data.item, encryptionKey);
        setItems([decrypted, ...items]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    }
  };

  const handleUpdateItem = async (
    itemData: Omit<DecryptedVaultItem, '_id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!editingItem?._id) return;

    try {
      const encrypted = encryptVaultItem(itemData, encryptionKey);

      const res = await fetch(`/api/vault/${editingItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encrypted),
      });

      if (res.ok) {
        const data = await res.json();
        const decrypted = decryptVaultItem(data.item, encryptionKey);
        setItems(items.map((item) => (item._id === decrypted._id ? decrypted : item)));
        setEditingItem(undefined);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/vault/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setItems(items.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleEdit = (item: DecryptedVaultItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingItem(undefined);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <p className="text-gray-900 dark:text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <div className="container mx-auto p-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <PasswordGenerator />
          </div>

          <div className="bg-white dark:bg-gray-900/70 p-6 rounded-lg shadow-md transition-colors">
            <h2 className="text-2xl mb-4">Quick Stats</h2>
            <div className="space-y-2">
              <p className="text-lg">Total Items: <span className="font-bold">{items.length}</span></p>
              <button
                onClick={() => setShowForm(true)}
                className="w-full px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Item
              </button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="mb-6">
            <VaultForm
              item={editingItem}
              onSubmit={editingItem ? handleUpdateItem : handleAddItem}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        <div className="bg-white dark:bg-gray-900/70 p-6 rounded-lg shadow-md transition-colors">
          <h2 className="text-2xl mb-4">Your Vault</h2>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <VaultList
            items={filteredItems}
            onEdit={handleEdit}
            onDelete={handleDeleteItem}
          />
        </div>
      </div>
    </div>
  );
}