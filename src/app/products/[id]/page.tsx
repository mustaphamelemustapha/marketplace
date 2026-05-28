'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  
  const { user } = useAuth();
  const { products, reviews, addReview, getProductRatingInfo } = useProducts();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-bold">Product Not Found</h2>
          <p className="text-slate-400 text-sm">The item you are looking for does not exist or has been removed.</p>
          <Link href="/" className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-200 text-sm font-medium rounded-xl hover:bg-slate-850">
            Return to Browse
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const ratingInfo = getProductRatingInfo(product.id);
  const productReviews = reviews.filter((rev) => rev.productId === product.id);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        category: product.category,
      }, quantity);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setAddingToCart(false), 600);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    setSubmittingReview(true);

    if (comment.trim().length < 2) {
      setReviewError('Review comment must be at least 2 characters');
      setSubmittingReview(false);
      return;
    }

    try {
      await addReview(product.id, rating, comment);
      setComment('');
      setRating(5);
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-450 flex items-center space-x-2">
          <Link href="/" className="hover:text-slate-200 transition">Products</Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-slate-300 font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Product Details Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="md:col-span-6 flex items-start">
            <div className="relative aspect-square w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="object-cover w-full h-full"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                  <span className="px-4 py-2 bg-red-950 border border-red-500/40 text-red-400 text-sm font-bold rounded-xl uppercase tracking-wide">
                    Sold Out
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Specs & Options */}
          <div className="md:col-span-6 flex flex-col justify-between py-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{product.category}</span>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {product.title}
                </h1>
              </div>

              {/* Rating Row */}
              <div className="flex items-center space-x-3 text-sm">
                {ratingInfo.count > 0 ? (
                  <>
                    <div className="flex items-center space-x-1 text-amber-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.6 3.102-1.196 4.622c-.21.811.679 1.459 1.374.992L10 15.666l4.187 2.408c.695.467 1.584-.181 1.374-.992l-1.196-4.622 3.6-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                      </svg>
                      <span className="font-bold text-slate-200">{ratingInfo.average}</span>
                    </div>
                    <span className="text-slate-650">|</span>
                    <span className="text-slate-450 font-medium hover:underline cursor-pointer">
                      {ratingInfo.count} Customer Reviews
                    </span>
                  </>
                ) : (
                  <span className="text-slate-550 text-xs">No customer ratings yet</span>
                )}
              </div>

              {/* Price Tag */}
              <div className="text-3xl font-black text-white">
                ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line border-t border-slate-900 pt-4">
                {product.description}
              </p>

              {/* Seller details */}
              <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-0.5">Listed By</span>
                  <span className="font-bold text-slate-200 text-sm">{product.sellerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-0.5">Stock Level</span>
                  {product.stock > 0 ? (
                    <span className="text-emerald-400 font-bold text-sm">{product.stock} items remaining</span>
                  ) : (
                    <span className="text-red-400 font-bold text-sm">Unavailable</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            {product.stock > 0 && (
              <div className="space-y-4 border-t border-slate-900 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400 font-medium">Quantity</span>
                  <div className="flex items-center space-x-2 border border-slate-800 bg-slate-900/60 p-1.5 rounded-xl">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-350 hover:text-white disabled:opacity-30 disabled:hover:text-slate-350 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                      </svg>
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-white select-none">{quantity}</span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-350 hover:text-white disabled:opacity-30 disabled:hover:text-slate-350 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-650 hover:from-sky-400 hover:to-indigo-550 text-white font-bold rounded-2xl transition duration-250 shadow-lg shadow-indigo-950/60 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {addingToCart ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Adding to Cart...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                      <span>Add to Cart (${(product.price * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })})</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-slate-900 pt-12">
          {/* Reviews Aggregation / Writing Form */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-white">Customer Reviews</h2>
            
            {/* Average Rating Block */}
            <div className="p-6 bg-slate-900/35 border border-slate-850 rounded-2xl space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-black text-white">{ratingInfo.average}</span>
                <div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-4 h-4 ${i < Math.round(ratingInfo.average) ? 'text-amber-400' : 'text-slate-700'}`}
                      >
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.6 3.102-1.196 4.622c-.21.811.679 1.459 1.374.992L10 15.666l4.187 2.408c.695.467 1.584-.181 1.374-.992l-1.196-4.622 3.6-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    Based on {ratingInfo.count} ratings
                  </span>
                </div>
              </div>
            </div>

            {/* Review Form */}
            {user ? (
              <form onSubmit={handleReviewSubmit} className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-4">
                <h3 className="font-bold text-sm text-slate-200">Share your thoughts</h3>
                
                {reviewError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs">
                    {reviewError}
                  </div>
                )}

                {/* Rating selection stars */}
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Your Rating</span>
                  <div className="flex space-x-1.5">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRating(val)}
                        className="text-slate-600 hover:scale-110 transition duration-150"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className={`w-6 h-6 ${val <= rating ? 'text-amber-400' : 'text-slate-700 hover:text-amber-500/50'}`}
                        >
                          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.6 3.102-1.196 4.622c-.21.811.679 1.459 1.374.992L10 15.666l4.187 2.408c.695.467 1.584-.181 1.374-.992l-1.196-4.622 3.6-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="comment" className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">
                    Comments
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-xs placeholder-slate-600 transition"
                    placeholder="Describe your experience with this product..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-2.5 bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs rounded-xl transition duration-150 flex items-center justify-center"
                >
                  {submittingReview ? (
                    <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
                  ) : (
                    <span>Submit Review</span>
                  )}
                </button>
              </form>
            ) : (
              <div className="p-6 border border-slate-850 border-dashed rounded-2xl text-center space-y-2">
                <p className="text-slate-500 text-xs">Want to review this product?</p>
                <Link
                  href={`/login?callbackUrl=/products/${product.id}`}
                  className="inline-block text-indigo-400 hover:text-indigo-350 text-xs font-semibold hover:underline"
                >
                  Sign In to leave a review
                </Link>
              </div>
            )}
          </div>

          {/* Individual Reviews Listing */}
          <div className="lg:col-span-7 space-y-4">
            {productReviews.length === 0 ? (
              <div className="text-center py-10 bg-slate-900/10 border border-slate-850 border-dashed rounded-2xl">
                <p className="text-slate-500 text-xs">No reviews have been written for this product yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {productReviews.map((rev) => (
                  <div key={rev.id} className="p-5 bg-slate-900/30 border border-slate-850 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{rev.buyerName}</span>
                      <span className="text-slate-500">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-amber-400' : 'text-slate-700'}`}
                        >
                          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.6 3.102-1.196 4.622c-.21.811.679 1.459 1.374.992L10 15.666l4.187 2.408c.695.467 1.584-.181 1.374-.992l-1.196-4.622 3.6-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>

                    <p className="text-slate-350 text-xs leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
