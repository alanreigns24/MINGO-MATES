import React from 'react';

/**
 * StatusDot – Pulsing animated status indicator
 * Colours: red = pending, amber = en_route, green = delivered
 */
const STATUS_LABELS = {
  pending:   'Pending',
  en_route:  'En Route',
  delivered: 'Delivered',
};

const StatusDot = ({ status, showLabel = false }) => {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span className={`status-dot ${status}`} />
      {showLabel && (
        <span style={{
          fontSize: '0.82rem',
          fontWeight: 600,
          color: status === 'pending'
            ? 'var(--accent-red)'
            : status === 'en_route'
              ? 'var(--accent-amber)'
              : 'var(--accent-green)',
          letterSpacing: '0.02em',
        }}>
          {STATUS_LABELS[status] ?? status}
        </span>
      )}
    </span>
  );
};

export default StatusDot;
