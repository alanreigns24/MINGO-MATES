import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Flame } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import CartDock from '../components/CartDock';
import useStore from '../store/useStore';
import { MENU_ITEMS, CATEGORIES } from '../data/menuData';


import InteractiveCard from '../components/InteractiveCard';

const CustomerMenu = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(i => i.category === activeCategory);

  return (
    <div className="page-wrapper" style={{ paddingTop: 96, paddingBottom: 120 }}>
      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.1 }}
          style={{ marginBottom: 40 }}
        >
          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--accent-orange)',
            marginBottom: 8,
          }}>
            Today's Menu
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Fresh from Big Mingos kitchen, delivered to your room
          </p>
        </motion.div>

        {/* Category filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: 10, marginBottom: 36, flexWrap: 'wrap' }}
        >
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.id}
              id={`filter-${cat.id}`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 20px',
                border: activeCategory === cat.id
                  ? '1px solid var(--accent-orange)'
                  : '1px solid var(--glass-border)',
                borderRadius: 999,
                background: activeCategory === cat.id
                  ? 'var(--accent-orange)'
                  : 'var(--bg-secondary)',
                color: activeCategory === cat.id ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-base)',
                transition: 'all 200ms ease',
              }}
            >
              {cat.emoji} {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Bento grid */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26, delay: i * 0.04 }}
              >
                <InteractiveCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Floating cart dock */}
      <CartDock />
    </div>
  );
};

export default CustomerMenu;
