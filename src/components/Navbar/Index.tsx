"use client";
import Link from "next/link";
import { AuthButton } from "../AuthButton";

export default function Navbar() {
  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        🍎 Food Tracker
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/dashboard">Dashboard</Link>
        <AuthButton />
      </div>
    </nav>
  );
}
