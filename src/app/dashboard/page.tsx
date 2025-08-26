"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "../../../lib/supabaseClient";
import FoodTable from "@/components/FoodTable/Index";
import dynamic from "next/dynamic";

// barcode scanner ko dynamically load karna (ssr issue avoid karega)
const BarcodeScannerComponent = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
);

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
  const [showScanner, setShowScanner] = useState(false);

  // jab barcode scan hoga to product ka code milega
  const handleScan = async (result: string | null) => {
    console.log("Scanned result:", result);
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${result}.json`
    );
    const product = await res.json();
    console.log(product);
    if(product.status === 0){
      alert("Product data not available.");
      return;
    }
 
  };

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    expiry_date: "",
  });

  // ✅ Fetch items for logged-in user
  useEffect(() => {
    const fetchItems = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-3 animate-fade-in">
              Food Inventory Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Track your meals and stay ahead of expiry dates 🍎
            </p>
          </div>

          {/* Scanner Button */}
          {/* <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowScanner(!showScanner)}
              className="px-6 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              {showScanner ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Close Scanner
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h4l2-2h2l2 2h4a2 2 0 012 2v6a2 2 0 01-2 2h-4l-2 2h-2l-2-2H5a2 2 0 01-2-2V9z"
                    />
                  </svg>
                  Scan Barcode
                </>
              )}
            </button>
          </div> */}

          {/* Scanner Component */}
          {/* {showScanner && (
            <div className="flex justify-center my-6">
              <div className="p-4 bg-white rounded-xl shadow-2xl">
                <BarcodeScannerComponent
                  width={300}
                  height={300}
                  onUpdate={(err, result) => {
                    if (result) handleScan(result.getText());
                  }}
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Align the barcode within the frame
                </p>
              </div>
            </div>
          )} */}

          {/* Add Item Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              {showForm ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Close Form
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Item
                </>
              )}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-8 p-6 bg-white rounded-xl shadow-2xl max-w-lg mx-auto flex flex-col gap-4 transform transition-all duration-500 animate-slide-up"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Food Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter food name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Save Item
              </button>
            </form>
          )}

          {/* Table Component */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <FoodTable items={items} setItems={setItems} />
          </div>
        </div>
      </div>

      {/* Tailwind Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </ProtectedRoute>
  );
}