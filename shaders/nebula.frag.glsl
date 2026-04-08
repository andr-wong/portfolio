varying vec2 vUv;
uniform float uTime;

// Simple hash / value noise — no external dependency needed in GLSL
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

  // Slow drift
  vec2 drift = vec2(uTime * 0.008, uTime * 0.005);

  // Base noise layers
  float n1 = fbm(uv * 3.0 + drift);
  float n2 = fbm(uv * 6.0 - drift * 1.3);

  float cloud = n1 * 0.7 + n2 * 0.3;

  // Observatory palette colours
  vec3 colorVoid        = vec3(0.012, 0.008, 0.039);  // #03020A
  vec3 colorNebBlue     = vec3(0.039, 0.086, 0.157);  // #0A1628
  vec3 colorNebPurple   = vec3(0.102, 0.020, 0.200);  // #1A0533

  // Radial vignette toward purple/blue centre
  vec2 centre = vUv - 0.5;
  float dist = length(centre);
  float radial = smoothstep(0.0, 0.6, dist);

  vec3 colour = mix(colorNebBlue, colorNebPurple, cloud * 0.6);
  colour = mix(colour, colorVoid, radial * 0.8);

  // Very subtle mint tint in bright cloud regions
  vec3 mintHint = vec3(0.486, 1.0, 0.831);  // #7CFFD4
  colour += mintHint * cloud * 0.015;

  gl_FragColor = vec4(colour, 1.0);
}
