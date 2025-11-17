"use client";

import { Search, ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-amber-400">🍷 Wine Store</div>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="hidden md:flex space-x-8">
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Wines
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Categories
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for wines..."
              className="w-full px-4 py-2 pl-10 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
          </div>
        </div>

        {/* Cart and Auth */}
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 hover:text-amber-400 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            <span className="bg-amber-400 text-black rounded-full px-2 py-1 text-xs">
              0
            </span>
          </button>
          {/* Login/Sign Up - Placeholder */}
          <div className="flex items-center space-x-2">
            <button className="text-white hover:text-amber-400 transition-colors text-sm font-medium">
              Login
            </button>
            <span className="text-white">/</span>
            <button className="text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium">
              Sign Up
            </button>
          </div>
          {/* If logged in, show avatar */}
          {/* <div className="w-8 h-8 rounded-full bg-gray-400 overflow-hidden">
            <img src="https://via.placeholder.com/32x32" alt="Avatar" className="w-full h-full object-cover" />
          </div> */}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden">
        <ul className="flex justify-center space-x-4 py-2">
          <li>
            <a
              href="#"
              className="hover:text-amber-400 transition-colors text-sm"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-amber-400 transition-colors text-sm"
            >
              Wines
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-amber-400 transition-colors text-sm"
            >
              Categories
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-amber-400 transition-colors text-sm"
            >
              About
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
