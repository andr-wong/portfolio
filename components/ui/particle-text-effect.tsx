"use client"

import { useEffect, useRef } from "react"

interface Vector2D {
  x: number
  y: number
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 }
  vel: Vector2D = { x: 0, y: 0 }
  acc: Vector2D = { x: 0, y: 0 }
  target: Vector2D = { x: 0, y: 0 }

  closeEnoughTarget = 100
  maxSpeed = 1.0
  maxForce = 0.1
  particleSize = 10
  isKilled = false

  startColor = { r: 0, g: 0, b: 0 }
  targetColor = { r: 0, g: 0, b: 0 }
  colorWeight = 0
  colorBlendRate = 0.01

  move() {
    let proximityMult = 1
    const distance = Math.sqrt(
      Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2)
    )
    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    }
    const magnitude = Math.sqrt(
      towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y
    )
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    }
    const steerMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y)
    if (steerMag > 0) {
      steer.x = (steer.x / steerMag) * this.maxForce
      steer.y = (steer.y / steerMag) * this.maxForce
    }

    this.acc.x += steer.x
    this.acc.y += steer.y
    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    }
    const r = Math.round(
      this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight
    )
    const g = Math.round(
      this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight
    )
    const b = Math.round(
      this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight
    )
    const size = this.particleSize / 2.5
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, size / 2, 0, Math.PI * 2)
    ctx.fill()
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      const rp = randomPos(width / 2, height / 2, (width + height) / 2)
      this.target.x = rp.x
      this.target.y = rp.y
      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0
      this.isKilled = true
    }
  }
}

function randomPos(cx: number, cy: number, mag: number): Vector2D {
  const rx = Math.random() * cx * 2
  const ry = Math.random() * cy * 2
  const dx = rx - cx
  const dy = ry - cy
  const m = Math.sqrt(dx * dx + dy * dy) || 1
  return { x: cx + (dx / m) * mag, y: cy + (dy / m) * mag }
}

interface ParticleTextEffectProps {
  words?: string[]
  /** interval in frames between word changes (default 240 ≈ 4 s at 60 fps) */
  interval?: number
  className?: string
  style?: React.CSSProperties
}

export function ParticleTextEffect({
  words = ["HELLO", "21st.dev", "ParticleTextEffect", "BY", "KAINXU"],
  interval = 240,
  className,
  style,
}: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    particles: [] as Particle[],
    frame: 0,
    wordIndex: 0,
    mouse: { x: 0, y: 0, pressed: false, right: false },
    raf: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const s = stateRef.current
    const pixelSteps = 3
    // Brand-consistent palette so particles always read against the black canvas
    // instead of the fully-random RGB occasionally landing on a near-invisible dark color.
    const PALETTE = [
      { r: 255, g: 122, b: 61 }, // accent (orange)
      { r: 255, g: 200, b: 140 }, // warm gold
      { r: 108, g: 197, b: 240 }, // accent-2 (cool blue)
      { r: 236, g: 231, b: 223 }, // paper
    ]

    const loadWord = (word: string) => {
      const off = document.createElement("canvas")
      off.width = canvas.width
      off.height = canvas.height
      const oc = off.getContext("2d")!
      oc.fillStyle = "white"
      oc.font = `bold ${Math.round(canvas.height * 0.4)}px Arial`
      oc.textAlign = "center"
      oc.textBaseline = "middle"
      oc.fillText(word, canvas.width / 2, canvas.height / 2)

      const { data } = oc.getImageData(0, 0, canvas.width, canvas.height)
      const newColor = PALETTE[Math.floor(Math.random() * PALETTE.length)]

      const coords: number[] = []
      for (let i = 0; i < data.length; i += pixelSteps * 4) coords.push(i)
      for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[coords[i], coords[j]] = [coords[j], coords[i]]
      }

      let pi = 0
      for (const ci of coords) {
        if (data[ci + 3] === 0) continue
        const x = (ci / 4) % canvas.width
        const y = Math.floor(ci / 4 / canvas.width)
        let p: Particle
        if (pi < s.particles.length) {
          p = s.particles[pi]
          p.isKilled = false
          pi++
        } else {
          p = new Particle()
          const rp = randomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2)
          p.pos.x = rp.x
          p.pos.y = rp.y
          p.maxSpeed = Math.random() * 6 + 4
          p.maxForce = p.maxSpeed * 0.05
          p.particleSize = Math.random() * 6 + 6
          p.colorBlendRate = Math.random() * 0.0275 + 0.0025
          s.particles.push(p)
        }
        p.startColor = {
          r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
          g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
          b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
        }
        p.targetColor = newColor
        p.colorWeight = 0
        p.target.x = x
        p.target.y = y
      }
      for (let i = pi; i < s.particles.length; i++) {
        s.particles[i].kill(canvas.width, canvas.height)
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      canvas.width = rect.width
      canvas.height = rect.height
      s.particles = []
      s.frame = 0
      loadWord(words[s.wordIndex])
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const loop = () => {
      ctx.fillStyle = "rgba(0,0,0,0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i]
        p.move()
        p.draw(ctx)
        if (p.isKilled && (p.pos.x < 0 || p.pos.x > canvas.width || p.pos.y < 0 || p.pos.y > canvas.height)) {
          s.particles.splice(i, 1)
        }
      }
      if (s.mouse.pressed && s.mouse.right) {
        s.particles.forEach((p) => {
          const d = Math.sqrt(Math.pow(p.pos.x - s.mouse.x, 2) + Math.pow(p.pos.y - s.mouse.y, 2))
          if (d < 50) p.kill(canvas.width, canvas.height)
        })
      }
      s.frame++
      if (s.frame % interval === 0) {
        s.wordIndex = (s.wordIndex + 1) % words.length
        loadWord(words[s.wordIndex])
      }
      s.raf = requestAnimationFrame(loop)
    }
    s.raf = requestAnimationFrame(loop)

    const md = (e: MouseEvent) => {
      s.mouse.pressed = true
      s.mouse.right = e.button === 2
      const r = canvas.getBoundingClientRect()
      s.mouse.x = e.clientX - r.left
      s.mouse.y = e.clientY - r.top
    }
    const mu = () => { s.mouse.pressed = false; s.mouse.right = false }
    const mm = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      s.mouse.x = e.clientX - r.left
      s.mouse.y = e.clientY - r.top
    }
    const cm = (e: Event) => e.preventDefault()

    canvas.addEventListener("mousedown", md)
    canvas.addEventListener("mouseup", mu)
    canvas.addEventListener("mousemove", mm)
    canvas.addEventListener("contextmenu", cm)

    return () => {
      cancelAnimationFrame(s.raf)
      ro.disconnect()
      canvas.removeEventListener("mousedown", md)
      canvas.removeEventListener("mouseup", mu)
      canvas.removeEventListener("mousemove", mm)
      canvas.removeEventListener("contextmenu", cm)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  )
}
