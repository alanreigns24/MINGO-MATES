import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Flame } from 'lucide-react';
import useStore from '../store/useStore';

const InteractiveCard = ({ item }) => {
  const addToCart    = useStore(s => s.addToCart);
  const removeFromCart = useStore(s => s.removeFromCart);
  const cart         = useStore(s => s.cart);

  const cartItem = cart.find(c => c.id === item.id);
  const quantity = cartItem?.quantity ?? 0;

  const categoryColor = item.category === 'meal'
    ? 'var(--accent-blue)'
    : item.category === 'drink'
      ? 'var(--accent-teal)'
      : 'var(--accent-amber)';

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
      style={{
        padding: '22px 20px',
        borderRadius: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
        background: quantity > 0
          ? 'rgba(255, 79, 0, 0.04)' // Very light orange tint
          : '#ffffff',
        border: quantity > 0
          ? '1.5px solid var(--accent-orange)'
          : '1px solid var(--glass-border)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
        transition: 'border-color 200ms ease, background 200ms ease',
        cursor: 'pointer',
      }}
    >
      {/* Popular badge */}
      {item.popular && (
        <span style={{
          position: 'absolute',
          top: 14,
          right: 14,
          background: 'rgba(247,37,133,0.1)',
          border: '1px solid rgba(247,37,133,0.2)',
          borderRadius: 999,
          padding: '3px 10px',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--accent-red)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <Flame size={10} /> Popular
        </span>
      )}

      {/* Item Image */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        style={{ 
          width: '100%', 
          height: '160px', 
          overflow: 'hidden', 
          borderRadius: '14px',
          background: 'var(--bg-secondary)'
        }}
      >
        <img 
          src={`/menu-images/${
            item.id === 'm2' ? 'md.jpg' :
            item.id === 's3' ? 'mm.jpg' :
            item.id === 's4' ? 'bo.png' :
            item.id === 's5' ? 'ff.jpg' :
            item.id === 's6' ? 'vp.jpg' :
            item.id === 'd2' ? 'cc.jpg' :
            item.id === 'd3' ? 'np.jpg' :
            item.id + '.jpg'
          }`} 
          alt={item.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </motion.div>

      {/* Category chip */}
      <span style={{
        fontSize: '0.7rem',
        fontWeight: 600,
        color: categoryColor,
        background: `${categoryColor}10`,
        border: `1px solid ${categoryColor}30`,
        borderRadius: 999,
        padding: '3px 10px',
        width: 'fit-content',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {item.category}
      </span>

      {/* Name & description */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 4, color: 'var(--text-main)' }}>{item.name}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          {item.description}
        </p>
      </div>

      {/* Price + Add controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 10 }}>
        <span style={{
          fontWeight: 800,
          fontSize: '1.25rem',
          color: 'var(--accent-orange)',
        }}>
          ₹{item.price}
        </span>

        <AnimatePresence mode="wait">
          {quantity === 0 ? (
            <motion.button
              key="add"
              id={`add-${item.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="btn btn-primary btn-sm"
              onClick={(e) => { e.stopPropagation(); addToCart(item); }}
              style={{
                borderRadius: 999,
                fontWeight: 700,
                padding: '8px 16px',
                boxShadow: '0 4px 14px rgba(255, 79, 0, 0.25)',
              }}
            >
              Add
            </motion.button>
          ) : (
            <motion.div
              key="counter"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileTap={{ scale: 0.85 }}
                className="btn btn-ghost btn-sm"
                style={{ padding: '8px', minWidth: 'unset', borderRadius: '50%' }}
                onClick={() => removeFromCart(item.id)}
              >
                <Minus size={14} strokeWidth={3} />
              </motion.button>
              <span style={{ fontWeight: 800, minWidth: 20, textAlign: 'center', fontSize: '1.1rem' }}>{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                className="btn btn-primary btn-sm"
                style={{ padding: '8px', minWidth: 'unset', borderRadius: '50%', boxShadow: '0 4px 14px rgba(255, 79, 0, 0.25)' }}
                onClick={() => addToCart(item)}
              >
                <Plus size={14} strokeWidth={3} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default InteractiveCard;
