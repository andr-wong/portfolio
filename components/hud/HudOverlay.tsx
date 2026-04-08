'use client'

import { motion } from 'framer-motion'
import CoordinatesDisplay from './CoordinatesDisplay'
import CompassRing from './CompassRing'
import SystemStatus from './SystemStatus'

interface HudOverlayProps {
  visible: boolean
}

export default function HudOverlay({ visible }: HudOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
      aria-hidden="true"
    >
      {/* Bottom-left: compass + coordinates */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px',
        }}
      >
        <CompassRing />
        <CoordinatesDisplay />
      </div>

      {/* Top-right: system status */}
      <div
        style={{
          position: 'absolute',
          top: '28px',
          right: '28px',
        }}
      >
        <SystemStatus />
      </div>
    </motion.div>
  )
}
