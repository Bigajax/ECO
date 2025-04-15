'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion-3d';

const Bubble = () => {
  return (
    <motion.mesh
      initial={{ scale: [1, 1, 1] }}
      animate={{
        scale: [1.05, 1.05, 1.05],
        transition: {
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        },
      }}
    >
      <icosahedronGeometry args={[1.5, 0]} />
      <meshStandardMaterial
        color="#82D8D8"
        roughness={0.1}
        metalness={0.5}
        transparent
        opacity={0.7}
      />
    </motion.mesh>
  );
};

const Bubble3D = () => {
  return (
    <div className="w-full h-[400px]">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <Bubble />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default Bubble3D;

