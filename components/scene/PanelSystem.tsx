'use client'

import { useCallback } from 'react'
import { Vector3 } from 'three'
import { PANELS } from '@/lib/panels'
import PanelOrbit from './PanelOrbit'

interface PanelSystemProps {
  orbitActive: boolean
  activePanelId: string | null
  onPanelSelect: (id: string, pos: Vector3) => void
  onHoverChange: (hovered: boolean) => void
}

export default function PanelSystem({
  orbitActive,
  activePanelId,
  onPanelSelect,
  onHoverChange,
}: PanelSystemProps) {
  return (
    <>
      {PANELS.map((panel) => (
        <PanelOrbit
          key={panel.id}
          data={panel}
          orbitActive={orbitActive}
          onSelect={onPanelSelect}
          isActive={activePanelId === panel.id}
          onHoverChange={onHoverChange}
        />
      ))}
    </>
  )
}
