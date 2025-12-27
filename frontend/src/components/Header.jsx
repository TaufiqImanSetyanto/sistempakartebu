import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-[var(--primary)] text-white py-4 px-6 flex justify-between items-center shadow-md">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative">
          <div className="w-4 h-4 border border-white transform group-hover:rotate-45 transition-transform duration-500 ease-out"></div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">SIPATE</h1>
      </Link>

      <Link to="/admin/login" className="bg-white text-[var(--primary)] font-medium px-4 py-1.5 rounded-md hover:bg-gray-200 transition">
        Login Admin
      </Link>
    </header>
  );
}
