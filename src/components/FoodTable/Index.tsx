"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

interface FoodItem {
  id: number;
  name: string;
  quantity: number;
  expiry_date: string;
  user_id: string;
  created_at?: string;
}

interface FoodTableProps {
  items: FoodItem[];
  setItems: React.Dispatch<React.SetStateAction<FoodItem[]>>;
}

// Loader component
function Loader() {
  return (
    <div className="flex justify-center items-center h-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-indigo-600"></div>
      <span className="ml-4 text-lg text-gray-600 animate-pulse">Loading your pantry...</span>
    </div>
  );
}


function EditableField<T>({
  type,
  value,
  onChange,
  className,
}: {
  type: "text" | "number" | "date";
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={String(value)}
      onChange={(e) => onChange(e.target.value as T)}
      className={`border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm ${className}`}
    />
  );
}


function EmptyState({ message, subMessage }: { message: string; subMessage: string }) {
  return (
    <div className="text-center p-6 bg-white rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold text-indigo-600 mb-2">{message}</h2>
      <p className="text-lg text-gray-600 animate-pulse">{subMessage}</p>
      <div className="mt-4 flex justify-center items-center">
        <span className="inline-block animate-bounce text-yellow-500 text-2xl">👇</span>
        <span className="ml-2 text-sm text-gray-500 transition-opacity duration-500 opacity-100 hover:opacity-75">
          Tap &quot;Add Item&quot; to start tracking.
        </span>
      </div>
    </div>
  );
}


