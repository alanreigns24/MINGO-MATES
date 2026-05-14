import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Users, BarChart2, Settings,
  ChevronDown, Filter, Download
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatusDot from '../components/StatusDot';
import useStore from '../store/useStore';

/**
 * AdminDashboard – Canteen Staff Command Center
 *
 * Features:
 *  - Blurred sidebar navigation
 *  - Orders table with status filter
 *  - Inline status update dropdown
 *  - Pulsing status dots per row
 *  - Summary KPI cards at the top
 *
 * TODO: Firebase real-time integration:
 *   useEffect(() => {
 *     const unsub = onSnapshot(collection(db, 'orders'), snap => {
 *       const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
 *       setOrders(all); // Firestore listener pushes live updates
 *     });
 *     return unsub;
 *   }, []);
 */

const NAV_ITEMS = [
  { id: 'orders',    icon: ShoppingBag,    label: 'Orders' },
  { id: 'customers', icon: Users,          label: 'Customers' },
  { id: 'analytics', icon: BarChart2,      label: 'Analytics' },
  { id: 'settings',  icon: Settings,       label: 'Settings' },
];

const STATUS_OPTIONS = ['pending', 'en_route', 'delivered'];
const FILTER_OPTIONS = ['all', 'pending', 'en_route', 'delivered'];

const StatusBadge = ({ status }) => {
  const colors = {
    pending:   { bg: '#fef2f2',  border: '#fee2e2',  text: 'var(--accent-red)' },
    en_route:  { bg: '#fffbeb', border: '#fef3c7', text: 'var(--accent-amber)' },
    delivered: { bg: '#f0fdf4',  border: '#dcfce7',  text: 'var(--accent-green)' },
  };
  const c = colors[status] ?? colors.pending;
  const labels = { pending: 'Pending', en_route: 'En Route', delivered: 'Delivered' };

  return (
    <span style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.text,
      borderRadius: 999,
      padding: '4px 12px',
      fontSize: '0.75rem',
      fontWeight: 700,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      whiteSpace: 'nowrap',
    }}>
      <StatusDot status={status} />
      {labels[status]}
    </span>
  );
};

