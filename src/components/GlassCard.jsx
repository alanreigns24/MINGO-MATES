import React from 'react';
import { motion } from 'framer-motion';

/**
 * GlassCard – Reusable Cupertino glass container
 * Uses backdrop-filter: blur(25px) + spring hover/tap animations via Framer Motion.
 *
 * Props:
 *  - className: additional CSS classes
 *  - onClick: click handler
 *  - children: content
 *  - noHover: disables hover animation
 *  - style: inline styles override
 *  - layoutId: Framer Motion layoutId for shared layout animation
 */
const GlassCard = ({
  className = '',
  onClick,
  children,
  noHover = false,
  style = {},
  layoutId,
  ...rest
}) => {
  return (
    <motion.div
      layoutId={layoutId}
      className={`glass ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
      whileHover={noHover ? {} : { scale: 1.025, y: -4 }}
      whileTap={onClick ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
