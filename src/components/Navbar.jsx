import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const NAV_ITEMS = [
  { id: 'auth',     label: 'Welcome',   emoji: '👋' },
  { id: 'customer', label: 'Menu',      emoji: '🍽️' },
  { id: 'delivery', label: 'Delivery',  emoji: '🛵' },
  { id: 'admin',    label: 'Admin',     emoji: '⚙️' },
];

/**
 * Navbar – Fixed glass island navigation bar (macOS-inspired pill)
 * Shows the active view with a sliding indicator.
 * Clicking a tab switches the view in the global store.
 *
 * TODO: Firebase – only show tabs relevant to the user's role:
 *   const { user } = useStore();
 *   // user.role determines which tabs are visible
 */
const Navbar = () => {
  const activeView = useStore(s => s.activeView);
  const setActiveView = useStore(s => s.setActiveView);
  const user = useStore(s => s.user);

  // Determine which tabs to show based on user role
  const role = user?.role || 'customer';
  const visibleItems = NAV_ITEMS.filter(item => {
    if (item.id === 'auth') return true; // Always show the Welcome/Login tab for demo purposes
    if (item.id === role) return true;   // Only show the tab matching their role
    return false;
  });

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      pointerEvents: 'none',
    }}>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.1 }}
        style={{
          pointerEvents: 'all',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(226, 232, 240, 0.8)',
          borderRadius: 999,
          padding: '6px 8px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        }}
      >
        {/* Logo */}
        <div style={{
          paddingLeft: 10,
          paddingRight: 14,
          fontSize: '1.05rem',
          fontWeight: 800,
          color: 'var(--accent-orange)',
          letterSpacing: '-0.01em',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}>
          🍽 Mingo Mates
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: 'var(--glass-border)', marginRight: 4 }} />

        {/* Nav tabs */}
        {visibleItems.map(item => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                background: 'transparent',
                border: 'none',
                borderRadius: 999,
                cursor: 'pointer',
                color: isActive ? 'var(--accent-orange)' : 'var(--text-muted)',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'var(--font-base)',
                transition: 'all 200ms ease',
                zIndex: 1,
              }}
            >
              {/* Active pill indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(255, 79, 0, 0.1)',
                      borderRadius: 999,
                      border: '1px solid rgba(255, 79, 0, 0.2)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <span style={{ position: 'relative', zIndex: 1, filter: isActive ? 'none' : 'grayscale(1)' }}>{item.emoji}</span>
              <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Navbar;
