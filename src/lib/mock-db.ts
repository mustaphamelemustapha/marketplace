export interface MockUser {
  id: string;
  email: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  businessName?: string;
  bio?: string;
  phoneNumber?: string;
  address?: string;
}

export interface MockProduct {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
}

export interface MockReview {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface MockOrder {
  id: string;
  buyerId: string;
  buyerName: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: string;
  createdAt: string;
  items: {
    productId: string;
    productTitle: string;
    productPrice: number;
    productImageUrl: string;
    quantity: number;
  }[];
}

// Initial static seed users
export const INITIAL_USERS: MockUser[] = [
  {
    id: 'user-admin',
    email: 'admin@marketplace.com',
    role: 'ADMIN',
    firstName: 'System',
    lastName: 'Administrator',
  },
  {
    id: 'user-seller-1',
    email: 'seller1@marketplace.com',
    role: 'SELLER',
    firstName: 'John',
    lastName: 'Gadget',
    businessName: 'Tech Central',
    bio: 'Your premier source for high-quality electronics and gaming gear.',
    phoneNumber: '+15550101',
    address: '100 Silicon Valley Way, CA',
  },
  {
    id: 'user-seller-2',
    email: 'seller2@marketplace.com',
    role: 'SELLER',
    firstName: 'Sarah',
    lastName: 'Vogue',
    businessName: 'Apex Threads',
    bio: 'Chic, premium quality streetwear and accessories designed locally.',
    phoneNumber: '+15550202',
    address: '200 Fashion Ave, NY',
  },
  {
    id: 'user-buyer-1',
    email: 'buyer1@marketplace.com',
    role: 'BUYER',
    firstName: 'Alice',
    lastName: 'Smith',
    phoneNumber: '+15550303',
    address: '12 Oak Lane, Austin, TX',
  },
  {
    id: 'user-buyer-2',
    email: 'buyer2@marketplace.com',
    role: 'BUYER',
    firstName: 'Bob',
    lastName: 'Jones',
    phoneNumber: '+15550404',
    address: '45 Pine Street, Seattle, WA',
  },
];

// Initial static seed products
export const INITIAL_PRODUCTS: MockProduct[] = [
  {
    id: 'prod-1',
    sellerId: 'user-seller-1',
    sellerName: 'Tech Central',
    title: 'AeroSound Pro Wireless Headphones',
    description: 'Experience industry-leading active noise cancellation, spatial audio, and up to 40 hours of battery life. Crafted for audiophiles.',
    price: 299.99,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    category: 'Electronics',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prod-2',
    sellerId: 'user-seller-1',
    sellerName: 'Tech Central',
    title: 'Matrix-X Mechanical Keyboard',
    description: 'Tactile mechanical switch keyboard with hot-swappable switches, customizable RGB backlighting, and a premium aluminum top frame.',
    price: 129.50,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    category: 'Electronics',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prod-3',
    sellerId: 'user-seller-1',
    sellerName: 'Tech Central',
    title: 'UltraView 27" Gaming Monitor',
    description: '4K IPS panel with a 144Hz refresh rate, 1ms response time, and HDR 400 support. Perfect for gaming and professional design work.',
    price: 449.00,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
    category: 'Electronics',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prod-4',
    sellerId: 'user-seller-2',
    sellerName: 'Apex Threads',
    title: 'Legacy Leather Bomber Jacket',
    description: 'Genuine full-grain leather bomber jacket featuring custom brass hardware, rib-knit cuffs, and a satin lining. Timeless style.',
    price: 189.99,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    category: 'Apparel',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prod-5',
    sellerId: 'user-seller-2',
    sellerName: 'Apex Threads',
    title: 'Stride Tech Running Shoes',
    description: 'Lightweight, high-cushion road running shoes engineered with carbon fiber plates for energy return and breathability.',
    price: 85.00,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    category: 'Apparel',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prod-6',
    sellerId: 'user-seller-2',
    sellerName: 'Apex Threads',
    title: 'Minimalist Canvas Daypack',
    description: 'Water-resistant wax canvas backpack featuring a padded 15" laptop sleeve, quick-access pockets, and full-grain leather straps.',
    price: 59.99,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    category: 'Accessories',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Initial static seed reviews
export const INITIAL_REVIEWS: MockReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    buyerId: 'user-buyer-1',
    buyerName: 'Alice Smith',
    rating: 5,
    comment: 'Absolutely stunning sound quality and super comfortable. Worth every penny!',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    buyerId: 'user-buyer-2',
    buyerName: 'Bob Jones',
    rating: 4,
    comment: 'ANC is fantastic, but the headband feels slightly tight after a few hours of wear.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    buyerId: 'user-buyer-1',
    buyerName: 'Alice Smith',
    rating: 5,
    comment: 'Best mechanical keyboard I have owned. The switches feel extremely premium.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-4',
    productId: 'prod-4',
    buyerId: 'user-buyer-2',
    buyerName: 'Bob Jones',
    rating: 5,
    comment: 'The leather quality is incredible. True to size and matches anything.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
