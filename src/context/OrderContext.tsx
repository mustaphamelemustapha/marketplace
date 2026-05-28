'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MockOrder, MockProduct } from '@/lib/mock-db';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useProducts } from './ProductContext';

interface OrderContextType {
  orders: MockOrder[];
  loading: boolean;
  createOrder: (shippingAddress: string) => Promise<MockOrder>;
  updateOrderStatus: (orderId: string, status: MockOrder['status']) => Promise<MockOrder>;
  getOrderById: (id: string) => MockOrder | undefined;
  getSellerOrders: (sellerId: string) => MockOrder[];
  getSellerMetrics: (sellerId: string) => { totalSales: number; totalOrders: number; totalSoldUnits: number };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const { updateProduct } = useProducts();
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage or defaults
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('marketplace_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders([]);
        localStorage.setItem('marketplace_orders', JSON.stringify([]));
      }
    } catch (e) {
      console.error('Error loading order data:', e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = async (shippingAddress: string) => {
    if (!user) {
      throw new Error('You must be logged in to complete a checkout');
    }
    if (cartItems.length === 0) {
      throw new Error('Your cart is empty');
    }

    const totalAmount = cartItems.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity,
      0
    );

    const newOrder: MockOrder = {
      id: `ord-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      buyerId: user.id,
      buyerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      totalAmount,
      status: 'PAID', // Start as Paid once checked out
      shippingAddress,
      createdAt: new Date().toISOString(),
      items: cartItems.map((item) => ({
        productId: item.productId,
        productTitle: item.product.title,
        productPrice: Number(item.product.price),
        productImageUrl: item.product.imageUrl || '',
        quantity: item.quantity,
      })),
    };

    // Deduct stock levels for items
    for (const item of cartItems) {
      const newStock = Math.max(item.product.stock - item.quantity, 0);
      await updateProduct(item.productId, { stock: newStock });
    }

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('marketplace_orders', JSON.stringify(updated));
      return updated;
    });

    await clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: MockOrder['status']) => {
    let updatedOrder: MockOrder | null = null;

    setOrders((prev) => {
      const updated = prev.map((order) => {
        if (order.id === orderId) {
          updatedOrder = { ...order, status };
          return updatedOrder;
        }
        return order;
      });
      localStorage.setItem('marketplace_orders', JSON.stringify(updated));
      return updated;
    });

    if (!updatedOrder) {
      throw new Error('Order not found');
    }

    return updatedOrder;
  };

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  // Helper: Filter orders that contain products belonging to a specific seller
  const getSellerOrders = (sellerId: string) => {
    if (typeof window === 'undefined') return [];
    // In our simplified mock setup, we store products separately. Let's find products belonging to this seller first.
    // However, since products are in ProductContext, we can filter orders that contain items belonging to this seller.
    // Wait, let's fetch products list to map which productId belongs to which sellerId.
    const savedProducts = localStorage.getItem('marketplace_products');
    const productsList: MockProduct[] = savedProducts ? JSON.parse(savedProducts) : [];
    const sellerProductIds = new Set(
      productsList.filter((p) => p.sellerId === sellerId).map((p) => p.id)
    );

    return orders.filter((order) =>
      order.items.some((item) => sellerProductIds.has(item.productId))
    );
  };

  // Helper: Get sales metrics for seller dashboard
  const getSellerMetrics = (sellerId: string) => {
    if (typeof window === 'undefined') {
      return { totalSales: 0, totalOrders: 0, totalSoldUnits: 0 };
    }
    const sellerOrders = getSellerOrders(sellerId);
    
    // Find products belonging to the seller
    const savedProducts = localStorage.getItem('marketplace_products');
    const productsList: MockProduct[] = savedProducts ? JSON.parse(savedProducts) : [];
    const sellerProductIds = new Set(
      productsList.filter((p) => p.sellerId === sellerId).map((p) => p.id)
    );

    let totalSales = 0;
    let totalSoldUnits = 0;

    sellerOrders.forEach((order) => {
      // Only count items in the order that belong to this seller
      order.items.forEach((item) => {
        if (sellerProductIds.has(item.productId)) {
          totalSales += item.productPrice * item.quantity;
          totalSoldUnits += item.quantity;
        }
      });
    });

    return {
      totalSales: parseFloat(totalSales.toFixed(2)),
      totalOrders: sellerOrders.length,
      totalSoldUnits,
    };
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getSellerOrders,
        getSellerMetrics,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
