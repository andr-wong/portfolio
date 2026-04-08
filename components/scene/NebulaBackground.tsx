'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BackSide, ShaderMaterial } from 'three'
import type { Mesh } from 'three'

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAG = /* glsl */ `
varying vec2 vUv;
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 drift = vec2(uTime * 0.008, uTime * 0.005);

  float n1 = fbm(uv * 3.0 + drift);
  float n2 = fbm(uv * 6.0 - drift * 1.3);
  float cloud = n1 * 0.7 + n2 * 0.3;

  vec3 colorVoid      = vec3(0.012, 0.008, 0.039);
  vec3 colorNebBlue   = vec3(0.039, 0.086, 0.157);
  vec3 colorNebPurple = vec3(0.102, 0.020, 0.200);

  vec2 centre = vUv - 0.5;
  float dist = length(centre);
  float radial = smoothstep(0.0, 0.6, dist);

  vec3 colour = mix(colorNebBlue, colorNebPurple, cloud * 0.6);
  colour = mix(colour, colorVoid, radial * 0.8);
  colour += vec3(0.486, 1.0, 0.831) * cloud * 0.015;

  gl_FragColor = vec4(colour, 1.0);
}
`

export default function NebulaBackground() {
  const materialRef = useRef<ShaderMaterial>(null)

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
    }
  })

  return (
    <mesh>
      <sphereGeometry args={[50, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={{ uTime: { value: 0 } }}
        side={BackSide}
      />
    </mesh>
  )
}
