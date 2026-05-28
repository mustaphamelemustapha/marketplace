'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-white">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-sm font-black shadow-lg">V</span>
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">VibeMarket</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Dashboard Link for Sellers */}
            {user && (user.role === 'SELLER' || user.role === 'ADMIN') && (
              <Link
                href="/seller"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition"
              >
                Seller Dashboard
              </Link>
            )}

            {/* Cart (visible to all but Admin/Seller can still use it or focus on Dashboards) */}
            {(!user || user.role === 'BUYER') && (
              <Link
                href="/cart"
                className="relative p-2 text-slate-350 hover:text-white transition"
                aria-label="Shopping Cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-slate-950 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Order History */}
            {user && (
              <Link
                href="/orders"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition"
              >
                Orders
              </Link>
            )}

            {/* User Session Handler */}
            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-200">
                    {user.firstName || 'User'}
                  </span>
                  <span className="text-[10px] text-slate-450 uppercase tracking-wider font-semibold">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-750 text-slate-350 hover:text-white text-xs font-medium rounded-lg transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2">
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white px-3 py-1.5 text-sm font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition shadow-md shadow-indigo-950/40"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
