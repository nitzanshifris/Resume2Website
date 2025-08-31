import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@/components/theme/theme-provider';

const vertexShader = `
varying vec2 vUv;
uniform float time;
uniform vec4 resolution;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform float time;
uniform vec4 resolution;
uniform vec3 blobColor;

float PI = 3.141592653589793238;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
    mat4 m = rotationMatrix(axis, angle);
    return (m * vec4(v, 1.0)).xyz;
}

float smin( float a, float b, float k ) {
    k *= 6.0;
    float h = max( k-abs(a-b), 0.0 )/k;
    return min(a,b) - h*h*h*k*(1.0/6.0);
}

float sphereSDF(vec3 p, float r) {
    return length(p) - r;
}

float sdf(vec3 p) {
    vec3 p1 = rotate(p, vec3(0.0, 0.0, 1.0), time/5.0);
    vec3 p2 = rotate(p, vec3(1.), -time/5.0);
    vec3 p3 = rotate(p, vec3(1., 1., 0.), -time/4.5);
    vec3 p4 = rotate(p, vec3(0., 1., 0.), -time/4.0);
    
    float final = sphereSDF(p1 - vec3(-0.5, 0.0, 0.0), 0.35);
    float nextSphere = sphereSDF(p2 - vec3(0.55, 0.0, 0.0), 0.3);
    final = smin(final, nextSphere, 0.1);
    nextSphere = sphereSDF(p2 - vec3(-0.8, 0.0, 0.0), 0.2);
    final = smin(final, nextSphere, 0.1);
    nextSphere = sphereSDF(p3 - vec3(1.0, 0.0, 0.0), 0.15);
    final = smin(final, nextSphere, 0.1);
    nextSphere = sphereSDF(p4 - vec3(0.45, -0.45, 0.0), 0.15);
    final = smin(final, nextSphere, 0.1);
    
    return final;
}

vec3 getNormal(vec3 p) {
    float d = 0.001;
    return normalize(vec3(
        sdf(p + vec3(d, 0.0, 0.0)) - sdf(p - vec3(d, 0.0, 0.0)),
        sdf(p + vec3(0.0, d, 0.0)) - sdf(p - vec3(0.0, d, 0.0)),
        sdf(p + vec3(0.0, 0.0, d)) - sdf(p - vec3(0.0, 0.0, d))
    ));
}

float rayMarch(vec3 rayOrigin, vec3 ray) {
    float t = 0.0;
    for (int i = 0; i < 100; i++) {
        vec3 p = rayOrigin + ray * t;
        float d = sdf(p);
        if (d < 0.001) return t;
        t += d;
        if (t > 100.0) break;
    }
    return -1.0;
}

void main() {
    vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
    vec3 cameraPos = vec3(0.0, 0.0, 5.0);
    vec3 ray = normalize(vec3((vUv - vec2(0.5)) * resolution.zw, -1));
    
    float t = rayMarch(cameraPos, ray);
    if (t > 0.0) {
        vec3 p = cameraPos + ray * t;
        vec3 normal = getNormal(p);
        float fresnel = pow(1.0 + dot(ray, normal), 3.0);
        // Use theme-aware blob color with fresnel effect
        vec3 color = blobColor * (0.6 + fresnel * 0.4); // Base color with fresnel enhancement
        gl_FragColor = vec4(color, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Transparent background
    }
}
`;


interface LavaLampInnerProps {
  themeColor: THREE.Vector3;
}

function LavaLampInner({ themeColor }: LavaLampInnerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    resolution: { value: new THREE.Vector4() },
    blobColor: { value: themeColor }
  }), [themeColor]);

  // Update resolution when size changes
  React.useEffect(() => {
    const { width, height } = size;
    const imageAspect = 1;
    let a1, a2;
    
    if (height / width > imageAspect) {
      a1 = (width / height) * imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = (height / width) / imageAspect;
    }
    
    uniforms.resolution.value.set(width, height, a1, a2);
  }, [size, uniforms]);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[5, 5]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export const LavaLamp = () => {
  const { theme } = useTheme();
  const [themeColor, setThemeColor] = React.useState(new THREE.Vector3(1.0, 0.843, 0.0));

  // Update blob color based on theme
  React.useEffect(() => {
    const updateColor = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      
      // Try multiple CSS variables in order of preference
      let colorValue = rootStyles.getPropertyValue('--accent').trim() || 
                       rootStyles.getPropertyValue('--primary').trim() ||
                       rootStyles.getPropertyValue('--foreground').trim();
      
      if (!colorValue) {
        // Fallback to a default if no CSS variable found
        setThemeColor(new THREE.Vector3(1.0, 0.843, 0.0)); // Default gold
        return;
      }
      
      // Handle different color formats
      if (colorValue.includes(' ')) {
        // HSL format: "h s% l%" or "h s l"
        const parts = colorValue.split(' ').map(v => parseFloat(v));
        if (parts.length >= 3) {
          const [h, s, l] = parts;
          
          // Convert HSL to RGB for Three.js
          const hue = h / 360;
          const sat = s / 100;
          const light = l / 100;
          
          const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
          };
          
          const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
          const p = 2 * light - q;
          const r = hue2rgb(p, q, hue + 1/3);
          const g = hue2rgb(p, q, hue);
          const b = hue2rgb(p, q, hue - 1/3);
          
          setThemeColor(new THREE.Vector3(r, g, b));
        }
      } else if (colorValue.startsWith('#')) {
        // Hex format
        const hex = colorValue.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;
        setThemeColor(new THREE.Vector3(r, g, b));
      } else if (colorValue.includes(',')) {
        // RGB format: "r, g, b" or "r g b"
        const parts = colorValue.split(/[,\s]+/).map(v => parseFloat(v));
        if (parts.length >= 3) {
          const [r, g, b] = parts.map(v => v / 255);
          setThemeColor(new THREE.Vector3(r, g, b));
        }
      }
    };
    
    // Update immediately on mount
    updateColor();
    
    // Watch for changes to the document's class attribute (theme changes)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')) {
          // Theme has changed, update color after a small delay for CSS to update
          setTimeout(updateColor, 50);
        }
      });
    });
    
    // Observe changes to html element's class and data-theme attributes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });
    
    // Also listen for storage events (theme changes from other tabs)
    const handleStorageChange = () => {
      setTimeout(updateColor, 50);
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Remove theme dependency, use MutationObserver instead

  return (
    <div style={{ width: '100%', height: '100%', background: 'transparent', position: "absolute" }}>
      <Canvas
        camera={{
          left: -0.5,
          right: 0.5,
          top: 0.5,
          bottom: -0.5,
          near: -1000,
          far: 1000,
          position: [0, 0, 2]
        }}
        orthographic
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <LavaLampInner themeColor={themeColor} />
      </Canvas>
    </div>
  );
}