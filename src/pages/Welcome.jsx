import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';

/**
 * Welcome Page - First screen the user sees
 */
const Welcome = () => {
  const setActiveView = useStore(s => s.setActiveView);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
      padding: 24,
    }}>
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        style={{
          fontSize: '7rem',
          marginBottom: 24,
          filter: 'drop-shadow(0 20px 40px rgba(255, 79, 0, 0.2))'
        }}
      >
        🍽️
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.3 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 900,
          color: 'var(--accent-orange)',
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          marginBottom: 16
        }}>
          Welcome to<br />Mingo Mates
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-muted)',
          fontWeight: 500,
          marginBottom: 48,
          maxWidth: 400,
          margin: '0 auto 48px auto',
          lineHeight: 1.5
        }}>
          The hyper-clean, lightning-fast campus canteen experience.
        </p>

        <motion.button
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveView('auth')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--accent-orange)',
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            padding: '18px 42px',
            fontSize: '1.2rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 12px 30px rgba(255, 79, 0, 0.3)',
          }}
        >
          Get Started
          <ArrowRight size={24} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Welcome;
