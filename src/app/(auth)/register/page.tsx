'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    const formData = {
      email,
      password,
      role,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      businessName: role === 'SELLER' ? businessName : undefined,
    };

    try {
      const result = await register(formData);
      if (result.success) {
        const targetRedirect = role === 'SELLER' ? '/seller' : '/';
        router.push(targetRedirect);
        router.refresh();
      } else {
        setError(result.error || 'Registration failed');
        if (result.details) {
          setFieldErrors(result.details);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold tracking-tight">Create Account</h2>
        <p className="text-slate-400 text-sm">
          Register to buy products or list them as a seller.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start space-x-2 animate-shake">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 flex-shrink-0 mt-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <div>
            <span className="font-semibold">{error}</span>
            {Object.keys(fieldErrors).length > 0 && (
              <ul className="list-disc pl-5 mt-1 space-y-0.5 text-xs text-red-400/90">
                {Object.values(fieldErrors).flatMap((msgs) =>
                  msgs.map((msg, idx) => <li key={idx}>{msg}</li>)
                )}
              </ul>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selector Grid */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Account Type
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('BUYER')}
              className={`py-3 px-4 rounded-xl border text-sm font-medium transition duration-200 flex flex-col items-center gap-1 ${
                role === 'BUYER'
                  ? 'bg-slate-900 border-sky-500 text-sky-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900/50'
              }`}
            >
              <span>Buyer</span>
              <span className="text-[10px] opacity-70 font-normal">Browse and purchase products</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('SELLER')}
              className={`py-3 px-4 rounded-xl border text-sm font-medium transition duration-200 flex flex-col items-center gap-1 ${
                role === 'SELLER'
                  ? 'bg-slate-900 border-indigo-500 text-indigo-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900/50'
              }`}
            >
              <span>Seller</span>
              <span className="text-[10px] opacity-70 font-normal">Create listings and earn</span>
            </button>
          </div>
        </div>

        {/* Name Fields Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 placeholder-slate-650 transition"
              placeholder="Alice"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 placeholder-slate-650 transition"
              placeholder="Smith"
            />
          </div>
        </div>

        {/* Conditionally render Business Name */}
        {role === 'SELLER' && (
          <div className="space-y-1 animate-fadeIn">
            <label htmlFor="businessName" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Business / Store Name
            </label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 placeholder-slate-650 transition"
              placeholder="e.g. Apex Tech Deals"
            />
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 placeholder-slate-650 transition"
            placeholder="name@example.com"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 placeholder-slate-650 transition"
            placeholder="Min 6 characters"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 mt-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium rounded-xl transition duration-250 shadow-lg shadow-indigo-950/50 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      <div className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
          Sign In
        </Link>
      </div>
    </div>
  );
}
