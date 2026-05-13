import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import useStore, { calculateCommission, calculateFoodTotal, calculateDrinkTotal } from '../store/useStore';

/**
 * CheckoutModal – Spring-from-bottom order summary modal
 * Shows itemised cart, commission calculation, and total.
 *
 * Commission formula (as defined by Mingo Mates):
 *   Delivery Partner Commission = (Total_Food × 20) + (Total_Drink × 10)
 *   NOTE: snacks treated as food for commission rate of 15 per item
 *
 * TODO: Firebase – on "Place Order" button:
 *   const orderRef = await addDoc(collection(db, 'orders'), {
 *     studentId: user.uid,
 *     studentName: user.displayName,
 *     items: cart,
 *     total: grandTotal,
 *     commission: commission,
 *     status: 'pending',
 *     location: deliveryLocation,
 *     time: serverTimestamp(),
 *   });
 */
const CheckoutModal = ({ onClose }) => {
  const cart = useStore(s => s.cart);
  const placeOrder = useStore(s => s.placeOrder);
  const user = useStore(s => s.user);
  const [block, setBlock] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [placed, setPlaced] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const blocks = ['A', 'B', 'C', 'D', 'E', 'F'];
  const floors = ['1', '2', '3', '4', '5'];
  const getRoomsForFloor = (f) => {
    if (!f) return [];
    const base = parseInt(f) * 100;
    return Array.from({ length: 8 }, (_, i) => base + i + 1);
  };

  const handleFloorChange = (e) => {
    setFloor(e.target.value);
    setRoom('');
  };

  const foodTotal  = calculateFoodTotal(cart);
  const drinkTotal = calculateDrinkTotal(cart);
  const subtotal   = cart.reduce((t, i) => t + i.price * i.quantity, 0);

  // Commission: meal/snack items × 20 + drink items × 10
  const mealCount  = cart.filter(i => i.category === 'meal' || i.category === 'snack').reduce((t,i) => t + i.quantity, 0);
  const drinkCount = cart.filter(i => i.category === 'drink').reduce((t,i) => t + i.quantity, 0);
  const commission = mealCount * 20 + drinkCount * 10;

  const grandTotal = subtotal; // commission is paid externally by platform

  const handlePlace = () => {
    if (!block || !floor || !room) {
      setErrorMsg("choose a location where u want food to be delivered");
      return;
    }
    setErrorMsg('');
    const fullLocation = `Block ${block}, Floor ${floor}, Room ${room}`;
    placeOrder({
      studentId:   user?.studentId ?? 'STU-DEMO',
      studentName: user?.name ?? 'Demo Student',
      location: fullLocation,
      items:       cart,
      total:       grandTotal,
      commission,
    });
    setPlaced(true);
    setTimeout(onClose, 2200);
  };

  if (cart.length === 0 && !placed) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🛒</div>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="checkout"
        initial={{ opacity: 0, y: 50, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        style={{ padding: '28px 32px', minWidth: 440, maxWidth: 540 }}
      >
        {placed ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{ fontSize: '4rem', marginBottom: 16 }}
            >
              ✅
            </motion.div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8, color: 'var(--accent-orange)' }}>Order Placed!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Your delivery partner will be assigned shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>Order Summary</h2>
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.4rem' }}>{item.emoji}</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)' }}>{item.name}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>× {item.quantity}</p>
                    </div>
                  </div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--glass-border)', marginBottom: 16 }} />

            {/* Delivery Location */}
            <div className="input-group" style={{ marginBottom: 16 }}>
              <label className="input-label">Delivery Location</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  className="input-field"
                  style={{ flex: 1, padding: '12px' }}
                  value={block}
                  onChange={e => setBlock(e.target.value)}
                >
                  <option value="">Block</option>
                  {blocks.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                <select
                  className="input-field"
                  style={{ flex: 1, padding: '12px' }}
                  value={floor}
                  onChange={handleFloorChange}
                >
                  <option value="">Floor</option>
                  {floors.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>

                <select
                  className="input-field"
                  style={{ flex: 1, padding: '12px' }}
                  value={room}
                  onChange={e => setRoom(e.target.value)}
                  disabled={!floor}
                >
                  <option value="">Room</option>
                  {getRoomsForFloor(floor).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              {errorMsg && (
                <p style={{ color: 'var(--accent-red, #ef4444)', fontSize: '0.8rem', marginTop: '6px' }}>
                  {errorMsg}
                </p>
              )}
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <span>Food Subtotal</span>
                <span>₹{foodTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <span>Drinks Subtotal</span>
                <span>₹{drinkTotal}</span>
              </div>

              {/* Commission line — highlighted */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(249,115,22,0.08)',
                border: '1px solid rgba(249,115,22,0.2)',
                borderRadius: 10,
                padding: '8px 12px',
                fontSize: '0.85rem',
              }}>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--accent-orange)' }}>Delivery Partner Commission</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    (Food × 20 + Drink × 10) = ({mealCount} × 20 + {drinkCount} × 10)
                  </p>
                </div>
                <span style={{ fontWeight: 800, color: 'var(--accent-orange)' }}>₹{commission}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem', marginTop: 4 }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent-orange)' }}>
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '1rem', padding: '14px' }}
              onClick={handlePlace}
            >
              <ShoppingBag size={18} />
              Place Order
            </button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
