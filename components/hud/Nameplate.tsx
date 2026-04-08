'use client'

import { motion } from 'framer-motion'

interface NameplateProps {
  visible: boolean
  dimmed: boolean
}

export default function Nameplate({ visible, dimmed }: NameplateProps) {
  return (
    <motion.div
      animate={{ opacity: visible ? (dimmed ? 0.5 : 1) : 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 600,
          color: '#F0F4FF',
          letterSpacing: '-0.01em',
          lineHeight: 1.1,
          marginBottom: '12px',
        }}
      >
        Andrew Wong
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)',
          color: '#94A3B8',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        AI Engineer · Full-Stack Developer · CS Graduate 2025
      </p>
    </motion.div>
  )
}
