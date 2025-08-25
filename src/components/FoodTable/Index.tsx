"use client";

import { useState } from "react";
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

export default function FoodTable({ items, setItems }: FoodTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState<string>("");

  // ✅ Delete Item
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("food_items").delete().eq("id", id);
    if (!error) {
      setItems(items.filter((item) => item.id !== id));
    } else {
      console.error("Delete error:", error);
    }
  };

  // ✅ Update Expiry Date
  const handleUpdate = async (id: number) => {
    if (!newDate) {
      alert("Please select a new expiry date.");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      alert("You must be logged in to update items.");
      return;
    }

    console.log("Attempting update for ID:", id, "with new date:", newDate, "by user:", sessionData.session.user.id);

    const { data, error } = await supabase
      .from("food_items")
      .update({ expiry_date: newDate })
      .eq("id", id)
      .select();

    console.log("Update response:", { data, error });

    if (error) {
      console.error("Update error:", error.message);
      alert("Failed to update expiry date: " + error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log("Update successful, updating state with:", data[0]);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, expiry_date: newDate } : item
        )
      );
      setEditingId(null);
      setNewDate("");
    } else {
      console.log("No data returned from update, attempting refetch...");
      const { data: refreshedData, error: refreshError } = await supabase
        .from("food_items")
        .select("*")
        .eq("id", id)
        .single();

      console.log("Refetch response:", { refreshedData, refreshError });

      if (refreshError || !refreshedData) {
        console.error("Refresh error:", refreshError?.message || "No data found");
        alert("Failed to update or refresh data. Check console for details (likely RLS issue).");
      } else {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? refreshedData : item))
        );
        setEditingId(null);
        setNewDate("");
      }
    }
  };

  // Function to format date to show only date portion
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0]; // Extracts "YYYY-MM-DD"
  };

  // ✅ Expiry Status
  const getStatus = (expiry: string) => {
    const today = new Date();
    const exp = new Date(expiry);
    if (exp < today) return "Expired ❌";
    if ((exp.getTime() - today.getTime()) / (1000 * 3600 * 24) <= 3)
      return "Expiring Soon ⚠️";
    return "Fresh ✅";
  };

  return (
    <div className="w-full">
      {/* Desktop and Large Tablet Table View (≥ 1024px) */}
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
                <td colSpan={6} className="text-center p-6 text-gray-500 text-base">
                  No items added yet.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="p-3 text-gray-800 text-sm">{item.name}</td>
                  <td className="p-3 text-gray-800 text-sm">{item.quantity}</td>
                  <td className="p-3 text-gray-800 text-sm">{formatDate(item.created_at)}</td>
                  <td className="p-3 text-gray-800 text-sm">
                    {editingId === item.id ? (
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm"
                      />
                    ) : (
                      formatDate(item.expiry_date)
                    )}
                  </td>
                  <td className="p-3 text-gray-800">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
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
                            setNewDate("");
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
                            setNewDate(item.expiry_date);
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile and Small Tablet Card View (< 1024px) */}
      <div className="lg:hidden space-y-4">
        {items.length === 0 ? (
          <div className="text-center p-6 bg-white rounded-xl shadow-lg text-gray-500 text-base">
            No items added yet.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg p-4 transition-all duration-200 hover:shadow-xl animate-slide-up"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-base text-gray-800">{item.name}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
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
                    <p className="text-gray-800 text-sm">{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Added At</p>
                    <p className="text-gray-800 text-sm">{formatDate(item.created_at)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expiry Date</p>
                  {editingId === item.id ? (
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full mt-1 text-sm"
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
                          setNewDate("");
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
                          setNewDate(item.expiry_date);
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
          ))
        )}
      </div>

      {/* Tailwind Animation Styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}