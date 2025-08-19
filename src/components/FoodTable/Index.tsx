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

  // ✅ Update Expiry Date (with added logging and auth check)
  const handleUpdate = async (id: number) => {
    if (!newDate) {
      alert("Please select a new expiry date.");
      return;
    }

    // Check if user is authenticated
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
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Name</th>
          <th className="border p-2">Quantity</th>
          <th className="border p-2">Added At</th>
          <th className="border p-2">Expiry Date</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center p-4 text-gray-500">
              No items added yet.
            </td>
          </tr>
        ) : (
          items.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">{formatDate(item.created_at)}</td>
              <td className="border p-2">
                {editingId === item.id ? (
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="border p-1 rounded"
                  />
                ) : (
                  item.expiry_date
                )}
              </td>
              <td className="border p-2">{getStatus(item.expiry_date)}</td>
              <td className="border p-2 space-x-2">
                {editingId === item.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(item.id)}
                      className="px-2 py-1 bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setNewDate("");
                      }}
                      className="px-2 py-1 bg-gray-500 text-white rounded"
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
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded"
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
  );
}