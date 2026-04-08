'use client'

import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Environment } from '@react-three/drei'
import { Group, Vector3 } from 'three'
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
  prefersReducedMotion: boolean
}

function SceneContents({
  orbitActive,
  activePanelId,
  onPanelSelect,
  onBackgroundClick,
  prefersReducedMotion,
}: SceneContentsProps) {
  // Camera hook must be inside Canvas context
  const { focusPanel, resetCamera } = useObservatoryCamera()

  const handlePanelSelect = (id: string, pos: Vector3) => {
    focusPanel(pos)
    onPanelSelect(id, pos)
  }

  const handleBackground = () => {
    resetCamera()
    onBackgroundClick()
  }

  return (
    <>
      <ambientLight intensity={0.2} color="#0A1628" />
      <Environment preset="city" />
      <NebulaBackground />
      {!prefersReducedMotion && <StarField />}
      {!prefersReducedMotion && <BiopunkLayer />}
      <ObservatoryCore />
      <PanelSystem
        orbitActive={orbitActive}
        activePanelId={activePanelId}
        onPanelSelect={handlePanelSelect}
      />
      {/* Invisible background mesh — click to reset */}
      <mesh visible={false} position={[0, 0, -15]} onClick={handleBackground}>
        <planeGeometry args={[200, 200]} />
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
  const sceneGroupRef = useRef<Group>(null)

  const handlePanelSelect = (id: string, _pos: Vector3) => {
    const panel = PANELS.find((p) => p.id === id)
    if (!panel) return
    setActivePanelId(id)
    setActivePanelContent(panel.content)
  }

  const handleReset = () => {
    setActivePanelId(null)
    setActivePanelContent(null)
  }

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (sceneGroupRef.current) {
      sceneGroupRef.current.rotation.y += e.deltaY * 0.0003
    }
  }

  return (
    <div className="relative w-full h-full" onWheel={handleWheel}>
      <Canvas
        aria-hidden="true"
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: '#03020A' }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <SceneContents
            orbitActive={loadState.orbitActive}
            activePanelId={activePanelId}
            onPanelSelect={handlePanelSelect}
            onBackgroundClick={handleReset}
            prefersReducedMotion={prefersReducedMotion}
          />
        </Suspense>
      </Canvas>

      {/* 2D overlays — rendered in DOM outside Canvas */}
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
      <CustomCursor />
    </div>
  )
}
