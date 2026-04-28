'use client'

import { useTilt } from '@/hooks/useTilt'

interface BentoCellProps {
  children: React.ReactNode
  className?: string
  extraMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void
  extraMouseLeave?: () => void
}

export default function BentoCell({
  children,
  className = '',
  extraMouseMove,
  extraMouseLeave,
}: BentoCellProps) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt()

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMouseMove(e)
    extraMouseMove?.(e)
  }

  const onLeave = () => {
    handleMouseLeave()
    extraMouseLeave?.()
  }

  return (
    <div
      ref={ref}
      className={`bento-cell ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  )
}
