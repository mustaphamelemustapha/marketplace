import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-slate-100">
      {/* Brand Pane (hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-5 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 flex-col justify-between p-12 border-r border-slate-800">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <Link href="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-white relative z-10">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-sm font-black shadow-lg">V</span>
          <span>VibeMarket</span>
        </Link>

        <div className="space-y-6 relative z-10 my-auto">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
            The modern exchange for <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">buyers and sellers</span>.
          </h1>
          <p className="text-slate-400 leading-relaxed text-sm">
            Empowering sellers to build directories, run listings, and fulfill orders. Giving buyers access to a curated directory with seamless checkout.
          </p>
        </div>

        <div className="text-xs text-slate-500 relative z-10">
          © {new Date().getFullYear()} VibeMarket Inc. All rights reserved.
        </div>
      </div>

      {/* Form Pane */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 md:p-12 relative">
        <div className="lg:hidden absolute top-6 left-6">
          <Link href="/" className="flex items-center space-x-2 text-lg font-bold tracking-tight text-white">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-black">V</span>
            <span>VibeMarket</span>
          </Link>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
