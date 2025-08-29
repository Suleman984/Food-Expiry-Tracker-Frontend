"use client";

import { useState, useEffect } from "react";
import {
  FoodItem, inputClasses,
  formatDate,
  getStatus,
  getStatusClasses,
  deleteItem,
  updateItem,
  buttonStyles,
} from "../../../utils/FoodTable";

interface FoodTableProps {
  items: FoodItem[];
  setItems: React.Dispatch<React.SetStateAction<FoodItem[]>>;
}

function Loader() {
  return (
    <div className="flex justify-center items-center h-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-indigo-600 dark:border-indigo-400"></div>
      <span className="ml-4 text-lg text-gray-600 dark:text-gray-300 animate-pulse">Loading your pantry...</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700">
      <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">Your Food Inventory is Empty! 🌱</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">Let&apos;s get started by adding your first item!</p>
      <div className="mt-4 flex justify-center items-center">
        <span className="inline-block animate-bounce text-yellow-500 text-2xl">👇</span>
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Tap "Add Item" to start tracking.</span>
      </div>
    </div>
  );
}

export default function FoodTable({ items, setItems }: FoodTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<FoodItem>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items && items.length >= 0) setLoading(false);
  }, [items]);

  const handleEdit = (item: FoodItem) => {
    setEditingId(item.id);
    setEditedItem({ name: item.name, quantity: item.quantity, expiry_date: item.expiry_date });
  };

  const handleSave = async (id: number) => {
    setLoading(true);
    const result = await updateItem(id, editedItem);

    if (result.success && result.data) {
      setItems(prev => prev.map(item => item.id === id ? { ...item, ...result.data } : item));
      setEditingId(null);
      setEditedItem({});
    } else {
      alert(`Failed to update item: ${result.error}`);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedItem({});
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    const result = await deleteItem(id);

    if (result.success) {
      setItems(prev => prev.filter(item => item.id !== id));
    } else {
      alert(`Failed to delete item: ${result.error}`);
    }
    setLoading(false);
  };

  if (loading) return <Loader />;
  if (items.length === 0) return <EmptyState />;

  return (
    <div className="w-full">
      {/* Desktop Header */}
      <div className="hidden lg:block bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white rounded-t-xl p-4">
        <div className="grid grid-cols-6 gap-4 text-sm font-semibold">
          <div>Name</div>
          <div>Quantity</div>
          <div>Added At</div>
          <div>Expiry Date</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl lg:rounded-t-none shadow-2xl overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700 space-y-4 lg:space-y-0 p-4 lg:p-0">
          {items.map((item) => {
            const isEditing = editingId === item.id;
            const status = getStatus(item.expiry_date);

            return (
              <div key={item.id} className="shopItem lg:hover:bg-gray-50 dark:lg:hover:bg-gray-700 transition-all duration-200 lg:p-4 animate-slide-up">
                {/* Mobile Card Layout */}
                <div className="lg:hidden space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-3">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedItem.name || ''}
                          onChange={e => setEditedItem(prev => ({ ...prev, name: e.target.value }))}
                          className={`${inputClasses} shopName`}
                        />
                      ) : (
                        <span className="shopName text-base font-semibold text-gray-800 dark:text-gray-200">{item.name}</span>
                      )}
                    </div>
                    <span className={`shopAvailability px-2 py-1 rounded-full text-xs ${getStatusClasses(status)}`}>
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Quantity</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedItem.quantity || ''}
                          onChange={e => setEditedItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                          className={inputClasses}
                        />
                      ) : (
                        <span className="text-sm text-gray-800 dark:text-gray-200">{item.quantity}</span>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Added</label>
                      <span className="text-sm text-gray-800 dark:text-gray-200">{formatDate(item.created_at)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Expiry</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedItem.expiry_date || ''}
                        onChange={e => setEditedItem(prev => ({ ...prev, expiry_date: e.target.value }))}
                        className={inputClasses}
                      />
                    ) : (
                      <span className="text-sm text-gray-800 dark:text-gray-200">{formatDate(item.expiry_date)}</span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    {isEditing ? (
                      <>
                        <button onClick={() => handleSave(item.id)} className={`flex-1 px-3 py-2 text-white rounded-lg text-sm transition-all duration-200 ${buttonStyles.save}`}>
                          Save
                        </button>
                        <button onClick={handleCancel} className={`flex-1 px-3 py-2 text-white rounded-lg text-sm transition-all duration-200 ${buttonStyles.cancel}`}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(item)} className={`flex-1 px-3 py-2 text-white rounded-lg text-sm transition-all duration-200 ${buttonStyles.edit}`}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)} className={`flex-1 px-3 py-2 text-white rounded-lg text-sm transition-all duration-200 ${buttonStyles.delete}`}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Desktop Grid Layout */}
                <div className="hidden lg:grid grid-cols-6 gap-4 items-center">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedItem.name || ''}
                        onChange={e => setEditedItem(prev => ({ ...prev, name: e.target.value }))}
                        className={`${inputClasses} shopName`}
                      />
                    ) : (
                      <span className="shopName text-sm text-gray-800 dark:text-gray-200">{item.name}</span>
                    )}
                  </div>

                  <div>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedItem.quantity || ''}
                        onChange={e => setEditedItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                        className={inputClasses}
                      />
                    ) : (
                      <span className="text-sm text-gray-800 dark:text-gray-200">{item.quantity}</span>
                    )}
                  </div>

                  <div>
                    <span className="text-sm text-gray-800 dark:text-gray-200">{formatDate(item.created_at)}</span>
                  </div>

                  <div>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedItem.expiry_date || ''}
                        onChange={e => setEditedItem(prev => ({ ...prev, expiry_date: e.target.value }))}
                        className={inputClasses}
                      />
                    ) : (
                      <span className="text-sm text-gray-800 dark:text-gray-200">{formatDate(item.expiry_date)}</span>
                    )}
                  </div>

                  <div>
                    <span className={`shopAvailability px-2 py-1 rounded-full text-xs ${getStatusClasses(status)}`}>
                      {status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button onClick={() => handleSave(item.id)} className={`px-3 py-1 text-white rounded-lg text-sm transition-all duration-200 ${buttonStyles.save}`}>
                          Save
                        </button>
                        <button onClick={handleCancel} className={`px-3 py-1 text-white rounded-lg text-sm transition-all duration-200 ${buttonStyles.cancel}`}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(item)} className={`px-3 py-1 text-white rounded-lg text-sm transition-all duration-200 ${buttonStyles.edit}`}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)} className={`px-3 py-1 text-white rounded-lg text-sm transition-all duration-200 ${buttonStyles.delete}`}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}