import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Cart, CartItem } from '../types';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  addToCart: (bookId: number, quantity?: number) => Promise<void>;
  updateQuantity: (bookId: number, quantity: number) => Promise<void>;
  removeFromCart: (bookId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get<{ data: Cart }>('/user/cart');
      setCart(res.data.data);
    } catch {}
  };

  useEffect(() => {
    if (isAuthenticated) fetchCart();
    else setCart(null);
  }, [isAuthenticated]);

  const addToCart = async (bookId: number, quantity = 1) => {
    setLoading(true);
    try {
      const res = await api.post<{ data: Cart }>('/user/cart/add', { bookId, quantity });
      setCart(res.data.data);
      toast.success('Added to cart!');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (bookId: number, quantity: number) => {
    setLoading(true);
    try {
      const res = await api.put<{ data: Cart }>('/user/cart/update', { bookId, quantity });
      setCart(res.data.data);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (bookId: number) => {
    setLoading(true);
    try {
      const res = await api.delete<{ data: Cart }>(`/user/cart/remove/${bookId}`);
      setCart(res.data.data);
      toast.success('Removed from cart');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    await api.delete('/user/cart/clear');
    setCart(null);
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount: cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0,
      addToCart, updateQuantity, removeFromCart, clearCart, fetchCart, loading,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
