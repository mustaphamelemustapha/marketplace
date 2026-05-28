'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { MockOrder } from '@/lib/mock-db';

function BuyerOrdersList() {
  const { user } = useAuth();
  const { orders, loading } = useOrders();
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get('success') === 'true';

  // Filter orders for current logged-in buyer
  const buyerOrders = orders.filter((o) => o.buyerId === user?.id);

  // Status badge styling helper
  const getStatusStyles = (status: MockOrder['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-950/50 border border-amber-500/30 text-amber-400';
      case 'PAID':
        return 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-400';
      case 'PROCESSING':
        return 'bg-sky-950/50 border border-sky-500/30 text-sky-400';
      case 'SHIPPED':
        return 'bg-blue-950/50 border border-blue-500/30 text-blue-450';
      case 'DELIVERED':
        return 'bg-purple-950/50 border border-purple-500/30 text-purple-405';
      case 'CANCELLED':
        return 'bg-red-950/50 border border-red-500/30 text-red-400';
      default:
        return 'bg-slate-900 border border-slate-800 text-slate-400';
    }
  };

  // Tracking stepper helper
  const renderTrackingSteps = (status: MockOrder['status']) => {
    const steps = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIdx = steps.indexOf(status);

    if (status === 'CANCELLED') {
      return (
        <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-xs rounded-xl text-center font-semibold">
          This order has been cancelled.
        </div>
      );
    }

    return (
      <div className="w-full py-4 px-2">
        <div className="flex items-center justify-between relative">
          {/* Connector Line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-900 -z-10"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-sky-500 to-indigo-650 transition-all duration-500 -z-10"
            style={{ width: `${(Math.max(currentIdx, 0) / (steps.length - 1)) * 100}%` }}
          ></div>

          {/* Steps */}
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isActive = idx === currentIdx;

            return (
              <div key={step} className="flex flex-col items-center space-y-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 border-transparent text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  } ${isActive ? 'scale-115 ring-4 ring-indigo-500/20' : ''}`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-[9px] uppercase tracking-wider font-bold select-none ${
                    isActive ? 'text-indigo-400 font-extrabold' : isCompleted ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-1">
          <nav className="text-xs text-slate-450 flex items-center space-x-2 mb-2">
            <Link href="/" className="hover:text-slate-200 transition">Products</Link>
            <span>/</span>
            <span className="text-slate-300 font-medium">Order History</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Order Tracking</h1>
        </div>

        {showSuccess && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm flex items-start space-x-2.5 animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
            <div>
              <span className="font-bold">Order placed successfully!</span>
              <p className="text-xs text-emerald-400/90 mt-0.5">Thank you for your purchase. Sellers will be notified to fulfill your orders shortly.</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <span className="w-10 h-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></span>
          </div>
        ) : buyerOrders.length === 0 ? (
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
                d="M9 12h3.75M9 15h3.375c1.88 0 3.42-1.54 3.42-3.42 0-1.88-1.54-3.42-3.42-3.42H9v6.84zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-200">No orders found</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                You haven&apos;t placed any orders on VibeMarket yet. Let&apos;s get some gear!
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
          <div className="space-y-6">
            {buyerOrders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Order Header */}
                <div className="p-5 bg-slate-900/40 border-b border-slate-900 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-400">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-550 uppercase tracking-wider font-bold">Order Reference</span>
                    <div className="font-extrabold text-slate-100">{order.id}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-550 uppercase tracking-wider font-bold">Date Placed</span>
                    <div className="font-semibold text-slate-200">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-550 uppercase tracking-wider font-bold">Total Bill</span>
                    <div className="font-black text-slate-100">${order.totalAmount.toFixed(2)}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getStatusStyles(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Details & Stepper */}
                <div className="p-5 space-y-6">
                  {/* Stepper tracker */}
                  {renderTrackingSteps(order.status)}

                  {/* Items List */}
                  <div className="border-t border-slate-900 pt-5 space-y-4">
                    <span className="text-[10px] text-slate-550 uppercase tracking-wider font-bold block">Items List</span>
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-950 border border-slate-850 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.productImageUrl}
                              alt={item.productTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-200 line-clamp-1">{item.productTitle}</span>
                            <span className="text-slate-500 font-semibold text-[10px]">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-100">${(item.productPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Location */}
                  <div className="border-t border-slate-900 pt-4 flex flex-col gap-1 text-xs">
                    <span className="text-[10px] text-slate-550 uppercase tracking-wider font-bold">Shipping Address</span>
                    <span className="text-slate-400 font-medium leading-relaxed">{order.shippingAddress}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BuyerOrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <span className="w-10 h-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></span>
        </main>
        <Footer />
      </div>
    }>
      <BuyerOrdersList />
    </Suspense>
  );
}
