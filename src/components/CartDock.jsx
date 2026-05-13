import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronUp } from 'lucide-react';
import useStore from '../store/useStore';
import CheckoutModal from './CheckoutModal';

/**
 * CartDock – Persistent macOS-style floating dock at the bottom of the screen.
 * Shows item count badge and cart total.
 * Clicking expands the CheckoutModal via AnimatePresence.
 */
const CartDock = () => {
  const cart = useStore(s => s.cart);
  const [open, setOpen] = useState(false);

  const totalItems = cart.reduce((t, i) => t + i.quantity, 0);
  const subtotal   = cart.reduce((t, i) => t + i.price * i.quantity, 0);

  return (
    <>
      {/* Dock trigger */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.3 }}
        style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 900,
        }}
      >
        <motion.button
          onClick={() => setOpen(o => !o)}
          whileHover={{ scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: 'var(--accent-orange)',
            border: 'none',
            borderRadius: 999,
            padding: '14px 32px',
            cursor: 'pointer',
            color: '#fff',
            fontFamily: 'var(--font-base)',
            boxShadow: '0 10px 30px rgba(255, 79, 0, 0.3)',
            minWidth: 260,
          }}
        >
          {/* Cart icon with badge */}
          <div style={{ position: 'relative' }}>
            <ShoppingCart size={22} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: '#fff',
                    color: 'var(--accent-orange)',
                    borderRadius: '50%',
                    width: 18,
                    height: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                  }}
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
            {totalItems === 0 ? 'Cart is empty' : `${totalItems} item${totalItems > 1 ? 's' : ''}`}
          </span>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontWeight: 800,
              fontSize: '1.05rem',
              color: '#fff',
            }}>
              ₹{subtotal}
            </span>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            >
              <ChevronUp size={18} color="rgba(255,255,255,0.7)" />
            </motion.div>
          </div>
        </motion.button>
      </motion.div>

      {/* Checkout Modal Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(10px)',
                zIndex: 950,
              }}
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              style={{
                position: 'fixed',
                bottom: 100,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 960,
                width: '100%',
                maxWidth: 450,
                background: '#fff',
                border: '1.5px solid var(--glass-border)',
                borderRadius: 24,
                boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
                overflow: 'hidden',
              }}
            >
              <CheckoutModal onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDock;
