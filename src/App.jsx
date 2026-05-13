import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Welcome from './pages/Welcome';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import CustomerMenu from './pages/CustomerMenu';
import DeliveryPortal from './pages/DeliveryPortal';
import AdminDashboard from './pages/AdminDashboard';
import useStore from './store/useStore';
import { Toaster } from 'react-hot-toast';


const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transitionEnd: { transform: 'none' } },
  exit:    { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
};

const VIEW_MAP = {
  welcome:  Welcome,
  auth:     Auth,
  customer: CustomerMenu,
  delivery: DeliveryPortal,
  admin:    AdminDashboard,
};

function App() {
  const activeView = useStore(s => s.activeView);
  const ActivePage = VIEW_MAP[activeView] ?? Welcome;
  const subscribeToOrders = useStore(s => s.subscribeToOrders);

  useEffect(() => {
    const unsubscribe = subscribeToOrders();
    return () => unsubscribe && unsubscribe();
  }, [subscribeToOrders]);

  return (
    <>
      
      <div className="app-bg" aria-hidden>
        {(activeView !== 'auth' && activeView !== 'welcome') && <div className="orb3" />}
      </div>

     
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#fff',
            border: '1.5px solid var(--glass-border)',
            color: 'var(--text-main)',
            borderRadius: 12,
            fontSize: '0.9rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          },
        }}
      />

      {/* Global nav – hidden on auth and welcome screens */}
      {(activeView !== 'auth' && activeView !== 'welcome') && <Navbar />}

      {/* Animated page render */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <ActivePage />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default App;
