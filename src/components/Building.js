import React, { useState } from 'react';
import { useSpring, a as a3 } from '@react-spring/three';
import { a as aweb } from '@react-spring/web';
import { Html, Float } from '@react-three/drei';

const Building = ({ 
  position, 
  rotation, 
  color, 
  title, 
  icon, 
  onHover, 
  onLeave, 
  onClick,
  isHovered,
  isModalOpen
}) => {
  const [hovered, setHovered] = useState(false);

  const { scale, y } = useSpring({
    scale: isHovered || hovered ? 1.05 : 1,
    y: isHovered || hovered ? position[1] + 0.1 : position[1],
    config: { mass: 1, tension: 300, friction: 40 }
  });

  const titleSpring = useSpring({
    color: isHovered || hovered ? '#ffd700' : '#fff',
    config: { mass: 1, tension: 300, friction: 30 }
  });

  const handlePointerOver = () => {
    setHovered(true);
    if(onHover) onHover();
  };

  const handlePointerOut = () => {
    setHovered(false);
    if(onLeave) onLeave();
  };

  const handleClick = (event) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <Float speed={1} rotationIntensity={0.18} floatIntensity={0.08}>
      <a3.group
        position-y={y}
        position-x={position[0]}
        position-z={position[2]}
        rotation={rotation}
        scale={scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        {/* Soft shadow at base */}
        <mesh position={[0, -1.95, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <circleGeometry args={[2.2, 32]} />
          <meshStandardMaterial color="#000" transparent opacity={0.12} />
        </mesh>

        {/* Enhanced base platform with gradient */}
        <mesh position={[0, -1.65, 0]} receiveShadow>
          <cylinderGeometry args={[2.2, 2.2, 0.5, 16]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.8}
            roughness={0.2}
            emissive="#2a2a3e"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Main building structure with enhanced material */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 3.2, 2.2]} />
          <meshStandardMaterial
            color={color}
            metalness={0.6}
            roughness={0.1}
            transparent
            opacity={0.92}
            emissive={color}
            emissiveIntensity={0.12}
          />
        </mesh>

        {/* Building edge highlights */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.25, 3.25, 2.25]} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.05}
            transparent
            opacity={0.3}
            emissive={color}
            emissiveIntensity={0.2}
            wireframe={true}
          />
        </mesh>

        {/* Enhanced glass panels with better reflection */}
        <mesh position={[0, 0, 1.12]}>
          <planeGeometry args={[2.0, 3.0]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.15}
            metalness={0.95}
            roughness={0.02}
            emissive="#ffffff"
            emissiveIntensity={0.08}
          />
        </mesh>
        <mesh position={[0, 0, -1.12]}>
          <planeGeometry args={[2.0, 3.0]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.15}
            metalness={0.95}
            roughness={0.02}
            emissive="#ffffff"
            emissiveIntensity={0.08}
          />
        </mesh>

        {/* Side glass panels */}
        <mesh position={[1.12, 0, 0]} rotation={[0, Math.PI/2, 0]}>
          <planeGeometry args={[2.0, 3.0]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.12}
            metalness={0.95}
            roughness={0.02}
            emissive="#ffffff"
            emissiveIntensity={0.06}
          />
        </mesh>
        <mesh position={[-1.12, 0, 0]} rotation={[0, Math.PI/2, 0]}>
          <planeGeometry args={[2.0, 3.0]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.12}
            metalness={0.95}
            roughness={0.02}
            emissive="#ffffff"
            emissiveIntensity={0.06}
          />
        </mesh>
        
        {/* Enhanced roof with better design */}
        <mesh position={[0, 1.75, 0]} castShadow>
          <cylinderGeometry args={[1.6, 1.6, 0.4, 16]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.9}
            roughness={0.15}
            emissive="#2a2a3e"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Floating title */}
        {!isModalOpen && (
          <Html
            position={[0, 3.2, 0]}
            center
            distanceFactor={8}
          >
            <aweb.div
              style={{
                background: 'rgba(10, 10, 10, 0.98)',
                backdropFilter: 'blur(25px)',
                color: titleSpring.color,
                padding: '16px 32px',
                borderRadius: '40px',
                fontSize: '24px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: '900',
                whiteSpace: 'nowrap',
                border: `4px solid ${color}`,
                boxShadow: `0 0 35px ${color}, 0 0 70px ${color}, inset 0 0 30px rgba(255,255,255,0.15)`,
                pointerEvents: 'none',
                textShadow: `0 0 15px ${color}, 0 0 30px white, 0 0 45px ${color}`,
                letterSpacing: '2px',
                transform: 'scale(1.1)',
                zIndex: 1000,
              }}
            >
              {title}
            </aweb.div>
          </Html>
        )}
        
        {/* Enhanced ambient light around building */}
        <pointLight
          position={[0, 1.5, 0]}
          intensity={isHovered || hovered ? 2.5 : 1.5}
          color={color}
          distance={10}
        />

        {/* Additional accent lighting */}
        <pointLight
          position={[0, 0.5, 0]}
          intensity={isHovered || hovered ? 1.2 : 0.7}
          color={color}
          distance={6}
        />

        {/* Corner accent lights */}
        <pointLight
          position={[1.5, 0, 1.5]}
          intensity={1.1}
          color={color}
          distance={4}
        />
        <pointLight
          position={[-1.5, 0, 1.5]}
          intensity={1.1}
          color={color}
          distance={4}
        />
        <pointLight
          position={[1.5, 0, -1.5]}
          intensity={1.1}
          color={color}
          distance={4}
        />
        <pointLight
          position={[-1.5, 0, -1.5]}
          intensity={1.1}
          color={color}
          distance={4}
        />

        {/* Decorative corner elements */}
        <mesh position={[1.1, 0, 1.1]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
            emissive={color}
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[-1.1, 0, 1.1]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
            emissive={color}
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[1.1, 0, -1.1]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
            emissive={color}
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[-1.1, 0, -1.1]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
            emissive={color}
            emissiveIntensity={0.4}
          />
        </mesh>
      </a3.group>
    </Float>
  );
};

export default Building; 