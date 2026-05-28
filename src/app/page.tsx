'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { MockProduct } from '@/lib/mock-db';

export default function DirectoryPage() {
  const { products, getProductRatingInfo, loading: productsLoading } = useProducts();
  const { addToCart } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, price-low, price-high
  const [addingId, setAddingId] = useState<string | null>(null);

  // Get active products
  const activeProducts = products.filter((p) => p.status === 'ACTIVE');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(activeProducts.map((p) => p.category)))];

  // Filter & Sort Products
  const filteredProducts = activeProducts
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      // Default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleAddToCart = async (e: React.MouseEvent, product: MockProduct) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingId(product.id);
    try {
      await addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        category: product.category,
      });
    } catch (err) {
      console.error(err);
    } finally {
      // Simulate slight visual feedback delay
      setTimeout(() => setAddingId(null), 600);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900/40 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
          <span className="px-3 py-1 bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
            Premium Two-Sided Marketplace
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
            Curated Gear for Creators & Collectors
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Browse and search active listings from top verified sellers. Seamless cart & mock checkout pipeline ready for deployment.
          </p>
        </section>

        {/* Directory Filters */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products or descriptions..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 placeholder-slate-500 transition text-sm"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602z" />
              </svg>
            </div>

            {/* Sort Select */}
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-350 text-xs font-semibold px-3 py-2.5 rounded-xl focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest Additions</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition duration-150 ${
                  selectedCategory === category
                    ? 'bg-slate-100 border-white text-slate-950 font-bold'
                    : 'bg-slate-900/60 border-slate-850 text-slate-450 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section className="space-y-6">
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-900/30 border border-slate-850 rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/10 border border-slate-850 border-dashed rounded-3xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-12 h-12 text-slate-600 mx-auto mb-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <h3 className="text-lg font-bold">No Products Found</h3>
              <p className="text-slate-500 text-sm mt-1">Try resetting your search query or choosing another category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const ratingInfo = getProductRatingInfo(product.id);
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-lg transition duration-200 flex flex-col h-full"
                  >
                    {/* Image Wrapper */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-sm border border-slate-850 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                        {product.category}
                      </span>
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                          <span className="px-3 py-1 bg-red-950 border border-red-500/35 text-red-400 text-xs font-bold rounded-lg uppercase tracking-wide">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                      <div className="space-y-2">
                        {/* Seller & Rating Row */}
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-medium hover:underline">{product.sellerName}</span>
                          
                          {ratingInfo.count > 0 ? (
                            <div className="flex items-center space-x-1 text-amber-400">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.6 3.102-1.196 4.622c-.21.811.679 1.459 1.374.992L10 15.666l4.187 2.408c.695.467 1.584-.181 1.374-.992l-1.196-4.622 3.6-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                              </svg>
                              <span className="font-bold text-slate-200">{ratingInfo.average}</span>
                              <span className="text-[10px] text-slate-500">({ratingInfo.count})</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-550">No ratings yet</span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-100 text-lg group-hover:text-sky-400 transition duration-150 line-clamp-1">
                            {product.title}
                          </h3>
                          <p className="text-slate-450 text-xs leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      {/* Pricing & Add to Cart */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                        <span className="text-lg font-black text-slate-100">
                          ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.stock === 0 || addingId === product.id}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition duration-200 ${
                            product.stock === 0
                              ? 'bg-slate-900 border border-slate-850 text-slate-600 cursor-not-allowed'
                              : addingId === product.id
                              ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                              : 'bg-slate-800 hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-650 hover:text-white hover:border-transparent border border-slate-750 text-slate-200 shadow-md'
                          }`}
                        >
                          {addingId === product.id ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 animate-bounce">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                              </svg>
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
