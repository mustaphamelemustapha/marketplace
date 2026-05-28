'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { useOrders } from '@/context/OrderContext';
import { MockProduct, MockOrder } from '@/lib/mock-db';

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const { products, createProduct, updateProduct, deleteProduct } = useProducts();
  const { getSellerOrders, getSellerMetrics, updateOrderStatus } = useOrders();

  const sellerId = user?.id || '';
  const sellerProducts = products.filter((p) => p.sellerId === sellerId);
  const sellerOrders = getSellerOrders(sellerId);
  const metrics = getSellerMetrics(sellerId);

  // Active tab state: 'products' or 'orders'
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  // Modal forms states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MockProduct | null>(null);

  // Product form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Electronics');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setDescription('');
    setPrice(0);
    setStock(0);
    setImageUrl('');
    setCategory('Electronics');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: MockProduct) => {
    setEditingProduct(product);
    setTitle(product.title);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
    setImageUrl(product.imageUrl || '');
    setCategory(product.category);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    if (price <= 0) {
      setFormError('Price must be greater than $0.');
      setIsSubmitting(false);
      return;
    }
    if (stock < 0) {
      setFormError('Stock cannot be negative.');
      setIsSubmitting(false);
      return;
    }

    const imageFallback = imageUrl.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';

    try {
      if (editingProduct) {
        // Edit mode
        await updateProduct(editingProduct.id, {
          title,
          description,
          price,
          stock,
          imageUrl: imageFallback,
          category,
        });
      } else {
        // Create mode
        await createProduct({
          title,
          description,
          price,
          stock,
          imageUrl: imageFallback,
          category,
          status: 'ACTIVE',
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteProduct(id);
      } catch (err: any) {
        alert(err.message || 'Failed to delete listing');
      }
    }
  };

  const handleStatusChange = async (orderId: string, status: MockOrder['status']) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Dashboard Title */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Seller Console</h1>
            <p className="text-slate-450 text-sm mt-1">
              Fulfill incoming orders and manage product catalog listings for{' '}
              <span className="text-slate-200 font-semibold">{user?.businessName}</span>.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-650 hover:from-sky-400 hover:to-indigo-550 text-white text-xs font-bold rounded-xl transition duration-200 shadow-md shadow-indigo-950/40 flex items-center justify-center space-x-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add New Product</span>
          </button>
        </div>

        {/* Metrics Section */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Revenue Metric */}
          <div className="p-6 bg-slate-900/35 border-l-4 border-emerald-500 border border-y-slate-800 border-r-slate-800 rounded-r-2xl rounded-l-md shadow-xl flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Revenue</span>
            <span className="text-3xl font-black text-white mt-2">
              ${metrics.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Orders Metric */}
          <div className="p-6 bg-slate-900/35 border-l-4 border-sky-500 border border-y-slate-800 border-r-slate-800 rounded-r-2xl rounded-l-md shadow-xl flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Orders</span>
            <span className="text-3xl font-black text-white mt-2">{metrics.totalOrders}</span>
          </div>

          {/* Sold Units Metric */}
          <div className="p-6 bg-slate-900/35 border-l-4 border-indigo-500 border border-y-slate-800 border-r-slate-800 rounded-r-2xl rounded-l-md shadow-xl flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Sold Units</span>
            <span className="text-3xl font-black text-white mt-2">{metrics.totalSoldUnits}</span>
          </div>
        </section>

        {/* Dashboard Tabs Selector */}
        <section className="border-b border-slate-900 flex space-x-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 text-xs uppercase tracking-wider font-extrabold border-b-2 transition duration-200 ${
              activeTab === 'products' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            My Listings ({sellerProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 text-xs uppercase tracking-wider font-extrabold border-b-2 transition duration-200 ${
              activeTab === 'orders' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Incoming Orders ({sellerOrders.length})
          </button>
        </section>

        {/* Tab Contents */}
        <section className="space-y-6">
          {/* Tab 1: Products Catalogue */}
          {activeTab === 'products' && (
            sellerProducts.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/10 border border-slate-850 border-dashed rounded-3xl space-y-4">
                <p className="text-slate-500 text-sm">You haven&apos;t added any product listings to your catalogue yet.</p>
                <button
                  onClick={openAddModal}
                  className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200 text-xs font-bold rounded-xl transition"
                >
                  Create Your First Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sellerProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-5 bg-slate-900/35 border border-slate-800/80 hover:border-slate-750/80 rounded-2xl flex items-start gap-4 transition shadow-md"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-slate-950 border border-slate-855 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Meta */}
                    <div className="flex-grow space-y-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-550 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                          {prod.category}
                        </span>
                        <h3 className="font-bold text-slate-200 text-base line-clamp-1">{prod.title}</h3>
                      </div>

                      <div className="flex items-center space-x-6 text-xs text-slate-450">
                        <div>
                          Price: <span className="font-bold text-slate-200">${prod.price.toFixed(2)}</span>
                        </div>
                        <div>
                          Stock: <span className={`font-bold ${prod.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{prod.stock}</span>
                        </div>
                      </div>

                      {/* CRUD Buttons */}
                      <div className="flex items-center space-x-3 pt-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition"
                        >
                          Edit Details
                        </button>
                        <span className="text-slate-800">|</span>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="text-xs font-semibold text-red-400 hover:text-red-350 transition"
                        >
                          Delete listing
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Tab 2: Orders Fulfillment */}
          {activeTab === 'orders' && (
            sellerOrders.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/10 border border-slate-850 border-dashed rounded-3xl">
                <p className="text-slate-500 text-sm">No buyers have purchased your products yet. They will appear here when they do.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sellerOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4"
                  >
                    {/* Order Meta */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-900">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-550 uppercase tracking-widest font-bold">Order ID</span>
                        <div className="font-extrabold text-slate-100 text-sm">{order.id}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-550 uppercase tracking-widest font-bold">Customer</span>
                        <div className="font-semibold text-slate-200 text-sm">{order.buyerName}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-550 uppercase tracking-widest font-bold">Total Bill</span>
                        <div className="font-black text-slate-100 text-sm">${order.totalAmount.toFixed(2)}</div>
                      </div>
                      
                      {/* Fulfillment Selector */}
                      <div className="flex items-center space-x-2">
                        <label htmlFor={`status-${order.id}`} className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                          Tracking Status
                        </label>
                        <select
                          id={`status-${order.id}`}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as MockOrder['status'])}
                          className="bg-slate-950 border border-slate-850 text-slate-300 text-xs px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
                        >
                          <option value="PAID">PAID</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-550 uppercase tracking-wider font-bold block mb-1">Purchased Products</span>
                      {order.items.map((item) => (
                        <div key={item.productId} className="flex justify-between items-center text-xs text-slate-350">
                          <span>
                            {item.productTitle} <span className="font-bold text-slate-500">x{item.quantity}</span>
                          </span>
                          <span className="font-bold text-slate-200">${(item.productPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-slate-950/40 p-3.5 border border-slate-900 rounded-xl flex flex-col gap-0.5 text-xs text-slate-400">
                      <span className="text-[10px] text-slate-550 uppercase tracking-wider font-bold mb-0.5">Shipping Address</span>
                      {order.shippingAddress}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </section>
      </main>

      {/* Product Creation/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden animate-zoomIn flex flex-col">
            {/* Modal Title */}
            <div className="p-6 border-b border-slate-950 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white">
                {editingProduct ? 'Edit Catalog Listing' : 'Create Catalog Listing'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-500 hover:text-white rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              {formError && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="title" className="text-xs text-slate-450 uppercase tracking-wider font-bold">
                  Listing Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-sm"
                  placeholder="e.g. Mechanical Tactile Keyboard"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="price" className="text-xs text-slate-450 uppercase tracking-wider font-bold">
                    Retail Price ($)
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-sm"
                    placeholder="129.50"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="stock" className="text-xs text-slate-450 uppercase tracking-wider font-bold">
                    Stock Inventory
                  </label>
                  <input
                    id="stock"
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-sm"
                    placeholder="15"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="category" className="text-xs text-slate-450 uppercase tracking-wider font-bold">
                  Listing Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-sm cursor-pointer"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="imageUrl" className="text-xs text-slate-450 uppercase tracking-wider font-bold">
                  Product Image URL
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-sm"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="desc" className="text-xs text-slate-450 uppercase tracking-wider font-bold">
                  Listing Description
                </label>
                <textarea
                  id="desc"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-100 text-sm"
                  placeholder="Describe key specs, materials, features, and sizes..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-650 hover:from-sky-400 hover:to-indigo-550 text-white font-bold rounded-xl transition duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <span>Save Listing</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
