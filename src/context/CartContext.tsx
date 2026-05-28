'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface CartProduct {
  id: string;
  title: string;
  price: string | number;
  imageUrl: string | null;
  stock: number;
  category: string;
}

export interface CartItem {
  id?: string;
  productId: string;
  quantity: number;
  product: CartProduct;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (product: CartProduct, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Cart from DB or LocalStorage
  const refreshCart = useCallback(async () => {
    setLoading(true);
    if (user) {
      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          setCartItems(data.cartItems || []);
        }
      } catch (e) {
        console.error('Error fetching database cart:', e);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest: Load from LocalStorage
      try {
        const saved = localStorage.getItem('guest_cart');
        if (saved) {
          setCartItems(JSON.parse(saved));
        } else {
          setCartItems([]);
        }
      } catch (e) {
        console.error('Error loading guest cart:', e);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  // Sync cart when user logging changes
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // 2. Add to Cart
  const addToCart = async (product: CartProduct, quantity = 1) => {
    if (user) {
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, quantity }),
        });
        if (res.ok) {
          await refreshCart();
        }
      } catch (e) {
        console.error('Error adding to database cart:', e);
      }
    } else {
      // Guest LocalStorage logic
      setCartItems((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        let updated;
        if (existing) {
          updated = prev.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
              : item
          );
        } else {
          updated = [...prev, { productId: product.id, quantity, product }];
        }
        localStorage.setItem('guest_cart', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // 3. Update Quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (user) {
      try {
        const res = await fetch('/api/cart', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity }),
        });
        if (res.ok) {
          await refreshCart();
        }
      } catch (e) {
        console.error('Error updating database cart:', e);
      }
    } else {
      setCartItems((prev) => {
        const updated = prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        localStorage.setItem('guest_cart', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // 4. Remove from Cart
  const removeFromCart = async (productId: string) => {
    if (user) {
      try {
        const res = await fetch(`/api/cart?productId=${productId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          await refreshCart();
        }
      } catch (e) {
        console.error('Error deleting from database cart:', e);
      }
    } else {
      setCartItems((prev) => {
        const updated = prev.filter((item) => item.productId !== productId);
        localStorage.setItem('guest_cart', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // 5. Clear Cart
  const clearCart = async () => {
    if (user) {
      try {
        await fetch('/api/cart/clear', { method: 'POST' });
        setCartItems([]);
      } catch (e) {
        console.error('Error clearing database cart:', e);
      }
    } else {
      localStorage.removeItem('guest_cart');
      setCartItems([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
