import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Clock, Package, ChevronRight, CheckCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatusDot from '../components/StatusDot';
import useStore from '../store/useStore';

/**
 * DeliveryPortal – 'Bounty Feed' for delivery partners.
 *
 * Features:
 *  - AnimatedList of available orders (status === 'pending')
 *  - Click to expand order card using Framer Motion layoutId morphing
 *  - Slide-to-accept bar using drag constraint
 *  - commission display per order
 *
 * TODO: Firebase real-time integration:
 *   useEffect(() => {
 *     const q = query(collection(db, 'orders'), where('status', '==', 'pending'));
 *     const unsub = onSnapshot(q, snap => {
 *       const incoming = snap.docs.map(d => ({ id: d.id, ...d.data() }));
 *       setOrders(incoming); // new orders will animate in via AnimatePresence
 *     });
 *     return unsub;
 *   }, []);
 */

// Slide-to-accept bar component
const SlideToAccept = ({ onAccept }) => {
  const x = useMotionValue(0);
  const bgOpacity = useTransform(x, [0, 180], [0, 1]);
  const trackRef = useRef(null);
  const [accepted, setAccepted] = useState(false);

  const handleDragEnd = (_, info) => {
    if (info.point.x - (trackRef.current?.getBoundingClientRect().left ?? 0) > 160) {
      setAccepted(true);
      setTimeout(onAccept, 500);
    } else {
      x.set(0);
    }
  };

  return (
    <div
      ref={trackRef}
      style={{
        position: 'relative',
        height: 54,
        background: '#f0fdf4',
        border: '1.5px solid #dcfce7',
        borderRadius: 999,
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Fill track */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, #dcfce7, #f0fdf4)',
          opacity: bgOpacity,
        }}
      />

      {/* Label */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: accepted ? 'var(--accent-green)' : 'rgba(48,209,88,0.6)',
        gap: 8,
        pointerEvents: 'none',
      }}>
        {accepted ? <><CheckCircle size={16} /> Claimed!</> : <>Slide to claim order →</>}
      </div>

      {/* Draggable knob */}
      {!accepted && (
        <motion.div
          drag="x"
          dragConstraints={trackRef}
          dragElastic={0.05}
          style={{
            x,
            position: 'absolute',
            left: 4,
            top: '50%',
            y: '-50%',
            width: 46,
            height: 46,
            background: 'linear-gradient(135deg, #30d158, #00c9b8)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            boxShadow: '0 4px 20px rgba(48,209,88,0.4)',
            zIndex: 2,
          }}
          whileDrag={{ cursor: 'grabbing', scale: 1.1 }}
          onDragEnd={handleDragEnd}
        >
          <ChevronRight size={20} color="#fff" />
        </motion.div>
      )}
    </div>
  );
};

