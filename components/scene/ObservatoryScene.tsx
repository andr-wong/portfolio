'use client'

import { useRef, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Vector3 } from 'three'
import NebulaBackground from './NebulaBackground'
import StarField from './StarField'
import BiopunkLayer from './BiopunkLayer'
import ObservatoryCore from './ObservatoryCore'
import PanelSystem from './PanelSystem'
import PanelModal from './PanelModal'
import HudOverlay from '@/components/hud/HudOverlay'
import Nameplate from '@/components/hud/Nameplate'
import CustomCursor from '@/components/hud/CustomCursor'
import { useLoadSequence } from '@/components/LoadSequence'
import { useObservatoryCamera } from '@/hooks/useObservatoryCamera'
import { PANELS } from '@/lib/panels'
import type { PanelContent } from '@/types/panel'

interface SceneContentsProps {
  orbitActive: boolean
  activePanelId: string | null
  onPanelSelect: (id: string, pos: Vector3) => void
  onBackgroundClick: () => void
  onHoverChange: (hovered: boolean) => void
  prefersReducedMotion: boolean
}

function SceneContents({
  orbitActive,
  activePanelId,
  onPanelSelect,
  onBackgroundClick,
  onHoverChange,
  prefersReducedMotion,
}: SceneContentsProps) {
  const { focusPanel, resetCamera } = useObservatoryCamera()

  const handlePanelSelect = useCallback(
    (id: string, pos: Vector3) => {
      focusPanel(pos)
      onPanelSelect(id, pos)
    },
    [focusPanel, onPanelSelect]
  )

  const handleBackground = useCallback(() => {
    resetCamera()
    onBackgroundClick()
  }, [resetCamera, onBackgroundClick])

  return (
    <>
      {/* Lighting — no expensive Environment HDR map */}
      <ambientLight intensity={0.25} color="#0A1628" />
      <pointLight position={[5, 5, 5]} intensity={0.4} color="#7CFFD4" />
      <pointLight position={[-5, -3, -5]} intensity={0.2} color="#C084FC" />

      <NebulaBackground />
      {!prefersReducedMotion && <StarField />}
      {!prefersReducedMotion && <BiopunkLayer />}
      <ObservatoryCore />

      <PanelSystem
        orbitActive={orbitActive}
        activePanelId={activePanelId}
        onPanelSelect={handlePanelSelect}
        onHoverChange={onHoverChange}
      />

      {/* Invisible background mesh — click to reset */}
      <mesh visible={false} position={[0, 0, -20]} onClick={handleBackground}>
        <planeGeometry args={[300, 300]} />
        <meshBasicMaterial />
      </mesh>
    </>
  )
}

interface ObservatorySceneProps {
  prefersReducedMotion: boolean
}

export default function ObservatoryScene({
  prefersReducedMotion,
}: ObservatorySceneProps) {
  const loadState = useLoadSequence(prefersReducedMotion)
  const [activePanelId, setActivePanelId] = useState<string | null>(null)
  const [activePanelContent, setActivePanelContent] =
    useState<PanelContent | null>(null)
  const [panel3DHovered, setPanel3DHovered] = useState(false)

  const handlePanelSelect = useCallback((id: string, _pos: Vector3) => {
    const panel = PANELS.find((p) => p.id === id)
    if (!panel) return
    setActivePanelId(id)
    setActivePanelContent(panel.content)
  }, [])

  const handleReset = useCallback(() => {
    setActivePanelId(null)
    setActivePanelContent(null)
  }, [])

  const handleHoverChange = useCallback((hovered: boolean) => {
    setPanel3DHovered(hovered)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    // Let the event propagate to R3F for scene rotation if needed
  }, [])

  return (
    <div className="relative w-full h-full" onWheel={handleWheel}>
      <Canvas
        aria-hidden="true"
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: '#03020A' }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        // Cap DPR — no need to render at 3× on Retina
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <SceneContents
            orbitActive={loadState.orbitActive}
            activePanelId={activePanelId}
            onPanelSelect={handlePanelSelect}
            onBackgroundClick={handleReset}
            onHoverChange={handleHoverChange}
            prefersReducedMotion={prefersReducedMotion}
          />
        </Suspense>
      </Canvas>

      <HudOverlay visible={loadState.hudVisible} />
      <Nameplate
        visible={loadState.nameplateVisible}
        dimmed={activePanelId !== null}
      />
      <PanelModal
        activePanelId={activePanelId}
        panelContent={activePanelContent}
        onClose={handleReset}
      />
      <CustomCursor panel3DHovered={panel3DHovered} />
    </div>
  )
}
