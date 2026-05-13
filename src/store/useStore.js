/**
 * Mingo Mates – Global Zustand Store
 *
 * TODO: Firebase Integration Points:
 *  - `user` state should be set from `onAuthStateChanged(auth, callback)`
 *  - `orders` should be populated via `onSnapshot(collection(db, 'orders'), callback)`
 *  - `placeOrder` should call `addDoc(collection(db, 'orders'), orderData)`
 *  - `claimOrder` should call `updateDoc(doc(db, 'orders', id), { status: 'en_route', deliveryPartnerId: uid })`
 *  - `updateOrderStatus` should call `updateDoc(doc(db, 'orders', id), { status })`
 */

import { create } from 'zustand';
import { db } from '../firebase/firebase';
import { collection, addDoc, updateDoc, doc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';

// Commission rates (per item category)
export const COMMISSION_RATES = {
  meal: 20,  // rs per meal item
  drink: 10, // rs per drink item
  snack: 15, // rs per snack item
};

// Calculate delivery partner commission from cart
export function calculateCommission(cart) {
  return cart.reduce((total, item) => {
    const rate = COMMISSION_RATES[item.category] ?? 10;
    return total + rate * item.quantity;
  }, 0);
}

// Calculate food subtotal (meals + snacks)
export function calculateFoodTotal(cart) {
  return cart
    .filter(i => i.category === 'meal' || i.category === 'snack')
    .reduce((t, i) => t + i.price * i.quantity, 0);
}

// Calculate drinks subtotal
export function calculateDrinkTotal(cart) {
  return cart
    .filter(i => i.category === 'drink')
    .reduce((t, i) => t + i.price * i.quantity, 0);
}

const MOCK_ORDERS = []; // Removed mock orders to use Firestore

const useStore = create((set, get) => ({
  // ─── Auth ─────────────────────────────────────────────────────────────────
  user: null,
  // TODO: Set user from Firebase: onAuthStateChanged(auth, u => set({ user: u }))

  setUser: (user) => set({ user }),
  logout: () => set({ user: null, cart: [] }),

  // ─── Navigation / View ────────────────────────────────────────────────────
  // Current active role view: 'welcome' | 'auth' | 'customer' | 'delivery' | 'admin'
  activeView: 'welcome',
  setActiveView: (view) => set({ activeView: view }),

  // ─── Cart ─────────────────────────────────────────────────────────────────
  cart: [],

  addToCart: (item) => set((state) => {
    const existing = state.cart.find(c => c.id === item.id);
    if (existing) {
      return {
        cart: state.cart.map(c =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        ),
      };
    }
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),

  removeFromCart: (itemId) => set((state) => ({
    cart: state.cart.reduce((acc, c) => {
      if (c.id !== itemId) return [...acc, c];
      if (c.quantity > 1) return [...acc, { ...c, quantity: c.quantity - 1 }];
      return acc;
    }, []),
  })),

  clearCart: () => set({ cart: [] }),

  // ─── Orders ───────────────────────────────────────────────────────────────
  orders: [],
  
  subscribeToOrders: () => {
    // Create a query against the collection, ordered by creation time descending
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    // Listen to real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ orders: ordersData });
    }, (error) => {
      console.error("Error listening to orders:", error);
    });

    return unsubscribe;
  },

  placeOrder: async (orderData) => {
    try {
      const newOrder = {
        ...orderData,
        status: 'pending',
        customerId: useStore.getState().user?.uid || 'anonymous',
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        deliveryPartnerId: null,
        createdAt: serverTimestamp(),
      };
      
      // Add to Firestore (this will automatically trigger onSnapshot and update the UI)
      await addDoc(collection(db, 'orders'), newOrder);
      
      // Clear cart
      set({ cart: [] });
    } catch (error) {
      console.error("Error placing order:", error);
    }
  },

  claimOrder: async (orderId, partnerId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { 
        status: 'en_route', 
        deliveryPartnerId: partnerId 
      });
    } catch (error) {
      console.error("Error claiming order:", error);
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  },

  // Filter state for admin
  adminFilter: 'all',
  setAdminFilter: (filter) => set({ adminFilter: filter }),
}));

export default useStore;
