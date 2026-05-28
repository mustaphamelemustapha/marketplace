import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/marketplace';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in correct dependency order)
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned up existing database records.');

  // Create hashed passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Users
  console.log('👥 Creating users...');
  
  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@marketplace.com',
      passwordHash,
      role: 'ADMIN',
      profile: {
        create: {
          firstName: 'System',
          lastName: 'Administrator',
        },
      },
    },
  });

  // Sellers
  const seller1 = await prisma.user.create({
    data: {
      email: 'seller1@marketplace.com',
      passwordHash,
      role: 'SELLER',
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Gadget',
          businessName: 'Tech Central',
          bio: 'Your premier source for high-quality electronics and gaming gear.',
          phoneNumber: '+15550101',
          address: '100 Silicon Valley Way, CA',
        },
      },
    },
  });

  const seller2 = await prisma.user.create({
    data: {
      email: 'seller2@marketplace.com',
      passwordHash,
      role: 'SELLER',
      profile: {
        create: {
          firstName: 'Sarah',
          lastName: 'Vogue',
          businessName: 'Apex Threads',
          bio: 'Chic, premium quality streetwear and accessories designed locally.',
          phoneNumber: '+15550202',
          address: '200 Fashion Ave, NY',
        },
      },
    },
  });

  // Buyers
  const buyer1 = await prisma.user.create({
    data: {
      email: 'buyer1@marketplace.com',
      passwordHash,
      role: 'BUYER',
      profile: {
        create: {
          firstName: 'Alice',
          lastName: 'Smith',
          phoneNumber: '+15550303',
          address: '12 Oak Lane, Austin, TX',
        },
      },
    },
  });

  const buyer2 = await prisma.user.create({
    data: {
      email: 'buyer2@marketplace.com',
      passwordHash,
      role: 'BUYER',
      profile: {
        create: {
          firstName: 'Bob',
          lastName: 'Jones',
          phoneNumber: '+15550404',
          address: '45 Pine Street, Seattle, WA',
        },
      },
    },
  });

  console.log('✅ Users & Profiles created.');

  // 2. Create Products
  console.log('📦 Creating products...');

  // Seller 1 Products (Tech)
  const p1 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      title: 'AeroSound Pro Wireless Headphones',
      description: 'Experience industry-leading active noise cancellation, spatial audio, and up to 40 hours of battery life. Crafted for audiophiles.',
      price: 299.99,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      category: 'Electronics',
      status: 'ACTIVE',
    },
  });

  const p2 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      title: 'Matrix-X Mechanical Keyboard',
      description: 'Tactile mechanical switch keyboard with hot-swappable switches, customizable RGB backlighting, and a premium aluminum top frame.',
      price: 129.50,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
      category: 'Electronics',
      status: 'ACTIVE',
    },
  });

  const p3 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      title: 'UltraView 27" Gaming Monitor',
      description: '4K IPS panel with a 144Hz refresh rate, 1ms response time, and HDR 400 support. Perfect for gaming and professional design work.',
      price: 449.00,
      stock: 8,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
      category: 'Electronics',
      status: 'ACTIVE',
    },
  });

  // Seller 2 Products (Fashion)
  const p4 = await prisma.product.create({
    data: {
      sellerId: seller2.id,
      title: 'Legacy Leather Bomber Jacket',
      description: 'Genuine full-grain leather bomber jacket featuring custom brass hardware, rib-knit cuffs, and a satin lining. Timeless style.',
      price: 189.99,
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      category: 'Apparel',
      status: 'ACTIVE',
    },
  });

  const p5 = await prisma.product.create({
    data: {
      sellerId: seller2.id,
      title: 'Stride Tech Running Shoes',
      description: 'Lightweight, high-cushion road running shoes engineered with carbon fiber plates for energy return and breathability.',
      price: 85.00,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      category: 'Apparel',
      status: 'ACTIVE',
    },
  });

  const p6 = await prisma.product.create({
    data: {
      sellerId: seller2.id,
      title: 'Minimalist Canvas Daypack',
      description: 'Water-resistant wax canvas backpack featuring a padded 15" laptop sleeve, quick-access pockets, and full-grain leather straps.',
      price: 59.99,
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      category: 'Accessories',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Products created.');

  // 3. Create Reviews
  console.log('⭐ Creating reviews...');

  await prisma.review.create({
    data: {
      productId: p1.id,
      buyerId: buyer1.id,
      rating: 5,
      comment: 'Absolutely stunning sound quality and super comfortable. Worth every penny!',
    },
  });

  await prisma.review.create({
    data: {
      productId: p1.id,
      buyerId: buyer2.id,
      rating: 4,
      comment: 'ANC is fantastic, but the headband feels slightly tight after a few hours of wear.',
    },
  });

  await prisma.review.create({
    data: {
      productId: p2.id,
      buyerId: buyer1.id,
      rating: 5,
      comment: 'Best mechanical keyboard I have owned. The switches feel extremely premium.',
    },
  });

  await prisma.review.create({
    data: {
      productId: p4.id,
      buyerId: buyer2.id,
      rating: 5,
      comment: 'The leather quality is incredible. True to size and matches anything.',
    },
  });

  console.log('✅ Reviews created.');
  console.log('🎉 Database seeding complete!');
  
  await pool.end();
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  });
