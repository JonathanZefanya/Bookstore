// API types matching backend entities

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'ADMIN' | 'STAFF' | 'USER';
  isActive: boolean;
  createdAt: string;
}

export interface Publisher {
  id: number;
  name: string;
  description?: string;
  website?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Book {
  id: number;
  title: string;
  slug: string;
  author?: string;
  isbn?: string;
  description?: string;
  price: number;
  weightGram?: number;
  publishYear?: number;
  stock: number;
  coverImage?: string;
  publisher?: Publisher;
  category?: Category;
  createdAt: string;
}

export interface Review {
  id: number;
  user: User;
  book: Book;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CartItem {
  id: number;
  book: Book;
  quantity: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
}

export interface OrderItem {
  id: number;
  book: Book;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  user: User;
  totalAmount: number;
  shippingCost: number;
  grandTotal: number;
  shippingAddress?: string;
  paymentStatus: 'UNPAID' | 'PAID' | 'FAILED';
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
  notes?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface Settings {
  id?: number;
  siteName?: string;
  siteLogo?: string;
  siteFavicon?: string;
  themeColor?: string;
  footerText?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: string;
}
