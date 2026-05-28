'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, MockProduct, MockReview } from '@/lib/mock-db';
import { useAuth } from './AuthContext';

interface ProductContextType {
  products: MockProduct[];
  reviews: MockReview[];
  loading: boolean;
  createProduct: (product: Omit<MockProduct, 'id' | 'sellerId' | 'sellerName' | 'createdAt'>) => Promise<MockProduct>;
  updateProduct: (id: string, product: Partial<Omit<MockProduct, 'id' | 'sellerId' | 'sellerName'>>) => Promise<MockProduct>;
  deleteProduct: (id: string) => Promise<void>;
  addReview: (productId: string, rating: number, comment: string) => Promise<MockReview>;
  getProductRatingInfo: (productId: string) => { average: number; count: number };
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [reviews, setReviews] = useState<MockReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage or defaults
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('marketplace_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem('marketplace_products', JSON.stringify(INITIAL_PRODUCTS));
      }

      const savedReviews = localStorage.getItem('marketplace_reviews');
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      } else {
        setReviews(INITIAL_REVIEWS);
        localStorage.setItem('marketplace_reviews', JSON.stringify(INITIAL_REVIEWS));
      }
    } catch (e) {
      console.error('Error loading product data:', e);
      setProducts(INITIAL_PRODUCTS);
      setReviews(INITIAL_REVIEWS);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (productData: Omit<MockProduct, 'id' | 'sellerId' | 'sellerName' | 'createdAt'>) => {
    if (!user || user.role !== 'SELLER') {
      throw new Error('Only registered sellers can create listings');
    }

    const newProduct: MockProduct = {
      ...productData,
      id: `prod-${Math.random().toString(36).substr(2, 9)}`,
      sellerId: user.id,
      sellerName: user.businessName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous Seller',
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      localStorage.setItem('marketplace_products', JSON.stringify(updated));
      return updated;
    });

    return newProduct;
  };

  const updateProduct = async (id: string, updatedData: Partial<Omit<MockProduct, 'id' | 'sellerId' | 'sellerName'>>) => {
    if (!user || user.role !== 'SELLER') {
      throw new Error('Only registered sellers can modify listings');
    }

    let updatedProduct: MockProduct | null = null;

    setProducts((prev) => {
      const updated = prev.map((prod) => {
        if (prod.id === id) {
          if (prod.sellerId !== user.id) {
            throw new Error('You do not own this listing');
          }
          updatedProduct = { ...prod, ...updatedData };
          return updatedProduct;
        }
        return prod;
      });

      localStorage.setItem('marketplace_products', JSON.stringify(updated));
      return updated;
    });

    if (!updatedProduct) {
      throw new Error('Product not found');
    }

    return updatedProduct;
  };

  const deleteProduct = async (id: string) => {
    if (!user || user.role !== 'SELLER') {
      throw new Error('Only registered sellers can delete listings');
    }

    setProducts((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target && target.sellerId !== user.id) {
        throw new Error('You do not own this listing');
      }

      const updated = prev.filter((prod) => prod.id !== id);
      localStorage.setItem('marketplace_products', JSON.stringify(updated));
      return updated;
    });
  };

  const addReview = async (productId: string, rating: number, comment: string) => {
    if (!user) {
      throw new Error('You must be signed in to submit reviews');
    }

    const newReview: MockReview = {
      id: `rev-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      buyerId: user.id,
      buyerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous Buyer',
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => {
      // Prevent duplicates by same user on same product
      const filtered = prev.filter((rev) => !(rev.productId === productId && rev.buyerId === user.id));
      const updated = [newReview, ...filtered];
      localStorage.setItem('marketplace_reviews', JSON.stringify(updated));
      return updated;
    });

    return newReview;
  };

  const getProductRatingInfo = useCallback((productId: string) => {
    const productReviews = reviews.filter((rev) => rev.productId === productId);
    if (productReviews.length === 0) return { average: 0, count: 0 };

    const sum = productReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return {
      average: parseFloat((sum / productReviews.length).toFixed(1)),
      count: productReviews.length,
    };
  }, [reviews]);

  return (
    <ProductContext.Provider
      value={{
        products,
        reviews,
        loading,
        createProduct,
        updateProduct,
        deleteProduct,
        addReview,
        getProductRatingInfo,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
