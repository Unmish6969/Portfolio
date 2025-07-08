import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, PresentationControls, Html } from '@react-three/drei';
import { useSpring, a as a3 } from '@react-spring/three';
import { a as aweb } from '@react-spring/web';
import Building from './Building';
import FloatingIsland from './FloatingIsland';
import ParticleField from './ParticleField';

// 3D Light Fixture Component
const LightFixture = ({ position, color = "#ffffff", intensity = 1.0 }) => {
  const bulbRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (bulbRef.current) {
      // Subtle pulsing effect
      bulbRef.current.material.emissiveIntensity = intensity + Math.sin(time * 2) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Light fixture base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.5, 8]} />
        <meshStandardMaterial
          color="#2c2c2c"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Light fixture arm */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Light bulb housing */}
      <mesh position={[0, 3, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Light bulb */}
      <mesh position={[0, 3, 0]} ref={bulbRef}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Light glow effect */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          emissive={color}
          emissiveIntensity={intensity * 0.5}
        />
      </mesh>
      
      {/* Point light */}
      <pointLight
        position={[0, 3, 0]}
        intensity={intensity * 8}
        color={color}
        distance={30}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </group>
  );
};

// Floating Light Orb Component
const FloatingLightOrb = ({ position, color = "#667eea", size = 1 }) => {
  const orbRef = useRef();
  const materialRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (orbRef.current) {
      orbRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.3;
      orbRef.current.rotation.y = time * 0.5;
      orbRef.current.rotation.z = Math.sin(time * 0.8) * 0.1;
    }
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.8 + Math.sin(time * 3) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = time * 0.3;
      ringRef.current.rotation.x = Math.sin(time * 0.6) * 0.2;
    }
  });

  return (
    <group ref={orbRef} position={position}>
      {/* Main orb */}
      <mesh>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Inner glow ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[size * 0.8, 0.05, 16, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Outer glow ring */}
      <mesh>
        <torusGeometry args={[size * 1.2, 0.03, 16, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[size * 1.5, 16, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.2}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Additional outer glow layer */}
      <mesh>
        <sphereGeometry args={[size * 2.0, 16, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.1}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Floating particles around the orb */}
      {[...Array(6)].map((_, i) => (
        <mesh
          key={`particle-${i}`}
          position={[
            Math.cos(i * Math.PI / 3) * (size * 1.8),
            Math.sin(i * Math.PI / 3) * 0.2,
            Math.sin(i * Math.PI / 3) * (size * 1.8)
          ]}
        >
          <sphereGeometry args={[0.02 + Math.random() * 0.02, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
      
      {/* Point light */}
      <pointLight
        position={[0, 0, 0]}
        intensity={6}
        color={color}
        distance={25}
      />
    </group>
  );
};

// Central Building Component
const CentralBuilding = ({ position, onHover, onLeave, onClick, isHovered, isModalOpen }) => {
  const [hovered, setHovered] = useState(false);
  const centralColor = '#ffd700'; // Golden color for the central building

  const { scale, y } = useSpring({
    scale: isHovered || hovered ? 1.08 : 1,
    y: (isHovered || hovered ? 0.2 : 0) + (position ? position[1] : 0),
    config: { mass: 1, tension: 300, friction: 40 }
  });

  const titleSpring = useSpring({
    color: isHovered || hovered ? '#ffffff' : '#ffd700',
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
    <a3.group
      position={position || [0, 0, 0]}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Enhanced base platform with gradient */}
      <mesh position={[0, -2.4, 0]} receiveShadow>
        <cylinderGeometry args={[4.5, 4.5, 0.8, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          emissive="#2a2a3e"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Main building structure - much larger */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.0, 6.0, 4.0]} />
        <meshStandardMaterial
          color={centralColor}
          metalness={0.7}
          roughness={0.1}
          transparent
          opacity={0.95}
          emissive={centralColor}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Building edge highlights */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.1, 6.1, 4.1]} />
        <meshStandardMaterial
          color={centralColor}
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.4}
          emissive={centralColor}
          emissiveIntensity={0.3}
          wireframe={true}
        />
      </mesh>

      {/* Large glass panels on all sides */}
      <mesh position={[0, 0, 2.05]}>
        <planeGeometry args={[3.6, 5.6]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.12}
          metalness={0.95}
          roughness={0.02}
          emissive="#ffffff"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[0, 0, -2.05]}>
        <planeGeometry args={[3.6, 5.6]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.12}
          metalness={0.95}
          roughness={0.02}
          emissive="#ffffff"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[2.05, 0, 0]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[3.6, 5.6]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          metalness={0.95}
          roughness={0.02}
          emissive="#ffffff"
          emissiveIntensity={0.08}
        />
      </mesh>
      <mesh position={[-2.05, 0, 0]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[3.6, 5.6]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          metalness={0.95}
          roughness={0.02}
          emissive="#ffffff"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* INTERIOR ELEMENTS - Beautiful floating crystal */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.3}>
        <mesh position={[0, 1.5, 0]}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial
            color={centralColor}
            transparent
            opacity={0.9}
            metalness={0.9}
            roughness={0.1}
            emissive={centralColor}
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      {/* Inner crystal glow */}
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.2}>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshStandardMaterial
            color={centralColor}
            transparent
            opacity={0.3}
            emissive={centralColor}
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      {/* Floating energy rings around crystal */}
      {[...Array(3)].map((_, i) => (
        <Float key={`ring-${i}`} speed={1 + i * 0.5} rotationIntensity={0.5} floatIntensity={0.2}>
          <mesh position={[0, 1.5 + i * 0.3, 0]}>
            <torusGeometry args={[1.0 + i * 0.3, 0.03, 16, 100]} />
            <meshStandardMaterial
              color={centralColor}
              transparent
              opacity={0.4 - i * 0.1}
              emissive={centralColor}
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
      ))}

      {/* Floating particles inside building */}
      {[...Array(15)].map((_, i) => (
        <Float key={`particle-${i}`} speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
          <mesh
            position={[
              (Math.random() - 0.5) * 3.0,
              Math.random() * 4.0 + 0.5,
              (Math.random() - 0.5) * 3.0
            ]}
          >
            <sphereGeometry args={[0.03 + Math.random() * 0.02, 8, 8]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? centralColor : i % 3 === 1 ? "#ffffff" : "#ffaa00"}
              emissive={i % 3 === 0 ? centralColor : i % 3 === 1 ? "#ffffff" : "#ffaa00"}
              emissiveIntensity={0.8}
            />
          </mesh>
        </Float>
      ))}

      {/* Glowing orbs at different levels */}
      {[
        { pos: [0, 0.5, 0], size: 0.2, color: "#ffffff" },
        { pos: [0, 2.5, 0], size: 0.15, color: centralColor },
        { pos: [0, 4.0, 0], size: 0.1, color: "#ffaa00" }
      ].map((orb, index) => (
        <Float key={`orb-${index}`} speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
          <mesh position={orb.pos}>
            <sphereGeometry args={[orb.size, 16, 16]} />
            <meshStandardMaterial
              color={orb.color}
              transparent
              opacity={0.8}
              emissive={orb.color}
              emissiveIntensity={0.6}
            />
          </mesh>
        </Float>
      ))}

      {/* Energy beams connecting levels */}
      {[...Array(4)].map((_, i) => (
        <mesh
          key={`beam-${i}`}
          position={[
            Math.cos(i * Math.PI / 2) * 1.5,
            2.0,
            Math.sin(i * Math.PI / 2) * 1.5
          ]}
        >
          <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
          <meshStandardMaterial
            color={centralColor}
            transparent
            opacity={0.6}
            emissive={centralColor}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}

      {/* Interior ambient lighting */}
      <pointLight
        position={[0, 1.5, 0]}
        intensity={1.5}
        color={centralColor}
        distance={8}
      />

      <pointLight
        position={[0, 3.0, 0]}
        intensity={1.0}
        color="#ffffff"
        distance={6}
      />

      {/* Multiple roof levels */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <cylinderGeometry args={[2.8, 2.8, 0.6, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.15}
          emissive="#2a2a3e"
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh position={[0, 4.2, 0]} castShadow>
        <cylinderGeometry args={[2.2, 2.2, 0.4, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.15}
          emissive="#2a2a3e"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Roof rim */}
      <mesh position={[0, 4.4, 0]} castShadow>
        <cylinderGeometry args={[2.3, 2.3, 0.08, 16]} />
        <meshStandardMaterial
          color={centralColor}
          metalness={0.9}
          roughness={0.1}
          emissive={centralColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Floating title */}
      {!isModalOpen && (
        <Html
          position={[0, 8.5, 0]}
          center
          distanceFactor={12}
        >
          <aweb.div
            style={{
              background: 'rgba(15, 15, 15, 0.95)',
              backdropFilter: 'blur(20px)',
              color: titleSpring.color,
              padding: '16px 32px',
              borderRadius: '40px',
              fontSize: '24px',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              border: `4px solid ${centralColor}`,
              boxShadow: `0 0 35px ${centralColor}, 0 0 70px ${centralColor}, inset 0 0 25px rgba(255,255,255,0.1)`,
              pointerEvents: 'none',
              textShadow: `0 0 15px ${centralColor}, 0 0 30px white`,
              letterSpacing: '2px',
            }}
          >
            About
          </aweb.div>
        </Html>
      )}

      {/* Decorative corner elements - larger */}
      {[
        [2.0, 0, 2.0], [-2.0, 0, 2.0], [2.0, 0, -2.0], [-2.0, 0, -2.0]
      ].map(([x, y, z], index) => (
        <mesh key={`corner-${index}`} position={[x, y, z]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial
            color={centralColor}
            metalness={0.9}
            roughness={0.1}
            emissive={centralColor}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Enhanced lighting system */}
      <pointLight
        position={[0, 2.0, 0]}
        intensity={isHovered || hovered ? 2.0 : 1.2}
        color={centralColor}
        distance={15}
      />

      <pointLight
        position={[0, 0.5, 0]}
        intensity={isHovered || hovered ? 1.0 : 0.6}
        color={centralColor}
        distance={8}
      />

      {/* Corner accent lights */}
      {[
        [2.5, 0, 2.5], [-2.5, 0, 2.5], [2.5, 0, -2.5], [-2.5, 0, -2.5]
      ].map(([x, y, z], index) => (
        <pointLight
          key={`corner-light-${index}`}
          position={[x, y, z]}
          intensity={0.5}
          color={centralColor}
          distance={6}
        />
      ))}
    </a3.group>
  );
};

const Scene = ({ onSectionClick, isModalOpen }) => {
  const groupRef = useRef();
  const floorGroupRef = useRef();
  const floorEdgeLightingRef = useRef();
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [currentGreeting, setCurrentGreeting] = useState(0);
  const [showGreetings, setShowGreetings] = useState(true);
  const [fadeOpacity, setFadeOpacity] = useState(1);

  // Array of greetings in different languages
  const greetings = [
    "Hello! 👋",
    "Hola! 🇪🇸",
    "Namaste! 🇮🇳",
    "Bonjour! 🇫🇷",
    "Ciao! 🇮🇹",
    "Hallo! 🇩🇪",
    "Konnichiwa! 🇯🇵",
    "Ni hao! 🇨🇳",
    "Annyeong! 🇰🇷",
    "Olá! 🇵🇹",
    "Привет! 🇷🇺",
    "Merhaba! 🇹🇷",
    "Salam! 🇸🇦",
    "Shalom! 🇮🇱",
    "Jambo! 🇰🇪"
  ];

  useEffect(() => {
    let currentIndex = 0;
    
    const cycleGreetings = () => {
      if (currentIndex < greetings.length) {
        // Fade out
        setFadeOpacity(0);
        
        setTimeout(() => {
          // Change greeting
          setCurrentGreeting(currentIndex);
          // Fade in
          setFadeOpacity(1);
          currentIndex++;
        }, 300); // Half second fade transition
      } else {
        // After all greetings, fade out completely
        setFadeOpacity(0);
        setTimeout(() => {
          setShowGreetings(false);
        }, 500);
        return;
      }
      
      // Schedule next greeting
      setTimeout(cycleGreetings, 2000); // 2 seconds per greeting (1.5s display + 0.5s transition)
    };
    
    // Start the cycle
    cycleGreetings();
  }, [greetings.length]);

  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setFadeOpacity(0);
      setTimeout(() => setFadeOpacity(1), 500);
    }, 3000);

    return () => clearInterval(fadeInterval);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate the entire scene slightly
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
    }
    
    // Move the floor and buildings forward
    if (floorGroupRef.current) {
      floorGroupRef.current.position.z = Math.sin(time * 0.5) * 2 - 5;
      // Add a slight floating motion
      floorGroupRef.current.position.y = Math.sin(time * 0.3) * 0.2;
    }

    // Change the floor edge lighting color continuously
    if (floorEdgeLightingRef.current) {
      const hue = (time * 50) % 360; // Complete color cycle every ~7 seconds
      const color = `hsl(${hue}, 70%, 60%)`;
      floorEdgeLightingRef.current.color.set(color);
      floorEdgeLightingRef.current.emissive.set(color);
    }
  });

  const handleBuildingClick = (sectionId) => {
    console.log('Building clicked in Scene:', sectionId); // Debug log
    onSectionClick(sectionId);
  };

  const buildings = [
    {
      id: 'home',
      position: [-8, 0, -8],
      rotation: [0, Math.PI / 4, 0],
      color: '#00d4ff',
      title: 'Education',
      icon: '🎓'
    },
    {
      id: 'projects',
      position: [8, 0, -8],
      rotation: [0, -Math.PI / 4, 0],
      color: '#ff6b6b',
      title: 'Projects',
      icon: '💼'
    },
    {
      id: 'skills',
      position: [-8, 0, 8],
      rotation: [0, Math.PI / 4, 0],
      color: '#4ecdc4',
      title: 'Skills',
      icon: '⚡'
    },
    {
      id: 'contact',
      position: [8, 0, 8],
      rotation: [0, -Math.PI / 4, 0],
      color: '#45b7d1',
      title: 'Contact',
      icon: '📧'
    }
  ];

  return (
    <group ref={groupRef}>
      {/* Enhanced Lighting System */}
      <ambientLight intensity={0.4} color="#1a1a2e" />
      
      {/* Main directional lights */}
      <directionalLight
        position={[15, 20, 15]}
        intensity={0.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      <directionalLight
        position={[-15, 20, -15]}
        intensity={0.6}
        color="#667eea"
        castShadow
      />
      <directionalLight
        position={[0, 25, 0]}
        intensity={0.4}
        color="#764ba2"
        castShadow
      />

      {/* Atmospheric point lights */}
      <pointLight position={[0, 25, 0]} intensity={1.2} color="#ffffff" distance={40} />
      <pointLight position={[0, 15, 0]} intensity={0.8} color="#667eea" distance={30} />
      <pointLight position={[0, 5, 0]} intensity={0.6} color="#764ba2" distance={25} />
      <pointLight position={[0, -5, 0]} intensity={0.4} color="#f093fb" distance={20} />

      {/* Enhanced Floating Light Orbs */}
      <FloatingLightOrb position={[0, 15, 0]} color="#667eea" size={1.0} />
      <FloatingLightOrb position={[-12, 8, -12]} color="#764ba2" size={0.7} />
      <FloatingLightOrb position={[12, 8, -12]} color="#f093fb" size={0.7} />
      <FloatingLightOrb position={[-12, 8, 12]} color="#4facfe" size={0.7} />
      <FloatingLightOrb position={[12, 8, 12]} color="#43e97b" size={0.7} />

      {/* Moving Floor and Buildings Group */}
      <group ref={floorGroupRef}>
        {/* Enhanced 3D Light Fixtures */}
        <LightFixture position={[-20, -1.5, -20]} color="#f39c12" intensity={1.2} />
        <LightFixture position={[20, -1.5, -20]} color="#3498db" intensity={1.2} />
        <LightFixture position={[-20, -1.5, 20]} color="#9b59b6" intensity={1.2} />
        <LightFixture position={[20, -1.5, 20]} color="#e74c3c" intensity={1.2} />

        {/* Main Floor Platform */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial 
            color="#1e1e2e"
            metalness={0.6}
            roughness={0.3}
            side={2}
          />
        </mesh>

        {/* Floor grid pattern */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.49, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial 
            color="#2a2a3e"
            transparent
            opacity={0.3}
            metalness={0.7}
            roughness={0.2}
            side={2}
          />
        </mesh>

        {/* Enhanced Floor grid lines */}
        {[...Array(25)].map((_, i) => (
          <group key={`grid-line-${i}`}>
            {/* Horizontal lines */}
            <mesh 
              rotation={[-Math.PI / 2, 0, 0]} 
              position={[0, -1.48, (i - 12) * 2]}
            >
              <planeGeometry args={[50, 0.05]} />
              <meshStandardMaterial 
                color="#4a90e2"
                transparent
                opacity={0.7}
                emissive="#4a90e2"
                emissiveIntensity={0.4}
                side={2}
              />
            </mesh>
            
            {/* Vertical lines */}
            <mesh 
              rotation={[-Math.PI / 2, 0, 0]} 
              position={[(i - 12) * 2, -1.48, 0]}
            >
              <planeGeometry args={[0.05, 50]} />
              <meshStandardMaterial 
                color="#4a90e2"
                transparent
                opacity={0.7}
                emissive="#4a90e2"
                emissiveIntensity={0.4}
                side={2}
              />
            </mesh>
          </group>
        ))}

        {/* Enhanced Floor edge lighting */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.47, 0]}>
          <ringGeometry args={[24, 25, 64]} />
          <meshStandardMaterial 
            ref={floorEdgeLightingRef}
            color="#4a90e2"
            transparent
            opacity={0.5}
            emissive="#4a90e2"
            emissiveIntensity={0.8}
            side={2}
          />
        </mesh>

        {/* Corner floor panels */}
        {[
          [-20, -20], [20, -20], [-20, 20], [20, 20]
        ].map(([x, z], index) => (
          <mesh 
            key={`corner-${index}`}
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[x, -1.46, z]}
          >
            <boxGeometry args={[8, 8, 0.1]} />
            <meshStandardMaterial 
              color="#1a1a2e"
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
        ))}

        {/* Enhanced Floor ambient lighting */}
        <pointLight position={[0, -1, 0]} intensity={1.0} color="#4a90e2" distance={35} />
        <pointLight position={[-20, -1, -20]} intensity={0.8} color="#667eea" distance={20} />
        <pointLight position={[20, -1, -20]} intensity={0.8} color="#764ba2" distance={20} />
        <pointLight position={[-20, -1, 20]} intensity={0.8} color="#f093fb" distance={20} />
        <pointLight position={[20, -1, 20]} intensity={0.8} color="#4facfe" distance={20} />

        {/* Central floating platform - COMMENTED OUT */}
        {/* <FloatingIsland position={[0, 0, 0]} /> */}

        {/* Central Building - Inside floor group to sync movement */}
        <CentralBuilding
          position={[0, 0, 0]}
          onHover={() => setHoveredBuilding('central')}
          onLeave={() => setHoveredBuilding(null)}
          onClick={() => handleBuildingClick('central')}
          isHovered={hoveredBuilding === 'central'}
          isModalOpen={isModalOpen}
        />

        {/* Buildings */}
        {buildings.map((building) => (
          <Building
            key={building.id}
            {...building}
            onHover={() => setHoveredBuilding(building.id)}
            onLeave={() => setHoveredBuilding(null)}
            onClick={() => handleBuildingClick(building.id)}
            isHovered={hoveredBuilding === building.id}
            isModalOpen={isModalOpen}
          />
        ))}
      </group>

      {/* Particle field for atmosphere */}
      <ParticleField count={100} />

      {/* Floating text elements */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 8, 0]}
          fontSize={1.5}
          color="#667eea"
          anchorX="center"
          anchorY="middle"
          style={{
            opacity: fadeOpacity,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          {showGreetings ? greetings[currentGreeting] : ''}
        </Text>
      </Float>

      {/* Presentation controls for better interaction */}
      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, 0.75]}
      >
        <group />
      </PresentationControls>
    </group>
  );
};

export default Scene; 