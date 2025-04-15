import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function FloatingBubble() {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Pulsação contínua
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (mesh.current) {
      // Flutuação suave no eixo Y
      mesh.current.position.y = Math.sin(time * 1.5) * 0.1;

      // Pulsação leve (escala)
      const scale = 1 + Math.sin(time * 2) * 0.02;
      mesh.current.scale.set(scale, scale, scale);
    }
  });

  const handleClick = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 1000); // Pulso curto
  };

  return (
    <mesh
      ref={mesh}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color={'#a5b4fc'} // Azul suave
        distort={0.3} // Variação da superfície
        speed={2}
        roughness={0.05}
        metalness={0.6}
        transparent
        opacity={0.7}
        emissive={pulse ? new THREE.Color('#c084fc') : new THREE.Color(0x000000)}
        emissiveIntensity={pulse ? 0.6 : 0.1}
        envMapIntensity={1}
      />
    </mesh>
  );
}

export default function BubbleCanvas() {
  return (
    <div style={{ height: '100vh', background: '#f0f4f8' }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <FloatingBubble />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
