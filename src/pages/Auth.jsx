import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Hash, Eye, EyeOff, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import useStore from '../store/useStore';
import { loginWithGoogle } from '../firebase/authService';

/**
 * Auth Page – Cupertino-style login & registration module
 *
 * TODO: Firebase Authentication Integration
 *   import { auth } from '../firebase/config';
 *   import {
 *     signInWithEmailAndPassword,
 *     createUserWithEmailAndPassword,
 *   } from 'firebase/auth';
 *
 *   Login:
 *     const handleLogin = async () => {
 *       const userCred = await signInWithEmailAndPassword(auth, email, password);
 *       setUser({ uid: userCred.user.uid, name: ..., role: 'customer' });
 *     };
 *
 *   Register:
 *     const handleRegister = async () => {
 *       const userCred = await createUserWithEmailAndPassword(auth, email, password);
 *       // Store additional info (studentId, name, role) in Firestore:
 *       await setDoc(doc(db, 'users', userCred.user.uid), {
 *         name, studentId, role: 'customer', email,
 *       });
 *     };
 */

const TABS = ['login', 'register'];

const formVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -20 },
};

const Auth = () => {
  const setActiveView = useStore(s => s.setActiveView);
  const setUser       = useStore(s => s.setUser);

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleGoogleLogin = async (requestedRole) => {
    setError('');
    setLoading(true);

    try {
      const { user, role } = await loginWithGoogle(requestedRole);
      
      // Update global store
      setUser({ 
        uid: user.uid,
        name: user.displayName || 'Mingo User', 
        email: user.email, 
        photoURL: user.photoURL,
        role: role 
      });

      // Route based on role
      setActiveView(role === 'admin' ? 'admin' : role === 'delivery' ? 'delivery' : 'customer');
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      paddingTop: 100,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.15 }}
        style={{ width: '100%', maxWidth: 460 }}
      >
        {/* Hero text */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22, delay: 0.05 }}
            style={{ fontSize: '3.5rem', marginBottom: 12 }}
          >
            🍽
          </motion.div>
          <h1 style={{
            fontSize: '2.1rem',
            fontWeight: 800,
            color: 'var(--accent-orange)',
            letterSpacing: '-0.02em',
            marginBottom: 6,
          }}>
            Mingo Mates
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Big Mingos Campus Canteen Service
          </p>
        </div>

        <GlassCard noHover style={{ borderRadius: 28, overflow: 'hidden' }}>
          <div style={{ padding: '32px 36px' }}>
            {/* Form Area */}
            <AnimatePresence mode="wait">
              <motion.div
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.22 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 12 }}>
                  Sign in using your college Gmail account to continue.
                </p>

                {/* Error */}
                {error && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--accent-red)', background: 'rgba(255,69,58,0.1)', border: '1px solid rgba(255,69,58,0.2)', borderRadius: 10, padding: '8px 12px' }}>
                    {error}
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                  <motion.button
                    onClick={() => handleGoogleLogin('customer')}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', background: '#4285F4', color: '#fff' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={loading}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      🎓 Sign In as Customer
                    </span>
                  </motion.button>

                  <motion.button
                    onClick={() => handleGoogleLogin('delivery')}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', background: 'var(--accent-amber)', color: '#fff' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={loading}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      🛵 Sign In as Delivery
                    </span>
                  </motion.button>

                  <motion.button
                    onClick={() => handleGoogleLogin('admin')}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', background: '#EF4444', color: '#fff' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={loading}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      ⚙️ Sign In as Admin
                    </span>
                  </motion.button>
                </div>

                {loading && (
                  <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 8 }}>
                    <span className="spinner" style={{ display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }} />
                    Connecting to Google...
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Auth;
