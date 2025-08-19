"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "../../../lib/supabaseClient";
import FoodTable from "@/components/FoodTable/Index";

interface FoodItem {
  id: number;
  name: string;
  quantity: number;
  expiry_date: string;
  user_id: string;
  created_at?: string;
}

export default function Dashboard() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    expiry_date: "",
  });

  // ✅ Fetch items for logged-in user
  useEffect(() => {
    const fetchItems = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("food_items")
        .select("*")
        .eq("user_id", user.id)
        .order("expiry_date", { ascending: true });

      if (!error && data) setItems(data);
    };

    fetchItems();
  }, []);

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add new item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("food_items")
      .insert([{ ...formData, user_id: user.id }])
      .select();

    if (!error && data) {
      setItems((prev) => [...prev, ...data]);
      setShowForm(false);
      setFormData({ name: "", quantity: "", expiry_date: "" });
    } else {
      console.error("Insert error:", error);
    }
  };


  return (
    <ProtectedRoute>
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
      <p className="text-gray-600 mb-6 text-center">
        Track your meals and get expiry reminders 🍲
      </p>

      {/* Add Item Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          {showForm ? "Close Form" : "➕ Add Item"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded-lg bg-gray-50 max-w-lg mx-auto flex flex-col gap-3"
        >
          <input
            type="text"
            name="name"
            placeholder="Enter Food Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save
          </button>
        </form>
      )}

      {/* Table Component */}
      <FoodTable items={items} setItems={setItems} />
    </ProtectedRoute>
  );
}
