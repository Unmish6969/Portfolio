import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

const ParticleField = ({ count = 200 }) => {
  const mesh = useRef();
  const light = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() * 0.02;
      const x = Math.random() * 2000 - 1000;
      const y = Math.random() * 2000 - 1000;
      const z = Math.random() * 2000 - 1000;

      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    particles.forEach((particle, i) => {
      positions[i * 3] = particle.x;
      positions[i * 3 + 1] = particle.y;
      positions[i * 3 + 2] = particle.z;
    });
    return positions;
  }, [particles, count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    particles.forEach((particle, i) => {
      particle.time += particle.speed;
      particle.x += Math.sin(particle.time) * 0.01;
      particle.y += Math.cos(particle.time) * 0.01;
      particle.z += Math.sin(particle.time) * 0.01;

      const idx = i * 3;
      mesh.current.geometry.attributes.position.array[idx] = particle.x;
      mesh.current.geometry.attributes.position.array[idx + 1] = particle.y;
      mesh.current.geometry.attributes.position.array[idx + 2] = particle.z;
    });

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.01;
  });

  return (
    <group>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2}
          color="#667eea"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      
      <pointLight
        ref={light}
        distance={40}
        intensity={8}
        color="#667eea"
      />
    </group>
  );
};

export default ParticleField; 