// Inline status changer dropdown in table row
const StatusChanger = ({ orderId, current }) => {
  const updateOrderStatus = useStore(s => s.updateOrderStatus);
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: '5px 10px',
          color: 'rgba(232,232,245,0.5)',
          cursor: 'pointer',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-base)',
        }}
      >
        <ChevronDown size={12} /> Change
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 6,
              zIndex: 50,
              background: '#fff',
              border: '1.5px solid var(--glass-border)',
              borderRadius: 12,
              overflow: 'hidden',
              minWidth: 130,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }}
          >
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => { updateOrderStatus(orderId, s); setOpen(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 16px',
                  background: s === current ? 'rgba(249,115,22,0.1)' : 'transparent',
                  border: 'none',
                  color: s === current ? 'var(--accent-orange)' : 'var(--text-muted)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-base)',
                  fontWeight: s === current ? 700 : 400,
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={e => { if (s !== current) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { if (s !== current) e.currentTarget.style.background = 'transparent'; }}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminDashboard = () => {
  const orders        = useStore(s => s.orders);
  const adminFilter   = useStore(s => s.adminFilter);
  const setAdminFilter = useStore(s => s.setAdminFilter);
  const [activeNav, setActiveNav] = useState('orders');

  const filteredOrders = adminFilter === 'all'
    ? orders
    : orders.filter(o => o.status === adminFilter);

  // KPIs
  const totalRevenue   = orders.reduce((t, o) => t + o.total, 0);
  const totalCommission = orders.reduce((t, o) => t + o.commission, 0);
  const pendingCount   = orders.filter(o => o.status === 'pending').length;
  const enRouteCount   = orders.filter(o => o.status === 'en_route').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <div style={{ display: 'flex', height: '100vh', paddingTop: 72, overflow: 'hidden' }}>
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        style={{
          width: 220,
          flexShrink: 0,
          height: '100%',
          background: '#fff',
          borderRight: '1.5px solid var(--glass-border)',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          overflowY: 'auto',
        }}
      >
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(232,232,245,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 12px', marginBottom: 10 }}>
          Dashboard
        </p>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveNav(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 12,
                background: isActive ? 'rgba(249,115,22,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(249,115,22,0.3)' : '1px solid transparent',
                color: isActive ? 'var(--accent-orange)' : 'var(--text-muted)',
                fontFamily: 'var(--font-base)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                transition: 'all 180ms ease',
              }}
            >
              <Icon size={17} color={isActive ? 'var(--accent-blue)' : undefined} />
              {item.label}
            </motion.button>
          );
        })}

        {/* Spacer + logout area */}
        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '0.72rem', color: 'rgba(232,232,245,0.25)', padding: '0 14px', lineHeight: 1.4 }}>
            Logged in as Admin
            {/* TODO: Firebase – display auth.currentUser.displayName */}
          </p>
        </div>
      </motion.aside>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        {activeNav === 'analytics' ? (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <div style={{ marginBottom: 28 }}>
              <h1 style={{
                fontSize: '2.2rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--accent-orange)',
                marginBottom: 4,
              }}>
                Analytics
              </h1>
              <p style={{ color: 'rgba(232,232,245,0.4)', fontSize: '0.9rem' }}>
                Order status distribution
              </p>
            </div>

            <GlassCard noHover style={{ padding: 40, borderRadius: 22, maxWidth: 600 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 40, color: 'var(--text-primary)' }}>
                Order Status
              </h2>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 250, paddingBottom: 10, borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                {[
                  { label: 'Pending', count: pendingCount, color: 'var(--accent-red)' },
                  { label: 'En Route', count: enRouteCount, color: 'var(--accent-amber)' },
                  { label: 'Delivered', count: deliveredCount, color: 'var(--accent-green)' },
                ].map((item, i, arr) => {
                  const maxCount = Math.max(...arr.map(a => a.count), 1);
                  const heightPercentage = (item.count / maxCount) * 100;
                  return (
                    <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80, height: '100%', justifyContent: 'flex-end' }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercentage}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, type: 'spring' }}
                        style={{
                          width: '100%',
                          background: item.color,
                          borderRadius: '8px 8px 0 0',
                          opacity: 0.9,
                          position: 'relative',
                          minHeight: heightPercentage > 0 ? 4 : 0,
                        }}
                      >
                        <span style={{
                          position: 'absolute',
                          top: -28,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          color: 'var(--text-primary)',
                          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                          {item.count}
                        </span>
                      </motion.div>
                      <div style={{ marginTop: 15, width: 80, textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(232,232,245,0.6)' }}>
                        {item.label}
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.1 }}
          >
            {/* Page title */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--accent-orange)',
              marginBottom: 4,
            }}>
              Command Center
            </h1>
            <p style={{ color: 'rgba(232,232,245,0.4)', fontSize: '0.9rem' }}>
              Live overview of all Mingo Mates orders
            </p>
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Total Orders',    value: orders.length,    color: 'var(--accent-blue)',   emoji: '📦' },
              { label: 'Pending',         value: pendingCount,     color: 'var(--accent-red)',    emoji: '⏳' },
              { label: 'Delivered',       value: deliveredCount,   color: 'var(--accent-green)',  emoji: '✅' },
              { label: 'Revenue',         value: `₹${totalRevenue}`, color: 'var(--accent-amber)', emoji: '💰' },
            ].map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <GlassCard noHover style={{ borderRadius: 18, padding: '20px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '0.73rem', color: 'rgba(232,232,245,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                        {kpi.label}
                      </p>
                      <p style={{ fontSize: '2rem', fontWeight: 800, color: kpi.color }}>{kpi.value}</p>
                    </div>
                    <span style={{ fontSize: '2rem' }}>{kpi.emoji}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Orders Table */}
          <GlassCard noHover style={{ borderRadius: 22, overflow: 'hidden' }}>
            {/* Table header bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Filter size={16} color="rgba(232,232,245,0.4)" />
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>All Orders</span>
                <span style={{
                  background: 'rgba(249,115,22,0.1)',
                  color: 'var(--accent-orange)',
                  borderRadius: 999,
                  padding: '2px 10px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                }}>
                  {filteredOrders.length}
                </span>
              </div>

              {/* Filter pills */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {FILTER_OPTIONS.map(f => (
                  <button
                    key={f}
                    id={`admin-filter-${f}`}
                    onClick={() => setAdminFilter(f)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      border: adminFilter === f
                        ? '1px solid var(--accent-orange)'
                        : '1px solid var(--glass-border)',
                      background: adminFilter === f
                        ? 'var(--accent-orange)'
                        : '#fff',
                      color: adminFilter === f ? '#fff' : 'var(--text-muted)',
                      fontFamily: 'var(--font-base)',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all 180ms ease',
                    }}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}

                <button
                  className="btn btn-ghost btn-sm"
                  style={{ gap: 6 }}
                  title="Export CSV"
                >
                  <Download size={14} /> Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    {['Order ID', 'Student', 'Items', 'Total', 'Commission', 'Status', 'Time', 'Action'].map(col => (
                      <th key={col} style={{
                        padding: '12px 20px',
                        textAlign: 'left',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'rgba(232,232,245,0.35)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        whiteSpace: 'nowrap',
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredOrders.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          transition: 'background 150ms ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px 20px', fontSize: '0.82rem', fontFamily: 'monospace', color: 'rgba(232,232,245,0.5)' }}>
                          {order.id}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order.studentName}</p>
                          <p style={{ fontSize: '0.75rem', color: 'rgba(232,232,245,0.35)' }}>{order.studentId}</p>
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'rgba(232,232,245,0.55)' }}>
                          {order.items.map(i => i.name).join(', ').slice(0, 32)}
                          {order.items.map(i => i.name).join(', ').length > 32 ? '…' : ''}
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 700, fontSize: '0.95rem' }}>₹{order.total}</td>
                        <td style={{ padding: '14px 20px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-green)' }}>
                          ₹{order.commission}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <StatusBadge status={order.status} />
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '0.82rem', color: 'rgba(232,232,245,0.4)', whiteSpace: 'nowrap' }}>
                          {order.time}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <StatusChanger orderId={order.id} current={order.status} />
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(232,232,245,0.3)' }}>
                  No orders matching this filter
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
