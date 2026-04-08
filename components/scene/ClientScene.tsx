'use client'

import dynamic from 'next/dynamic'

const SceneWrapper = dynamic(
  () => import('@/components/scene/SceneWrapper'),
  { ssr: false }
)

export default function ClientScene() {
  return <SceneWrapper />
}
