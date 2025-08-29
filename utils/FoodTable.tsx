// lib/foodTableUtils.ts
import { supabase } from "../lib/supabaseClient";

export interface FoodItem {
  id: number;
  name: string;
  quantity: number;
  expiry_date: string;
  user_id: string;
  created_at?: string;
}

// Format date to show only date portion
export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
};

// Determine expiry status
export const getStatus = (expiry: string): string => {
  const today = new Date();
  const exp = new Date(expiry);
  if (exp < today) return "Expired ❌";
  if ((exp.getTime() - today.getTime()) / (1000 * 3600 * 24) <= 3) return "Expiring Soon ⚠️";
  return "Fresh ✅";
};

// Get status styling classes
export const getStatusClasses = (status: string): string => {
  if (status.includes("Expired")) {
    return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300";
  }
  if (status.includes("Soon")) {
    return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-300";
  }
  return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-300";
};

// Delete item from Supabase
export const deleteItem = async (id: number): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase.from("food_items").delete().eq("id", id);
  if (error) {
    console.error("Delete error:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
};

// Update item in Supabase
export const updateItem = async (
  id: number,
  updates: Partial<FoodItem>
): Promise<{ success: boolean; data?: FoodItem; error?: string }> => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData?.session) {
    return { success: false, error: "You must be logged in to update items." };
  }

  if (!updates.name || !updates.quantity || !updates.expiry_date) {
    return { success: false, error: "Please fill in all fields." };
  }

  const { data, error } = await supabase
    .from("food_items")
    .update({
      name: updates.name,
      quantity: updates.quantity,
      expiry_date: updates.expiry_date,
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Update error:", error.message);
    return { success: false, error: error.message };
  }

  if (data && data.length > 0) {
    return { success: true, data: data[0] };
  }

  // Fallback: fetch updated data
  const { data: refreshedData, error: refreshError } = await supabase
    .from("food_items")
    .select("*")
    .eq("id", id)
    .single();

  if (refreshError || !refreshedData) {
    console.error("Refresh error:", refreshError?.message || "No data found");
    return { success: false, error: "Failed to update or refresh data." };
  }

  return { success: true, data: refreshedData };
};

// Base input styles
export const inputClasses = `
  border border-gray-300 dark:border-gray-600 p-2 rounded-lg 
  bg-white dark:bg-gray-700 
  text-gray-900 dark:text-white 
  placeholder-gray-500 dark:placeholder-gray-400
  focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent
  w-full text-sm transition-colors duration-200
`.trim();

// Button style variants
export const buttonStyles = {
  save: "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
  cancel: "bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700",
  edit: "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
  delete: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
} as const;