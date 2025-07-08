import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

const FloatingIsland = ({ position }) => {
  const groupRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main island platform */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[3, 4, 0.5, 8]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.3}
            roughness={0.8}
          />
        </mesh>
      </Float>

      {/* Upper platform */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.5, 3, 0.3, 8]} />
          <meshStandardMaterial
            color="#3a3a3a"
            metalness={0.4}
            roughness={0.7}
          />
        </mesh>
      </Float>

      {/* Central crystal */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.8}>
        <mesh position={[0, 1, 0]} castShadow>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial
            color="#667eea"
            transparent
            opacity={0.8}
            metalness={0.9}
            roughness={0.1}
            emissive="#667eea"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      {/* Energy rings */}
      {[...Array(3)].map((_, i) => (
        <Float key={i} speed={1 + i * 0.5} rotationIntensity={0.5} floatIntensity={0.3}>
          <mesh position={[0, 0.5 + i * 0.3, 0]}>
            <torusGeometry args={[1.5 + i * 0.5, 0.05, 16, 100]} />
            <meshStandardMaterial
              color="#667eea"
              transparent
              opacity={0.3 - i * 0.1}
              emissive="#667eea"
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      ))}

      {/* Floating particles around the island */}
      {[...Array(12)].map((_, i) => (
        <Float key={`particle-${i}`} speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh
            position={[
              Math.cos(i * Math.PI / 6) * (2 + Math.random() * 2),
              Math.sin(i * Math.PI / 6) * 0.5 + 1,
              Math.sin(i * Math.PI / 6) * (2 + Math.random() * 2)
            ]}
          >
            <sphereGeometry args={[0.05 + Math.random() * 0.05, 8, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#667eea" : "#764ba2"}
              emissive={i % 2 === 0 ? "#667eea" : "#764ba2"}
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
      ))}

      {/* Glowing base effect */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[4.5, 4.5, 0.1, 8]} />
        <meshStandardMaterial
          color="#667eea"
          transparent
          opacity={0.2}
          emissive="#667eea"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Energy beams */}
      {[...Array(4)].map((_, i) => (
        <mesh
          key={`beam-${i}`}
          position={[
            Math.cos(i * Math.PI / 2) * 2,
            0,
            Math.sin(i * Math.PI / 2) * 2
          ]}
        >
          <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
          <meshStandardMaterial
            color="#667eea"
            transparent
            opacity={0.4}
            emissive="#667eea"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

export default FloatingIsland; 