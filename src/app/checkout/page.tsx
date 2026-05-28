'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems } = useCart();
  const { createOrder } = useOrders();

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Card mock states
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  const shippingFee = subtotal > 150 ? 0 : 15.0;
  const estimatedTax = subtotal * 0.08;
  const total = subtotal + shippingFee + estimatedTax;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    if (cartItems.length === 0) {
      setError('Your shopping cart is empty.');
      setIsProcessing(false);
      return;
    }

    const shippingDetails = `${address}, ${city}, ${state} ${zipCode}`;

    try {
      // Create the order via context (writes to localStorage, updates product stock, clears cart)
      await createOrder(shippingDetails);
      
      // Simulate Stripe/Paystack payment processing lag
      setTimeout(() => {
        setIsProcessing(false);
        router.push('/orders?success=true');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout.');
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-slate-450 text-sm">Add products to your cart before proceeding to checkout.</p>
          <Link href="/" className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-200 text-sm font-medium rounded-xl hover:bg-slate-850">
            Start Shopping
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-1">
          <nav className="text-xs text-slate-450 flex items-center space-x-2 mb-2">
            <Link href="/" className="hover:text-slate-200 transition">Products</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-slate-200 transition">Cart</Link>
            <span>/</span>
            <span className="text-slate-300 font-medium">Checkout</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Checkout</h1>
        </div>

        {error && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Shipping & Payment Fields */}
          <div className="lg:col-span-8 space-y-6">
            {/* Shipping details */}
            <div className="p-6 bg-slate-900/35 border border-slate-800/80 rounded-2xl space-y-4">
              <h2 className="font-extrabold text-base text-slate-250 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center text-xs font-bold">1</span>
                <span>Shipping Address</span>
              </h2>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="fullName" className="text-xs text-slate-450 uppercase tracking-wider font-semibold">
                    Recipient Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-sm"
                    placeholder="Alice Smith"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="address" className="text-xs text-slate-450 uppercase tracking-wider font-semibold">
                    Street Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-sm"
                    placeholder="12 Oak Lane"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="city" className="text-xs text-slate-450 uppercase tracking-wider font-semibold">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-sm"
                      placeholder="Austin"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="state" className="text-xs text-slate-450 uppercase tracking-wider font-semibold">
                      State / Region
                    </label>
                    <input
                      id="state"
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-sm"
                      placeholder="TX"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="zip" className="text-xs text-slate-450 uppercase tracking-wider font-semibold">
                      Postal Code
                    </label>
                    <input
                      id="zip"
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-sm"
                      placeholder="73301"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="p-6 bg-slate-900/35 border border-slate-800/80 rounded-2xl space-y-4">
              <h2 className="font-extrabold text-base text-slate-250 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center text-xs font-bold">2</span>
                <span>Payment Details (Mock Gateway)</span>
              </h2>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="cardNumber" className="text-xs text-slate-450 uppercase tracking-wider font-semibold">
                    Credit Card Number
                  </label>
                  <input
                    id="cardNumber"
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-sm"
                    placeholder="4000 1234 5678 9010"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="expiry" className="text-xs text-slate-450 uppercase tracking-wider font-semibold">
                      Expiration Date
                    </label>
                    <input
                      id="expiry"
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-sm"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="cvv" className="text-xs text-slate-450 uppercase tracking-wider font-semibold">
                      CVV / Security Code
                    </label>
                    <input
                      id="cvv"
                      type="text"
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-sm"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Totals Summary */}
          <div className="lg:col-span-4">
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-6 shadow-xl sticky top-24">
              <h2 className="font-extrabold text-base text-slate-100 pb-3 border-b border-slate-900">Summary Details</h2>

              {/* Items List */}
              <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center text-xs gap-3">
                    <span className="text-slate-400 truncate flex-grow">
                      {item.product.title} <span className="text-[10px] font-bold text-slate-500">x{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-slate-200 flex-shrink-0">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs text-slate-450 pt-4 border-t border-slate-900">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-300">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-slate-300">
                    {shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-bold text-slate-300">${estimatedTax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-base font-extrabold text-white pt-4 border-t border-slate-900">
                <span>Total Amount</span>
                <span className="text-lg font-black">${total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-650 hover:from-sky-400 hover:to-indigo-550 text-white font-bold rounded-xl transition duration-200 shadow-lg shadow-indigo-950/40 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>Place Order (${total.toFixed(2)})</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
