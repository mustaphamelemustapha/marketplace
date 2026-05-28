'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, loading } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  // Free shipping over $150
  const shippingFee = subtotal > 150 || subtotal === 0 ? 0 : 15.0;
  const estimatedTax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + shippingFee + estimatedTax;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-1">
          <nav className="text-xs text-slate-450 flex items-center space-x-2 mb-2">
            <Link href="/" className="hover:text-slate-200 transition">Products</Link>
            <span>/</span>
            <span className="text-slate-300 font-medium">Shopping Cart</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Your Cart</h1>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <span className="w-10 h-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></span>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/10 border border-slate-850 border-dashed rounded-3xl space-y-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-16 h-16 text-slate-650 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-200">Your shopping cart is empty</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Looks like you haven&apos;t added anything to your cart yet. Head back to the browse page to find premium gear.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-650 hover:from-sky-400 hover:to-indigo-550 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-indigo-950/40"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="p-5 bg-slate-900/35 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:bg-slate-900/50"
                >
                  <div className="flex items-center space-x-4">
                    {/* Item Thumbnail */}
                    <div className="w-16 h-16 bg-slate-950 border border-slate-855 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.imageUrl || ''}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Text details */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                        {item.product.category}
                      </span>
                      <h3 className="font-bold text-slate-200 text-sm sm:text-base line-clamp-1 hover:text-sky-400 transition">
                        <Link href={`/products/${item.productId}`}>{item.product.title}</Link>
                      </h3>
                      <div className="text-xs text-slate-450">
                        Unit Price: ${Number(item.product.price).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls & Deletion */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-4 pl-0 sm:pl-4 border-t sm:border-t-0 border-slate-900 pt-3 sm:pt-0">
                    <div className="flex items-center space-x-2 border border-slate-850 bg-slate-950/50 p-1 rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-450 hover:text-white transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                        </svg>
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-450 hover:text-white disabled:opacity-30 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>

                    <div className="text-right flex items-center space-x-4">
                      <span className="font-bold text-slate-100 text-sm sm:text-base">
                        ${(Number(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-red-400 hover:border-red-950 transition"
                        aria-label="Remove item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-4">
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-6 shadow-xl sticky top-24">
                <h2 className="font-extrabold text-lg text-slate-100 pb-3 border-b border-slate-900">Order Summary</h2>

                <div className="space-y-3 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-200">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold text-slate-200">
                      {shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-bold text-slate-200">${estimatedTax.toFixed(2)}</span>
                  </div>
                  {shippingFee > 0 && (
                    <div className="text-[10px] text-indigo-400 bg-indigo-950/20 border border-indigo-500/20 p-2.5 rounded-lg">
                      Add ${(150 - subtotal).toFixed(2)} more to qualify for Free Shipping!
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-base font-extrabold text-white pt-4 border-t border-slate-900">
                  <span>Order Total</span>
                  <span className="text-xl font-black">${total.toFixed(2)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="block text-center w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-650 hover:from-sky-400 hover:to-indigo-550 text-white font-bold rounded-xl transition duration-200 shadow-lg shadow-indigo-950/40"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
