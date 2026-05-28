import React from 'react';

export function Footer() {
  return (
    <footer className="mt-auto bg-slate-950 border-t border-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-md font-bold tracking-tight text-white">
          <span className="w-6 h-6 rounded-md bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-black">V</span>
          <span>VibeMarket</span>
        </div>
        <p className="text-xs text-slate-550 text-center sm:text-left">
          © {new Date().getFullYear()} VibeMarket. Built with Next.js App Router, Tailwind CSS, and TypeScript.
        </p>
      </div>
    </footer>
  );
}
