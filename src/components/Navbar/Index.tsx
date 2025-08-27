"use client";
import Link from "next/link";
import { AuthButton } from "../AuthButton";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 max-md:flex max-md:flex-col max-md:items-start flex justify-between items-center shadow-lg">
      <div>
        <Link href="/" className="text-xl font-bold">
        🍎 Food Tracker
      </Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link href="/dashboard">Dashboard</Link>
        <AuthButton />
      </div>
    </nav>
  );
}