function TableRow({
  item,
  editingId,
  editedItem,
  setEditedItem,
  handleUpdate,
  handleDelete,
  setEditingId,
  formatDate,
  getStatus,
}: {
  item: FoodItem;
  editingId: number | null;
  editedItem: Partial<FoodItem> | null;
  setEditedItem: React.Dispatch<React.SetStateAction<Partial<FoodItem> | null>>;
  handleUpdate: (id: number) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  formatDate: (dateStr: string | undefined) => string;
  getStatus: (expiry: string) => string;
}) {
  return (
    <tr className="shopItem border-b border-gray-200 hover:bg-gray-50 transition-all duration-200">
      <td className="p-3 text-gray-800 text-sm">
        {editingId === item.id ? (
          <EditableField
            type="text"
            value={editedItem?.name || item.name}
            onChange={(value) => setEditedItem({ ...editedItem, name: value })}
            className="shopName"
          />
        ) : (
          <span className="shopName">{item.name}</span>
        )}
      </td>
      <td className="p-3 text-gray-800 text-sm">
        {editingId === item.id ? (
          <EditableField
            type="number"
            value={editedItem?.quantity || item.quantity}
            onChange={(value) => setEditedItem({ ...editedItem, quantity: Number(value) || 0 })}
          />
        ) : (
          item.quantity
        )}
      </td>
      <td className="p-3 text-gray-800 text-sm">{formatDate(item.created_at)}</td>
      <td className="p-3 text-gray-800 text-sm">
        {editingId === item.id ? (
          <EditableField
            type="date"
            value={editedItem?.expiry_date || item.expiry_date}
            onChange={(value) => setEditedItem({ ...editedItem, expiry_date: value })}
          />
        ) : (
          formatDate(item.expiry_date)
        )}
      </td>
      <td className="p-3 text-gray-800">
        <span
          className={`shopAvailability px-2 py-1 rounded-full text-xs ${
            getStatus(item.expiry_date).includes("Expired")
              ? "bg-red-100 text-red-600"
              : getStatus(item.expiry_date).includes("Soon")
              ? "bg-yellow-100 text-yellow-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {getStatus(item.expiry_date)}
        </span>
      </td>
      <td className="p-3 space-x-2">
        {editingId === item.id ? (
          <>
            <button
              onClick={() => handleUpdate(item.id)}
              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 text-sm"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setEditedItem(null);
              }}
              className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setEditingId(item.id);
                setEditedItem({ id: item.id, name: item.name, quantity: item.quantity, expiry_date: item.expiry_date });
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-sm"
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}


function FoodCard({
  item,
  editingId,
  editedItem,
  setEditedItem,
  handleUpdate,
  handleDelete,
  setEditingId,
  formatDate,
  getStatus,
}: {
  item: FoodItem;
  editingId: number | null;
  editedItem: Partial<FoodItem> | null;
  setEditedItem: React.Dispatch<React.SetStateAction<Partial<FoodItem> | null>>;
  handleUpdate: (id: number) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  formatDate: (dateStr: string | undefined) => string;
  getStatus: (expiry: string) => string;
}) {
  return (
    <div className="shopItem bg-white rounded-xl shadow-lg p-4 transition-all duration-200 hover:shadow-xl animate-slide-up">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-base text-gray-800">
            {editingId === item.id ? (
              <EditableField
                type="text"
                value={editedItem?.name || item.name}
                onChange={(value) => setEditedItem({ ...editedItem, name: value })}
                className="shopName"
              />
            ) : (
              <span className="shopName">{item.name}</span>
            )}
          </h3>
          <span
            className={`shopAvailability px-2 py-1 rounded-full text-xs ${
              getStatus(item.expiry_date).includes("Expired")
                ? "bg-red-100 text-red-600"
                : getStatus(item.expiry_date).includes("Soon")
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {getStatus(item.expiry_date)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-500">Quantity</p>
            {editingId === item.id ? (
              <EditableField
                type="number"
                value={editedItem?.quantity || item.quantity}
                onChange={(value) => setEditedItem({ ...editedItem, quantity: Number(value) || 0 })}
              />
            ) : (
              <p className="text-gray-800 text-sm">{item.quantity}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500">Added At</p>
            <p className="text-gray-800 text-sm">{formatDate(item.created_at)}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500">Expiry Date</p>
          {editingId === item.id ? (
            <EditableField
              type="date"
              value={editedItem?.expiry_date || item.expiry_date}
              onChange={(value) => setEditedItem({ ...editedItem, expiry_date: value })}
              className="mt-1"
            />
          ) : (
            <p className="text-gray-800 text-sm">{formatDate(item.expiry_date)}</p>
          )}
        </div>
        <div className="flex space-x-2 pt-2">
          {editingId === item.id ? (
            <>
              <button
                onClick={() => handleUpdate(item.id)}
                className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditedItem(null);
                }}
                className="flex-1 px-3 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditingId(item.id);
                  setEditedItem({ id: item.id, name: item.name, quantity: item.quantity, expiry_date: item.expiry_date });
                }}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-sm"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Desktop table view
function DesktopTableView({
  items,
  editingId,
  editedItem,
  setEditedItem,
  handleUpdate,
  handleDelete,
  setEditingId,
  formatDate,
  getStatus,
}: {
  items: FoodItem[];
  editingId: number | null;
  editedItem: Partial<FoodItem> | null;
  setEditedItem: React.Dispatch<React.SetStateAction<Partial<FoodItem> | null>>;
  handleUpdate: (id: number) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  formatDate: (dateStr: string | undefined) => string;
  getStatus: (expiry: string) => string;
}) {
  return (
    <div className="hidden lg:block bg-white rounded-xl shadow-2xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <th className="p-3 text-left font-semibold text-sm">Name</th>
            <th className="p-3 text-left font-semibold text-sm">Quantity</th>
            <th className="p-3 text-left font-semibold text-sm">Added At</th>
            <th className="p-3 text-left font-semibold text-sm">Expiry Date</th>
            <th className="p-3 text-left font-semibold text-sm">Status</th>
            <th className="p-3 text-left font-semibold text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-6 text-gray-500">
                <EmptyState
                  message="Your Food Inventory is Empty! 🌱"
                  subMessage="Let’s get started by adding your first item!"
                />
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                editingId={editingId}
                editedItem={editedItem}
                setEditedItem={setEditedItem}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
                setEditingId={setEditingId}
                formatDate={formatDate}
                getStatus={getStatus}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Mobile card view
function MobileCardView({
  items,
  editingId,
  editedItem,
  setEditedItem,
  handleUpdate,
  handleDelete,
  setEditingId,
  formatDate,
  getStatus,
}: {
  items: FoodItem[];
  editingId: number | null;
  editedItem: Partial<FoodItem> | null;
  setEditedItem: React.Dispatch<React.SetStateAction<Partial<FoodItem> | null>>;
  handleUpdate: (id: number) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  formatDate: (dateStr: string | undefined) => string;
  getStatus: (expiry: string) => string;
}) {
  return (
    <div className="lg:hidden space-y-4">
      {items.length === 0 ? (
        <EmptyState
          message="Your Pantry is Waiting! 🌿"
          subMessage="Time to add your first delicious item!"
        />
      ) : (
        items.map((item) => (
          <FoodCard
            key={item.id}
            item={item}
            editingId={editingId}
            editedItem={editedItem}
            setEditedItem={setEditedItem}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            setEditingId={setEditingId}
            formatDate={formatDate}
            getStatus={getStatus}
          />
        ))
      )}
    </div>
  );
}

export default function FoodTable({ items, setItems }: FoodTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<FoodItem> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate loading state based on items prop
  useEffect(() => {
    if (items && items.length >= 0) {
      setLoading(false);
    }
  }, [items]);

  // Delete item from Supabase and update state
  const handleDelete = async (id: number) => {
    setLoading(true);
    const { error } = await supabase.from("food_items").delete().eq("id", id);
    if (!error) {
      setItems(items.filter((item) => item.id !== id));
    } else {
      console.error("Delete error:", error);
      alert("Failed to delete item: " + error.message);
    }
    setLoading(false);
  };

  // Update item in Supabase and refresh state
  const handleUpdate = async (id: number) => {
    if (!editedItem || !editedItem.name || !editedItem.quantity || !editedItem.expiry_date) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      alert("You must be logged in to update items.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("food_items")
      .update({
        name: editedItem.name,
        quantity: editedItem.quantity,
        expiry_date: editedItem.expiry_date,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Update error:", error.message);
      alert("Failed to update item: " + error.message);
      setLoading(false);
      return;
    }

    if (data && data.length > 0) {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...editedItem } : item)));
      setEditingId(null);
      setEditedItem(null);
    } else {
      const { data: refreshedData, error: refreshError } = await supabase
        .from("food_items")
        .select("*")
        .eq("id", id)
        .single();

      if (refreshError || !refreshedData) {
        console.error("Refresh error:", refreshError?.message || "No data found");
        alert("Failed to update or refresh data. Check console for details.");
      } else {
        setItems((prev) => prev.map((item) => (item.id === id ? refreshedData : item)));
        setEditingId(null);
        setEditedItem(null);
      }
    }
    setLoading(false);
  };

  // Format date to show only date portion
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0]; // Extracts "YYYY-MM-DD"
  };

  // Determine expiry status
  const getStatus = (expiry: string) => {
    const today = new Date();
    const exp = new Date(expiry);
    if (exp < today) return "Expired ❌";
    if ((exp.getTime() - today.getTime()) / (1000 * 3600 * 24) <= 3) return "Expiring Soon ⚠️";
    return "Fresh ✅";
  };

  return (
    <div className="w-full">
      {loading ? (
        <Loader />
      ) : (
        <>
          <DesktopTableView
            items={items}
            editingId={editingId}
            editedItem={editedItem}
            setEditedItem={setEditedItem}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            setEditingId={setEditingId}
            formatDate={formatDate}
            getStatus={getStatus}
          />
          <MobileCardView
            items={items}
            editingId={editingId}
            editedItem={editedItem}
            setEditedItem={setEditedItem}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            setEditingId={setEditingId}
            formatDate={formatDate}
            getStatus={getStatus}
          />
        </>
      )}
    </div>
  );
}