// Individual order card in the feed
const OrderCard = ({ order, isSelected, onSelect }) => {
  const claimOrder = useStore(s => s.claimOrder);
  const [claimed, setClaimed] = useState(order.deliveryPartnerId !== null);

  const handleClaim = () => {
    claimOrder(order.id, 'DEL-CURRENT');
    setClaimed(true);
  };

  return (
    <motion.div layoutId={`order-card-${order.id}`}>
      <GlassCard
        onClick={() => !isSelected && onSelect(order.id)}
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          border: isSelected
            ? '1.5px solid var(--accent-orange)'
            : '1px solid var(--glass-border)',
        }}
        noHover={isSelected}
      >
        <div style={{ padding: '20px 24px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <StatusDot status={order.status} showLabel />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {order.id}
                </span>
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{order.studentName}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                ID: {order.studentId}
              </p>
            </div>

            {/* Commission badge */}
            <div style={{
              background: 'rgba(48,209,88,0.12)',
              border: '1px solid rgba(48,209,88,0.25)',
              borderRadius: 14,
              padding: '8px 14px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '0.7rem', color: 'rgba(232,232,245,0.4)', fontWeight: 600 }}>COMMISSION</p>
              <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-green)' }}>
                ₹{order.commission}
              </p>
            </div>
          </div>

          {/* Location + Time row */}
          <div style={{ display: 'flex', gap: 20, marginBottom: isSelected ? 18 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <MapPin size={14} color="var(--accent-blue)" />
              {order.location}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Clock size={14} color="var(--accent-amber)" />
              {order.time}
            </div>
          </div>

          {/* Expanded detail panel */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                style={{ overflow: 'hidden' }}
              >
                {/* Items list */}
                <div style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  marginBottom: 16,
                }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(232,232,245,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Items
                  </p>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '4px 0' }}>
                      <span>{item.name} × {item.quantity}</span>
                      <span style={{ color: 'rgba(232,232,245,0.45)' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>Total</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>

                {/* Pickup & delivery info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                  <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.18)', borderRadius: 14, padding: '12px 14px' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--accent-orange)', fontWeight: 600, marginBottom: 4 }}>PICKUP</p>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700 }}>Big Mingos Counter</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Main Canteen, Ground Floor</p>
                  </div>
                  <div style={{ background: 'rgba(58,141,255,0.08)', border: '1px solid rgba(58,141,255,0.18)', borderRadius: 14, padding: '12px 14px' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 600, marginBottom: 4 }}>DELIVERY</p>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700 }}>{order.location}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Student ID: {order.studentId}</p>
                  </div>
                </div>

                {/* Slide to accept */}
                {!claimed && order.status === 'pending' && (
                  <SlideToAccept onAccept={handleClaim} />
                )}
                {(claimed || order.status !== 'pending') && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '14px',
                    background: '#f0fdf4',
                    border: '1.5px solid #dcfce7',
                    borderRadius: 999,
                    color: 'var(--accent-green)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}>
                    <CheckCircle size={18} /> Order Claimed
                  </div>
                )}

                {/* Collapse button */}
                <button
                  onClick={(e) => { e.stopPropagation(); onSelect(null); }}
                  style={{
                    display: 'block',
                    marginTop: 12,
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(232,232,245,0.3)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-base)',
                    padding: '6px 0',
                  }}
                >
                  ↑ Collapse
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const DeliveryPortal = () => {
  const orders   = useStore(s => s.orders);
  const [selectedId, setSelectedId] = useState(null);

  const pendingOrders  = orders.filter(o => o.status === 'pending');
  const activeOrders   = orders.filter(o => o.status === 'en_route');
  const myTotalEarned  = orders.filter(o => o.status === 'delivered' && o.deliveryPartnerId === 'DEL-CURRENT')
    .reduce((t, o) => t + o.commission, 0);

  const handleSelect = (id) => setSelectedId(prev => prev === id ? null : id);

  return (
    <div className="page-wrapper" style={{ paddingTop: 96 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 80px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.1 }}
          style={{ marginBottom: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <div>
            <h1 style={{
              fontSize: '2.6rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--accent-orange)',
              marginBottom: 6,
            }}>
              Bounty Feed
            </h1>
            <p style={{ color: 'rgba(232,232,245,0.45)', fontSize: '0.95rem' }}>
              Pick up orders and earn commission per delivery
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 14 }}>
            {[
              { label: 'Available', value: pendingOrders.length, color: 'var(--accent-blue)' },
              { label: 'En Route', value: activeOrders.length, color: 'var(--accent-amber)' },
              { label: 'Earned Today', value: `₹${myTotalEarned}`, color: 'var(--accent-green)' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: '#fff',
                border: '1px solid var(--glass-border)',
                borderRadius: 16,
                padding: '14px 20px',
                textAlign: 'center',
                minWidth: 110,
              }}>
                <p style={{ fontWeight: 800, fontSize: '1.4rem', color: stat.color }}>{stat.value}</p>
                <p style={{ fontSize: '0.72rem', color: 'rgba(232,232,245,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* Available orders feed */}
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              🟢 Available Orders
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <AnimatePresence>
                {pendingOrders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(232,232,245,0.3)' }}
                  >
                    <Package size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
                    <p>No available orders right now</p>
                  </motion.div>
                ) : (
                  pendingOrders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 26, delay: i * 0.06 }}
                    >
                      <OrderCard
                        order={order}
                        isSelected={selectedId === order.id}
                        onSelect={handleSelect}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Active / en-route orders */}
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              🟡 My Active Deliveries
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <AnimatePresence>
                {activeOrders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(232,232,245,0.3)' }}
                  >
                    <p>No active deliveries</p>
                  </motion.div>
                ) : (
                  activeOrders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 26, delay: i * 0.06 }}
                    >
                      <OrderCard
                        order={order}
                        isSelected={selectedId === order.id}
                        onSelect={handleSelect}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPortal;
